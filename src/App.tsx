import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { CreatorWizard } from './components/creator/CreatorWizard';
import { SurpriseViewer } from './components/viewer/SurpriseViewer';
import { SurpriseType } from './config/themes';

type RouteState =
  | { page: 'landing' }
  | { page: 'creator'; type: SurpriseType }
  | { page: 'viewer'; id: string; type?: SurpriseType };

export function App() {
  const [route, setRoute] = useState<RouteState>({ page: 'landing' });

  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      // Viewer Routes: #/view/:type/:id OR #/view/:id
      if (hash.startsWith('#/view/')) {
        const parts = hash.replace('#/view/', '').split('/').filter(Boolean);
        if (parts.length >= 2) {
          const type = parts[0] as SurpriseType;
          const id = parts[1];
          setRoute({ page: 'viewer', id, type });
          return;
        } else if (parts.length === 1) {
          const id = parts[0];
          setRoute({ page: 'viewer', id });
          return;
        }
      }

      if (path.startsWith('/view/')) {
        const parts = path.replace('/view/', '').split('/').filter(Boolean);
        if (parts.length >= 2) {
          const type = parts[0] as SurpriseType;
          const id = parts[1];
          setRoute({ page: 'viewer', id, type });
          return;
        } else if (parts.length === 1) {
          const id = parts[0];
          setRoute({ page: 'viewer', id });
          return;
        }
      }

      // Creator Routes: #/birthday, #/wedding, #/love, #/create
      if (hash === '#/birthday' || path === '/birthday' || hash === '#/create') {
        setRoute({ page: 'creator', type: 'birthday' });
        return;
      }
      if (hash === '#/wedding' || path === '/wedding') {
        setRoute({ page: 'creator', type: 'wedding' });
        return;
      }
      if (hash === '#/love' || path === '/love') {
        setRoute({ page: 'creator', type: 'love' });
        return;
      }

      // Default: Landing Page
      setRoute({ page: 'landing' });
    };

    parseRoute();
    window.addEventListener('hashchange', parseRoute);
    window.addEventListener('popstate', parseRoute);

    return () => {
      window.removeEventListener('hashchange', parseRoute);
      window.removeEventListener('popstate', parseRoute);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  if (route.page === 'viewer' && route.id) {
    return <SurpriseViewer surpriseId={route.id} typeParam={route.type} />;
  }

  if (route.page === 'creator') {
    return (
      <CreatorWizard
        type={route.type}
        onGoHome={() => navigateTo('/')}
      />
    );
  }

  return (
    <LandingPage
      onSelectType={(type) => navigateTo(`/${type}`)}
    />
  );
}

export default App;
