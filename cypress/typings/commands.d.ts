declare namespace Cypress {
	interface Chainable {
		/**
		 * Custom command to select DOM element by data-cy attribute.
		 * @example cy.getById('greeting')
		 */
		getById(value: string): Chainable<Element>;

		/**
		 * Проверяет состоянние элемента (существует, отсутствует, содержит...)
		 * @param id - data-cy элемента
		 * @param state - аргумент для метода should. Если передается true/false, то оно перебразуется в exist/not.exist.
		 * @example checkElementState('primary-button', 'exist')
		 * @example checkElementState('primary-button', true)
		 */
		checkElementState(id: string, state: string | boolean): void;
	}
}
