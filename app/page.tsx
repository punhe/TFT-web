'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@heroui/react';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect authenticated users to SQL Editor
        router.replace('/sql-editor');
      } else {
        // Redirect unauthenticated users to login
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
