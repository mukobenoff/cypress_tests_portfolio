import { USER_ROLES } from '../../support/mock/mock-user';
import { Select, Tab, Api } from './common-pageobject';
const tab = new Tab();
const api = new Api();
const select = new Select();

export const RESTAURANTS_PAGE_DC = {
	TEXT_BLOCK: 'text-block',
	HEADER_TEXT: 'header-text',
	FIELD_LABEL_TEXT: 'fielad-label-text',
	FIELD_VALUE_TEXT: 'fielad-value-text',
	SHOP_PARTNER_SELECT: 'shop-partner-select',

};
// TODO: Генерировать из фикстуры
export const RESTAURANTS_PAGE_DATA = {
	INFO_TEXT_BLOCKS: [
		{
			header: 'Общая',
			texts: [
				{
					label: 'Партнер',
					text: 'Покешная «Угорь Игорь»',
				},
				{
					label: 'Юридическое лицо',
					text: 'Больше не битое юрлицо',
				},
				{
					label: 'Город',
					text: 'msk',
				},
				{
					label: 'Адрес',
					text: 'Москва, парк Ленина',
				},
			],
		},
		{
			header: 'Оплата',
			texts: [
				{
					label: 'Наличные',
					text: 'Доступно',
				},
				{
					label: 'Картой онлайн',
					text: 'Доступно',
				},
			],
		},
		{
			header: 'Модель работы',
			texts: [
				{
					label: 'Курьеры ОКОЛО',
					text: 'Не активно',
				},
			],
		},
		{
			header: 'Как пройти',
			texts: [
				{
					label: 'Курьеру',
					text: 'Налево, направо, вход со двора, второй этаж',
				},
				{
					label: 'Клиенту',
					text: 'Направо от светофора, красная дверь с надписью',
				},
			],
		},
	],
	CONTACTS_TEXT_BLOCKS: [
		{
			header: 'Менеджер',
			texts: [
				{
					label: 'Телефон',
					text: '+7 (919) 999-11-33',
				},
				{
					label: 'E-mail',
					text: 'manager@lolkek.onion',
				},
			],
		},
		{
			header: 'Директор',
			texts: [
				{
					label: 'Телефон',
					text: '+7 (919) 999-11-22',
				},
				{
					label: 'E-mail',
					text: 'director@lolkek.onion',
				},
			],
		},
		{
			header: 'Ресторан',
			texts: [
				{
					label: 'Телефон',
					text: '+7 (919) 999-11-44',
				},
				{
					label: 'E-mail',
					text: 'restaurant@lolkek.onion',
				},
			],
		},
	],
	SHOP: 'Москва, парк Ленина',
	ALL_SHOPS: 'Все',
};

export class RestaurantsPage {
	// checks

	/**
	 * Проверить содержимое текстовых блоков на соответстиве с @param arrayOfTextBlocks
	 * Проверка на кол-во элементов
	 * Для каждого элемента проверка контента на соответствие с элементами @param arrayOfTextBlocks
	 * @param  {Array} arrayOfTextBlocks - массив элементов с контентом текстовых блоков
	 */
	checkTextBlocksText(arrayOfTextBlocks = []) {
		cy.getById(RESTAURANTS_PAGE_DC.TEXT_BLOCK).should('have.length', arrayOfTextBlocks.length);

		arrayOfTextBlocks.forEach(item => this.checkTextBlockHeaderText(item));
	}

	/**
	 * Проверить что в блоке существует элемент с лейблом равным @param label и текстом равным @param text
	 * @param  {string} label - текст лейбла
	 * @param  {string} text- текст элемента
	 */
	checkTextBlockLabelAndText({ label, text }) {
		cy.getById(RESTAURANTS_PAGE_DC.FIELD_LABEL_TEXT).contains(label).should('exist');
		cy.getById(RESTAURANTS_PAGE_DC.FIELD_VALUE_TEXT).contains(text).should('exist');
	}

	/**
	 * Проверка контента текстового блока выбранного по заголовку, где:
	 * 1) заголовок блока равен @param header
	 * 2) для массива текстов вызываем проверку через метод @method checkTextBlockLabelAndText
	 * @param  {string} header - текст заголовка блока
	 * @param  {Array} texts - массив текстов в блоке
	 */
	checkTextBlockHeaderText({ header, texts = [] }) {
		cy.getById(RESTAURANTS_PAGE_DC.TEXT_BLOCK).within(() => {
			cy.getById(RESTAURANTS_PAGE_DC.HEADER_TEXT)
				.contains(header).parents(`div[data-cy=${RESTAURANTS_PAGE_DC.TEXT_BLOCK}]`)
				.within(() => {
					cy.elementHaveText(RESTAURANTS_PAGE_DC.HEADER_TEXT, header);
					texts.forEach(item => this.checkTextBlockLabelAndText(item));
				});
		});
	}

	/**
	 * Проверить что в селекте отсутствует выбор всех магазинов
	 */
	checkShopListNotContainSelectionOfAllShops() {
		select.checkItemsList(RESTAURANTS_PAGE_DC.SHOP_PARTNER_SELECT, RESTAURANTS_PAGE_DATA.ALL_SHOPS, false);
	}

	/**
	 * Проверить выбранный магазин на соответствие со значением
	 * @param shopName - название магазина
	 */
	checkSelectedShop(shopName) {
		cy.getById(RESTAURANTS_PAGE_DC.SHOP_PARTNER_SELECT).within(() => {
			cy.elementHaveText('select-label', shopName);
		});
	}

	// actions

	/**
	 * Открытие страницы Рестораны под ролью переданной в @param role
	 * @param  {string} role - роль под которой будет открыта страница
	 */
	openPage(role = USER_ROLES.OWNER) {
		cy.setLSToken();
		cy.mockUser(role);
		cy.openRestaurantsPage();
		api.waitInitialRequests(role);

		cy.clickOnStartWork();
	}

	/**
	 * Нажать на таб, который содержит текст равный @param name
	 * и проверить что таб с @param name активен
	 * @param  {string} name - контент таба
	 */
	openTabAndCheckIsActive(name) {
		tab.clickTab(name);
		tab.checkTabActive(name);
	}
}
