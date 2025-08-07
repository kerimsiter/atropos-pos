// packages/atropos-desktop/src/renderer/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

interface UserState {
  token: string | null;
  profile: { username: string; role: string } | null;
  isAuthenticated: boolean;
  login: (values: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      isAuthenticated: false,
      login: async (values) => {
        const { data } = await api.post('/auth/login', values);
        // Token'ı state'e hemen kaydet, böylece sonraki istekler token'ı kullanabilir
        set({ token: data.access_token, isAuthenticated: true });

        // Token ile profil bilgisini çek
        const profileResponse = await api.get('/auth/profile');
        set({ profile: profileResponse.data });
      },
      logout: () => {
        set({ token: null, profile: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // Local storage'da saklanacak anahtar
    }
  )
);

