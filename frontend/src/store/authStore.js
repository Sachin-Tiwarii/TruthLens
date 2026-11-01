
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAnalysisStore } from './analysisStore'

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@truthlens.ai',
}

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      status: 'ready',

      // Local demo login: no backend request.
      login: async (email, password) => {
        if (!email || !password) {
          throw new Error('Please enter your email and password.')
        }

        useAnalysisStore.getState().reset()

        set({
          token: 'local-demo-token',
          user: {
            name: email.split('@')[0],
            email,
          },
          status: 'ready',
        })
      },

      // One-click demo access.
      loginDemo: async () => {
        useAnalysisStore.getState().reset()

        set({
          token: 'local-demo-token',
          user: DEMO_USER,
          status: 'ready',
        })
      },

      // Local registration for UI testing.
      register: async ({ name, email, password }) => {
        if (!name || !email || !password) {
          throw new Error('Please complete all fields.')
        }

        useAnalysisStore.getState().reset()

        set({
          token: 'local-demo-token',
          user: { name, email },
          status: 'ready',
        })
      },

      logout: () => {
        set({
          token: null,
          user: null,
          status: 'ready',
        })

        useAnalysisStore.getState().reset()
      },

      checkSession: async () => {
        set({ status: 'ready' })
      },

      startSession: async () => {
        set({
          token: 'local-demo-token',
          user: DEMO_USER,
          status: 'ready',
        })
      },
    }),
    {
      name: 'truthlens_auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)
