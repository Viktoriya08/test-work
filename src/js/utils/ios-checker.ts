export const iosChecker = () => {
  const userAgent = navigator.userAgent
  const platform = navigator.platform

  const iosDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ]

  const isIosDevice = iosDevices.includes(platform) || (userAgent.includes('Mac') && 'ontouchend' in document)

  const isIpadMac = userAgent.includes('Mac') && navigator.maxTouchPoints > 1

  return isIosDevice || isIpadMac
}
