export const USER_ROLES = {
	ADMIN: 'admin',
	OWNER: 'owner',
	ANALYST: 'analyst',
	MANAGER: 'manager',
	MULTIOWNER: 'multiowner',
	SUPPORTER: 'supporter',
};

Cypress.Commands.add('mockUser', (role = USER_ROLES.OWNER, isIntegrationPartner = false) => {
	cy.intercept('POST', '**/session/getuser', {
		fixture: `users-auth/getuser_${role}`,
	}).as('getuser');

	cy.intercept('POST', '**/shops/list', {
		fixture: `other/shops_list_${role}`,
	}).as('shopList');

	const partnerFixture = isIntegrationPartner ? `integration_${role}` : role;

	cy.intercept('POST', '**/partners/list', {
		fixture: `partners/response/partners_list_${partnerFixture}`,
	}).as('partnersList');
});
