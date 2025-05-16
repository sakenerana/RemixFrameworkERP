import { useEffect, useState } from 'react';

export function useSupabaseAuth() {
  const [authData, setAuthData] = useState<{
    access_token: string | null;
    user: { email: string; id: string } | null;
  }>({ access_token: null, user: null });

  useEffect(() => {
    // Check for both v1 and v2 Supabase localStorage keys
    const supabaseAuthKey = Object.keys(localStorage).find((key) =>
      key.startsWith('sb-') && key.includes('auth-token')
    );

    if (supabaseAuthKey) {
      const storedData = localStorage.getItem(supabaseAuthKey);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setAuthData({
            access_token: parsedData.currentSession?.access_token || null,
            user: parsedData.currentSession?.user || null,
          });
        } catch (error) {
          console.error('Failed to parse Supabase auth data:', error);
        }
      }
    }
  }, []);

  return authData;
}