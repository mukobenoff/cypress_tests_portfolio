import { USER_ROLES } from '../mock/mock-user';

Cypress.Commands.add('mockEmployeeGetById', (role = USER_ROLES.OWNER, isBlocked = false) => {
	const block = isBlocked ? 'blocked' : 'unblocked';

	cy.intercept(
		'POST',
		'**/b2b/employee/get-by-id',
		{ fixture: `employee/response/get-by-id/${role}/${block}` }
	).as('employeeGetById');
});

Cypress.Commands.add('mockEmployeeUpdate', (role = USER_ROLES.OWNER, isBlocked = false) => {
	const block = isBlocked ? 'blocked' : 'unblocked';
	cy.intercept(
		'POST',
		'**/b2b/employee/update',
		{ fixture: `employee/response/get-by-id/${role}/${block}` }
	).as('employeeChangeInfo');
});
