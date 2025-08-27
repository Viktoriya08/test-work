// [data-accordion-item] - обёртка элемента
// [data-accordion-block] - сворачиваемый блок
// [data-accordion-btn] - кнопка свернуть/развернуть

interface IAccordion {
  isAlwaysOpen: boolean
  activeClass: string
  itemSelector: string
  blockSelector: string
  btnSelector: string
}

export default class Accordion {
  private options: IAccordion = {
    isAlwaysOpen: true,
    activeClass: 'is-active',
    itemSelector: '[data-accordion-item]',
    blockSelector: '[data-accordion-block]',
    btnSelector: '[data-accordion-btn]'
  }

  private accordions: NodeListOf<HTMLElement>

  constructor(selector: string, options?: IAccordion) {
    this.accordions = document.querySelectorAll(selector)
    this.options = {
      ...this.options,
      ...options
    }
    this.init()
  }

  private init(): void {
    this.accordions.forEach((accordion: HTMLElement) => {
      const accordionItems: NodeListOf<HTMLElement> = accordion.querySelectorAll(this.options.itemSelector)

      this.initElements(Array.from(accordionItems))
    })
  }

  private initElements(elements: HTMLElement[]): void {
    elements.forEach((item: HTMLElement) => {
      const block: HTMLElement | null = item.querySelector(`:scope ${this.options.blockSelector}`)
      const toggler: HTMLElement | null = item.querySelector(`:scope ${this.options.btnSelector}`)

      if (!toggler || !block) {
        console.warn('Cant find elements for accordion')
        return
      }

      if (item.classList.contains(this.options.activeClass)) {
        block.style.maxHeight = `${block.scrollHeight}px`
      }

      toggler.addEventListener('click', (e: MouseEvent) => {
        const target: HTMLElement = e.target as HTMLElement
        const parent: HTMLElement | null = target.closest(this.options.itemSelector) as HTMLElement

        if (!parent) {
          return
        }

        this.options.isAlwaysOpen && this.closeAll(elements, parent)

        if (parent.classList.contains(this.options.activeClass)) {
          block.style.maxHeight = ''
        } else {
          block.style.maxHeight = `${block.scrollHeight}px`
        }

        parent.classList.toggle(this.options.activeClass)
      })
    })
  }

  private closeAll(allParents: HTMLElement[], excludeNode: HTMLElement | null): void {
    allParents.forEach((item: HTMLElement) => {
      const block: HTMLElement | null = item.querySelector(this.options.blockSelector)

      if (item === excludeNode) {
        return
      }

      item.classList.remove(this.options.activeClass)
      block && (block.style.maxHeight = '')
    })
  }
}
