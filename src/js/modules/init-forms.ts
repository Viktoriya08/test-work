import JustValidate from 'just-validate'
import { addRules } from '../helpers/form-helpers'

const validateOptions = {
  lockForm: true,
  errorLabelStyle: '',
  errorFieldCssClass: 'has-error',
  errorLabelCssClass: 'input-error',
  validateBeforeSubmitting: false,
  focusInvalidField: false
}
const submitForm = (e: Event) => {
  const targetForm = e.target as HTMLFormElement
  const name = targetForm.getAttribute('data-form') || ''
  const action = targetForm.getAttribute('action') || `${window.location}`
  const dataForm = new FormData(targetForm)
  const submitBtn = targetForm.querySelector('[type="submit"]')

  submitBtn?.classList.add('is-load')

  fetch(action, {
    method: 'POST',
    credentials: 'same-origin',
    body: dataForm
  })
  .then((res) => {
    if (!res.ok) {
      submitBtn?.classList.remove('is-load')
      throw new Error('Server error')
    }
    return res.json()
  })
  .then((data) => {
    if (!data) {
      throw new Error('Invalid JSON response')
    } else {
      console.log('SENDED')
    }

    submitBtn && submitBtn.classList.remove('is-load')
  })
  .catch((err) => {
    submitBtn?.classList.remove('is-load')
    console.error(err)
  })
}

const initForms = () => {
  const forms: NodeListOf<HTMLFormElement> = document.querySelectorAll('[data-form]:not(.is-init)')

  forms.forEach((form) => {
    const validate = new JustValidate(form, validateOptions)

    addRules(form, validate)
    validate.onSuccess((e) => submitForm(e as Event))
    form.API = validate
    form.classList.add('is-init')
  })
}

export { validateOptions, initForms }
