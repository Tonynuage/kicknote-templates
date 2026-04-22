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
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/'); return }
      setEmail(session.user.email!)
    }
    init()
  }, [])

  const genererPDF = async () => {
    setLoading(true)
    // Décrémenter crédit
    await supabase.rpc('decrementer_credit', { p_email: email })
    // Enregistrer rapport
    await supabase.from('kicknote_rapports').insert({
      email,
      template: 'Analyse de match',
      couleur,
      nom_fichier: `analyse-match-${Date.now()}.pdf`
    })
    // TODO: générer PDF
    alert('PDF généré — fonctionnalité en cours de déploiement')
    setLoading(false)
    router.push('/dashboard')
  }

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
          }}>← Retour</button>
          <span style={{ color: '#F0F2F8', fontSize: '14px', fontWeight: '500' }}>Analyse de match</span>
        </div>
        <button onClick={genererPDF} disabled={loading} style={{
          background: loading ? '#0F6E56' : '#34D399',
          border: 'none', color: '#070910', fontSize: '13px',
          fontWeight: '500', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer'
        }}>
          {loading ? 'Génération...' : 'Générer PDF — 1 crédit'}
        </button>
      </div>

      {/* Template iframe */}
      <div style={{ paddingTop: '56px' }}>
        <iframe
          src="/templates/analyse-match.html"
          style={{ width: '100%', height: 'calc(100vh - 56px)', border: 'none' }}
          title="Analyse de match"
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
