beforeEach(() => {
	cy.intercept('POST', '**/proxy/products/options/create', {
		fixture: 'options/response/option/create',
	}).as('createOption');

	cy.intercept('POST', '**/proxy/products/options/list', req => {
		const kind = req.body.kind;

		return req.reply({ fixture: `options/response/${kind}/list` });
	}).as('optionList');

	cy.intercept('POST', '**/proxy/products/options/edit', req => {
		const active = req.body.status;
		const kind = req.body.kind;

		return req.reply({
			fixture: `options/response/${kind}/get_by_id_${active}`,
		});
	}).as('optionEdit');

	cy.intercept('POST', '**/proxy/products/options/get-by-id', req => {
		const id = req.body.id;
		switch (id) {
		case 14:
			return req.reply({
				fixture: 'options/response/option/get_by_id_active',
			});
		case 15:
			return req.reply({
				fixture: 'options/response/ingredient/get_by_id_active',
			});
		case 221:
			return req.reply({
				fixture: 'options/response/content/get_by_id_active',
			});
		default:
			return req.reply({
				fixture: 'options/response/option/get_by_id_active',
			});
		}
	}).as('optionGetById');
});

Cypress.Commands.add('mockOptionsListDisabled', () => {
	cy.intercept('POST', '**/proxy/products/options/list', req => {
		const kind = req?.body?.kind;

		return req.reply({ fixture: `options/response/${kind}/list_disabled` });
	}).as('optionList');
});

Cypress.Commands.add('mockOptionsListActive', () => {
	cy.intercept('POST', '**/proxy/products/options/list', req => {
		const kind = req?.body?.kind;

		return req.reply({ fixture: `options/response/${kind}/list` });
	}).as('optionList');
});
