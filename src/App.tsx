import React, { useState, useEffect } from 'react';
import { CreatorWizard } from './components/creator/CreatorWizard';
import { SurpriseViewer } from './components/viewer/SurpriseViewer';

export function App() {
  const [route, setRoute] = useState<{ page: 'create' | 'view'; id?: string }>({
    page: 'create',
  });

  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (hash.startsWith('#/view/')) {
        const id = hash.replace('#/view/', '').trim();
        if (id) {
          setRoute({ page: 'view', id });
          return;
        }
      }

      if (path.startsWith('/view/')) {
        const id = path.replace('/view/', '').trim();
        if (id) {
          setRoute({ page: 'view', id });
          return;
        }
      }

      setRoute({ page: 'create' });
    };

    parseRoute();
    window.addEventListener('hashchange', parseRoute);
    window.addEventListener('popstate', parseRoute);

    return () => {
      window.removeEventListener('hashchange', parseRoute);
      window.removeEventListener('popstate', parseRoute);
    };
  }, []);

  if (route.page === 'view' && route.id) {
    return <SurpriseViewer surpriseId={route.id} />;
  }

  return <CreatorWizard />;
}

export default App;
