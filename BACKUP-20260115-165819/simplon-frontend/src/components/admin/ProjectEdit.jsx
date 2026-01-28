// src/components/admin/ProjectEdit.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Éditer le projet #{id}</h1>
      <p className="text-gray-600 mb-6">
        Cette fonctionnalité est en cours de développement.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        Retour
      </button>
    </div>
  );
};

export default ProjectEdit;