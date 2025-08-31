import { setScrollWidth } from './utils/scroll-width'
import { iosFixes } from './utils/ios-fixes'
import { initModals } from './modules/init-modals'
import { initTheme } from './modules/init-theme'
import { calcHeaderHeight } from "./utils/calc-header-height";
import initInputFile from "./modules/init-input-file"
import initNoUiSlider from "./modules/init-noUiSlider";
import { initSlimSelect } from "./modules/init-select"
import initAnimations from "./modules/init-animations";

// DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  setScrollWidth()
  iosFixes()
  initTheme()
  calcHeaderHeight()
  new initInputFile()
  initNoUiSlider()
  initSlimSelect('.default-select', '.default-select__select', false);
  initAnimations();
})

// All resources loaded
window.addEventListener('load', () => {
  initModals()
})
