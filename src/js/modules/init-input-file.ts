export default class initInputFile {
  private inputsFiles
  private fileTypes
  constructor() {
      this.inputsFiles = document.querySelectorAll('.default-file__input')
      if(!this.inputsFiles.length) return
      this.init()
      this.fileTypes = ['.jpg', '.jpeg', '.pdf', '.png']
  }

  init() {
      this.inputsFiles.forEach(input => input.addEventListener('change', (event) => {
          const [file] = event.target.files
          if((file.size / 1024 / 1024) < 5) {
              let fileType = file.name.match(/\.([^.]+)$|$/)[0]
              let itsImage = this.fileTypes.includes(fileType)
              if(itsImage) {
                  const filePlaceholder = input.parentNode?.querySelector('.default-file__placeholder')
                  input.parentNode?.classList.add('active')
                  filePlaceholder.textContent = file.name
              } else {
                  input.value = null
                  alert(`Формат документа не соответствует возможному для загрузки \n (${this.fileTypes})`)
              }
          } else {
              input.value = null
              alert('Размер файла не может превышать 5 Мб')
          }
      }))
  }

}
