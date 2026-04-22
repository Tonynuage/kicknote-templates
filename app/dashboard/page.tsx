'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [credits, setCredits] = useState<any>(null)
  const [rapports, setRapports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/'); return }
      const userEmail = session.user.email!
      setEmail(userEmail)

      const { data: cred } = await supabase
        .from('kicknote_credits')
        .select('*')
        .eq('email', userEmail)
        .single()
      setCredits(cred)

      const { data: raps } = await supabase
        .from('kicknote_rapports')
        .select('*')
        .eq('email', userEmail)
        .order('created_at', { ascending: false })
        .limit(10)
      setRapports(raps || [])
      setLoading(false)
    }
    init()
  }, [])

  const templates = [
    { id: 'analyse-match', nom: 'Analyse de match', desc: 'Rapport tactique complet post-match', emoji: '📋' },
    { id: 'performance-joueur', nom: 'Performance joueur', desc: 'Fiche individuelle stats + notes', emoji: '⚽' },
    { id: 'scouting', nom: 'Recrutement / Scouting', desc: 'Fiche observation et évaluation', emoji: '🔍' },
  ]

  const couleurs = [
    { id: 'sombre', hex: '#070910' },
    { id: 'vert', hex: '#1D9E75' },
    { id: 'bleu', hex: '#185FA5' },
    { id: 'rouge', hex: '#E24B4A' },
  ]

  const [couleurActive, setCouleurActive] = useState('sombre')

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#070910', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#8890AA', fontFamily: 'Arial, sans-serif' }}>Chargement...</p>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#070910', fontFamily: 'Arial, sans-serif', paddingBottom: '40px' }}>
      <nav style={{ background: '#0D1018', borderBottom: '1px solid #ffffff11', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#34D399', fontSize: '20px', margin: 0 }}>
          Kick<span style={{ color: '#FFFFFF' }}>note</span>
          <span style={{ color: '#8890AA', fontSize: '13px', fontFamily: 'Arial, sans-serif', marginLeft: '8px' }}>Templates</span>
        </h1>
        <p style={{ color: '#8890AA', fontSize: '12px', margin: 0 }}>{email}</p>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#1A1F2E', borderRadius: '10px', padding: '14px', border: '1px solid #ffffff11' }}>
            <p style={{ color: '#34D399', fontSize: '28px', fontWeight: '500', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>
              {credits?.credits_restants ?? 0}
            </p>
            <p style={{ color: '#8890AA', fontSize: '11px', margin: '0 0 8px' }}>Crédits restants</p>
            <div style={{ height: '4px', borderRadius: '2px', background: '#ffffff11', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px', background: '#34D399',
                width: `${credits ? (credits.credits_restants / credits.credits_total) * 100 : 0}%`
              }} />
            </div>
          </div>
          <div style={{ background: '#1A1F2E', borderRadius: '10px', padding: '14px', border: '1px solid #ffffff11' }}>
            <p style={{ color: '#F0F2F8', fontSize: '28px', fontWeight: '500', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>
              {rapports.length}
            </p>
            <p style={{ color: '#8890AA', fontSize: '11px', margin: 0 }}>Rapports générés</p>
          </div>
          <div style={{ background: '#1A1F2E', borderRadius: '10px', padding: '14px', border: '1px solid #ffffff11' }}>
            <p style={{ color: '#F0F2F8', fontSize: '15px', fontWeight: '500', margin: '0 0 4px' }}>
              {credits?.pack || 'Aucun pack'}
            </p>
            <p style={{ color: '#8890AA', fontSize: '11px', margin: 0 }}>Offre actuelle</p>
          </div>
        </div>

        {(!credits || credits.credits_restants === 0) && (
          <div style={{ background: '#1A1F2E', borderRadius: '10px', padding: '14px', border: '1px solid #34D39933', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <p style={{ color: '#F0F2F8', fontSize: '13px', margin: '0 0 3px' }}>Pack 10 rapports — 9€</p>
              <p style={{ color: '#8890AA', fontSize: '11px', margin: 0 }}>Soit 0,90€ par rapport · Sans abonnement</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
              <a href="https://buy.stripe.com/4gMdR80yT6Wq9FL4TZ5ZC08" style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #34D399', background: 'transparent', color: '#34D399', textDecoration: 'none' }}>7€ · 10 crédits</a>
              <a href="https://buy.stripe.com/8x25kC95p6Wq2dj7275ZC09" style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #34D399', background: '#34D39911', color: '#34D399', textDecoration: 'none' }}>15€ · 25 crédits</a>
              <a href="https://buy.stripe.com/fZu7sK6Xh6Wq6tzdqv5ZC0a" style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #34D399', background: 'transparent', color: '#34D399', textDecoration: 'none' }}>29€ · 60 crédits</a>
            </div>
          </div>
        )}

        <p style={{ color: '#8890AA', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>Choisir un template</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
          <p style={{ color: '#8890AA', fontSize: '12px', margin: 0 }}>Couleur :</p>
          {couleurs.map(c => (
            <div key={c.id} onClick={() => setCouleurActive(c.id)} style={{
              width: '20px', height: '20px', borderRadius: '50%', background: c.hex,
              cursor: 'pointer', border: couleurActive === c.id ? '2px solid #34D399' : '2px solid transparent'
            }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {templates.map(t => (
            <div key={t.id} style={{ background: '#1A1F2E', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ffffff11' }}>
              <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D1018', fontSize: '28px' }}>
                {t.emoji}
              </div>
              <div style={{ padding: '10px' }}>
                <p style={{ color: '#F0F2F8', fontSize: '12px', fontWeight: '500', margin: '0 0 4px' }}>{t.nom}</p>
                <p style={{ color: '#8890AA', fontSize: '11px', margin: '0 0 8px', lineHeight: '1.4' }}>{t.desc}</p>
                <button
                  onClick={() => router.push(`/template/${t.id}?couleur=${couleurActive}`)}
                  disabled={!credits || credits.credits_restants === 0}
                  style={{
                    width: '100%', fontSize: '11px', padding: '7px', borderRadius: '6px',
                    border: '1px solid #34D39944', background: 'transparent',
                    color: credits?.credits_restants > 0 ? '#34D399' : '#8890AA',
                    cursor: credits?.credits_restants > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Utiliser — 1 crédit
                </button>
              </div>
            </div>
          ))}
        </div>

        {rapports.length > 0 && (
          <>
            <p style={{ color: '#8890AA', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>Mes rapports générés</p>
            <div style={{ background: '#1A1F2E', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ffffff11' }}>
              {rapports.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < rapports.length - 1 ? '1px solid #ffffff11' : 'none' }}>
                  <div>
                    <p style={{ color: '#F0F2F8', fontSize: '13px', margin: '0 0 2px' }}>{r.template}</p>
                    <p style={{ color: '#8890AA', fontSize: '11px', margin: 0 }}>{new Date(r.created_at).toLocaleDateString('fr-FR')} · {r.couleur}</p>
                  </div>
                  <span style={{ color: '#34D399', fontSize: '12px', cursor: 'pointer' }}>Télécharger</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  )
}
