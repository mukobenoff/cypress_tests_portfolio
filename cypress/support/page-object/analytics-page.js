import { USER_ROLES } from '../../support/mock/mock-user';
import { Input, Api, Select, ACTIONS } from '../../support/page-object/common-pageobject';

const input = new Input();
const select = new Select();
const api = new Api();

export const FILTER_BY_REQ_FX = {
	DEFAULT: 'analytics/report/request/filter_default',
	PARTNERS_SHOPS: 'analytics/report/request/filter_by_partners_shops',
	DELIVERY: 'analytics/report/request/filter_by_delivery',
	DATE: 'analytics/report/request/filter_by_date',
	CUSTOM_DATE: 'analytics/report/request/filter_by_custom_date_period',
	CHANGED_DATE: 'analytics/report/request/filter_by_changed_date_by_week',
	DIMENSION: 'analytics/report/request/filter_by_dimension',
};

export const ANALYTICS_PAGE_FILTER_DC = {
	SEARCH_BTN: 'analytics-filter-bar-search-btn-sm',
	RESET_BTN: 'analytics-filter-bar-reset-btn',
	PARTNERS: 'filter-by-partner-selector',
	PARTNERS_SELECT_ALL_CHECKBOX: 'filter-by-partner-select-all-checkbox',
	SHOPS: 'filter-by-shop-partner-selector',
	DELIVERY: 'filter-by-delivery-type-selector',
	DATE: 'filter-by-date-periods-selector',
	DIMENSION: 'filter-by-dimension-selector',
};

export const SELECT_PARTNER_MODAL_DC = 'select-partner-modal';

export const ANALYTICS_PAGE_TEXT = {
	DEFAULT_PARTNER: 'Покешная «Угорь Игорь»',
	DEFAULT_SHOP: 'Москва, парк Лени',
};

export const FILTER_DIMENSION_VARIANTS = {
	DAY: 'По дням',
	WEEK: 'По неделям',
	MONTH: 'По месяцам',
};

export const FILTER_DATE_VARIANTS = {
	WEEK: 'Неделя',
	MONTH: 'Месяц',
	YEAR: 'Год',
	CUSTOM: 'Свой период',
};

export const FILTER_DELIVERY_VARIANTS = {
	aggregator: 'Доставка ОКОЛО',
	marketplace: 'Доставка ресторана',
};

export class AnalyticsPage {
	/** Открытие страницы Аналитика
	 * @param {string} role - роль пользователя
	 */
	openPage(role = USER_ROLES.SUPPORTER) {
		cy.setLSToken();
		cy.mockUser(role);
		cy.openAnalyticsPage();
		api.waitInitialRequestsBeforePartnerSelect();

		if (role === USER_ROLES.SUPPORTER) {
			input.typeInput(SELECT_PARTNER_MODAL_DC, ANALYTICS_PAGE_TEXT.DEFAULT_PARTNER);
			cy.clickOnItem(ACTIONS.ACCEPT_SELECTED_PARTNER);
			cy.clickOnStartWork();
			api.waitInitialRequestsAfterPartnerSelect(role);
			cy.openAnalyticsPage();
			cy.clickOnStartWork();
			this.waitReportsRequests();

			return;
		}

		api.waitInitialRequestsAfterPartnerSelect(role);
		this.waitReportsRequests();
		cy.clickOnStartWork();
	}

	// get

	/** Кнопка поиска */
	getSearchBtn() {
		return cy.getById(ANALYTICS_PAGE_FILTER_DC.SEARCH_BTN);
	}

	/** Кнопка сброса фильтров */
	getResetBtn() {
		return cy.getById(ANALYTICS_PAGE_FILTER_DC.RESET_BTN);
	}

	/** Селект партнеров */
	getSelectPartner() {
		return cy.getById(ANALYTICS_PAGE_FILTER_DC.PARTNERS);
	}

	/** Селект ресторанов */
	getSelectShop() {
		return cy.getById(ANALYTICS_PAGE_FILTER_DC.SHOPS);
	}

	// mock

	/** Установка одинаковой даты для прохождения теста календарем */
	mockDefaultDate() {
		cy.clock(Date.UTC(2021, 9, 28, 5), ['Date']);
	}

	// wait

	/** Подождать выполнения запросов на все отчеты */
	waitReportsRequests() {
		cy.wait([
			'@analyticsReportRevenue',
			'@analyticsReportCount',
			'@analyticsReportAverageReceipt',
			'@analyticsReportDistribution',
			'@analyticsReportLost',
			'@analyticsReportAvailability',
		]);
	}

	// check

	/** Проверить тело в запросах во всех отчетах
	 * @param {string} fixture - путь до фикстуры
	 */
	checkReportsRequestBodyEqualFixture(fixture = FILTER_BY_REQ_FX.DEFAULT) {
		api.checkRequestBody('analyticsReportRevenue', fixture);
		api.checkRequestBody('analyticsReportCount', fixture);
		api.checkRequestBody('analyticsReportDistribution', fixture);
		api.checkRequestBody('analyticsReportAverageReceipt', fixture);
		api.checkRequestBody('analyticsReportLost', fixture);
		api.checkRequestBody('analyticsReportAvailability', fixture);
	}

	/** Проверить что кнопка поиска активна/неактивна
	 * @param {booleam} isShouldExist - булевый флаг
	 */
	checkSearchBtnIsDisabled(isShouldDisabled = true) {
		isShouldDisabled
			? this.getSearchBtn().should('be.disabled')
			: this.getSearchBtn().should('not.be.disabled');
	}

	/** Проверить существование фильтра партнеров
	 * @param {booleam} isShouldExist - булевый флаг
	 */
	checkFilterByPartnerExist(isShouldExist = true) {
		isShouldExist
			?	this.getSelectPartner().should('exist')
			: this.getSelectPartner().should('not.exist');
	}

	/** Проверить существование фильтра ресторанов
	 * @param {booleam} isShouldExist - булевый флаг
	 */
	checkFilterByShopExist(isShouldExist = true) {
		isShouldExist
			?	this.getSelectShop().should('exist')
			: this.getSelectShop().should('not.exist');
	}

	// click

	/** Нажать на кнопку сброса фильтров */
	clickResetFilterBtn() {
		this.getResetBtn().click();
	}

	/** Нажать на кнопку сброса фильтров */
	clickSearchFilterBtn() {
		this.getSearchBtn().click();
	}

	// toggle

	/** Переключить чекбокс выбора всех партнеров */
	toggleAllPartnersCheckbox() {
		this.getSelectPartner().click().within(() => {
			cy.getById(ANALYTICS_PAGE_FILTER_DC.PARTNERS_SELECT_ALL_CHECKBOX).click();
		});
	}

	// select

	/** Выбрать партнера
	 * @param {string} partner - название партнера
	 */
	selectPartnerByName(partner = ANALYTICS_PAGE_TEXT.DEFAULT_PARTNER) {
		select.selectByText(ANALYTICS_PAGE_FILTER_DC.PARTNERS, partner);
	}

	/** Выбрать ресторан
	 * @param {string} shop - название ресторана
	 */
	selectShopByName(shop = ANALYTICS_PAGE_TEXT.DEFAULT_SHOP) {
		select.selectByText(ANALYTICS_PAGE_FILTER_DC.SHOPS, shop);
	}

	/** Выбрать доставку
	 * @param {string} delivery - название типа доставки
	 */
	selectDeliveryType(delivery = FILTER_DELIVERY_VARIANTS.marketplace) {
		select.selectByText(ANALYTICS_PAGE_FILTER_DC.DELIVERY, delivery);
	}

	/** Выбрать период дат
	 * @param {string} date - название типа даты
	 */
	selectDate(date = FILTER_DATE_VARIANTS.WEEK) {
		select.selectByText(ANALYTICS_PAGE_FILTER_DC.DATE, date);
	}

	/** Выбрать по каким промежуткам времени разбивать данные
	 * @param {string} dimension - название типа разбивки по дням
	 */
	selectDimension(dimension = FILTER_DIMENSION_VARIANTS.MONTH) {
		select.selectByText(ANALYTICS_PAGE_FILTER_DC.DIMENSION, dimension);
	}
}
