import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const priceToCredits: Record<string, { credits: number, pack: string }> = {
  'price_1TOyghACLcTqy6NQMNAEsjHU': { credits: 10, pack: 'Pack 10' },
  'price_1TOyjSACLcTqy6NQ1RRACZeA': { credits: 25, pack: 'Pack 25' },
  'price_1TOykPACLcTqy6NQGWExRa8e': { credits: 60, pack: 'Pack 60' },
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const priceId = lineItems.data?.[0]?.price?.id

    if (email && priceId && priceToCredits[priceId]) {
      const { credits, pack } = priceToCredits[priceId]

      const { data: existing } = await supabase
        .from('kicknote_credits')
        .select('*')
        .eq('email', email)
        .single()

      if (existing) {
        await supabase
          .from('kicknote_credits')
          .update({
            credits_restants: existing.credits_restants + credits,
            credits_total: existing.credits_total + credits,
            pack,
            updated_at: new Date().toISOString()
          })
          .eq('email', email)
      } else {
        await supabase
          .from('kicknote_credits')
          .insert({
            email,
            credits_restants: credits,
            credits_total: credits,
            pack
          })
      }

      const appUrl = 'https://kicknote-templates.vercel.app'
      await resend.emails.send({
        from: 'Kicknote <noreply@kicknote.fr>',
        to: email,
        subject: 'Tes crédits Kicknote Templates sont disponibles',
        html: [
          '<div style="max-width:480px;margin:0 auto;padding:40px 24px;background:#070910;font-family:Arial,sans-serif;">',
          '<h1 style="color:#34D399;font-family:Georgia,serif;font-size:28px;margin:0 0 8px;">Kicknote Templates</h1>',
          '<p style="color:#8890AA;font-size:13px;margin:0 0 32px;">Tes rapports d\'analyse football</p>',
          '<div style="background:#1A1F2E;border-radius:12px;padding:28px;margin-bottom:24px;">',
          '<p style="color:#F0F2F8;font-size:18px;font-family:Georgia,serif;margin:0 0 12px;">'+credits+' crédits disponibles</p>',
          '<p style="color:#8890AA;font-size:14px;margin:0;">'+pack+' activé — accède à tes templates dès maintenant.</p>',
          '</div>',
          '<div style="text-align:center;margin-bottom:24px;">',
          '<a href="'+appUrl+'" style="display:inline-block;background:#34D399;color:#070910;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:500;">Accéder à mes templates</a>',
          '</div>',
          '<p style="color:#8890AA;font-size:11px;text-align:center;">Connexion par magic link — entre ton email sur kicknote-templates.vercel.app</p>',
          '</div>'
        ].join('')
      })
    }
  }

  return NextResponse.json({ received: true })
}
