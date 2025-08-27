import { iosChecker } from './ios-checker'

export const iosFixes = () => {
  // @ts-expect-error not windows
  if (!(!!window.MSInputMethodContext && !!document.documentMode)) {
    const isIos = iosChecker()

    if (!isIos) {
      return
    }

    document.body.classList.add('ios')
    document
      .querySelector('[name=viewport]')
      ?.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1') // fix input zooming


    document.documentElement.style.setProperty('--dvh', `${window.innerHeight * 0.01}px`)

    window.addEventListener('resize', () => document.documentElement.style.setProperty(
      '--dvh', `${window.innerHeight * 0.01}px`)
    )
  }
}
