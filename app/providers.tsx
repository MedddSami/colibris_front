'use client';

import { Provider } from 'react-redux';
import { useEffect } from 'react';

import { store } from '@/store/store';
import { authInitialized, hydrateAuth } from '@/store/slices/authSlice';
import { getToken } from '@/lib/auth';
import { Toaster } from '@/components/ui/toaster';

function InitAuth() {
  useEffect(() => {
    const token = getToken();

    if (token) {
      store.dispatch(hydrateAuth({ token }));
    } else {
      store.dispatch(authInitialized()); // NEW — mark checked even if no token
    }
  }, []);

  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <InitAuth />
      {children}
      <Toaster />
    </Provider>
  );
}