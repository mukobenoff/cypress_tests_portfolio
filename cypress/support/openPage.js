// todo - сделать дополнительные конфиги для pipeline
import config from '../../config/default.json';

const HOST = 'localhost';

export const BASE_URL = `${HOST}:${config.host.port}`;

Cypress.Commands.add('getHost', () => {
	return `${BASE_URL}`;
});

Cypress.Commands.add('openAuthPage', () => {
	return cy.visit(`${BASE_URL}/auth`);
});

Cypress.Commands.add('openOrdersPage', () => {
	return cy.visit(`${BASE_URL}/orders`);
});

Cypress.Commands.add('openHistoryPage', () => {
	return cy.visit(`${BASE_URL}/history`);
});

Cypress.Commands.add('openOptionPage', () => {
	return cy.visit(`${BASE_URL}/menu-options`);
});

Cypress.Commands.add('openMenuPage', () => {
	return cy.visit(`${BASE_URL}/menu`);
});

Cypress.Commands.add('openUsersPage', () => {
	return cy.visit(`${BASE_URL}/users`);
});

Cypress.Commands.add('openSupportPage', () => {
	return cy.visit(`${BASE_URL}/support`);
});

Cypress.Commands.add('openRestaurantsPage', () => {
	return cy.visit(`${BASE_URL}/restaurants`);
});

Cypress.Commands.add('openAnalyticsPage', () => {
	return cy.visit(`${BASE_URL}/analytics`);
});

