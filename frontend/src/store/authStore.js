import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { configureApiAuth } from '../services/api'
import { authService } from '../services/authService'
import { useAnalysisStore } from './analysisStore'

const DEMO_ACCOUNT = { name: 'Demo user', email: 'demo@truthlens.ai', password: 'truthlens-demo' }

const toUser = (profile) => ({
  name: profile.full_name || profile.username.split('@')[0],
  email: profile.email || profile.username,
})

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      // 'idle' until checkSession runs, 'checking' while a saved token is verified, then 'ready'.
      status: 'idle',

      // Sets the token, then loads the profile with it. Throws if the token is rejected.
      startSession: async (token) => {
        useAnalysisStore.getState().reset()
        set({ token })
        try {
          const { data } = await authService.me()
          set({ user: toUser(data), status: 'ready' })
        } catch (err) {
          set({ token: null, user: null })
          throw err
        }
      },

      login: async (email, password) => {
        const { data } = await authService.login(email, password)
        await get().startSession(data.access_token)
      },

      register: async ({ name, email, password }) => {
        const { data } = await authService.register({ name, email, password })
        await get().startSession(data.access_token)
      },

      // Shared demo account: signs in, creating the account on first use.
      loginDemo: async () => {
        try {
          await get().login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password)
        } catch (err) {
          if (err.response?.status !== 401) throw err
          await get().register(DEMO_ACCOUNT)
        }
      },

      logout: () => {
        set({ token: null, user: null })
        useAnalysisStore.getState().reset()
      },

      // Verifies a token saved from a previous visit. Run once on app start.
      checkSession: async () => {
        const { token, status } = get()
        if (status !== 'idle') return
        if (!token) {
          set({ status: 'ready' })
          return
        }
        set({ status: 'checking' })
        try {
          const { data } = await authService.me()
          set({ user: toUser(data) })
        } catch (err) {
          // Drop the session if the server rejected it; keep it if the server is just unreachable.
          if (err.response?.status === 401) get().logout()
        } finally {
          set({ status: 'ready' })
        }
      },
    }),
    {
      name: 'truthlens_auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)

configureApiAuth({
  getToken: () => useAuthStore.getState().token,
  onUnauthorized: () => useAuthStore.getState().logout(),
})
