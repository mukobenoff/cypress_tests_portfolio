import { USER_ROLES } from '../../support/mock/mock-user';

export const ACTIONS = {
	ACCEPT_SELECTED_PARTNER: 'accept-selected-partner',
};

export class Calendar {
	cy = {
		input: 'filter-by-date',
	}

	defaultDate = { day: '6', month: 'июль', year: '2021' };

	classes = {
		panel: {
			from: '.mx-calendar:first-child',
			to: '.mx-calendar:last-child',
		},
		arrow: {
			left: '.mx-btn-icon-left',
			right: '.mx-btn-icon-right',
		},
		date: {
			day: '.cell',
			month: '.mx-btn-current-month',
			year: '.mx-btn-current-year',
		},
	}

	/** Выбрать дату начала */
	_selectDateFrom(date = this.defaultDate) {
		const panel = () => cy.get(this.classes.panel.from);

		panel().find(this.classes.date.year).invoke('text').then(year => {
			panel().find(this.classes.date.month).invoke('text').then(month => {
				const isCorrect = year.includes(date.year) && month.includes(date.month);

				if (isCorrect) {
					panel().within(() => cy.get(this.classes.date.day).contains(new RegExp(`^${date.day}$`)).click());
				} else {
					panel().find(this.classes.arrow.left).click();
					this._selectDateFrom(date);
				}
			});
		});
	}

	/** Выбрать дату окончания */
	_selectDateTo(date = this.defaultDate) {
		const panel = () => cy.get(this.classes.panel.to);

		panel().find(this.classes.date.year).invoke('text').then(year => {
			panel().find(this.classes.date.month).invoke('text').then(month => {
				const isCorrect = year.includes(date.year) && month.includes(date.month);

				if (isCorrect) {
					panel().within(() => cy.get(this.classes.date.day).contains(new RegExp(`^${date.day}$`)).click());
				} else {
					panel().find(this.classes.arrow.left).click();
					this._selectDateTo(date);
				}
			});
		});
	}

	/** Открыть календарь */
	open() {
		cy.getById(this.cy.input).click();
	}

	/** Выбор периода фильтра */
	setPeriod({ from, to } = { from: this.defaultDate, to: this.defaultDate }) {
		this._selectDateFrom(from);
		this._selectDateTo(to);
	}
}

export class Notify {
	/**
	 * нотифай успеха
	 */
	getNotifySuccess() {
		return cy.getById('notify-success');
	}

	/**
	 * нотифай ошибки
	 */
	getNotifyError() {
		return cy.getById('notify-error');
	}

	/**
	 * проверка текста в нотифае успеха
	 * @param  {string} text='Изменениясохранены'
	 */
	checkNotifySuccessText(text = 'Изменения сохранены', isShouldBeVisible = false) {
		isShouldBeVisible
			? cy.getById('notify-success').should('exist').and('be.visible').elementHaveText('notify-success', text)
			: cy.elementHaveText('notify-success', text);
	}

	/**
	 * Проверить, что успешный нотифай виден/не виден
	 */
	checkNotifySuccessVisible(isShouldBeVisible = true) {
		isShouldBeVisible
			? this.getNotifySuccess().should('be.visible')
			: this.getNotifySuccess().should('not.be.visible');
	}

	/**
	 * проверка текста в нотифае ошибки
	 * @param  {string} text='Ничегоневышло'
	 */
	checkNotifyErrorText(text = 'Ничего не вышло') {
		cy.elementHaveText('notify-error', text);
	}
}

export class Base {
	/**
	 * проверить текст элемента
	 * @param  {string} item
	 * @param  {string} text
	 */
	haveText(item, text) {
		cy.elementHaveText(item, text);
	}

	/**
	 * клик на элемент
	 * @param  {string} item
	 */
	click(item) {
		cy.getById(item).click();
	}

	/**
	 * проверить есть ли элемент
	 * @param  {string} id
	 */
	exist(id) {
		cy.getById(id).should('exist');
	}

	/**
	 * проверить что элемент отсутствует
	 * @param  {string} id
	 */
	notExist(id) {
		cy.getById(id).should('not.exist');
	}

	/**
	 * получить текст элемента
	 * @param  {string} name
	 */
	getElementText(name) {
		return cy.getById(name).invoke('text');
	}
}

export class Api {
	/**
	 * Подождать запрос и сравнить request body
	 * @param  {string} requestName
	 * @param  {string} fixtureName
	 */
	checkRequestBody(requestName, fixtureName) {
		cy.wait(`@${requestName}`);
		cy.fixture(fixtureName).then((json) => {
			cy.get(`@${requestName}`).its('request.body').should('deep.equal', json);
		});
	}

	/** Ожидание основных запросов до окна выбора партнера */
	waitInitialRequestsBeforePartnerSelect() {
		cy.wait('@getuser');
		cy.wait('@getRolesList');
		cy.wait('@getRulesList');
		cy.wait('@partnersList');
	}

	/** Ожидание основных запросов до окна выбора партнера */
	waitInitialRequestsAfterPartnerSelect(role = USER_ROLES.OWNER) {
		if (role === USER_ROLES.MANAGER) {
			cy.wait('@getShopById');
		} else {
			cy.wait('@shopList');
		}
		cy.wait('@ordersList');
	}

	/** Ожидание основных запросов до и после окна выбора партнера */
	waitInitialRequests(role = USER_ROLES.OWNER) {
		this.waitInitialRequestsBeforePartnerSelect();
		this.waitInitialRequestsAfterPartnerSelect(role);
	}
}

export class Checkbox {
	// toogles

	/**
	* Включить/выключить чекбокс по data-cy
	* @param {string} id - data-cy чек бокса
	*/
	toggleCheckboxById(id) {
		const checkbox = cy.getById(id);

		checkbox.click();
	}

	/**
	 * Включить/выключить чекбокс по тексту
	 * @param  {string} selector - data-cy, css selector
	 * @param  {string} text - текст чекбокса который нужно выбрать
	 */
	toggleCheckboxByText(selector, text) {
		const el = selector[0] === '.' ? cy.get(selector) : cy.getById(selector);

		el.contains(text).click();
	}

	/**
	 * Включить/выключить чекбокс по индексу
	 * @param  {string} selector - data-cy, css selector
	 * @param  {number} index - индекс чекбокса который нужно выбрать
	 */
	toggleCheckboxByIndex(selector, index = 0) {
		const el = selector[0] === '.' ? cy.get(selector) : cy.getById(selector);

		el.eq(index).click();
	}
}

export class Radio {
	RADIO_DATA_CY = '';
	OPTION_DATA_CY = 'radio-option';

	constructor(dataCy) {
		this.RADIO_DATA_CY = dataCy;
	}

	/** Возвращает элемент radio */
	getRadioElement() {
		return cy.getById(this.RADIO_DATA_CY);
	}

	/** Возвращает элемент option
	 * @param textOrIndex {string|number} - текст или индекс опции
	 */
	getOptionElement(textOrIndex) {
		const isSearchByText = typeof textOrIndex === 'string';

		if (isSearchByText) {
			return this.getRadioElement().within(() => {
				cy.getById(this.OPTION_DATA_CY).contains(textOrIndex);
			});
		} else {
			return this.getRadioElement().within(() => {
				cy.getById(this.OPTION_DATA_CY).eq(textOrIndex);
			});
		}
	}

	/**
	 * Выбрать radio по тексту
	 * @param  {string} selector - data-cy, css selector
	 * @param  {string} text - текст radio option который нужно выбрать
	 */
	static selectRadioByText(selector, text) {
		const el = selector[0] === '.' ? cy.get(selector) : cy.getById(selector);

		el.click()
			.within(() => {
				cy.getById('radio-option').contains(text).click();
			});
	}

	/**
	 * Выбрать radio по индексу
	 * @param  {string} selector - data-cy, css selector
	 * @param  {number} index - индекс radio option который нужно выбрать
	 */
	static selectRadioByIndex(selector, index = 0) {
		const el = selector[0] === '.' ? cy.get(selector) : cy.getById(selector);

		el.click()
			.within(() => {
				cy.getById('radio-option').eq(index).click();
			});
	}
}
export class Input {
	/**
	 * @param  {string} id
	 * @param  {string} text
	 */
	checkSelectHasText(id, text) {
		cy.getById(id).within(() => {
			cy.elementHaveText('select-label', text);
		});
	}

	/**
	 * ввод в любой инпут
	 * @param  {string} inputName='input-name'
	 * @param  {string} text='Вводимэтоттекст'
	 */
	typeInput(inputName = 'input-name', text = 'Вводим этот текст') {
		cy.getById(inputName).within(() => {
			cy.get('input').type(text);
		});
	}

	/**
	 * очищение инпута
	 * @param  {string} inputName='input-name'
	 */
	clearInput(inputName = 'input-name') {
		cy.getById(inputName).within(() => {
			cy.get('input').clear();
		});
	}

	/**
	 * проверка стилей выключенной кнопки
	 * @param  {string} inputName
	 */
	checkDisabledButton(inputName) {
		cy.getById(inputName).should('have.class', 'button-block_disabled');
	}

	/**
	 * проверка атрибута diabled
	 * @param  {string} id
	 */
	checkDisabledAttribute(id) {
		cy.getById(id).should('have.attr', 'disabled');
	}

	/**
	 * выбрать элемент из ok-select
	 * @param  {string} id
	 * @param  {string|number} indexOrText=0
	 */
	typeSelect(id, indexOrText = 0) {
		const selector = id[0] === '.' ? cy.get(id) : cy.getById(id);

		if (typeof indexOrText === 'number') {
			selector
				.click()
				.within(() => {
					cy.getById('select-option').eq(indexOrText).click();
				});
		} else {
			selector
				.click()
				.within(() => {
					cy.getById('select-option').contains(indexOrText).click();
				});
		}
	}

	/**
	 * изменить состояние ok-switcher
	 * @param  {string} id
	 */
	toggleSwitcher(id) {
		cy.getById(id).within(() => {
			cy.get('.slider').click();
		});
	}
}

export class Switcher {
	SWITCHER_DATA_CY = '';
	SWITCHER_OFF_DATA_CY = 'switch-false';
	SWITCHER_ON_DATA_CY = 'switch-true';

	constructor(dataCy) {
		this.SWITCHER_DATA_CY = dataCy;
	}

	/** Получить элемент переключателя */
	getSwitcherElement() {
		return cy.getById(this.SWITCHER_DATA_CY);
	}

	/** Включить переключатель */
	on() {
		this.getSwitcherElement().within(() => {
			cy.getById(this.SWITCHER_OFF_DATA_CY).click({ force: true });
		});
	}

	/** Выключить переключатель */
	off() {
		this.getSwitcherElement().within(() => {
			cy.getById(this.SWITCHER_ON_DATA_CY).click({ force: true });
		});
	}

	/** Нажать на переключатель */
	toggle() {
		this.getSwitcherElement().click();
	}
}

export class Select {
	// selects

	/**
	 * Выбрать элемент селекта
	 * @param {string} id - dataCy селекта
	 * @param {string} text - текст опции, которую нужно выбрать
	 */
	selectByText(id = 'id', text = 'text') {
		const select = cy.getById(id);

		select
			.click()
			.within(() => {
				cy.getById('select-option').contains(text).click();
			});
	}

	/**
	 * Проверить существует или нет элемент в списке
	 * в зависимости от @param exist
	 * @param  {string} selectId - data-cy селекта
	 * @param  {string} value - текст элемента
	 * @param  {boolean} exist - условие проверки
	 */
	checkItemsList(selectId = ' ', value = '', exist = true) {
		const condition = exist ? 'exist' : 'not.exist';
		cy.getById(selectId).click().within(() => {
			cy.getById('select-option').contains(value).should(condition);
		});
	}
}

export class Table {
	constructor() {
		this.tableRows = '[data-cy^="table-row-"]';
	}

	// checks

	/**
	 * Проверить количество отображаемых элементов в таблице
	 * @param {string} id - dataCy таблицы
	 * @param {number} rowQuantity - количество строк
	 */
	checkTableRowsQuantity(id = 'table', rowQuantity = 10) {
		cy.getById(id)
			.within(() => {
				cy.get(this.tableRows).should('have.length', rowQuantity);
			});
	}
}

export class PaginationBlock {
	// clicks

	/**
	 * Нажимает на номер страницы в пагинации
	 * @param {String} id - dataCy блока пагинации
	 * @param {Number} pageNumber - число пагинации, которое нужно выбрать
	 */
	clickOnPaginationNumber(id = 'id', pageNumber = 2) {
		const paginationBlock = cy.getById(id);

		paginationBlock.within(() => {
			cy.contains(pageNumber.toString()).click();
		});
	}

	// checks

	/**
	 * Проверяет наличие пагинации
	 * @param {String} id - dataCy блока пагинации
	 * @param {Number|String} endNumber - последняя цифра в блоке пагинации
	 */
	checkPaginationBlockExist(id = 'id', endNumber) {
		const paginationBlock = cy.getById(id);

		paginationBlock.should('exist');
		paginationBlock.should('contain', 1);
		if (endNumber) {
			paginationBlock.should('contain', endNumber);
		}
	}
}

export class Tab {
	/**
	 * табы верхнего меню
	 */
	getTab() {
		return cy.getById('tab');
	}

	/**
	 * нажатие на Таб по названию
	 * @param  {string} name='Доставлен'
	 */
	clickTab(name = 'Доставлен') {
		this.getTab().contains(name).click();
	}

	/**
	 * проверка активности таба по названию
	 * @param  {string} name='Доставлен'
	 */
	checkTabActive(name = 'Доставлен') {
		this.getTab().contains(name).parents('label[data-cy=tab]').should('have.class', 'tab_active');
	}

	/**
	 * Нажатие на таб и проверка что он активен после нажаьтя
	 * @param  {string} text
	 * @param  {string} index
	 */
	clickAndCheckTab(text) {
		this.clickTab(text);
		this.checkTabActive(text);
	}
}

export class Menu {
	menuItems = {
		meals: 'menu',
		options: 'menu-options',
	}

	/**
	*	получить элемент дравера основного меню
	*/
	getMenu() {
		return cy.getById('menu-drawer');
	}

	/**
	* нажатие на кнопку Меню (открытие левого меню)
	*/
	clickMenuButton() {
		cy.getById('menu-btn').click();
	}

	/**
	 * закрыть меню
	 */
	сloseMenu() {
		cy.clickOnItem('drawer-overlay');
	}

	/**
	 * проверка, что меню открыто
	 */
	checkMenuOpened() {
		this.getMenu().should('exist');
	}

	/**
	* проверка, что пункт меню существует
	* @param  {string} name='Заказы'
	*/
	checkMenuItemExist(name = 'Заказы') {
		cy.getById('menu-list').within(() => {
			cy.get('a').contains(name).should('exist');
		});
	}

	/**
	* проверка, что пункт меню не существует
	* @param  {string} name='Заказы'
	*/
	checkMenuItemNotExist(name = 'Заказы') {
		cy.getById('menu-list').within(() => {
			cy.get('a').contains(name).should('not.exist');
		});
	}

	/**
	 * проверить что у элемента меню есть тултип
	 * @param  {string} routeName
	 */
	checkTabContainTooltip(routeName) {
		cy.getById(`${routeName}-menu-button`).within(() => {
			cy.getById(`${routeName}-menu-title`).within(() => {
				cy.elementExist(`${routeName}-menu-tooltip`);
			});
		});
	}

	select(routeName) {
		cy.clickOnItem(`${routeName}-menu-button`);
	}
}

export class Time {
	/** Установить фиксированный момент времени в таймзоне запуска тестов (МСК)
	 * @param date {DateConstructor["UTC"]} момент времени в формате параметров метода Date.UTC
	 */
	mock(...date) {
		return cy.clock(new Date(...date), ['Date']);
	}

	/** Сбросить фиксированное время */
	reset() {
		cy.clock().then((clock) => {
			clock.restore();
		});
	}
}

export class Modal {
	/**
	 * Проверка что модальное окно открылось
	 * @param  {string} id
	 */
	static checkModalOpened(id) {
		cy.getById(id).should('exist');
	}

	/**
	 * Закрыть модальное окно
	 * @param  {string} id - data-cy модального окна
	 */
	static clickCloseBtn(id) {
		cy.getById(id).parent().getById('close-modal-btn').click();
	}
}

export class SelectPartnerModal {
	/**
	 * выбрать партнёра по имени
	 * @param  {string} name
	 */
	selectPartner(name) {
		const selector = cy.getById('partners-list-radio');

		selector
			.within(() => {
				cy.getById('partner-name').contains(name).click();
			});

		cy.clickOnItem(ACTIONS.ACCEPT_SELECTED_PARTNER);
	}
}

export class ExpansionBlock {
	// gets

	/**
	 * Получить кнопку по нажатию на которую происходит раскрытие контента
	 */
	getExpansionBlockButton() {
		return cy.getById('expansion-block-btn');
	}

	/**
	 * Получить контент блока
	 */
	getExpansionBlockContent() {
		return cy.getById('expansion-block-content');
	}

	/**
	 * Получить блок,где заголовок равен @param name
	 * @param  {string} name - текст заголовка
	 */
	getExpansionBlock(name) {
		return cy.getById('expansion-block').contains(name);
	}

	// clicks

	/**
	 * Нажать на блок, где заголовок равен @param name
	 * @param  {string} name - текст заголовка
	 */
	clickExpansionBlock(name) {
		cy.getById('expansion-block').contains(name).click();
	}

	// checks

	/**
	 * Проверить что контент блока виден или скрыт в зависимости от @param should
	 * @param  {string} text - заголовок блока
	 * @param  {string} should - условия проверки
	 */
	checkExpansionBlockContent(text, isVisible = true) {
		this.getExpansionBlock(text).parents('div[data-cy=expansion-block]').within(() => {
			this.getExpansionBlockContent().should(isVisible ? 'be.visible' : 'not.be.visible');
		});
	}
}

export class Button {
	/**
	 * проверка стилей выключенной кнопки
	 * @param  {string} inputName - data-cy кнопки
	 */
	checkDisabledButton(inputName) {
		cy.getById(inputName).should('have.class', 'button-block_disabled');
	}
}

