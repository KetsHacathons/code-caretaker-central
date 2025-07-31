import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Repository {
  id: string;
  name: string;
  full_name: string;
  provider: string;
  language: string | null;
  description: string | null;
}

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRepositories = async () => {
    if (!user) {
      setRepositories([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('repositories')
        .select('id, name, full_name, provider, language, description')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error fetching repositories:', error);
        setError(error.message);
      } else {
        setRepositories(data || []);
      }
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError('Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, [user]);

  return { repositories, loading, error, refetch: fetchRepositories };
}