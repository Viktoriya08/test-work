export const calcHeaderHeight = () => {
	const doc: HTMLElement = document.documentElement;
	const header = document.querySelector('.header') as HTMLElement;

	if (header)
		doc.style.setProperty('--header-height', `${header.offsetHeight}px`);
}
