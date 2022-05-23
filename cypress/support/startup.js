import { MOCKED_ORDER_STATES } from './mock/mock-order';
import { MENU_PAGE_REQUESTS } from './page-object/menu-page';

beforeEach(() => {
	// Флаг нужен для того, чтобы в коде можно было определить, что запущены тесты
	localStorage.setItem('cypress', true);

	cy.window().then((win) => {
		window.windowObject = win;
	});

	cy.intercept('/api/**', { statusCode: 504, body: { text: 'Замокай запрос!' } });
	cy.intercept('/socket/**', { statusCode: 200 });

	// моки на основные запросы с неизменным ответом
	cy.intercept(
		'POST',
		'**/employee/roles/list',
		{ fixture: 'other/roles_list' }
	).as('getRolesList');

	cy.intercept(
		'POST',
		'**/employee/rules/list',
		{ fixture: 'other/rules_list' }
	).as('getRulesList');

	cy.intercept(
		'POST',
		'**/shops/close/reasons/list',
		{ fixture: 'shops/reasons_close_list' }
	).as('shopCloseReasonsList');

	cy.intercept('POST', '**/shops/get-by-id', {
		fixture: 'other/get_by_id',
	}).as('getShopById');

	cy.intercept(
		'POST',
		'**/orders/status/collecting',
		{ fixture: 'other/success' }
	).as('orderChangeStatusCollection');

	cy.intercept(
		'POST',
		'**/orders/status/ready-to-delivery',
		{ fixture: 'other/success' }
	).as('orderChangeStatusReadyToDelivery');

	cy.intercept(
		'POST',
		'**/orders/status/delivery',
		{ fixture: 'other/success' }
	).as('orderChangeStatusDelivery');

	cy.intercept(
		'POST',
		'**/orders/status/delivered',
		{ fixture: 'other/success' }
	).as('orderChangeStatusDelivered');

	cy.intercept(
		'POST',
		'**/orders/cancel/reasons/list',
		{ fixture: 'orders/response/cancel_reasons_list' }
	);

	cy.intercept(
		'POST',
		'**/proxy/products/categories/list',
		{ fixture: 'categories/response/categories_list' }
	).as('categoryList');

	cy.intercept(
		'POST',
		MENU_PAGE_REQUESTS.getMeals.url,
		{ fixture: 'menu/table/partner/response/meal_list' }
	).as(MENU_PAGE_REQUESTS.getMeals.label);

	cy.intercept(
		'POST',
		'**/proxy/products/categories/create',
		{ fixture: 'categories/response/category_create' }
	).as('createCategory');

	cy.intercept(
		'POST',
		'**/proxy/products/categories/edit',
		{ fixture: 'categories/response/category_delete' }
	).as('categoryEdit');

	cy.intercept(
		'POST',
		'**/proxy/products/categories/get-by-id',
		{ fixture: 'categories/response/category_get_by_id' }
	).as('categoryGetById');

	cy.intercept('POST', '**/b2b/employee/list', {
		fixture: 'employee/employees_list.json',
	}).as('employeeList');

	cy.intercept('POST', '**/orders/list', {
		fixture: 'orders/response/all_orders',
	}).as('ordersList');

	cy.intercept('POST', '**/b2b/employee/block', {
		fixture: 'other/success',
	});

	cy.intercept(
		'POST',
		'**/b2b/employee/unblock',
		{ fixture: 'other/success' }
	);

	cy.intercept(
		'POST',
		'**/b2b/employee/create',
		{ fixture: 'employee/employee_create' }
	).as('createEmployee');

	cy.intercept('POST', '**/proxy/products/create/via-xlsx', {
		fixture: 'meals/response/success_file',
	}).as('uploadImportFile');

	cy.intercept('POST', '**/files/get-upload-token', {
		fixture: 'meals/upload_token',
	}).as('uploadToken');

	cy.intercept('POST', '**/upload/u1C3gsyavzIrmJckQ9XIqjxe38nJEf1626099494432', {
		fixture: 'meals/upload',
	}).as('uploadFileByToken');

	cy.mockGetOrder(MOCKED_ORDER_STATES.CREATED);
	cy.mockCancelledOrder(200);
	cy.mockEmployeeGetById();
});
