const getStoredTheme = () => localStorage.getItem('theme')
const setStoredTheme = (theme: string) => localStorage.setItem('theme', theme)

const setTheme = (theme: string) => {
  if (theme === 'auto') {
    document.documentElement.setAttribute('data-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme()

  if (storedTheme) {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const initTheme = () => {
  setTheme(getPreferredTheme())

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()

    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })
}

export {
  getStoredTheme,
  setStoredTheme,
  initTheme
}
