'use client';

import { HeroUIProvider } from '@heroui/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <LazyMotion features={domAnimation}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LazyMotion>
    </HeroUIProvider>
  );
}
