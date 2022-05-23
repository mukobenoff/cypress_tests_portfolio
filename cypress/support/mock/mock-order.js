
export const MOCKED_ORDER_STATES = {
	CREATED: 'created',
	COLLECTION: 'collection',
	READY_TO_DELIVERY: 'ready_to_delivery',
	DELIVERY: 'delivery',
	FAILED_INTEGRATION: 'failed_integration',
	AGGREGATOR: 'aggregator',
	AGGREGATOR_READY_TO_DELIVERY: 'ready_to_delivery_aggregator',
	AGGREGATOR_DELIVERY: 'delivery_aggregator',
	IIKO: 'iiko',
	DELIVERED: 'delivered',
	EMPTY_CLIENT_NAME: 'empty_client_name',
};

export const ORDER_PAGE_IDS = {
	SHOP_PARTNER_SELECTOR: 'shop-partner-select',
	ORDER_DETAIL_INFO_BLOCK: 'info-block-content',
};

Cypress.Commands.add('mockOrdersList', (fixture = 'orders/response/all_orders') => {
	cy.intercept('POST', '**/orders/list', {
		fixture,
	}).as('ordersList');
});

Cypress.Commands.add('mockGetReasonsForDeleteMealInOrder', (fixture = 'orders/delete_meal_in_order/response/delete_meal_in_order_reasons') => {
	cy.intercept('POST', '**/orders/delete-products/reasons/list', {
		fixture,
	}).as('deleteMealInOrderReasons');
});

Cypress.Commands.add('mockDeleteMealInOrder', (fixture = 'orders/response/delete_meal_in_order_not_disabled') => {
	cy.intercept('POST', '**/orders/products/delete', {
		fixture,
	}).as('deleteMealInOrder');
});

Cypress.Commands.add('mockCancelledOrder', (status = 200) => {
	cy.intercept(
		'POST',
		'**/orders/status/cancelled',
		(req) => {
			if (status === 400) {
				req.reply({ statusCode: 400, fixture: 'other/fail' });
			} else {
				req.reply({ fixture: 'other/success' });
			}
		}
	).as('cancelOrder');
});

Cypress.Commands.add('mockGetOrder', (state = MOCKED_ORDER_STATES.CREATED) => {
	cy.intercept('POST', '**/orders/by-id/get', {
		fixture: `orders/response/detail_order_${state}`,
	}).as('getOrderById');
});

Cypress.Commands.add('mockOrderMeals', () => {
	cy.intercept(
		'POST',
		'**/proxy/products/list',
		{ fixture: 'orders/response/order-meals' }
	).as('getOrderMeals');
});

Cypress.Commands.add('mockEmptyOrdersList', () => {
	cy.intercept('POST', '**/orders/list', {
		fixture: 'orders/response/all_orders_empty',
	}).as('ordersList');
});
