'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';

export const SessionProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};