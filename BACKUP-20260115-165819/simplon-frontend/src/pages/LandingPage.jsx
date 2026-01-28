import React from 'react';
import { Link } from 'react-router-dom';
// Supprimez cette ligne : import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div style={styles.container}>
      {/* Header Hero */}
      <header style={styles.header}>
        <div style={styles.navbar}>
          <div style={styles.logo}>
            <h1 style={styles.logoText}>🚀 Simplon Projects</h1>
          </div>
          <div style={styles.navLinks}>
            <Link to="/login" style={styles.navLink}>Connexion</Link>
            <Link to="/signup" style={styles.primaryButton}>Inscription</Link>
          </div>
        </div>
        
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>
            Gérer vos projets <span style={styles.highlight}>efficacement</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Une plateforme complète pour la gestion, le suivi et la collaboration sur vos projets
          </p>
          <div style={styles.heroButtons}>
            <Link to="/signup" style={styles.ctaButton}>
              Commencer gratuitement
            </Link>
            <Link to="/login" style={styles.secondaryButton}>
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Pourquoi choisir Simplon Projects ?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Dashboard complet</h3>
            <p style={styles.featureText}>
              Visualisez toutes vos données importantes en un seul endroit.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👥</div>
            <h3 style={styles.featureTitle}>Collaboration en équipe</h3>
            <p style={styles.featureText}>
              Travaillez efficacement avec votre équipe en temps réel.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡</div>
            <h3 style={styles.featureTitle}>Interface intuitive</h3>
            <p style={styles.featureText}>
              Une interface simple et moderne pour une prise en main rapide.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>Comment ça marche ?</h2>
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Créez votre compte</h3>
            <p style={styles.stepText}>
              Inscrivez-vous en quelques secondes, c'est gratuit.
            </p>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Ajoutez vos projets</h3>
            <p style={styles.stepText}>
              Créez et organisez vos projets avec toutes les informations nécessaires.
            </p>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Collaborez et suivez</h3>
            <p style={styles.stepText}>
              Invitez votre équipe et suivez la progression en temps réel.
            </p>
          </div>
        </div>
      </section>

      {/* Test Section */}
      <section style={styles.testSection}>
        <h2 style={styles.sectionTitle}>Testez directement</h2>
        <p style={styles.testText}>
          Vous pouvez tester l'application avec ces accès rapides :
        </p>
        <div style={styles.testButtons}>
          <Link to="/dashboard" style={styles.testButton}>
            <div style={styles.testButtonIcon}>📈</div>
            <div>
              <h4 style={styles.testButtonTitle}>Dashboard Utilisateur</h4>
              <p style={styles.testButtonText}>Accédez au tableau de bord</p>
            </div>
          </Link>
          
          <Link to="/admin" style={styles.testButton}>
            <div style={styles.testButtonIcon}>👨‍💼</div>
            <div>
              <h4 style={styles.testButtonTitle}>Espace Administrateur</h4>
              <p style={styles.testButtonText}>Gestion complète des projets</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <h3>🚀 Simplon Projects</h3>
            <p>Plateforme de gestion de projets professionnelle</p>
          </div>
          
          <div style={styles.footerLinks}>
            <div style={styles.footerColumn}>
              <h4 style={styles.footerTitle}>Navigation</h4>
              <Link to="/" style={styles.footerLink}>Accueil</Link>
              <Link to="/login" style={styles.footerLink}>Connexion</Link>
              <Link to="/signup" style={styles.footerLink}>Inscription</Link>
            </div>
            
            <div style={styles.footerColumn}>
              <h4 style={styles.footerTitle}>Fonctionnalités</h4>
              <Link to="/explore" style={styles.footerLink}>Explorer</Link>
              <Link to="/dashboard" style={styles.footerLink}>Dashboard</Link>
              <Link to="/admin" style={styles.footerLink}>Admin</Link>
            </div>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p>© 2024 Simplon Projects. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

// Styles en ligne (remplacent le CSS externe)
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px 40px',
    paddingBottom: '80px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '60px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'background 0.3s',
  },
  primaryButton: {
    background: '#ffffff',
    color: '#667eea',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    transition: 'transform 0.3s',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  highlight: {
    color: '#ffd700',
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '40px',
    opacity: 0.9,
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  ctaButton: {
    background: '#ffd700',
    color: '#333',
    textDecoration: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '18px',
    display: 'inline-block',
  },
  secondaryButton: {
    background: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    border: '2px solid white',
    fontWeight: 'bold',
    fontSize: '18px',
    display: 'inline-block',
  },
  features: {
    padding: '80px 40px',
    backgroundColor: 'white',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '36px',
    marginBottom: '60px',
    color: '#333',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    textAlign: 'center',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#333',
  },
  featureText: {
    color: '#666',
    lineHeight: '1.6',
  },
  howItWorks: {
    padding: '80px 40px',
    backgroundColor: '#f8f9fa',
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  step: {
    textAlign: 'center',
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#333',
  },
  stepText: {
    color: '#666',
    lineHeight: '1.6',
  },
  testSection: {
    padding: '80px 40px',
    backgroundColor: 'white',
  },
  testText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginBottom: '40px',
  },
  testButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  testButton: {
    background: '#f8f9fa',
    textDecoration: 'none',
    padding: '30px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  testButtonIcon: {
    fontSize: '40px',
  },
  testButtonTitle: {
    color: '#333',
    margin: '0 0 10px 0',
    fontSize: '20px',
  },
  testButtonText: {
    color: '#666',
    margin: 0,
  },
  footer: {
    background: '#333',
    color: 'white',
    padding: '60px 40px 20px',
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    marginBottom: '40px',
  },
  footerLogo: {
    marginBottom: '20px',
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '40px',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  footerTitle: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#ffd700',
  },
  footerLink: {
    color: '#ddd',
    textDecoration: 'none',
    marginBottom: '10px',
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #444',
    color: '#aaa',
  },
};

export default LandingPage;