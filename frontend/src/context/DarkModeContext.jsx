import { createContext, useContext, useState, useEffect } from 'react'

const DarkModeContext = createContext({ dark: true, toggle: () => {} })

export function DarkModeProvider({ children }) {
  // TruthLens is dark-first. This context is kept for future toggle support.
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('truthlens_dark')
    return saved !== null ? saved === 'true' : true
  })

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    localStorage.setItem('truthlens_dark', dark)
  }, [dark])

  // Always start in dark mode
  useEffect(() => {
    document.body.classList.add('dark')
  }, [])

  const toggle = () => setDark((d) => !d)

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}
