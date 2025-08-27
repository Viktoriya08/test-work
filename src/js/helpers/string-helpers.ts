const toCamelCase = (str: string) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr: string) => chr.toUpperCase())

const getCSSVarValue = (variable: string) => getComputedStyle(document.documentElement).getPropertyValue(variable)

const copyToClipboard = (text: string) => {
  const textarea = document.createElement('textarea')

  textarea.textContent = text
  textarea.style.position = 'fixed'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.remove()

  try {
    console.log('copy')
    return document.execCommand('copy')
  } catch (ex) {
    console.warn('Copy to clipboard failed', ex)
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

const formatBytes = (bytes: number, lang: string[] = ['B', 'KB', 'MB', 'GB', 'TB']) => {
  if (bytes === 0) {
    return '0B'
  }

  const sizes = lang
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const result = bytes / Math.pow(1024, i)

  return (result % 1 === 0 ? result : result.toFixed(2)) + sizes[i]
}

export { toCamelCase, getCSSVarValue, copyToClipboard, formatBytes }
