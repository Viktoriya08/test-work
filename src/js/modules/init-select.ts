import SlimSelect from "slim-select"

// Примеры работы с Slim Select https://codepen.io/brexston74/pen/BamrZzN

// Значения по умолчанию
const configSelect = {
	messages: {
		placeholder: "Выберите",
		searchText: "Ничего не найдено",
		searchPlaceholder: "Поиск"
	}
}

declare global {
  interface Window {
    selects?: SlimSelect[];
    destroySelects?: () => void;
  }
}

// Передаем основной элемент селекта и селектор самого select внутри него
/**
 * Добавляет элемент в слушатель события scroll страницы
 * @async
 * @param {String} parentSelector - селектор корневого родителя(типо .default-select)
 * @param {String} selectSelector - селектор самого селекта(типо .default-select__select)
 * @returns {void}
 */
export function initSlimSelect(parentSelector, selectSelector, clear) {


	const destroySelects = () => {
		if (!window.selects?.length) {
			window.selects = []
		} else {
			window.selects.forEach(select => select.destroy())
			window.selects = []
		}
	}
	window.destroySelects = () => destroySelects();

	destroySelects()

	const selectList = document.querySelectorAll(parentSelector)

	selectList.forEach((selectItem) => {
		const select = selectItem.querySelector(selectSelector)
		if (!select) return

		const placeholder = select.getAttribute("data-placeholder")
		const multiple = select.hasAttribute("multiple")
		const search = select.hasAttribute("data-search")
		const dropdown = selectItem.querySelector(`#slim-dropdown`)
		const isException = select.hasAttribute("data-select-exсept")

		const slimSelectInstance = new SlimSelect({
			select: select,
			settings: {
				showSearch: search,
				searchText: configSelect.messages.searchText,
				searchPlaceholder: configSelect.messages.searchPlaceholder,
				placeholderText: placeholder || configSelect.messages.placeholder,
				closeOnSelect: !multiple,
				allowDeselect: multiple,
				maxValuesMessage: "Выбрано: {number}",
				maxSelected: 5,
				openPosition: "down",
				contentLocation: dropdown || null,
				contentPosition: dropdown ? "relative" : "absolute"
			},
		})

		//Сброс селектов
		if (!isException) {
			window.selects?.push(slimSelectInstance)
			if (clear) {
				try {
					slimSelectInstance.setSelected(`${slimSelectInstance.select[0]}`)
				} catch (error) {
				}
			}
		}

	})
}
