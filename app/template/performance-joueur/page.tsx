'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

function AnalyseMatchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const couleur = searchParams.get('couleur') || 'sombre'
  const [email, setEmail] = useState('')
  const [creditDebite, setCreditDebite] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/'); return }
      const userEmail = session.user.email!
      setEmail(userEmail)

      // Décrémenter crédit à l'ouverture
      const { data: cred } = await supabase
        .from('kicknote_credits')
        .select('credits_restants')
        .eq('email', userEmail)
        .single()

      if (!cred || cred.credits_restants <= 0) {
        alert('Plus de crédits disponibles. Achetez un pack sur kicknote.fr')
        router.push('/dashboard')
        return
      }

      await supabase.rpc('decrementer_credit', { p_email: userEmail })
      await supabase.from('kicknote_rapports').insert({
        email: userEmail,
        template: 'Performance joueur',
        couleur,
        nom_fichier: `performance-joueur-${Date.now()}.pdf`
      })
      setCreditDebite(true)
    }
    init()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#070910', fontFamily: 'Arial, sans-serif' }}>
      {/* Barre flottante */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: '#0D1018', borderBottom: '1px solid #ffffff11',
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{
            background: 'transparent', border: 'none', color: '#8890AA',
            fontSize: '13px', cursor: 'pointer'
          }}>← Dashboard</button>
          <span style={{ color: '#F0F2F8', fontSize: '14px', fontWeight: '500' }}></span>
          {creditDebite && (
            <span style={{ fontSize: '11px', color: '#34D399', background: '#34D39911', padding: '3px 8px', borderRadius: '4px' }}>
              ✓ 1 crédit utilisé
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => {
            const iframe = document.querySelector('iframe') as HTMLIFrameElement
            iframe?.contentWindow?.print()
          }} style={{
            background: '#34D399', border: 'none', color: '#070910',
            fontSize: '13px', fontWeight: '500', padding: '8px 20px',
            borderRadius: '8px', cursor: 'pointer'
          }}>
            Sauvegarder en PDF
          </button>
        </div>
      </div>

      {/* Template iframe */}
      <div style={{ paddingTop: '56px' }}>
        <iframe
          src="/templates/performance-joueur.html"
          style={{ width: '100%', height: 'calc(100vh - 56px)', border: 'none' }}
          title=""
        />
      </div>
    </div>
  )
}

export default function AnalyseMatch() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#070910', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8890AA' }}>Chargement...</p>
      </div>
    }>
      <AnalyseMatchContent />
    </Suspense>
  )
}
