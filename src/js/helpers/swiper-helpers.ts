import Swiper from 'swiper'
import { SwiperOptions } from 'swiper/types/swiper-options'

const getProgressPercent = (progress: number) => +((1 - progress).toFixed(2)) * 100

const hasManySlides = (slider: HTMLElement) => slider.getElementsByClassName('swiper-slide').length >= 2

// Отключаем свайпер на брейкпоинте
const createBreakepoint = (el: HTMLElement, params: SwiperOptions, media: string) => {
  let swiperInstance: undefined | Swiper
  const mediaBreak = window.matchMedia(media)

  if (!el) {
    return
  }

  const initSwiper = () => (swiperInstance = new Swiper(el, params))

  const breakpointChecker = () => {
    if (mediaBreak.matches === true) {
      return initSwiper()
    } else if (mediaBreak.matches === false) {
      swiperInstance !== undefined && swiperInstance.destroy(true, true)
    }

    return false
  }

  mediaBreak.addListener(breakpointChecker)
  breakpointChecker()
}

export { getProgressPercent, hasManySlides, createBreakepoint }
