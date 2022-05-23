Cypress.Commands.add('mockCloseShopSuccess', () => {
	cy.intercept('POST', '**/shops/close', {
		fixture: 'other/success',
	}).as('shopClose');
});

Cypress.Commands.add('mockOpenShopSuccess', () => {
	cy.intercept('POST', '**/shops/open', {
		fixture: 'other/success',
	}).as('shopOpen');
});

