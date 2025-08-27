import JustValidate from 'just-validate'
import { declines } from '../helpers/num-helpers'
import { formatBytes } from '../helpers/string-helpers'
import { formErrors } from '../data/lang'

const addRules = (form: HTMLElement, validator: JustValidate): void => {
  const elements: NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = form.querySelectorAll('input:not([type="hidden"], :disabled), textarea, select, .select:not(.is-disabled)')

  const parseAttribute = (el: HTMLElement, attr: string): number | false => {
    const value = el.getAttribute(attr)

    return value !== null ? +value : false
  }

  elements.forEach((element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const isReq = element.required
    const isTel = element.classList.contains('js-tel')
    const isEmail = element.type === 'email'
    const isDate = element.classList.contains('js-date')
    const isFile = element.type === 'file'
    const min: number | false = parseAttribute(element, 'minlength')
    const max: number | false = parseAttribute(element, 'maxlength')

    const filesAccept = element instanceof HTMLInputElement && element.accept
        ? element.accept.replace(/ /g, '').split(',')
        : false
    const minSize: number | false = element.dataset.minSize ? +element.dataset.minSize : false // in bytes
    const maxSize: number | false = element.dataset.maxSize ? +element.dataset.maxSize : false

    const reqTextError = element.getAttribute('data-error')

    const rulesList: object[] = []

    if (isReq) {
      rulesList.push({
        rule: 'required',
        errorMessage: reqTextError || formErrors.req
      })
    }

    if (isTel && min) {
      rulesList.push({
        rule: 'minLength',
        value: min,
        errorMessage: formErrors.phone
      })
    }

    if (!isTel && min) {
      rulesList.push({
        rule: 'minLength',
        value: min,
        errorMessage: `${formErrors.min.title} ${min} ${declines(min, formErrors.min.one, formErrors.min.two, formErrors.min.few)}`
      })
    }

    if (max) {
      rulesList.push({
        rule: 'maxLength',
        value: max,
        errorMessage: `${formErrors.max.title} ${min} ${declines(max, formErrors.min.one, formErrors.min.two, formErrors.min.few)}`
      })
    }

    if (isEmail) {
      rulesList.push({
        rule: 'email',
        errorMessage: formErrors.email
      })
    }

    if (isDate) {
      rulesList.push({
        rule: 'minLength',
        value: 10,
        errorMessage: formErrors.date
      })
    }

    if (isFile) {
      isReq && rulesList.push({
        rule: 'minFilesCount',
        value: 1,
        errorMessage: formErrors.file
      })

      if (filesAccept) {
        const arrayExt: string[] = filesAccept.filter(ext => ext[0] === '.').map(ext => ext.slice(1))
        const arrayTypes: string[] = filesAccept.filter(ext => ext[0] !== '.')

        rulesList.push({
          rule: 'files',
          value: {
            files: {
              extensions: arrayExt,
              types: arrayTypes,
            },
          },
          errorMessage: `${formErrors.extension}. ${arrayExt.forEach((ext, i) => i > 0 ? ext + ', ' : ext)}`,
        })
      }

      minSize && rulesList.push({
        rule: 'files',
        value: {
          files: {
            maxSize: minSize,
          },
        },
        errorMessage: `${formErrors.minSize} ${formatBytes(minSize)}`,
      })

      maxSize && rulesList.push({
        rule: 'files',
        value: {
          files: {
            maxSize: maxSize,
          },
        },
        errorMessage: `${formErrors.maxSize} ${formatBytes(maxSize)}`,
      })
    }

    rulesList.length && validator.addField(element, rulesList, {
      errorsContainer: element.closest('[data-parent], .field')
    })
  })
}

export { addRules }
