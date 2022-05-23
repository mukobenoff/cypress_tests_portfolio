import { USER_ROLES } from '../mock/mock-user';
import { Tab, Input, Modal } from './common-pageobject';
const input = new Input();

export const MEAL_STATUSES = {
	active: 'Активен',
	moderation: 'На модерации',
	draft: 'Черновик',
	fix_required: 'Отправлено на доработку',
	disabled: 'Не активен',
};

export const CATEGORY_MODAL_INPUT_NAME = {
	NAME_CATEGORY: 'name-category-input',
};

export const CATEGORY_REQ_FIXTURES = {
	CREATE: 'categories/request-body/category_create',
	CHANGE_NAME: 'categories/request-body/category_rename',
	DELETE: 'categories/request-body/category_delete',
};

export const EXCEL_IMPORT_DC = {
	IMPORT_BUTTON: 'menu-excel-import-button',
	IMPORT_MODAL: 'excel-import-modal',
	IMPORT_ACCEPT_BUTTON: 'accept-excel-file-button',
	IMPORT_FILE_LABEL: 'gui-drag-and-drop-file-label',
	IMPORT_FILE_INPUT: 'gui-drag-and-drop-native-input',

	SUCCESS_NOTIFY: 'excel-import-success-notify',
	ADD_CATEGORY_BUTTON: 'add-category-button',
	MENU_BUTTON: 'menu-btn',
	MENU_SUBTITLE: 'menu-subtitle-menu',

	OPEN_RESULTS_BUTTON: 'open-results-button',

	RESULTS_MODAL: 'menu-results-of-imported',
	RESULTS_MODAL_TITLE: 'menu-results-of-imported-title',

	OPEN_DETAIL_RESULTS_BUTTON: 'open-detail-results-info-button',

	ERRORS_MODAL: 'import-errors',

	OPEN_GUIDE_BUTTON: 'open-import-guide-button',

	GUIDE_MODAL: 'excel-import-guide',
};

export const MENU_PAGE_DC = {
	PLACEHOLDER_PRIMARY_BUTTON: 'placeholder-primary-button',
	PLACEHOLDER_SECONDARY_BUTTON: 'placeholder-secondary-button',
};

export const MENU_PAGE_REQUESTS = {
	getMeals: {
		label: 'productsList',
		url: '**/proxy/products/list',
	},
};

export const INTEGRATION_PARTNERS_DC = {
	ALERT: 'integration-alert',
};

export class MenuPage {
	tab = new Tab();

	openPage(role = USER_ROLES.ADMIN, isIntegrationPartner = false) {
		cy.setLSToken();
		cy.mockUser(role, isIntegrationPartner);
		cy.openMenuPage();
		cy.clickOnStartWork();
		cy.wait('@productsList');
		cy.wait('@categoryList');
	}

	// clicks

	// нажатие на кнопку Добавить категорию
	clickAddCategoryBtn() {
		cy.getById('add-category-button').click({ force: true });
	}

	// нажатие на кнопку Изменить категорию
	clickEditCategoryBtn() {
		cy.getById('edit-category-button').click();
	}

	/**
	 * Нажатие на категорию из списка сверху по названию
	 * @param {String} name - название категории
	 */
	clickCategory(name = 'Уточная') {
		cy.getById('sections').within(() => {
			this.tab.clickTab(name);
		});
	}

	/**
	 * Нажатие на кнопку создания категории в заглушке пустового меню
	 */
	clickOnAddCategoryInPlacholder() {
		cy.getById(MENU_PAGE_DC.PLACEHOLDER_PRIMARY_BUTTON).click();
	}

	// checks

	// проверка request body (json) запроса /api/proxy/products/categories/edit
	checkCategoryEditRequestBody(filterBy = CATEGORY_REQ_FIXTURES.CREATE) {
		cy.wait('@categoryEdit');
		cy.fixture(filterBy).then((json) => {
			cy.get('@categoryEdit').its('request.body').should('deep.equal', json);
		});
	}

	// проверка request body (json) запроса /api/proxy/products/categories/create
	checkCategoryCreateRequestBody(filterBy = CATEGORY_REQ_FIXTURES.CREATE) {
		cy.wait('@createCategory');
		cy.fixture(filterBy).then((json) => {
			cy.get('@createCategory').its('request.body').should('deep.equal', json);
		});
	}

	/**
	 * Проверяет отсутствие кнопки добавления категории в заглушке пустового меню
	 */
	checkButtonOfAddCategoryInPlaceholderExist(state = false) {
		cy.checkElementState(MENU_PAGE_DC.PLACEHOLDER_PRIMARY_BUTTON, state);
	}

	/**
	 * Проверяет отсутствие кнопки импорта меню в заглушке пустового меню
	 */
	checkButtonOfImportExcelMenuInPlaceholderExist(state = false) {
		cy.checkElementState(MENU_PAGE_DC.PLACEHOLDER_SECONDARY_BUTTON, state);
	}

	/**
	 * Проверяет отсутствие кнопки импорта меню в верхнем блоке
	 */
	checkButtonOfImportExcelMenuInTopBarExist(state = false) {
		cy.checkElementState(EXCEL_IMPORT_DC.IMPORT_BUTTON, state);
	}
}

export class CategoryCreateModal {
	// содержимое модального окна создания категории
	getModalContent() {
		return cy.getById('create-category-modal');
	}

	// кнопка Создать категорию
	getCreateBtn() {
		return cy.getById('create-category-button');
	}

	// проверка, что модальное окно открыто
	checkModalOpened() {
		this.getModalContent().should('exist');
	}

	// проверка, что модальное окно закрыто
	checkModalClosed() {
		this.getModalContent().should('not.exist');
	}

	// проверка, что кнопка Создать категорию не активна
	checkCreateBtnDisabled() {
		this.getCreateBtn().should('have.attr', 'disabled');
	}

	// нажатие на кнопку Создать категорию
	clickCreateBtn() {
		this.getCreateBtn().click();
	}
}

export class EditCategoryModal {
	//  содержимое модального окна редактирования категории
	getContentModal() {
		return cy.getById('edit-category-modal');
	}

	// нажатие на кнопку согласия
	clickAcceptBtn() {
		this.getContentModal().within(() => {
			cy.getById('accept-button').click();
		});
	}

	// нажатие на кнопку удалить категорию
	clickDeleteBtn() {
		cy.getById('delete-category-button').click();
	}

	// проверка, что модальное окно закрыто
	checkModalClosed() {
		this.getContentModal().should('not.exist');
	}

	// текст об удалении категории
	getDeletingContent() {
		return cy.getById('category-deleting');
	}

	// нажатие на кнопку закрытия модального окна
	clickCloseModalBtn() {
		cy.getById('modal-close-button').click();
	}

	// проверка, что текст удаления категории существует
	checkDeletingTextOpened() {
		this.getDeletingContent().should('exist');
	}

	// проверка, что текст удаления категории не существует
	checkDeletingTextClosed() {
		this.getDeletingContent().should('not.exist');
	}
}

export class ExcelImport {
	/**
	 * Открытие и проверка модального окна импорта меню через excel
	 */
	openModal() {
		cy.clickOnItem(EXCEL_IMPORT_DC.IMPORT_BUTTON);
		Modal.checkModalOpened(EXCEL_IMPORT_DC.IMPORT_MODAL);
		cy.elementNotExist(EXCEL_IMPORT_DC.IMPORT_ACCEPT_BUTTON);
	}

	/**
	 * Проверка что нужные кнопки действий взаимодействия с меню задизейблены
	 */
	checkDisabledActions() {
		input.checkDisabledAttribute(EXCEL_IMPORT_DC.IMPORT_BUTTON);
		input.checkDisabledAttribute(EXCEL_IMPORT_DC.ADD_CATEGORY_BUTTON);
	}

	/**
	 * Открытие нотифи с параметрами
	 * @param  {string} type
	 * @param  {object} data
	 */
	openNotifyTop(type, data) {
		if (type === 'success' || type === 'yellow-dark') {
			window.Cypress.App.NotifyTop.open({
				component: 'desktop/General/Notify/ExcelImport/FileUploadSuccess',
				width: 614,
				theme: type,
				time: -1,
				context: data,
			});
		}
		if (type === 'error') {
			window.Cypress.App.NotifyTop.open({
				component: 'desktop/General/Notify/ExcelImport/ImportError',
				width: 600,
				theme: 'error',
				time: -1,
			});
		}
	}

	/**
	 * Выбор файла для инпута type = file
	 */
	openAndChooseFile() {
		cy.uploadFile('meals/menu-excel-import.xlsx', 'xlsx', EXCEL_IMPORT_DC.IMPORT_FILE_INPUT);
		cy.elementHaveText(EXCEL_IMPORT_DC.IMPORT_FILE_LABEL, 'meals/menu-excel-import.xlsx');
		cy.elementExist(EXCEL_IMPORT_DC.IMPORT_ACCEPT_BUTTON);
		cy.clickOnItem(EXCEL_IMPORT_DC.IMPORT_ACCEPT_BUTTON);
	}

	/**
	 * Открытие модального окна с результатами импорта
	 */
	openResultsModal() {
		cy.clickOnItem(EXCEL_IMPORT_DC.OPEN_RESULTS_BUTTON);
		Modal.checkModalOpened(EXCEL_IMPORT_DC.RESULTS_MODAL);
	}

	/**
	 * Открытие модального окна с инструкцией по импорту
	 */
	openGuideModal() {
		cy.clickOnItem(EXCEL_IMPORT_DC.OPEN_GUIDE_BUTTON);
		Modal.checkModalOpened(EXCEL_IMPORT_DC.GUIDE_MODAL);
	}

	/**
	 * Открытие детального модального окна с результатами импорта
	 */
	openDetailResultsModal() {
		cy.clickOnItem(EXCEL_IMPORT_DC.OPEN_DETAIL_RESULTS_BUTTON);
		Modal.checkModalOpened(EXCEL_IMPORT_DC.ERRORS_MODAL);
	}
}
