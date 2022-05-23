Cypress.Commands.add('mockGetSimpleMeal', () => {
	cy.intercept(
		'POST',
		'**/proxy/products/get-by-id',
		{ fixture: 'meals/product_get_by_id' }
	).as('getSimpleMeal');
});

Cypress.Commands.add('mockGetEmptyMealList', () => {
	cy.intercept(
		'POST',
		'**/proxy/products/list',
		{ fixture: 'menu/response/empty_meal_list' }
	).as('productsList');
});

