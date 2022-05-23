import { Tab } from './page-object/common-pageobject';

export const SESSION_TOKEN = 'test';

Cypress.Commands.add('getById', (testId) => {
	return cy.get(`[data-cy=${testId}]`);
});

Cypress.Commands.add('setLSToken', () => {
	cy.fixture('users-auth/session_token').then((data) => {
		localStorage.setItem('token', data.session.token);
		localStorage.setItem('refresh_token', data.session.refresh_token);
		localStorage.setItem('expire_date', data.session.expire_date);
		localStorage.setItem('id', data.session.id);
		localStorage.setItem('device_id', data.session.device_id);
	});
});

Cypress.Commands.add('elementHaveText', (idElement, haveText, params = {}) => {
	cy.get(`[data-cy=${idElement}]`, params)
		.should('exist')
		.invoke('text')
		.then((text) => {
			expect(text.trim().replace(/[\t\n]/g, '')).equal(haveText);
		});
});

const tab = new Tab();

Cypress.Commands.add('checkAccessPage', (url, nameTab) => {
	cy.url().should('include', `/${url}`);
	cy.getById('closed-page').should('not.exist');
	tab.getTab().contains(nameTab).should('exist');
});

Cypress.Commands.add('checkClosedPage', (dataCy) => {
	cy.url().should('include', '/closed');
	cy.getById('closed-page').should('exist');
	cy.getById(dataCy).should('not.exist');
});

Cypress.Commands.add('clickOnStartWork', () => {
	cy.clickOnItem('start-work');
});

// эмуляция выбора файла в input type file
Cypress.Commands.add('uploadFile', (fileName, fileType, id) => {
	cy.getById(id).then((subject) => {
		cy.fixture(fileName, 'base64').then(Cypress.Blob.base64StringToBlob)
			.then((blob) => {
				const el = subject[0];
				const testFile = new File([blob], fileName, { type: fileType });
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(testFile);
				el.files = dataTransfer.files;
				el.dispatchEvent(new Event('change'));
			});
	});
});

Cypress.Commands.add('elementNotExist', (id) => {
	cy.getById(id).should('not.exist');
});

Cypress.Commands.add('elementExist', (id) => {
	cy.getById(id).should('exist');
});

/**
 * Проверяет состоянние элемента (существует, отсутствует, содержит...)
 * @param id - data-cy элемента
 * @param state - аргумент для метода should. Если передается true/false, то оно перебразуется в exist/not.exist.
 * @example checkElementState('primary-button', 'exist')
 * @example checkElementState('primary-button', true)
 */
Cypress.Commands.add('checkElementState', (id, state = true) => {
	if (typeof state === 'boolean') {
		state = state ? 'exist' : 'not.exist';
	}

	cy.getById(id).should(state);
});

// клик на элемент
Cypress.Commands.add('clickOnItem', (item) => {
	cy.getById(item).click();
});
