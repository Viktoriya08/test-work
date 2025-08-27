import { setScrollWidth } from './utils/scroll-width'
import { iosFixes } from './utils/ios-fixes'
import { initModals } from './modules/init-modals'
import { initTheme } from './modules/init-theme'

// DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  setScrollWidth()
  iosFixes()
  initTheme()
})

// All resources loaded
window.addEventListener('load', () => {
  initModals()
})
