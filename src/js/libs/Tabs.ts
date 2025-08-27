// [data-tabs-switcher] - обёртка для переключателей
// [data-tabs-blocks] - обёртка для блоков

interface ITabs {
  activeClass: string
  switchersSelector: string
  blocksSelector: string
}

export default class Tabs {
  private _el: HTMLElement
  private _switchers!: HTMLCollection
  private _tabs!: HTMLCollection
  private activeTabIndex = 0
  private options: ITabs = {
    activeClass: 'is-active',
    switchersSelector: '[data-tabs-switcher]',
    blocksSelector: '[data-tabs-blocks]'
  }

  constructor(el: HTMLElement, options?: ITabs) {
    if (!el) {
      throw new Error('Tabs requires a valid HTMLElement')
    }

    this.options = {
      ...this.options,
      ...options
    }

    this._el = el

    const switchersWrapper = this._el.querySelector(this.options.switchersSelector)
    const tabsWrapper = this._el.querySelector(this.options.blocksSelector)

    if (!switchersWrapper || !tabsWrapper) {
      return
    }

    this._switchers = switchersWrapper.children
    this._tabs = tabsWrapper.children
    this._init()
  }

  private _init() {
    Array.from(this._switchers).forEach((switcher, i) => {
      switcher.addEventListener('click', () => this.setActiveTab(i))
    })

    this.setActiveTab(this.activeTabIndex)
  }

  private _resetActive() {
    Array.from(this._switchers).forEach((switcher, i) => {
      switcher.classList.remove(this.options.activeClass)
      this._tabs[i] && this._tabs[i].classList.remove(this.options.activeClass)
    })
  }

  private _isSwitcherExists(num: number) {
    return this._switchers && this._switchers[num]
  }

  private _isTabExists(num: number) {
    return this._tabs && this._tabs[num]
  }

  public setActiveTab(index: number) {
    this._resetActive()
    this.activeTabIndex = index
    this._isSwitcherExists(index) && this._switchers[index].classList.add(this.options.activeClass)
    this._isTabExists(index) && this._tabs[index].classList.add(this.options.activeClass)
  }

  public getActiveTab() {
    return this.activeTabIndex
  }
}
