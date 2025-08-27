import IMask from 'imask'

export const initMask = () => {
  const inputsTel: NodeListOf<HTMLInputElement> = document.querySelectorAll('.js-tel')
  const inputsMail: NodeListOf<HTMLInputElement> = document.querySelectorAll('.js-mail')
  const inputsDate: NodeListOf<HTMLInputElement> = document.querySelectorAll('.js-date')
  const inputsName: NodeListOf<HTMLInputElement> = document.querySelectorAll('.js-name')

  inputsTel.forEach((input: HTMLInputElement) => {
    const form = input.closest('form')
    const telMask = new (IMask as any)(input, {
      mask: '+{7} (000) 000-00-00'
    })
    const initialValue = telMask.value

    form && form.addEventListener('reset', () => {
      setTimeout(() => (input.value = initialValue), 0)
    })

    return telMask
  })

  // https://codepen.io/denkako/pen/LYmwdPJ
  inputsMail.forEach((input: HTMLInputElement) => {
    const mainMask = new (IMask as any)(input, {
      mask: (value: string) => {
        if (/^[a-z0-9_.-]+$/.test(value)) {
          return true
        }

        if (/^[a-z0-9_.-]+@$/.test(value)) {
          return true
        }

        if (/^[a-z0-9_.-]+@[a-z0-9-]+$/.test(value)) {
          return true
        }

        if (/^[a-z0-9_.-]+@[a-z0-9-]+\.$/.test(value)) {
          return true
        }
        if (/^[a-z0-9_.-]+@[a-z0-9-]+\.[a-z]{1,4}$/.test(value)) {
          return true
        }
        if (/^[a-z0-9_.-]+@[a-z0-9-]+\.[a-z]{1,4}\.$/.test(value)) {
          return true
        }

        if (/^[a-z0-9_.-]+@[a-z0-9-]+\.[a-z]{1,4}\.[a-z]{1,4}$/.test(value)) {
          return true
        }

        return false
      },
      lazy: false
    })

    return mainMask
  })

  inputsDate.forEach((input: HTMLInputElement) => {
    const dateMask = new (IMask as any)(input, {
      mask: Date,
      min: new Date(),
      max: new Date(2099, 0, 1),
      lazy: true
    })

    return dateMask
  })

  inputsName.forEach((input: HTMLInputElement) => {
    const inputMasked = new (IMask as any)(input, {
      mask: /^[A-Za-zА-Яа-я\s-]+$/
    })

    return inputMasked
  })
}
