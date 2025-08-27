export const setScrollWidth = () => {
  document.documentElement.style.setProperty(
      '--scroll-width', `${getScrollbarWidth()}px`
  )
}
function getScrollbarWidth() {
  const outer = document.createElement('div')

  outer.style.visibility = 'hidden'
  outer.style.width = '100px'

  document.body.appendChild(outer)

  const widthNoScroll = outer.offsetWidth
  outer.style.overflow = 'scroll'

  // add inner div
  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  const widthWithScroll = inner.offsetWidth

  outer.parentNode && outer.parentNode.removeChild(outer)

  return widthNoScroll - widthWithScroll
}
