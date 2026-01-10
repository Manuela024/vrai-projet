// src/components/DebugAuth.jsx
import React from 'react';

const DebugAuth = () => {
  const checkAuth = () => {
    console.log('🔍 Debug Auth State:');
    
    const keys = [
      'access_token',
      'simplon_access_token',
      'refresh_token',
      'simplon_refresh_token',
      'user',
      'simplon_user'
    ];
    
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value ? `présent (${value.length} chars)` : 'absent');
      
      if (key.includes('user') && value) {
        try {
          const parsed = JSON.parse(value);
          console.log(`${key} parsed:`, {
            username: parsed.username,
            is_staff: parsed.is_staff,
            is_superuser: parsed.is_superuser
          });
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
        }
      }
    });
  };

  const clearAuth = () => {
    console.log('🧹 Clearing all auth keys...');
    localStorage.clear();
    console.log('✅ Cleared');
  };

  const setupAdmin = () => {
    console.log('👑 Setting up admin user...');
    localStorage.setItem('simplon_user', JSON.stringify({
      id: 1,
      username: 'admin',
      email: 'admin@simplon.com',
      first_name: 'Admin',
      last_name: 'System',
      is_staff: true,
      is_superuser: true,
      isAdmin: true
    }));
    localStorage.setItem('simplon_access_token', 'mock_admin_token');
    console.log('✅ Admin user created');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold text-sm mb-2">🔧 Debug Auth</h3>
      <div className="space-y-2">
        <button
          onClick={checkAuth}
          className="block w-full text-left px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded"
        >
          Check Auth State
        </button>
        <button
          onClick={clearAuth}
          className="block w-full text-left px-3 py-1 text-xs bg-red-100 hover:bg-red-200 rounded"
        >
          Clear All
        </button>
        <button
          onClick={setupAdmin}
          className="block w-full text-left px-3 py-1 text-xs bg-green-100 hover:bg-green-200 rounded"
        >
          Setup Admin
        </button>
      </div>
    </div>
  );
};

export default DebugAuth;