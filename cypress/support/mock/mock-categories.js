Cypress.Commands.add('mockGetEmptyCategoriesList', () => {
	cy.intercept(
		'POST',
		'**/proxy/products/categories/list',
		{ fixture: 'categories/response/categories_empty_list' }
	).as('categoryList');
});
