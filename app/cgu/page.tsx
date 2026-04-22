'use client'
import { useRouter } from 'next/navigation'

export default function CGU() {
  const router = useRouter()
  return (
    <main style={{ minHeight: '100vh', background: '#070910', fontFamily: 'Arial, sans-serif', paddingBottom: '60px' }}>
      <nav style={{ background: '#0D1018', padding: '14px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #ffffff11' }}>
        <span onClick={() => router.back()} style={{ color: '#8890AA', fontSize: '13px', cursor: 'pointer' }}>← Retour</span>
      </nav>
      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#34D399', fontSize: '22px', marginBottom: '8px' }}>
          Conditions Générales d&apos;Utilisation
        </h1>
        <p style={{ color: '#8890AA', fontSize: '12px', marginBottom: '32px' }}>Dernière mise à jour : avril 2026</p>

        {[
          { titre: '1. Objet', texte: "Les présentes CGU régissent l'accès et l'utilisation de Kicknote Templates, service de templates PDF interactifs pour l'analyse sportive, édité par Kicknote." },
          { titre: '2. Accès au service', texte: "L'accès à Kicknote Templates est conditionné à l'achat d'un pack de crédits. Chaque crédit permet de générer un rapport. Les crédits sont valables sans limite de durée." },
          { titre: '3. Paiement', texte: "Les packs sont vendus en paiement unique, sans abonnement. Le paiement est sécurisé par Stripe. Aucun remboursement ne sera effectué pour des crédits déjà utilisés." },
          { titre: '4. Données personnelles', texte: "Kicknote collecte uniquement l'email de l'utilisateur pour l'accès au service. Aucune donnée n'est revendue à des tiers. Conformément au RGPD, suppression possible sur demande à infos@kicknote.fr." },
          { titre: '5. Propriété intellectuelle', texte: "Les templates Kicknote sont la propriété exclusive de Kicknote. Les rapports générés appartiennent à l'utilisateur. Toute redistribution des templates est interdite." },
          { titre: '6. Responsabilité', texte: "Kicknote met tout en oeuvre pour assurer la disponibilité du service. En cas d'interruption, aucune indemnité ne pourra être réclamée." },
          { titre: '7. Contact', texte: "Pour toute question : infos@kicknote.fr" },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#34D399', fontSize: '15px', fontWeight: '600', margin: '0 0 8px' }}>{s.titre}</h2>
            <p style={{ color: '#8890AA', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{s.texte}</p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #ffffff11', paddingTop: '24px', marginTop: '16px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', color: '#34D399', fontSize: '22px', marginBottom: '8px' }}>
            Politique de Confidentialité
          </h1>
          {[
            { titre: 'Données collectées', texte: "Nous collectons uniquement votre email pour l'accès au service. Aucune donnée de paiement n'est stockée — tout est géré par Stripe." },
            { titre: 'Utilisation', texte: "Votre email est utilisé exclusivement pour l'authentification et l'envoi du lien d'accès. Nous ne faisons pas de marketing sans consentement explicite." },
            { titre: 'Conservation', texte: "Les données sont conservées tant que le compte est actif. Suppression immédiate sur demande à infos@kicknote.fr." },
            { titre: 'Droits', texte: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression. Contact : infos@kicknote.fr" },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <h2 style={{ color: '#8890AA', fontSize: '15px', fontWeight: '600', margin: '0 0 8px' }}>{s.titre}</h2>
              <p style={{ color: '#8890AA', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{s.texte}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
