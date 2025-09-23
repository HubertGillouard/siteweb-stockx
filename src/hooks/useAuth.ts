import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isVendor: boolean;
  hasAdminAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isDev = import.meta.env.MODE === 'development';

  useEffect(() => {
    if (isDev) {
      // Comptes de démo pour développement
      setUser({
        id: 'demo-user',
        email: 'user@sneakiz.com',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: new Date().toISOString(),
      } as any);
      setProfile({ 
        id: 'demo-user', 
        email: 'user@sneakiz.com',
        full_name: 'Utilisateur Demo', 
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setLoading(false);
      return;
    }

    // Récupérer session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserProfile(session.user.id);
      else setLoading(false);
    });

    // Listener pour les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await fetchUserProfile(session.user.id);
        else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isDev) {
      // Comptes de démonstration
      const demoAccounts = {
        'admin@sneakiz.com': { role: 'admin', name: 'Administrateur', password: 'admin123' },
        'vendor@sneakiz.com': { role: 'vendor', name: 'Vendeur', password: 'vendor123' },
        'user@sneakiz.com': { role: 'user', name: 'Client', password: 'user123' }
      };

      const account = demoAccounts[email as keyof typeof demoAccounts];
      if (account && password === account.password) {
        setUser({
          id: `demo-${account.role}`,
          email,
          app_metadata: {},
          user_metadata: {},
          aud: '',
          created_at: new Date().toISOString(),
        } as any);
        setProfile({ 
          id: `demo-${account.role}`, 
          email,
          full_name: account.name, 
          role: account.role as any,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        return { error: null };
      }
      return { error: { message: 'Email ou mot de passe incorrect' } };
    }

    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isDev) {
      setUser({
        id: 'demo-user-new',
        email,
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: new Date().toISOString(),
      } as any);
      setProfile({ 
        id: 'demo-user-new', 
        email,
        full_name: fullName, 
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { error: null };
    }

    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
  };

  const signOut = async () => {
    if (isDev) {
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const isAdmin = profile?.role === 'admin';
  const isVendor = profile?.role === 'vendor';
  const hasAdminAccess = isAdmin || isVendor;

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isVendor,
    hasAdminAccess,
  };
}

export { AuthContext };