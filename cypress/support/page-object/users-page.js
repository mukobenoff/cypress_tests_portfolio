import { USER_ROLES } from '../mock/mock-user';
import { Input, Notify } from '../../support/page-object/common-pageobject';

export const USER_DATA = {
	NAME: 'info-block-name',
	SURNAME: 'info-block-surname',
	PATRONYMIC: 'info-block-patronymic',
	PHONE: 'info-block-phone',
	EMAIL: 'info-block-email',
};
export const USER_INFO_REQ_FIXTURES = {
	NAME: 'employee_change_name',
	SURNAME: 'employee_change_surname',
	PATRONYMIC: 'employee_change_patronymic',
	PHONE: 'employee_change_phone',
	EMAIL: 'employee_change_email',
	ROLE: 'employee_change_role',
};
export const CREATE_USER_DATA = {
	NAME: 'name',
	SURNAME: 'surname',
	PATRONYMIC: 'patronymic',
	PHONE: 'phone',
	EMAIL: 'email',
};
export const USER_FILTER_FIELD = {
	NAME: 'user-filter-name',
	PHONE: 'user-filter-phone',
};
export const USER_FILTER_REQ_FIXTURES = {
	NAME: 'employee_filter_by_name',
	BLOCKED: 'employee_filter_by_blocked',
	UNBLOCKED: 'employee_filter_by_unblocked',
	PHONE: 'employee_filter_by_phone',
	PARTNERS: 'employee_filter_by_partner',
	ALL: 'employee_filter_by_all',
};

export const PARTNER_SELECT_ADDRESS_VALUE = {
	[USER_ROLES.SUPPORTER]: 'Москва, парк Лени',
	[USER_ROLES.OWNER]: 'Москва, парк Лени',
	[USER_ROLES.MULTIOWNER]: 'Москва, парк Лени',
};

export const ACTIONS = {
	ACCEPT_SELECTED_PARTNER: 'accept-selected-partner',
};

export class UsersPageFlow {
	constructor(options) {
		this.role = options.role ?? USER_ROLES.OWNER;

		this.usersPage = new UsersPage({ role: options.role });
		this.createUserModal = new CreateUserModal();
		this.employeeLpage = new EmployeeLpage();
		this.input = new Input();
		this.notify = new Notify();
	}

	/** Открыть страницу и подготовить все для теста */
	openPage() {
		cy.setLSToken();
		cy.mockUser(this.role);
		cy.openUsersPage();

		if (this.role === USER_ROLES.SUPPORTER) {
			this.input.typeInput('select-partner-modal', 'Угорь');
			cy.clickOnItem(ACTIONS.ACCEPT_SELECTED_PARTNER);
			cy.clickOnStartWork();
			cy.openUsersPage();
			cy.clickOnStartWork();
			cy.wait('@employeeList');

			return;
		}

		if (this.role === USER_ROLES.MULTIOWNER) {
			cy.wait('@employeeList');
			cy.clickOnStartWork();
			cy.clickOnItem(ACTIONS.ACCEPT_SELECTED_PARTNER);
			cy.wait('@employeeList');

			return;
		}

		cy.clickOnStartWork();
		cy.wait('@employeeList');
	}

	/** Проверить флоу работы с ролью целиком */
	checkRoleActionsFlow(role = USER_ROLES.OWNER) {
		this.checkCreateUserWithRole(role);

		this.checkEditUserWithRole(role);

		this.checkBlockUserWithRole(role);
	}

	/** Проверка на ошибку создания пустого пользователя */
	checkCreateEmptyUserNotAllowed() {
		this.usersPage.clickCreateUserButton();
		this.createUserModal.getModalContent().should('exist');

		this.createUserModal.clickCreateButton();
		this.createUserModal.getModalContent().should('exist');

		this.notify.checkNotifyErrorText('Пожалуйста, заполните и проверьте все поля ввода');

		this.createUserModal.getModalContent().getById('close-modal-btn').click();
	}

	/** Проверить создание пользователя под ролью
	 * @param role {string} - роль пользователя
	 */
	checkCreateUserWithRole(role = USER_ROLES.OWNER) {
		switch (role) {
		case USER_ROLES.OWNER:
			this.checkCreateUserOwner();
			break;
		case USER_ROLES.MANAGER:
			this.checkCreateUserManager();
			break;
		case USER_ROLES.ANALYST:
			this.checkCreateUserAnalyst();
			break;
		case USER_ROLES.SUPPORTER:
			this.checkCreateUserSupporter();
			break;
		case USER_ROLES.MULTIOWNER:
			this.checkCreateUserMultiowner();
		}

		this.notify.getNotifySuccess().should('not.be.visible');
	}

	/** Проверить редактирование роли
	 * @param role {string} - роль пользователя
	 */
	checkEditUserWithRole(role = USER_ROLES.OWNER) {
		cy.mockEmployeeGetById(role);

		this.usersPage.openChangeUserLPage();

		cy.mockEmployeeUpdate(role);

		this.checkChangeUser();
	}

	/** Проверить блокировку/разблокировку пользователя
	 * @param role {string} - роль пользователя
	 */
	checkBlockUserWithRole(role = USER_ROLES.OWNER) {
		this.usersPage.clickTableName('Беликов Оператор Иванович');
		cy.mockEmployeeGetById(role, true);
		this.employeeLpage.clickBlockedUserButton();
		this.notify.checkNotifySuccessText('Изменения сохранены');
		this.employeeLpage.checkSwitcherIsOff();

		cy.mockEmployeeGetById(role, false);
		this.employeeLpage.clickBlockedUserButton();
		this.notify.checkNotifySuccessText('Изменения сохранены');
		this.employeeLpage.checkSwitcherIsOn();
	}

	/** Проверить работу фильтрации */
	checkFilter() {
		this.input.typeInput(USER_FILTER_FIELD.NAME, 'Fraus');
		this.usersPage.checkEmployeeListRequestBody(this.role, USER_FILTER_REQ_FIXTURES.NAME);

		this.input.clearInput(USER_FILTER_FIELD.NAME);
		cy.wait('@employeeList');

		this.input.typeInput(USER_FILTER_FIELD.PHONE, '9998887766');
		this.usersPage.checkEmployeeListRequestBody(this.role, USER_FILTER_REQ_FIXTURES.PHONE);

		this.input.clearInput(USER_FILTER_FIELD.PHONE);
		cy.wait('@employeeList');

		this.usersPage.selectPartnerFilter(PARTNER_SELECT_ADDRESS_VALUE[this.role]);
		this.usersPage.checkEmployeeListRequestBody(this.role, USER_FILTER_REQ_FIXTURES.PARTNERS);

		this.input.typeInput(USER_FILTER_FIELD.NAME, 'Fraus');
		cy.wait('@employeeList');

		this.input.typeInput(USER_FILTER_FIELD.PHONE, '9998887766');

		this.usersPage.checkEmployeeListRequestBody(this.role, USER_FILTER_REQ_FIXTURES.ALL);

		this.input.clearInput(USER_FILTER_FIELD.NAME);
		cy.wait('@employeeList');

		this.input.clearInput(USER_FILTER_FIELD.PHONE);
		cy.wait('@employeeList');

		this.usersPage.clickFilterByBlockedButton();
		this.usersPage.checkEmployeeListRequestBody(this.role, USER_FILTER_REQ_FIXTURES.BLOCKED);

		this.usersPage.clickFilterByBlockedButton();
		this.usersPage.checkEmployeeListRequestBody(this.role, USER_FILTER_REQ_FIXTURES.UNBLOCKED);
	}

	/** Проверить смену полей пользователя под ролью
	 * @param role {string} - роль пользователя
	 */
	checkChangeUser(role = 'Аналитик') {
		this.checkChangeUserSurname();
		this.checkChangeUserName();
		this.checkChangeUserPatronymic();
		this.checkChangeUserPhone();
		this.checkChangeUserEmail();
		this.checkChangeUserRole(role);
	}

	/** Проверка смена фамилии */
	checkChangeUserSurname() {
		this.employeeLpage.changeUserData(USER_DATA.SURNAME, 'New surname');
		this.usersPage.checkChangeInfoRequestBody(USER_INFO_REQ_FIXTURES.SURNAME, this.role);
		this.notify.checkNotifySuccessText('Изменения сохранены');
	}

	/** Проверка смены имени */
	checkChangeUserName() {
		this.employeeLpage.changeUserData(USER_DATA.NAME, 'New name');
		this.usersPage.checkChangeInfoRequestBody(USER_INFO_REQ_FIXTURES.NAME, this.role);
		this.notify.checkNotifySuccessText('Изменения сохранены');
	}

	/** Проверка смены отчества */
	checkChangeUserPatronymic() {
		this.employeeLpage.changeUserData(USER_DATA.PATRONYMIC, 'New patronymic');
		this.usersPage.checkChangeInfoRequestBody(USER_INFO_REQ_FIXTURES.PATRONYMIC, this.role);
		this.notify.checkNotifySuccessText('Изменения сохранены');
	}

	/** Проверка смены номера */
	checkChangeUserPhone() {
		this.employeeLpage.changeUserData(USER_DATA.PHONE, '2223334454');
		this.usersPage.checkChangeInfoRequestBody(USER_INFO_REQ_FIXTURES.PHONE, this.role);
		this.notify.checkNotifySuccessText('Изменения сохранены');
	}

	/** Проверка смены почты */
	checkChangeUserEmail() {
		this.employeeLpage.changeUserData(USER_DATA.EMAIL, 'test@autotests.heh');
		this.usersPage.checkChangeInfoRequestBody(USER_INFO_REQ_FIXTURES.EMAIL, this.role);
		this.notify.checkNotifySuccessText('Изменения сохранены');
	}

	/** Проверка смены роли
	 * @param role {string} - роль пользователя
	 */
	checkChangeUserRole(role = 'Аналитик') {
		this.employeeLpage.changeUserRole(role);
		this.notify.checkNotifySuccessText('Изменения сохранены');
		this.usersPage.checkChangeInfoRequestBody(USER_INFO_REQ_FIXTURES.ROLE, this.role);
	}

	/** Создание мастер аккаунта */
	checkCreateUserOwner() {
		this.usersPage.clickCreateUserButton();
		this.createUserModal.getModalContent().should('exist');

		this.createUserModal.selectRole('Мастер аккаунт');

		this.input.typeInput(CREATE_USER_DATA.SURNAME, 'test');
		this.input.typeInput(CREATE_USER_DATA.NAME, 'owner');
		this.createUserModal.selectPartner(PARTNER_SELECT_ADDRESS_VALUE[this.role]);
		this.input.typeInput(CREATE_USER_DATA.EMAIL, 'test@test.test');
		this.input.typeInput(CREATE_USER_DATA.PHONE, '0000000000');

		this.createUserModal.clickCreateButton();
		this.usersPage.checkCreateEmployeeRequestBody(USER_ROLES.OWNER, this.role);

		this.notify.checkNotifySuccessText('Пользователь успешно добавлен');
	}

	/** Создание менеджера */
	checkCreateUserManager() {
		this.usersPage.clickCreateUserButton();
		this.createUserModal.getModalContent().should('exist');

		this.createUserModal.selectRole('Менеджер');

		this.input.typeInput(CREATE_USER_DATA.SURNAME, 'test');
		this.input.typeInput(CREATE_USER_DATA.NAME, 'manager');
		this.createUserModal.selectPartner(PARTNER_SELECT_ADDRESS_VALUE[this.role]);
		this.input.typeInput(CREATE_USER_DATA.EMAIL, 'test@test.test');
		this.input.typeInput(CREATE_USER_DATA.PHONE, '0000000000');

		this.createUserModal.clickCreateButton();
		this.usersPage.checkCreateEmployeeRequestBody(USER_ROLES.MANAGER, this.role);

		this.notify.checkNotifySuccessText('Пользователь успешно добавлен');
	}

	/** Создание аналитика */
	checkCreateUserAnalyst() {
		this.usersPage.clickCreateUserButton();
		this.createUserModal.getModalContent().should('exist');

		this.createUserModal.selectRole('Аналитик');

		this.input.typeInput(CREATE_USER_DATA.SURNAME, 'test');
		this.input.typeInput(CREATE_USER_DATA.NAME, 'analyst');
		this.createUserModal.selectPartner(PARTNER_SELECT_ADDRESS_VALUE[this.role]);
		this.input.typeInput(CREATE_USER_DATA.EMAIL, 'test@test.test');
		this.input.typeInput(CREATE_USER_DATA.PHONE, '0000000000');

		this.createUserModal.clickCreateButton();
		this.usersPage.checkCreateEmployeeRequestBody(USER_ROLES.ANALYST, this.role);

		this.notify.checkNotifySuccessText('Пользователь успешно добавлен');
	}

	/** Создание суппорта */
	checkCreateUserSupporter() {
		this.usersPage.clickCreateUserButton();
		this.createUserModal.getModalContent().should('exist');

		this.createUserModal.selectRole('Поддержка партнера');

		this.input.typeInput(CREATE_USER_DATA.SURNAME, 'test');
		this.input.typeInput(CREATE_USER_DATA.NAME, 'supporter');
		this.input.typeInput(CREATE_USER_DATA.EMAIL, 'test@test.test');
		this.input.typeInput(CREATE_USER_DATA.PHONE, '0000000000');

		this.createUserModal.clickCreateButton();
		this.usersPage.checkCreateEmployeeRequestBody(USER_ROLES.SUPPORTER, this.role);

		this.notify.checkNotifySuccessText('Пользователь успешно добавлен');
	}

	/** Создание мультиовнера */
	checkCreateUserMultiowner() {
		this.usersPage.clickCreateUserButton();
		this.createUserModal.getModalContent().should('exist');

		this.createUserModal.selectRole('Оператор');

		this.input.typeInput(CREATE_USER_DATA.SURNAME, 'test');
		this.input.typeInput(CREATE_USER_DATA.NAME, 'multiowner');
		this.input.typeInput(CREATE_USER_DATA.EMAIL, 'test@test.test');
		this.input.typeInput(CREATE_USER_DATA.PHONE, '0000000000');

		this.createUserModal.selectPartnerForMultiowner('Покешная «Угорь Игорь»');

		this.createUserModal.clickCreateButton();

		this.createUserModal.clickConfirmCreateMultiowner();
		this.usersPage.checkCreateEmployeeRequestBody(USER_ROLES.MULTIOWNER, this.role);

		this.notify.checkNotifySuccessText('Пользователь успешно добавлен');
	}
}

export class UsersPage {
	constructor({ role }) {
		this.role = role ?? USER_ROLES.OWNER;
	}

	/** Получить поле ФИО в таблице */
	getTableName() {
		return cy.get('.table__name');
	}

	/** Нажатие на кнопку Создать пользователя */
	clickCreateUserButton() {
		cy.getById('create-user').click();
	}

	/** Открыть lpage изменения пользователя */
	openChangeUserLPage() {
		this.getTableName().get('tbody').get('tr').first().get('td').first().click();
	}

	/** Нажатие на строку в таблице с именем */
	clickTableName(name = 'Беликов Оператор Иванович') {
		this.getTableName().contains(name).click();
	}

	/** Проверка request body (json) запроса /api/b2b/employee/update */
	checkChangeInfoRequestBody(changeInfo = USER_INFO_REQ_FIXTURES.NAME, role = USER_ROLES.SUPPORTER) {
		cy.wait('@employeeChangeInfo');
		cy.fixture(`employee/request-body/employee_change/${role}/${changeInfo}`).then((json) => {
			cy.get('@employeeChangeInfo')
				.its('request.body')
				.should('deep.equal', json);
		});
	}

	/** Нажатие на кнопку фильтрации по блокированности пользователя  */
	clickFilterByBlockedButton() {
		cy.getById('blocked-user').click();
	}

	_isRoleWithPartner(role) {
		return role === USER_ROLES.SUPPORTER;
	}

	/** Проверка request body (json) запроса /api/b2b/employee/create  */
	checkCreateEmployeeRequestBody(role = USER_ROLES.OWNER, currentRole = USER_ROLES.SUPPORTER) {
		const rolePartnerStatus = currentRole === USER_ROLES.SUPPORTER || currentRole === USER_ROLES.MULTIOWNER ? 'with_partner' : 'without_partner';

		cy.wait('@createEmployee');
		cy.fixture(`employee/request-body/employee_create/${rolePartnerStatus}/employee_create_${role}`).then((json) => {
			cy.get('@createEmployee').its('request.body').should('deep.equal', json);
		});
	}

	/** Проверка request body (json) запроса /api/b2b/employee/list  */
	checkEmployeeListRequestBody(role = USER_ROLES.SUPPORTER, filterType = USER_FILTER_REQ_FIXTURES.NAME) {
		const rolePartnerStatus = role === USER_ROLES.SUPPORTER || role === USER_ROLES.MULTIOWNER ? 'with_partner' : 'without_partner';

		cy.wait('@employeeList');

		cy.fixture(`employee/request-body/employee_filter/${rolePartnerStatus}/${filterType}`).then((json) => {
			cy.get('@employeeList').its('request.body').should('deep.equal', json);
		});
	}

	/** Выбор партнера в фильтре  */
	selectPartnerFilter(partnerName = 'Москва, парк Победы') {
		cy.getById('user-filter-partners').click();
		cy.get('.list').contains(partnerName).click();
	}

	/** Проверка существования страницы  */
	checkAccessPage() {
		cy.url().should('include', '/users');
		cy.getById('closed-page').should('not.exist');
		cy.getById('user-page').should('exist');
	}
}

export class CreateUserModal {
	constructor() {
		this.input = new Input();
	}

	/** Выбрать роль при создании сотрудника */
	selectRole(role = 'Мастер аккаунт') {
		this.getModalContent().within(() => {
			cy.getById('radio-option').contains(role).click();
		});
	}

	/** Cодержимое модального окна */
	getModalContent() {
		return cy.getById('employee-modal');
	}

	/** Нажатие на кнопку Создать */
	clickCreateButton() {
		cy.getById('accept-btn').click();
	}

	/** Подтвердить создание мультиовнера */
	clickConfirmCreateMultiowner() {
		cy.getById('confirm-create-employee-button').click();
	}

	/** Выбор партнера для мультиовнера */
	selectPartnerForMultiowner(partnerName = '') {
		this.input.typeSelect('partners', partnerName);

		this.getModalContent().click();
	}

	/** Выбор партнера */
	selectPartner(partnerName = '') {
		this.input.typeSelect('partners-shops', partnerName);
	}
}

export class EmployeeLpage {
	/** Содержимое lpage Пользователя */
	getLpageContent() {
		return cy.getById('employee-lpage');
	}

	/** Свитчер переключения блокировать/разблокировать пользователя */
	getSwitcher() {
		return cy.getById('switcher');
	}

	/** Изменение полей данных пользователя */
	changeUserData(field = USER_DATA.NAME, newText = 'Оскорович') {
		cy.getById(field).within(() => {
			cy.getById('info-field-edit-btn').click();
			cy.get('.editor__slots > .field > .field__input-wrapper > .field__input')
				.clear()
				.type(newText);
			cy.get(
				'.info-field__text > .wrapper > .editor-wrapper > .editor > .btn-main-color'
			).click();
		});
	}

	/** Изменение поля Роль */
	changeUserRole(roleName = 'Менеджер') {
		cy.getById('employee-role').within(() => {
			cy.getById('info-field-edit-btn').click();
			cy.getById('select-label').click();
			cy.get('.list').contains(roleName).click();
			cy.get(
				'.info-field__text > .wrapper > .editor-wrapper > .editor > .btn-main-color'
			).click();
		});
	}

	/** Нажатие на кнопку Заблокировать/Разблокировать пользователя */
	clickBlockedUserButton() {
		cy.getById('switcher').within(() => {
			cy.get('.slider').click();
		});
	}

	/** Проверить что свитчер выключен */
	checkSwitcherIsOff() {
		this.getSwitcher().should('have.class', 'switch__gray');
	}

	/** Проверить что свитчер включен */
	checkSwitcherIsOn() {
		this.getSwitcher().should('have.class', 'switch__checked');
	}
}
