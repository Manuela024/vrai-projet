// src/components/ThemeInitializer.jsx
import { useEffect } from 'react';

const ThemeInitializer = () => {
  useEffect(() => {
    // Fonction pour appliquer le thème
    const applyTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'auto';
      const root = document.documentElement;
      
      console.log('🎨 Applying theme:', savedTheme);
      
      if (savedTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else if (savedTheme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        // Mode auto
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      }
    };

    // Appliquer le thème immédiatement
    applyTheme();

    // Écouter les changements de préférences système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const currentTheme = localStorage.getItem('theme') || 'auto';
      if (currentTheme === 'auto') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return null; // Ce composant ne rend rien
};

export default ThemeInitializer;