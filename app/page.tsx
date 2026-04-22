'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const envoyerMagicLink = async () => {
    if (!email) return
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://templates.kicknote.fr/auth/callback" }
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh', background: '#070910',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif', padding: '24px'
    }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#34D399', fontSize: '32px', margin: '0 0 8px' }}>
          Kick<span style={{ color: '#FFFFFF' }}>note</span>
        </h1>
        <p style={{ color: '#8890AA', fontSize: '14px', margin: '0 0 40px' }}>
          Templates d'analyse football
        </p>

        {sent ? (
          <div style={{ background: '#1A1F2E', borderRadius: '12px', padding: '28px', border: '1px solid #34D39933' }}>
            <p style={{ color: '#34D399', fontSize: '24px', margin: '0 0 12px' }}>✓</p>
            <p style={{ color: '#F0F2F8', fontSize: '16px', margin: '0 0 8px' }}>Lien envoyé !</p>
            <p style={{ color: '#8890AA', fontSize: '13px', margin: 0 }}>
              Vérifie ta boîte mail et clique sur le lien pour accéder à tes templates.
            </p>
          </div>
        ) : (
          <div style={{ background: '#1A1F2E', borderRadius: '12px', padding: '28px', border: '1px solid #ffffff11' }}>
            <p style={{ color: '#F0F2F8', fontSize: '15px', margin: '0 0 20px' }}>
              Accède à ton espace templates
            </p>
            <input
              type="email"
              placeholder="ton@email.fr"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && envoyerMagicLink()}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                background: '#0D1018', border: '1px solid #ffffff22',
                color: '#F0F2F8', fontSize: '15px', marginBottom: '12px',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
            <button
              onClick={envoyerMagicLink}
              disabled={loading || !email}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: loading ? '#0F6E56' : '#34D399',
                border: 'none', color: '#070910', fontSize: '15px',
                fontWeight: '500', cursor: 'pointer'
              }}
            >
              {loading ? 'Envoi...' : 'Recevoir mon lien de connexion'}
            </button>
            <p style={{ color: '#8890AA', fontSize: '11px', marginTop: '12px' }}>
              Pas de mot de passe — connexion par email uniquement
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
