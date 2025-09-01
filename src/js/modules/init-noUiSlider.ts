import noUiSlider from 'nouislider'

export default function initNoUiSlider() {

    const rangeSliders = document.querySelectorAll<HTMLElement>(`.slider-range`)

    rangeSliders.forEach((rangeSlider) => {
      const sliderStart = rangeSlider.getAttribute("data-start")
      const sliderStep = Number(rangeSlider.getAttribute("data-step"))
      const sliderMin =  Number(rangeSlider.getAttribute("data-min"))
      const sliderMax =  Number(rangeSlider.getAttribute("data-max"))

      noUiSlider.create(rangeSlider, {
          start: [sliderStart],
          connect: 'lower',
          step: sliderStep,
          range: {
              'min': [sliderMin],
              'max': [sliderMax]
          },
          format: {
            to: function(value: number) {
                return value + ' %';
            },
            from: function(value: string) {
                return parseFloat(value);
            }
        }
      });

      changeInputValue(rangeSlider)
    })

    function changeInputValue(currentSlider){
      const rangeInput = currentSlider.closest('.default-range').querySelector('.default-range__current')

      currentSlider.noUiSlider.on('update', function (values, handle) {
        rangeInput.textContent  =values[handle]
      });
    }
}
