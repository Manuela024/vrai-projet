import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Simulation d'inscription
    console.log('Inscription réussie:', formData);
    
    // Redirection vers login
    alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Créer un compte</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', background: '#ffe6e6' }}>
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nom complet</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc' }}
            placeholder="Votre nom"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc' }}
            placeholder="votre@email.com"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc' }}
            placeholder="••••••••"
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc' }}
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none',
            cursor: 'pointer'
          }}
        >
          S'inscrire
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  );
};

export default Signup;