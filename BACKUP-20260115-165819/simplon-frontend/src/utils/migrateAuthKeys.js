// src/utils/migrateAuthKeys.js
export const migrateAuthKeys = () => {
  console.log('🔄 Migration des clés d\'authentification...');
  
  // Migration de 'access_token' vers 'simplon_access_token'
  const oldToken = localStorage.getItem('access_token');
  if (oldToken) {
    localStorage.setItem('simplon_access_token', oldToken);
    console.log('✅ Token migré');
  }
  
  // Migration de 'refresh_token' vers 'simplon_refresh_token'
  const oldRefresh = localStorage.getItem('refresh_token');
  if (oldRefresh) {
    localStorage.setItem('simplon_refresh_token', oldRefresh);
    console.log('✅ Refresh token migré');
  }
  
  // Migration de 'user' vers 'simplon_user'
  const oldUser = localStorage.getItem('user');
  if (oldUser) {
    localStorage.setItem('simplon_user', oldUser);
    console.log('✅ User migré');
  }
  
  return true;
};

export const debugAuth = () => {
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

// Exposer à la console du navigateur
if (typeof window !== 'undefined') {
  window.migrateAuthKeys = migrateAuthKeys;
  window.debugAuth = debugAuth;
}