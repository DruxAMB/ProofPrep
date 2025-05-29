import { User } from 'firebase/auth';

declare module '@/hooks/useAuth' {
  export function useAuth(): {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
}
