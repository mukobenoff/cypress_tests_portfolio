import { USER_ROLES } from '../mock/mock-user';
import {
	Input,
	Notify,
	Tab,
	Api,
	Radio,
	Select,
	Button,
} from '../../support/page-object/common-pageobject';

const input = new Input();
const notify = new Notify();
const tab = new Tab();
const api = new Api();
const select = new Select();
const button = new Button();

export const OPTIONS_PAGES_IDS = {
	STATUS: 'option-status',
	SWITCHER: 'option-switcher',
	ACCEPT_BUTTON: 'accept-button',
	NAME_INPUT: 'option-name',
	COMBO_NAME_INPUT: 'combo-name',
	EDIT_BUTTON: 'edit-button',
	NEW_VARIANT_MEAL: 'new-variant-meal',
	NEW_VARIANT_MEAL_POSITION: 'new-variant-meal-position',
	NEW_VARIANT_NAME_INPUT: 'new-variant-name',
	NEW_VARIANT_POSITION_NAME: 'new-variant-position-name',
	NEW_VARIANT_POSITION_PRICE: 'new-variant-position-price',
	NEW_VARIANT_POSITION_TAX: 'new-variant-position-tax',
	NEW_VARIANT_PRICE_INPUT: 'new-variant-price',
	NEW_VARIANT_TAX_INPUT: 'new-variant-tax',
	NEW_VARIANT_ADD_BUTTON: 'new-variant-add-btn',
	NEW_VARIANT_EXTERNAL_ID_INPUT: 'external-id',
	ADD_NEW_OPTION_BTN: 'add-new-option-btn',
	ADD_NEW_VARIANT_BTN: 'add-new-variant-btn',
	REMOVE_NEW_VARIANT_BTN: 'remove-new-variant-btn',
	CATEGORY_SELECT: 'category-select',
	ARTICLE_INPUT: 'article',
	HIDDEN_MEAL_VIEW: 'hidden-meal-view',
	HIDDEN_MEAL_NAME_INPUT: 'hidden-meal-name-input',
	HIDDEN_MEAL_WEIGHT_INPUT: 'hidden-meal-weight-input',
	HIDDEN_MEAL_PRICE_INPUT: 'hidden-meal-price-input',
	HIDDEN_MEAL_TAX_INPUT: 'hidden-meal-tax-select',
	OPTION_TYPE_RADIO_INPUT: 'selection-type-radio',
};

const COMBO_REQ_FX = {
	create_option: 'options/request-body/content/create',
	edit_option: 'options/request-body/content/edit',
};

export class OptionsPage {
	// actions

	/**
	 * Открыть страницу опций под ролью переданной в @param role
	 * @param  {string} role = USER_ROLES.OWNER
	 */
	openPage(role = USER_ROLES.OWNER) {
		cy.setLSToken();
		cy.mockUser(role);
		cy.openOptionPage();
		api.waitInitialRequests(role);
		cy.wait('@optionList');
		cy.clickOnStartWork();
	}

	/**
	 * Открыть опцию в списке у которой название равно @param value
	 * @param  {string} value - Название опции
	 */
	openAndCheckOptionInList(value = 0) {
		cy.getById('left-menu').within(() => {
			cy.getById('list-item')
				.contains(value)
				.click();
		});
	}

	// открыть страницу создания
	openCreateView() {
		cy.getById(OPTIONS_PAGES_IDS.ADD_NEW_OPTION_BTN).click();
	}

	/**
	 * Открыть страницу редактирования
	 */
	openEditView() {
		cy.clickOnItem(OPTIONS_PAGES_IDS.EDIT_BUTTON);
	}

	/**
	 * Выключение опции и проверка запроса
	 * Включении опции и проверка запроса
	 * @param  {string} requestName - название запроса
	 * @param  {string} requestDisabledFixture - название фикстуры для выключенной опции
	 * @param  {string} requestActiveFixture - название фикстуры для активной опции
	 */
	toggleAndCheckOptionStatus(
		requestName = '',
		requestDisabledFixture = '',
		requestActiveFixture = ''
	) {
		this.disableAndCheckOption(requestName, requestDisabledFixture);
		this.activateAndCheckOption(requestName, requestActiveFixture);
	}

	/**
	 * Выключение опции(опция - это комбо,ингредиент,опция), проверка запроса на соответствие и
	 * проверка что лейбл изменился
	 * @param  {string} requestName - название запроса
	 * @param  {string} requestFixture - название фикстуры для выключенной опции
	 */
	disableAndCheckOption(requestName = '', requestFixture = '') {
		cy.mockOptionsListDisabled();
		input.toggleSwitcher(OPTIONS_PAGES_IDS.SWITCHER);
		api.checkRequestBody(requestName, requestFixture);
		cy.wait('@optionList');
		cy.elementHaveText(OPTIONS_PAGES_IDS.STATUS, 'Не активен');
	}

	/**
	 * Включение опции(опция - это комбо,ингредиент,опция), проверка запроса на соответствие и
	 * проверка что лейбл изменился
	 * @param  {string} requestName - название запроса
	 * @param  {string} requestFixture - название фикстуры для выключенной опции
	 */
	activateAndCheckOption(requestName = '', requestFixture = '') {
		cy.mockOptionsListActive();
		input.toggleSwitcher(OPTIONS_PAGES_IDS.SWITCHER);
		api.checkRequestBody(requestName, requestFixture);
		cy.wait('@optionList');
		cy.elementHaveText(OPTIONS_PAGES_IDS.STATUS, 'Активен');
	}

	/**
	 * Заполнить название опции
	 * @param  {string} value  - название опции
	 */
	typeOptionName(value = '') {
		input.typeInput(OPTIONS_PAGES_IDS.NAME_INPUT, value);
	}

	/**
	 * Заполнить имя нового варианта опции
	 * @param  {string} value - название варианта опции
	 */
	typeOptionNewVariantName(value = '') {
		input.typeInput(OPTIONS_PAGES_IDS.NEW_VARIANT_NAME_INPUT, value);
	}

	/**
	 * Заполнить цену нового варианта опции
	 * @param  {string} value - цена опции
	 */
	typeOptionNewVariantPrice(value = '') {
		input.typeInput(OPTIONS_PAGES_IDS.NEW_VARIANT_PRICE_INPUT, value);
	}

	/**
	 * Заполнить НДС нового варианта опции
	 * @param  {number} value  - НДС опции
	 */
	typeOptionNewVariantTax(value = '') {
		select.selectByText(OPTIONS_PAGES_IDS.NEW_VARIANT_TAX_INPUT, value);
	}

	/**
	 * Заполнить тип  опции
	 * @param  {string} value  - тип опции
	 */
	typeOptionSelectionType(value = '') {
		Radio.selectRadioByText(OPTIONS_PAGES_IDS.OPTION_TYPE_RADIO_INPUT, value);
	}

	/**
	 * Добавить новый вариант опции
	 */
	addNewVariant() {
		cy.clickOnItem(OPTIONS_PAGES_IDS.NEW_VARIANT_ADD_BUTTON);
	}
	// checks

	/**
	 * Проверка что кнопка создания опции не активна
	 */
	checkCreatingIsDisabled() {
		button.checkDisabledButton(OPTIONS_PAGES_IDS.ACCEPT_BUTTON);
	}

	/**
	 * Нажать на кнопку подтверждения формы и проверить запрос с нотифи
	 * @param  {string} requestName='createOption' - название запроса
	 * @param  {string} requestFixture='options/option_create' - название фикстуры
	 * @param  {string} notifyText='Опциясоздана' - текст нотифая
	 */
	checkOptionOnSubmitActions(
		requestName = 'createOption',
		requestFixture = 'options/request-body/option/create',
		notifyText = 'Опция создана'
	) {
		cy.clickOnItem(OPTIONS_PAGES_IDS.ACCEPT_BUTTON);
		api.checkRequestBody(requestName, requestFixture);
		notify.checkNotifySuccessText(notifyText);
	}

	/**
	 * Переключение по табам и проверка что они активны после переключения
	 */
	checkTabsIsActiveAfterClick() {
		tab.clickAndCheckTab('Ингредиенты');
		tab.clickAndCheckTab('Варианты для комбо');
		tab.clickAndCheckTab('Опции');
	}
}

export class Combo {
	// actions

	/** Подготовка перед каждым тестом комбо */
	prepareBeforeEach() {
		cy.setLSToken();
		cy.mockUser(USER_ROLES.OWNER);
		cy.openOptionPage();
		api.waitInitialRequests(USER_ROLES.OWNER);

		cy.clickOnStartWork();
		cy.getById('tab')
			.contains('Варианты для комбо')
			.click();

		/**
		 * Нужно остановить время поскольку в новом варинте есть поле tempId,
		 * которое создаётся через Date.now()
		 */
		cy.clock(Date.UTC(2021, 6, 5, 13, 0), ['Date']);
	}

	// checks

	/** Проверить запрос на создание опции */
	checkCreateOptionRequestBody() {
		api.checkRequestBody('createOption', COMBO_REQ_FX.create_option);
	}

	/** Проверить запрос на изменение опции */
	checkEditOptionRequestBody() {
		api.checkRequestBody('optionEdit', COMBO_REQ_FX.edit_option);
	}

	/** Проверка редактирования комбо */
	checkEditCombo() {
		cy.get('.menu').within(() => {
			cy.getById('list-item')
				.contains('5575')
				.click();
		});
		cy.getById(OPTIONS_PAGES_IDS.EDIT_BUTTON).click();

		input.clearInput(OPTIONS_PAGES_IDS.COMBO_NAME_INPUT);
		input.typeInput(OPTIONS_PAGES_IDS.COMBO_NAME_INPUT, 'Крокодил');

		cy.getById(OPTIONS_PAGES_IDS.REMOVE_NEW_VARIANT_BTN)
			.eq(0)
			.click();

		select.selectByText(OPTIONS_PAGES_IDS.CATEGORY_SELECT, 'Уточная');

		select.selectByText(OPTIONS_PAGES_IDS.NEW_VARIANT_MEAL, 'Мимоза');

		input.typeInput(
			OPTIONS_PAGES_IDS.NEW_VARIANT_POSITION_NAME,
			'Крокозябрина три'
		);

		input.typeInput(OPTIONS_PAGES_IDS.NEW_VARIANT_POSITION_PRICE, '100.55');

		select.selectByText(OPTIONS_PAGES_IDS.NEW_VARIANT_POSITION_TAX, '10%');

		cy.getById(OPTIONS_PAGES_IDS.ADD_NEW_VARIANT_BTN).click();

		cy.getById(OPTIONS_PAGES_IDS.ACCEPT_BUTTON).click();

		notify.checkNotifySuccessText('комбо обновлен');

		this.checkEditOptionRequestBody();
	}
}

// TODO: Не актуально,много поменялось будет в отдельной таске
export class HiddenMeal {
	/**
	 * Открыть lpage с формой создания скрытого блюда
	 */
	openHiddenMealView() {
		tab.clickAndCheckTab('Варианты для комбо', 2);
		cy.getById(OPTIONS_PAGES_IDS.ADD_NEW_OPTION_BTN).click();
		// В селекте есть кнопка для открытия lpage
		select.selectByText(
			OPTIONS_PAGES_IDS.NEW_VARIANT_MEAL,
			'Создать новую скрытую'
		);
	}

	/**
	 * Нажать кнопку создания скрытого блюда
	 */
	clickOnCreateHiddenMeal() {
		cy.getById(OPTIONS_PAGES_IDS.HIDDEN_MEAL_VIEW).within(() => {
			cy.clickOnItem(OPTIONS_PAGES_IDS.ACCEPT_BUTTON);
		});
	}

	/**
	 * Проверить запрос на создание скрытого блюда
	 */
	checkCreateHiddenMealRequest() {
		api.checkRequestBody('createHiddenMeal', 'meals/response/hidden_meal');
	}

	/**
	 * Проверить нотифай на контент
	 * @param  {string} notifyId - data-cy нотифи
	 * @param  {string} notifyText - текст нотифи
	 */
	checkHiddenMealSubmitFormNotify(notifyText) {
		notify.checkNotifyErrorText(notifyText);
	}

	/**
	 * Заполнить название скрытого блюда
	 * @param  {string} value  - название скрытого блюда
	 */
	typeHiddenMealName(value = '') {
		input.typeInput(OPTIONS_PAGES_IDS.HIDDEN_MEAL_NAME_INPUT, value);
	}

	/**
	 * Заполнить вес скрытого блюда
	 * @param  {string} value  - вес скрытого блюда
	 */
	typeHiddenMealWeight(value = '') {
		input.typeInput(OPTIONS_PAGES_IDS.HIDDEN_MEAL_WEIGHT_INPUT, value);
	}

	/**
	 * Заполнить цену скрытого блюда
	 * @param  {string} value  - цена скрытого блюда
	 */
	typeHiddenMealPrice(value = '') {
		input.typeInput(OPTIONS_PAGES_IDS.HIDDEN_MEAL_PRICE_INPUT, value);
	}

	/**
	 * Заполнить НДС скрытого блюда
	 * @param  {string} value  - НДС скрытого блюда
	 */
	typeHiddenMealTax(value = '') {
		select.selectByText(OPTIONS_PAGES_IDS.HIDDEN_MEAL_TAX_INPUT, value);
	}
}
