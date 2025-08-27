import Tabs from '../libs/Tabs'

export const initTabs = () => {
  const tabs: NodeListOf<HTMLElement> = document.querySelectorAll('[data-tabs]')

  tabs.forEach((item: HTMLElement) => new Tabs(item))
}
