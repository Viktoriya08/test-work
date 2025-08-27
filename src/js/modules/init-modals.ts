import HystModal from 'hystmodal'

export const initModals = (): HystModal => {
  const modals = new HystModal({
    linkAttributeName: 'data-open-modal',
    waitTransitions: true
  })

  return modals
}
