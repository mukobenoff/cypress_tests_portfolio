import { USER_ROLES } from '../../support/mock/mock-user';
import { Input } from '../../support/page-object/common-pageobject';
import { CheckOrderMeals, ORDER_BASE_FIELDS, ORDER_IDS } from './orders/order-page';

const input = new Input();
const checkOrderMeals = new CheckOrderMeals();

export const FILTER_BY_REQ_FX = {
	ORDER_ID: 'orders/request-body/order_filter_by_order_id',
	ORDER_PRICE: 'orders/request-body/order_filter_by_order_price',
	DELIVERY_TYPE: 'orders/request-body/order_filter_by_delivery_type',
	DATE: 'orders/request-body/order_filter_by_date',
	ALL_FILTERS: 'orders/request-body/order_filter_by_all_filters',
	DEFAULT: 'orders/request-body/all_orders',
	TAB: {
		DELIVERED: 'orders/request-body/filter_by_tab/filter_by_tab_delivered',
		CANCELLED: 'orders/request-body/filter_by_tab/filter_by_tab_cancelled',
		DONE: 'orders/request-body/filter_by_tab/filter_by_tab_done',
		RETURNED: 'orders/request-body/filter_by_tab/filter_by_tab_returned',
	},
};

export const HISTORY_PAGE_ORDER_IDS = {
	firstInList: 1998559,
};

export const RESPONSE_FX = {
	ALL_ORDERS: 'orders/response/all_orders',
	FILTERED_BY_ID: 'orders/response/orders_filtered_by_id',
};

export const HISTORY_PAGE_DC = {
	orders: '[data-cy^="table-row-"]',
	order: {
		row: {
			cell: {
				id: 'table-data-partner_id',
				date: 'table-data-confirm_limit_date',
				status: 'table-data-status',
				delivery: 'table-data-deliveryType',
				price: 'table-data-price',
				address: 'table-data-address',
			},
		},
	},
	lpage: 'order-info',
	button: {
		find: 'filter-button',
		reset: 'reset-button',
	},
	filter: {
		price: 'filter-by-order-price',
		id: 'filter-by-order-id',
	},
	courierInfoBlock: 'courier-info-block',
};

export class HistoryPage {
	constructor() {
		this.orderLpage = new OrderLpage();
	}

	/** Открытие страницы История */
	openPage() {
		cy.setLSToken();
		cy.mockUser(USER_ROLES.ADMIN);
		cy.openHistoryPage();
		cy.wait(['@ordersList', '@ordersList']);
		cy.clickOnStartWork();
	}

	// get

	/** Получить первый заказ из списка заказов
	 *
	 * @param index {number} - позиция заказа в списке с 0
	 */
	getOrderByIndexFromList(index = 0) {
		return cy.getById(`table-row-${index}`);
	}

	/** Столбец Номер заказа таблицы История */
	getOrderId() {
		return cy.getById(HISTORY_PAGE_DC.order.row.cell.id);
	}

	/** Поле Поиск по номеру заказа */
	getOrderIdInput() {
		return cy.getById(HISTORY_PAGE_DC.filter.id);
	}

	/** Поле Поиск по сумме заказа */
	getOrderPriceInput() {
		return cy.getById(HISTORY_PAGE_DC.filter.price);
	}

	/** Кнопка Поиск */
	getFindButton() {
		return cy.getById(HISTORY_PAGE_DC.button.find);
	}

	/** Кнопка Сбросить фильтры */
	getResetButton() {
		return cy.getById(HISTORY_PAGE_DC.button.reset);
	}

	/** Инфоблок "Курьер в ресторане" */
	getCourierInfoBlock() {
		return cy.getById(HISTORY_PAGE_DC.courierInfoBlock);
	}

	// check

	/** Проверить детали заказа */
	checkOrderDetail() {
		this.clickOrderId(ORDER_IDS.default);

		cy.wait('@productsList');

		this.orderLpage.checkOpenLpage();

		checkOrderMeals.checkOrder();
	}

	/**
	 * Проверить существование/несуществование инфоблока "Курьер в ресторане и ждёт заказ"
	 */
	checkCourierBlockInOrderExist(isShouldExist = true) {
		this.getCourierInfoBlock().should(isShouldExist ? 'exist' : 'not.exist');
	}

	/** Проверить соответствие отображаемого количества заказов с заказами из фикстуры */
	checkOrdersCount() {
		cy.fixture(RESPONSE_FX.ALL_ORDERS).then(fx => {
			const ordersCount = fx.orders.length;

			this.checkOrdersHaveLength(ordersCount);
		});

		cy.mockOrdersList(RESPONSE_FX.FILTERED_BY_ID);

		this.typeOrderId(HISTORY_PAGE_ORDER_IDS.firstInList);
		this.clickFindButton();

		this.checkOrdersHaveLength(1);
	}

	/** Проверить, что количество заказов в списке равно заданному количеству */
	checkOrdersHaveLength(length) {
		cy.get(HISTORY_PAGE_DC.orders).should('have.length', length);
	}

	/** Проверить что заказ в списке строчно имеет всю основную информацию, а именно:
	 * 1. Id
	 * 2. Дата
	 * 3. Статус
	 * 4. Доставка
	 * 5. Цена
	 * 6. Адрес
	 *
	 * @param position {number} - позиция заказа в списке с 0
	 * @param order {object} - данные заказа для сравнения с заказом из списка
	 */
	checkOrderHaveCompleteInfoInRow(
		index = 0,
		order = {
			id: '1998559',
			date: '5 июл. 13:04',
			status: 'Отправка',
			delivery: 'Доставка ресторана',
			price: '1 419.00 руб.',
			address: 'проспект Будённого, 21с3',
		}) {
		const orderFromList = this.getOrderByIndexFromList(index);

		orderFromList.within(() => {
			cy.getById(HISTORY_PAGE_DC.order.row.cell.id).should('contain', order.id);

			cy.getById(HISTORY_PAGE_DC.order.row.cell.date).should('contain', order.date);

			cy.getById(HISTORY_PAGE_DC.order.row.cell.status).should('contain', order.status);

			cy.getById(HISTORY_PAGE_DC.order.row.cell.delivery).should('contain', order.delivery);

			cy.getById(HISTORY_PAGE_DC.order.row.cell.price).should('contain', order.price);

			cy.getById(HISTORY_PAGE_DC.order.row.cell.address).should('contain', order.address);
		});
	}

	// click

	/** Нажатие на Номер заказа в таблице истории */
	clickOrderId(orderID = 1111641) {
		this.getOrderId().contains(orderID).click();
		cy.wait('@getOrderById');
	}

	/** Нажатие на кнопку Поиск */
	clickFindButton() {
		this.getFindButton().click();
	}

	/** Нажатие на кнопку Сбросить фильтры */
	clickResetButton() {
		this.getResetButton().click();
	}

	// type

	/** Ввод значения в поле Поиск по номеру заказа */
	typeOrderId(orderId = 1345876) {
		input.typeInput(HISTORY_PAGE_DC.filter.id, orderId);
	}

	/** Ввод значения в поле Поиск по сумме заказа */
	typeOrderPrice(price = 559) {
		input.typeInput(HISTORY_PAGE_DC.filter.price, price);
	}

	// select

	/** Выбор Типа доставки */
	selectDeliveryType(typeName = 'Доставка ОКОЛО') {
		input.typeSelect('filter-by-delivery-type', typeName);
	}

	/**
	 * В таблице заказов проверить заказ iiko,
	 * что выводится id okolo, не выводится id партнёра
	 */

	checkIikoOrderIdInTable() {
		this.getOrderId(ORDER_BASE_FIELDS.defaultOrderNumber.value)
			.should('contain', `${ORDER_BASE_FIELDS.defaultOrderNumber.value}`);
		this.getOrderId(ORDER_BASE_FIELDS.defaultOrderNumber.value)
			.should('not.contain', `${ORDER_BASE_FIELDS.iikoOrderNumber.value}`);
	}
}

export class OrderLpage {
	// get

	/** Содержимое lpage заказа */
	getContentLpage() {
		return cy.getById(HISTORY_PAGE_DC.lpage);
	}

	// check

	/** Проверка, что lpage открыт/закрыт */
	checkOpenLpage(isOpen = true) {
		isOpen ? this.getContentLpage().should('exist') : this.getContentLpage().should('not.exist');
	}
}
