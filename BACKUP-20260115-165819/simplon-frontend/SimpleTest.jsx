// SimpleTest.jsx
import React, { useState, useEffect } from 'react';

const SimpleTest = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/projects/')
      .then(r => r.json())
      .then(data => {
        console.log('✅ Données:', data);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Erreur:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'green' }}>✅ API Django fonctionne !</h1>
      <p>{data.length} projets trouvés</p>
      
      {data.map(project => (
        <div key={project.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{project.title}</h3>
          <p><strong>Auteur:</strong> {project.author_name}</p>
          <p><strong>Email:</strong> {project.author_email}</p>
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Source:</strong> PostgreSQL table projects_project</p>
        </div>
      ))}
    </div>
  );
};

export default SimpleTest;