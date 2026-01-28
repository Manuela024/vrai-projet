import React from 'react';



const ExplorePage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Explorer les projets</h1>
      <p>Page d'exploration pour les utilisateurs normaux</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
          <h3>Projet Web</h3>
          <p>Site e-commerce React</p>
          <button style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none' }}>
            Voir
          </button>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
          <h3>Projet Mobile</h3>
          <p>Application React Native</p>
          <button style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none' }}>
            Voir
          </button>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
          <h3>Projet Backend</h3>
          <p>API Node.js</p>
          <button style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none' }}>
            Voir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;