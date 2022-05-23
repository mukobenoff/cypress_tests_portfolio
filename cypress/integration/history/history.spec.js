import { HistoryPage, FILTER_BY_REQ_FX } from '../../support/page-object/history-page';
import { Tab, Calendar, Api } from '../../support/page-object/common-pageobject';
import { ORDER_IDS } from '../../support/page-object/orders/order-page';
import { MOCKED_ORDER_STATES } from '../../support/mock/mock-order';

const api = new Api();
const calendar = new Calendar();
const tab = new Tab();

describe('Тестирование страницы История', () => {
	const historyPage = new HistoryPage();

	beforeEach(() => {
		historyPage.openPage();
	});

	it('Заказы отображаются в правильном количестве, с фильтрацией и без', () => {
		historyPage.checkOrdersCount();
	});

	it(`Заказ в списке строчно имеет всю основную информацию, а именно:
			* 1. Id
			* 2. Дата
			* 3. Статус
			* 4. Доставка
			* 5. Цена
			* 6. Адрес`,
	() => {
		historyPage.checkOrderHaveCompleteInfoInRow();
	});

	it(`Фильтрация на странице истории по:
			* Id
			* Цена
			* Доставка
			* Календарный период
			* Все фильтры вместе`,
	() => {
		historyPage.typeOrderId(ORDER_IDS.default);
		historyPage.clickFindButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.ORDER_ID);

		historyPage.clickResetButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.DEFAULT);

		historyPage.typeOrderPrice(223);
		historyPage.clickFindButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.ORDER_PRICE);

		historyPage.clickResetButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.DEFAULT);

		historyPage.selectDeliveryType('Доставка ресторана');
		historyPage.clickFindButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.DELIVERY_TYPE);

		historyPage.clickResetButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.DEFAULT);

		calendar.open();
		calendar.setPeriod(
			{ day: '6', month: 'июль', year: '2021' },
			{ day: '6', month: 'июль', year: '2021' }
		);
		historyPage.clickFindButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.DATE);

		historyPage.clickResetButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.DEFAULT);

		historyPage.typeOrderId(ORDER_IDS.default);
		historyPage.typeOrderPrice(224);
		historyPage.selectDeliveryType('Доставка ресторана');
		calendar.open();
		calendar.setPeriod(
			{ day: '6', month: 'июль', year: '2021' },
			{ day: '6', month: 'июль', year: '2021' }
		);

		historyPage.clickFindButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.ALL_FILTERS);

		historyPage.clickResetButton();
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.DEFAULT);
	});

	it(`Работа вкладок 'Все', 'Доставлен', 'Завершен', 'Отменен', 'Возврат'
			* Проверка тела запроса при переходе
			* Проверка визуальной активности вкладки `,
	() => {
		tab.clickTab('Доставлен');
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.TAB.DELIVERED);
		tab.checkTabActive('Доставлен');

		tab.clickTab('Завершен');
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.TAB.DONE);
		tab.checkTabActive('Завершен');

		tab.clickTab('Отменен');
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.TAB.CANCELLED);
		tab.checkTabActive('Отменен');

		tab.clickTab('Возврат');
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.TAB.RETURNED);
		tab.checkTabActive('Возврат');

		tab.clickTab('Все');
		api.checkRequestBody('ordersList', FILTER_BY_REQ_FX.DEFAULT);
		tab.checkTabActive('Все');
	});

	it(`Проверка детальной карточки заказа:
			* Cостав заказа.
			* Ингредиенты, опции, комбо
			* Для доставленного заказа не отображается инфоблок "Курьер в ресторане"`,
	() => {
		historyPage.checkOrderDetail();

		// Проверяем, что не отображается инфоблок "Курьер в ресторане", когда заказ в статусе "Доставлен"
		cy.mockGetOrder(MOCKED_ORDER_STATES.DELIVERED);
		historyPage.clickOrderId(ORDER_IDS.default);

		historyPage.checkCourierBlockInOrderExist(false);
	});

	it('Для заказа iiko в таблице выводиться id okolo, вместо partner_id', () => {
		historyPage.checkIikoOrderIdInTable();
	});
});
