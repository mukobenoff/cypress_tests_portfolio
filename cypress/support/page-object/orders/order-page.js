import { USER_ROLES } from '../../mock/mock-user';
import {
	Notify,
	Api,
	Checkbox,
	Radio,
	Modal,
	Switcher,
} from '../common-pageobject';

const notify = new Notify();
const checkbox = new Checkbox();
const api = new Api();

export const ORDER_IDS = {
	default: 1344084,
};

export const ORDER_STATUS_REQ_FIXTURE = {
	COLLECTION: 'orders/request-body/order_change_status_collection',
	READY_TO_DELIVERY:
		'orders/request-body/order_change_status_ready_to_delivery',
	DELIVERY: 'orders/request-body/order_change_status_delivery',
	DELIVERED: 'orders/request-body/order_change_status_delivered',
};

export const ORDER_STATUS_REQ = {
	COLLECTION: 'Collection',
	READY_TO_DELIVERY: 'ReadyToDelivery',
	DELIVERY: 'Delivery',
	DELIVERED: 'Delivered',
};

export const ORDER_BASE_FIELDS = {
	partner: {
		id: 'partner',
		valueId: 'partner-value',
		value: 'Покешная «Угорь Игорь» (Плещеева 15в)',
	},
	prepareTime: {
		id: 'prepare-time',
		value: '18',
	},
	deliveryTime: {
		id: 'delivery-time',
		value: '58',
	},
	cashPayType: {
		id: 'pay-type',
		value: 'Наличными',
	},
	cardPayType: {
		id: 'pay-type',
		value: 'Картой онлайн',
	},
	changeFromCash: {
		id: 'change-from-cash',
		value: '5\u00A0000\u00A0₽',
	},
	comment: {
		id: 'order-comment',
		value: 'Домофон не работает',
	},
	client: {
		id: 'client',
		value: 'Иван Иванов',
	},
	clientPhone: {
		id: 'client-phone',
		value: '+7 (925) 627-38-44',
	},
	clientAddress: {
		id: 'client-address',
		value: 'проспект Будённого, 21с3, кв.\u00A03',
	},
	defaultOrderNumber: {
		id: 'order-id',
		value: 1847943,
	},
	iikoOrderNumber: {
		id: 'order-id',
		value: '13e9d68b-7bdd-4fb0-9152-7c62374c0376',
	},
};

export const DELETE_MEAL_RES_FX = {
	meal_disabled:
		'orders/delete_meal_in_order/response/delete_meal_in_order_disabled',
	meal_not_disabled:
		'orders/delete_meal_in_order/response/delete_meal_in_order_not_disabled',
};

/** Константы data-cy атрибутов */
export const ORDER_PAGES_DC = {
	TIMER: {
		HOURS_VALUE: 'hours-value',
		MINUTES_VALUE: 'minutes-value',
		INCREMENT_HOURS: 'increment-hours-btn',
		INCREMENT_MINUTES: 'increment-minutes-btn',
		DECREMENT_HOURS: 'decrement-hours-btn',
		DECREMENT_MINUTES: 'decrement-minutes-btn',
		VARIANTS: 'shop-shutdown-modal-variants-radio',
	},
	SHUTDOWN: {
		MODAL: 'shop-shutdown-modal',
		CONFIRM: 'confirm-btn',
		INFO: 'shop-shotdown-info',
		INFO_TEXT: 'shop-shotdown-info-text',
	},
	SHUTDOWN_REASON: {
		MODAL: 'shop-shutdown-reason-modal',
		CONFIRM: 'shop-shutdown-reason-confirm-btn',
	},
	COMMENT: {
		TEXTAREA: 'textarea-field',
		ERROR_TEXT: 'textarea-error',
	},
	CANCEL: {
		MODAL: 'cancel-order-modal',
		CONFIRM: 'cancel-order-button',
		COMMENT: 'cancel-order-modal-comment',
	},
	ORDER_AGREGATE_DELIVERY_INFO: 'order-agregate-delivery-info',
	ORDERS: {
		NEW: 'order-list-item-1478909',
		COLLECTING: 'order-list-item-1105850',
		READY_TO_DELIVERY: 'order-list-item-1998559',
		DELIVERY: 'order-list-item-1003492',
	},
	PROCESS: {
		BUTTON: 'order-processed-button',
	},
	ORDER: {
		DETAIL: 'order-detail',
		MEAL: {
			ACTION_LIST: 'order-meal-action-list',
		},
	},
	ENABLE_SHOP_CONFIRM_BTN: 'enable-shop-confirm-btn',
	SWITCHER: 'shop-switcher',
	COPY_TEXT_BTN: 'copy-text-btn',
};

export const DELETE_MEAL_DC = {
	MODAL: 'delete-meal-in-order-modal',
	CONFIRM: 'delete-meal-in-order-modal-button',
	COMMENT: 'delete-meal-in-order-modal-comment',
	REQUIRED_DISABLE_MEAL_TEXT: 'delete-meal-in-order-required-disable-meal-text',
	DISABLE_MEAL_CHECKBOX: 'delete-meal-in-order-disable-meal-checkbox',
};

/** Тексты для информации по заказу по модели aggregate */
export const ORDER_AGREGATE_DELIVERY_INFO_TEXT = {
	ready_to_delivery: {
		heading: 'скоро заберет заказ',
		text: 'Статус заказа автоматически изменится на «Доставка»',
	},
	delivery: {
		heading: 'забрал заказ и везет его клиенту',
		text: 'Мы сообщим, когда заказ доставят',
	},
};

export const SHUTDOWN_TIME_VARIANTS = {
	CUSTOM: 'Своё время',
	ONE_HOUR: '1 час',
	TWO_HOUR: '2 часа',
	UNTIL_NEXT_OPEN_TIME: 'До следующего открытия',
};

export const DELETE_MEAL_REQ_FX = {
	not_available:
		'orders/delete_meal_in_order/request-body/reason_not_available',
	another: 'orders/delete_meal_in_order/request-body/reason_another',
	technical_problems:
		'orders/delete_meal_in_order/request-body/reason_technical_problems',
	[SHUTDOWN_TIME_VARIANTS.ONE_HOUR]:
		'orders/request-body/shop-close/shop_close_variant_one_hour',
	[SHUTDOWN_TIME_VARIANTS.TWO_HOUR]:
		'orders/request-body/shop-close/shop_close_variant_two_hour',
	[SHUTDOWN_TIME_VARIANTS.UNTIL_NEXT_OPEN_TIME]:
		'orders/request-body/shop-close/shop_close_variant_until_next_open_time',
};

export class DeleteMealModal {
	/** Подготовка перед тестированием удаления блюд - прогрузка причин */
	prepareDeleteMealInOrderReasons() {
		cy.mockGetReasonsForDeleteMealInOrder();
		this.clickDeleteMealInOrder();
		cy.wait('@deleteMealInOrderReasons');
		cy.getById('close-modal-btn').click();
	}

	// get

	/** Получить элемент кнопки удаления блюда */
	getConfirmDeleteMealBtn() {
		return cy.getById(DELETE_MEAL_DC.CONFIRM);
	}

	/** Получить элемент комментария удаления блюда */
	getDeleteMealReasonComment() {
		return cy.getById(DELETE_MEAL_DC.COMMENT);
	}

	/** Получить элемент чекбокса выключения блюда в ресторане при удалении блюда */
	getDisableMealCheckbox() {
		return cy.getById(DELETE_MEAL_DC.DISABLE_MEAL_CHECKBOX);
	}

	// click

	/** Нажать на удаление блюда, открывает модальное окно с выбором причины
	 *
	 * @param index {number} - индекс блюда в заказе
	 */
	clickDeleteMealInOrder(index = 0) {
		cy.getById(ORDER_PAGES_DC.ORDER.DETAIL).within(() => {
			cy.getById(ORDER_PAGES_DC.ORDER.MEAL.ACTION_LIST)
				.eq(index)
				.click()
				.within(() => {
					cy.getById('delete-meal-button').click();
				});
		});
	}

	// check

	/** Проверить существование модального окна */
	checkModalDeleteMealIsExist(isShouldExist = true) {
		cy.getById(DELETE_MEAL_DC.MODAL).should(
			isShouldExist ? 'exist' : 'not.exist'
		);
	}

	/** Проверить существование и текст ошибки поля комментарий при незаполнении */
	checkErrorComment() {
		cy.getById(DELETE_MEAL_DC.MODAL).within(() => {
			cy.getById(ORDER_PAGES_DC.COMMENT.TEXTAREA).should(
				'have.class',
				'textarea__field_error'
			);
			cy.getById(ORDER_PAGES_DC.COMMENT.ERROR_TEXT).should(
				'contain',
				'Не заполнено обязательное поле'
			);
		});
	}

	/** Убедиться что кнопка подтвердить причину существует/не существует */
	checkReasonConfirmBtnExist(isShouldExist = true) {
		const confirmBtn = this.getConfirmDeleteMealBtn();

		isShouldExist ? confirmBtn.should('exist') : confirmBtn.should('not.exist');
	}

	/** Убедиться что поле для комментария существует/не существует */
	checkAnotherReasonCommentExist(isShouldExist = true) {
		const comment = this.getDeleteMealReasonComment();

		isShouldExist ? comment.should('exist') : comment.should('not.exist');
	}

	/** Убедиться что чекбокс выключения блюда в ресторане существует/не существует */
	checkDisableMealCheckboxExist(isShouldExist = true) {
		const checkbox = this.getDisableMealCheckbox();

		isShouldExist ? checkbox.should('exist') : checkbox.should('not.exist');
	}

	// select

	/** Выбрать причину удаления блюда */
	selectDeleteMealReason(text = 'Нет блюда в наличии') {
		Radio.selectRadioByText(DELETE_MEAL_DC.MODAL, text);
	}
}

export class OrdersPage {
	constructor() {
		this.deleteMealModal = new DeleteMealModal();
		this.closeShopModal = new CloseShopModal();
		this.shopSwitcher = new Switcher(ORDER_PAGES_DC.SWITCHER);
	}

	// actions

	/** Включить ресторан */
	enableShop() {
		this.shopSwitcher.on();
		this.clickEnableShopConfirmBtn();
	}

	/** Открытие страницы под определенной ролью */
	openPage(role = USER_ROLES.OWNER) {
		cy.setLSToken();
		cy.mockUser(role);
		cy.openOrdersPage();
		cy.clickOnStartWork();
		api.waitInitialRequests(role);
		cy.wait('@categoryList');
		cy.wait('@optionList');
	}

	// get

	/** Получить информацию о заказе по модели aggregate
	 * @return {Cypress} Cypress
	 */
	getOrderAgregateInfo() {
		return cy.getById(ORDER_PAGES_DC.ORDER_AGREGATE_DELIVERY_INFO);
	}

	/** Кнопка перевода заказа по статусам */
	getOrderProcessedBtn() {
		return cy.getById(ORDER_PAGES_DC.PROCESS.BUTTON);
	}

	// check

	/**
	 * Проверить что заказ либо есть в списке ,либо его нет ,в зависимости от флага
	 * @param  {string} orderId=ORDER_IDS.default
	 * @param  {boolean} isExist=true
	 */
	checkOrderInListExist(orderId = ORDER_IDS.default, isExist = true) {
		const state = isExist ? 'exist' : 'not.exist';
		cy.getById(`order-list-item-${orderId}`).should(state);
	}

	/** Проверить вариант выключения ресторана на соответствие фикстуре
	 * @param variant {string} - вариант выключения
	 */
	checkShutdownTimeVariantFixtureEqual(
		variant = SHUTDOWN_TIME_VARIANTS.ONE_HOUR
	) {
		Radio.selectRadioByText(ORDER_PAGES_DC.TIMER.VARIANTS, variant);

		this.closeShopModal.clickConfirmBtn();

		this.closeShopModal.selectReasonWithoutComment();

		this.closeShopModal.clickShutdownReasonConfirmBtn();

		api.checkRequestBody('shopClose', DELETE_MEAL_REQ_FX[variant]);
	}

	/** Проверить что варианты времени выключения магазина присутствует в модальном окне
	 * @param {string[]} variants - варианты
	 */
	checkShutdownTimeVariantsOnModal(variants = [SHUTDOWN_TIME_VARIANTS.CUSTOM]) {
		this.shopSwitcher.off();

		this.closeShopModal.checkTimeVariantsExist(variants);

		Modal.clickCloseBtn('shop-shutdown-modal');
	}

	/**
	 * Проверка функционала удаления блюда из заказа:
	 *
	 * Модальное окно выбора причины удаления блюда существует
	 * В статусах 'Новые', 'Готовятся', 'Отправка' есть кнопка удалить блюдо
	 * В статусе 'Доставка' нет кнопки удалить блюдо
	 * Если причина удаления блюда не выбрана, то кнопка удаления блюда не отображается
	 * Причины корректно отображаются
	 * При выборе причины another необходимо заполнить комментарий
	 * При выборе причины not_available блюдо автоматически выключается в ресторане
	 * При выборе причины кроме not_available есть чекбокс выключения блюда в ресторане
	 * Показывается уведомление об успешном удалении блюда (и выключении в ресторане) после удаления блюда
	 */
	checkDeleteMealInOrder() {
		// проверяем причину нет в наличии
		this.deleteMealModal.clickDeleteMealInOrder();

		this.deleteMealModal.checkModalDeleteMealIsExist();
		this.deleteMealModal.checkReasonConfirmBtnExist(false);

		this.deleteMealModal.selectDeleteMealReason('Нет блюда в наличии');
		this.deleteMealModal.checkReasonConfirmBtnExist(true);

		this.deleteMealModal.checkDisableMealCheckboxExist(false);

		cy.getById(DELETE_MEAL_DC.REQUIRED_DISABLE_MEAL_TEXT).should('exist');

		cy.mockDeleteMealInOrder(DELETE_MEAL_RES_FX.meal_disabled);

		this.deleteMealModal.getConfirmDeleteMealBtn().click();
		api.checkRequestBody('deleteMealInOrder', DELETE_MEAL_REQ_FX.not_available);
		this.waitLoadingOrder();

		notify.checkNotifySuccessText(
			'Блюдо удалено из заказа и выключено в ресторане', true
		);
		this.deleteMealModal.checkModalDeleteMealIsExist(false);
		notify.checkNotifySuccessVisible(false);

		// проверяем причину другое
		this.deleteMealModal.clickDeleteMealInOrder();

		this.deleteMealModal.checkModalDeleteMealIsExist();
		this.deleteMealModal.checkReasonConfirmBtnExist(false);

		this.deleteMealModal.selectDeleteMealReason('Другая причина');
		this.deleteMealModal.checkReasonConfirmBtnExist(true);

		this.deleteMealModal.checkAnotherReasonCommentExist(true);

		this.deleteMealModal.checkDisableMealCheckboxExist(true);
		checkbox.toggleCheckboxByText(
			DELETE_MEAL_DC.DISABLE_MEAL_CHECKBOX,
			'Выключить блюдо в ресторане'
		);

		cy.mockDeleteMealInOrder(DELETE_MEAL_RES_FX.meal_disabled);
		this.deleteMealModal.getConfirmDeleteMealBtn().click();

		this.deleteMealModal.checkErrorComment();
		cy.getById(ORDER_PAGES_DC.COMMENT.TEXTAREA).type('comment');

		this.deleteMealModal.getConfirmDeleteMealBtn().click();

		api.checkRequestBody('deleteMealInOrder', DELETE_MEAL_REQ_FX.another);
		this.waitLoadingOrder();

		notify.checkNotifySuccessText(
			'Блюдо удалено из заказа и выключено в ресторане', true
		);
		this.deleteMealModal.checkModalDeleteMealIsExist(false);
		notify.checkNotifySuccessVisible(false);

		// проверяем причину технические неполадки
		this.deleteMealModal.clickDeleteMealInOrder();

		this.deleteMealModal.checkModalDeleteMealIsExist();
		this.deleteMealModal.checkReasonConfirmBtnExist(false);

		this.deleteMealModal.selectDeleteMealReason(
			'Технические проблемы в ресторане'
		);
		this.deleteMealModal.checkReasonConfirmBtnExist(true);

		this.deleteMealModal.checkDisableMealCheckboxExist(true);

		cy.mockDeleteMealInOrder(DELETE_MEAL_RES_FX.meal_not_disabled);
		this.deleteMealModal.getConfirmDeleteMealBtn().click();

		api.checkRequestBody(
			'deleteMealInOrder',
			DELETE_MEAL_REQ_FX.technical_problems
		);
		this.waitLoadingOrder();

		notify.checkNotifySuccessText('Блюдо удалено из заказа', true);
		this.deleteMealModal.checkModalDeleteMealIsExist(false);
		notify.checkNotifySuccessVisible(false);
	}

	/** Проверка, что детальная карточка заказа открыта */
	checkOrderDetailOpened() {
		cy.getById(ORDER_PAGES_DC.ORDER.DETAIL).should('exist');
	}

	/** Проверка текста внутри кнопки перевода заказа по статусам */
	checkOrderProcessdBtnText(text = 'заказ готов') {
		cy.elementHaveText(ORDER_PAGES_DC.PROCESS.BUTTON, text);
	}

	/** Проверка request body (json) запроса /api/orders/status/... (зависит от статуса) */
	checkOrdersChangeStatusRequestBody(
		status = ORDER_STATUS_REQ.READY_TO_DELIVERY
	) {
		cy.wait(`@orderChangeStatus${status}`);
		cy.fixture('orders/request-body/order_change_status').then((json) => {
			cy.get(`@orderChangeStatus${status}`)
				.its('request.body')
				.should('deep.equal', json);
		});
	}

	/** Проверка, что у заказа нет списка опций у блюда. В том числе и удаления блюда. */
	checkOrderHasNotActions() {
		cy.getById(ORDER_PAGES_DC.ORDER.DETAIL).within(() => {
			cy.getById(ORDER_PAGES_DC.ORDER.MEAL.ACTION_LIST).should('not.exist');
		});
	}

	/** Проверить текстовое наполнение информации о заказе по модели aggregate
	 * @param content {string} - текстовое наполнение
	 * @return {void}
	 */
	checkOrderAgregateInfoContent(content) {
		this.getOrderAgregateInfo().should('contain', content);
	}

	/** Проверить текстовое наполнение информации о заказе по модели aggregate с конкретным статусом
	 * @param status {string} = 'ready_to_delivery'
	 * @return {void}
	 */
	checkOrderAgregateInfoContentForStatus(status = 'ready_to_delivery') {
		this.checkOrderAgregateInfoContent(
			ORDER_AGREGATE_DELIVERY_INFO_TEXT[status].heading
		);
		this.checkOrderAgregateInfoContent(
			ORDER_AGREGATE_DELIVERY_INFO_TEXT[status].text
		);
	}

	/** Проверить что кнопка скопировать текст существует/не существует
	 * @param dataCyContainer {string} - data-cy контейнера в котором находится кнопка копирования
	 * @param isShouldExist {boolean} - булевый флаг существования кнопки
	 */
	checkCopyTextBtnExist(dataCyContainer, isShouldExist = true) {
		cy.getById(dataCyContainer).within(() => {
			cy.getById(ORDER_PAGES_DC.COPY_TEXT_BTN).should(isShouldExist ? 'exist' : 'not.exist');
		});
	}

	/** Проверяет наличие и содержание поля заказа */
	checkHasInfoField({ id, value, valueId }) {
		cy.getById(id)
			.should('exist')
			.within(() => {
				cy.elementHaveText(valueId || 'value', value);
			});
	}

	/** Проверяет номер телефона клиента заказа */
	checkClientPhone(phone) {
		cy.getById('client-phone')
			.eq(0)
			.should('exist')
			.within(() => {
				cy.elementHaveText('value', phone);
			});
	}

	/** Проверяет время доставки/готовки заказа */
	checkOrderTime({ id, value }) {
		cy.getById(id)
			.should('exist')
			.within(() => {
				cy.getById('value').contains(value);
			});
	}

	/** Проверить что вкладка имеет заказы всех отображаемых статусов */
	checkTabHaveAllStatusesOrders() {
		cy.getById(ORDER_PAGES_DC.ORDERS.NEW).should('exist');
		cy.getById(ORDER_PAGES_DC.ORDERS.COLLECTING).should('exist');
		cy.getById(ORDER_PAGES_DC.ORDERS.READY_TO_DELIVERY).should('exist');
		cy.getById(ORDER_PAGES_DC.ORDERS.DELIVERY).should('exist');
	}

	// click

	/** Клик на кнопку Включить магазин */
	clickEnableShopConfirmBtn() {
		cy.getById(ORDER_PAGES_DC.ENABLE_SHOP_CONFIRM_BTN).click();
	}

	/** Клик по заказу с номером */
	clickOrder(orderID = ORDER_IDS.default) {
		cy.getById(`order-list-item-${orderID}`).click();
	}

	/** Нажатие на кнопку перевода заказа по статусам */
	clickOrderProcessedBtn() {
		this.getOrderProcessedBtn().click();
	}

	/** Нажатие на свитчер отключения/включения приема заказов */
	clickSwitcherToggleShop() {
		cy.getById('shop-switcher').within(() => {
			cy.get('.b2b-switch').click();
		});
	}

	// нажатие на кнопку Отменить заказ
	clickCancelBtn() {
		cy.getById('cancel-button').click();
	}

	// prepare

	// refresh

	/** Кнопка обновляет список заказов и текущий заказ */
	refreshOrders() {
		cy.getById('refresh-button').click();
	}

	// wait

	/**
		На запрос деталки заказа, если в заказе есть комбо блюда,
		то нужен запрос для блюд в заказе. Флаг needWaitMeals отвечает за это
	*/

	waitLoadingOrder(needWaitMeals = true) {
		cy.wait('@getOrderById');
		if (needWaitMeals) {
			cy.wait('@getOrderMeals');
		}
	}

	/**
	 *	Проверить в списке заказов,
	 * 	что выводится id около и не выводится id партнера
	 */

	checkIikoOrderIdInOrderList() {
		this.checkOrderInListExist(ORDER_BASE_FIELDS.defaultOrderNumber.value);
		this.checkOrderInListExist(ORDER_BASE_FIELDS.iikoOrderNumber.value, false);
	}

	/**
	 * Проверить в детальном отображении заказа,
	 * что выводится id около и не выводится id партнера
	 */

	checkIikoOrderIdInOrderDetail() {
		this.clickOrder(ORDER_BASE_FIELDS.defaultOrderNumber.value);
		cy.getById(ORDER_BASE_FIELDS.defaultOrderNumber.id).should(
			'contain',
			`№ ${ORDER_BASE_FIELDS.defaultOrderNumber.value}`
		);
		cy.getById(ORDER_BASE_FIELDS.defaultOrderNumber.id).should(
			'not.contain',
			`№ ${ORDER_BASE_FIELDS.iikoOrderNumber.value}`
		);
	}
}

export class CloseShopModal {
	constructor() {
		this.shutdownShopRadio = new Radio(ORDER_PAGES_DC.TIMER.VARIANTS);
	}

	/** Кнопка Остановить прием заказов */
	getConfirmBtn() {
		return cy.getById(ORDER_PAGES_DC.SHUTDOWN.CONFIRM);
	}

	/** Кнопка Подтверждения выбора причины остановки приема заказов */
	getShutdownReasonConfirmBtn() {
		return cy.getById(ORDER_PAGES_DC.SHUTDOWN_REASON.CONFIRM);
	}

	/** Клик на кнопку Подтверждения выбора причины остановки приема заказов */
	clickShutdownReasonConfirmBtn() {
		this.getShutdownReasonConfirmBtn().click();
	}

	/** Увеличить время таймера на 1 час */
	clickIncrementHoursBtn() {
		return cy.getById(ORDER_PAGES_DC.TIMER.INCREMENT_HOURS).click();
	}

	/** Увеличить время таймера на 15 минут */
	clickIncrementMinutesBtn() {
		return cy.getById(ORDER_PAGES_DC.TIMER.INCREMENT_MINUTES).click();
	}

	/** Уменьшить время таймера на 1 час */
	clickDecrementHoursBtn() {
		return cy.getById(ORDER_PAGES_DC.TIMER.DECREMENT_HOURS).click();
	}

	/** Уменьшить время таймера на 15 минут */
	clickDecrementMinutesBtn() {
		return cy.getById(ORDER_PAGES_DC.TIMER.DECREMENT_MINUTES).click();
	}

	/** Нажатие на кнопку остановить прием заказов */
	clickConfirmBtn() {
		this.getConfirmBtn().click();
	}

	/** Проверка, что кнопка остановки приема заказов неактивна */
	checkConfirmBtnDisabled() {
		this.getConfirmBtn().should('have.class', 'button-block_disabled');
	}

	/** Проверить работу таймера с часами */
	checkTimerHoursChange() {
		const hoursValue = ORDER_PAGES_DC.TIMER.HOURS_VALUE;
		// проверка увеличения часа
		cy.elementHaveText(hoursValue, '0');
		this.clickIncrementHoursBtn();
		cy.elementHaveText(hoursValue, '1');

		// проверка уменьшения часа
		this.clickDecrementHoursBtn();
		cy.elementHaveText(hoursValue, '0');

		// проверка что час не становится меньше 0
		this.clickDecrementHoursBtn();
		cy.elementHaveText(hoursValue, '0');
	}

	/** Проверить работу таймера с минутами */
	checkTimerMinutesChange() {
		const minutesValue = ORDER_PAGES_DC.TIMER.MINUTES_VALUE;
		// проверка увеличения минут
		cy.elementHaveText(minutesValue, '0');
		this.clickIncrementMinutesBtn();
		cy.elementHaveText(minutesValue, '15');

		// проверка уменьшения минут
		this.clickDecrementMinutesBtn();
		cy.elementHaveText(minutesValue, '0');

		// проверка что минуты не уходят в минус
		this.clickDecrementMinutesBtn();
		cy.elementHaveText(minutesValue, '0');
	}

	/** Проверить работу таймера по переводу минут в часы */
	checkTimerTransformMinutesIntoHours() {
		const hoursValue = ORDER_PAGES_DC.TIMER.HOURS_VALUE;
		const minutesValue = ORDER_PAGES_DC.TIMER.MINUTES_VALUE;

		cy.elementHaveText(hoursValue, '0');
		cy.elementHaveText(minutesValue, '0');

		this.clickIncrementMinutesBtn();
		this.clickIncrementMinutesBtn();
		this.clickIncrementMinutesBtn();
		this.clickIncrementMinutesBtn();

		cy.elementHaveText(hoursValue, '1');
		cy.elementHaveText(minutesValue, '0');
	}

	/** Проверка работы таймера - добавление и уменьшение часов, минут, проверка на минимальный предел */
	checkTimer() {
		cy.getById(ORDER_PAGES_DC.SHUTDOWN.MODAL)
			.should('exist')
			.within(() => {
				// проверка изменения часа
				this.checkTimerHoursChange();

				// проверка изменения минут
				this.checkTimerMinutesChange();

				// проверка трансформации минут в часы
				this.checkTimerTransformMinutesIntoHours();
			});
	}

	/** Проверить что варианты времени выключения магазина присутствует на странице
	 * @param {string[]} variants - варианты
	 */
	checkTimeVariantsExist(variants = [SHUTDOWN_TIME_VARIANTS.CUSTOM]) {
		for (const variant of variants) {
			this.shutdownShopRadio.getOptionElement(variant).should('exist');
		}
	}

	/** Проверка, что кнопка остановки приема заказов активна */
	checkConfirmBtnNotDisabled() {
		this.getConfirmBtn().should('not.have.class', 'button-block_disabled');
	}

	/** Убедиться что кнопка подтвердить причину существует/не существует */
	checkReasonConfirmBtnExist(isShouldBtnExist = true) {
		const confirmBtn = this.getShutdownReasonConfirmBtn();

		isShouldBtnExist
			? confirmBtn.should('exist')
			: confirmBtn.should('not.exist');
	}

	/** Выбрать причину без поясняющего комментария */
	selectReasonWithoutComment() {
		cy.getById(ORDER_PAGES_DC.SHUTDOWN_REASON.MODAL).within(() => {
			cy.getById('radio-option').first().click();
		});
	}

	/** Выбрать причину c поясняющим комментарием */
	selectReasonWithComment() {
		cy.getById(ORDER_PAGES_DC.SHUTDOWN_REASON.MODAL).within(() => {
			cy.getById('radio-option').contains('Другое').click();
		});
	}

	/** Проверить наличие поля для комментария */
	checkReasonCommentExist() {
		cy.getById(ORDER_PAGES_DC.SHUTDOWN_REASON.MODAL).within(() => {
			cy.getById(ORDER_PAGES_DC.COMMENT.TEXTAREA).should('exist');
		});
	}

	/** Проверить что без указания причины появляется ошибка */
	checkErrorIfNoComment() {
		cy.getById(ORDER_PAGES_DC.SHUTDOWN_REASON.MODAL).within(() => {
			this.clickShutdownReasonConfirmBtn();
			cy.getById(ORDER_PAGES_DC.COMMENT.TEXTAREA).should(
				'have.class',
				'textarea__field_error'
			);
			cy.getById(ORDER_PAGES_DC.COMMENT.ERROR_TEXT).should(
				'contain',
				'Обязательное поле'
			);
		});
	}

	/** Закрыть магазин с комментарием */
	closeShopWithComment() {
		cy.getById(ORDER_PAGES_DC.SHUTDOWN_REASON.MODAL).within(() => {
			cy.getById(ORDER_PAGES_DC.COMMENT.TEXTAREA).type('comment');
			this.clickShutdownReasonConfirmBtn();
		});
	}
}

export class CancelOrderModal {
	/** Нажатие на кнопку Отменить заказ */
	clickCancelBtn() {
		cy.getById(ORDER_PAGES_DC.CANCEL.CONFIRM).click();
	}

	/** Проверка, что поле для ввода комментария присутствует */
	checkCommentFieldExist(isShouldExist = true) {
		const comment = cy.getById(ORDER_PAGES_DC.CANCEL.COMMENT);

		isShouldExist ? comment.should('exist') : comment.should('not.exist');
	}

	/** Убедиться что кнопка подтвердить причину существует/не существует */
	checkReasonConfirmBtnExist(isShouldBtnExist = true) {
		const confirmBtn = cy.getById(ORDER_PAGES_DC.CANCEL.CONFIRM);

		isShouldBtnExist
			? confirmBtn.should('exist')
			: confirmBtn.should('not.exist');
	}

	/** Выбрать причину без поясняющего комментария */
	selectReasonWithoutComment() {
		cy.getById(ORDER_PAGES_DC.CANCEL.MODAL).within(() => {
			cy.getById('radio-option').first().click();
		});
	}

	/** Выбрать причину c поясняющим комментарием */
	selectReasonWithComment() {
		cy.getById(ORDER_PAGES_DC.CANCEL.MODAL).within(() => {
			cy.getById('radio-option').last().click();
		});
	}

	/** Проверить наличие поля для комментария */
	checkReasonCommentExist() {
		cy.getById(ORDER_PAGES_DC.CANCEL.MODAL).within(() => {
			cy.getById(ORDER_PAGES_DC.COMMENT.TEXTAREA).should('exist');
		});
	}

	/** Проверить что без указания причины появляется ошибка */
	checkErrorIfNoComment() {
		cy.getById(ORDER_PAGES_DC.CANCEL.MODAL).within(() => {
			this.clickCancelBtn();
			cy.getById(ORDER_PAGES_DC.COMMENT.TEXTAREA).should(
				'have.class',
				'textarea__field_error'
			);
			cy.getById(ORDER_PAGES_DC.COMMENT.ERROR_TEXT).should(
				'contain',
				'Обязательное поле'
			);
		});
	}

	/** Отменить заказ с комментарием */
	cancelWithComment() {
		cy.getById(ORDER_PAGES_DC.CANCEL.MODAL).within(() => {
			cy.getById(ORDER_PAGES_DC.COMMENT.TEXTAREA).type('comment');
			this.clickCancelBtn();
		});
	}

	/** Проверить нотифай успешной отмены заказа */
	checkNotifySuccessCancelOrder(text = 'Заказ успешно отменен') {
		notify.checkNotifySuccessText(text);
	}

	/** Проверка тела запроса /api/orders/status/cancelled */
	checkCancelOrderRequestBody(withComment = false) {
		cy.wait('@cancelOrder');

		const fixture = `orders/request-body/cancel_order_${
			withComment ? 'with_comment' : 'without_comment'
		}`;

		cy.fixture(fixture).then((json) => {
			cy.get('@cancelOrder').its('request.body').should('deep.equal', json);
		});
	}
}

export class CheckOrderMeals {
	constructor() {
		this.simpleMeal = {
			mealId: 'meal-1369469',
			type: 'simple',
			base: {
				name: 'Чучхела ролл (простое блюдо)',
				quantity: 1,
				price: 624,
				hidePriceSymbol: true,
			},
			options: [
				{ name: 'Стандартный 300 мл', quantity: 1, price: 24 },
				{ name: '30 см', quantity: 1, price: 45 },
			],
			addIngredients: [
				{ name: 'Помидоры', quantity: 1, price: 35, incrementSymbol: true },
				{ name: 'Огурец', quantity: 1, price: 20, incrementSymbol: true },
			],
			removeIngredients: [
				{ name: 'Капуста', quantity: 1, price: 0, decrementSymbol: true },
			],
		};

		this.comboMeal = {
			mealId: 'meal-1369471',
			type: 'combo',
			base: {
				name: 'Комбо микс (Комбо блюдо)',
				quantity: 1,
				price: 917,
				hidePriceSymbol: true,
			},
			comboOptions: [
				{
					name: 'Поке (сложное блюдо) Стандартный 300 мл',
					quantity: 1,
					price: 2,
				},
				{ name: 'Поке (сложное блюдо) Большой 400 мл', quantity: 1, price: 25 },
				{ name: 'Поке (сложное блюдо)', quantity: 1, price: 0 },
			],
		};

		this.hardMeal = {
			mealId: 'meal-1369470',
			type: 'hard',
			base: {
				name: 'Поке (сложное блюдо), Стандартный 300 мл',
				quantity: 1,
				price: 650,
				hidePriceSymbol: true,
			},
			options: [
				{ name: '40 см', quantity: 1, price: 25 },
				{ name: 'Базилик', quantity: 1, price: 35 },
			],
			addIngredients: [
				{ name: 'Лук', quantity: 2, price: 25, incrementSymbol: true },
			],
			removeIngredients: [
				{ name: 'Помидоры', quantity: 1, price: 0, decrementSymbol: true },
				{ name: 'Капуста', quantity: 1, price: 0, decrementSymbol: true },
			],
		};
	}

	// метод проверяющий состав блюд в заказе
	checkOrder() {
		const meals = [this.simpleMeal, this.comboMeal, this.hardMeal];

		meals.forEach((meal) => {
			this._checkMeal(meal);
		});
	}

	_checkMeal(meal) {
		cy.getById(meal.mealId).within(() => {
			this._checkBaseFields(meal.base);
			this._checkOptions(meal.options, 'meal-options');
			this._checkOptions(meal.addIngredients, 'meal-add-ingredients');
			this._checkOptions(meal.removeIngredients, 'meal-remove-ingredients');
			this._checkOptions(meal.comboOptions, 'meal-combo-options');
		});
	}

	_checkBaseFields(fields) {
		cy.getById('meal-base-fields').within(() => {
			this._checkMealRow(fields);
		});
	}

	_checkOptions(options, name) {
		if (!options) return;

		cy.getById(name).within(() => {
			options.forEach((option, index) => {
				cy.getById('meal-row')
					.eq(index)
					.within(() => {
						this._checkMealRow(option);
					});
			});
		});
	}

	_getQuantityLabel(fields) {
		if (fields.incrementSymbol) {
			return `+ ${fields.quantity} шт`;
		}
		if (fields.decrementSymbol) {
			return `- ${fields.quantity} шт`;
		}

		return `${fields.quantity} шт`;
	}

	_getPriceLabel(fields) {
		if (fields.hidePriceSymbol) {
			return `${fields.price}\u00A0₽`;
		}

		// \u00A0 - не разрывный пробел
		return fields.price > 0
			? `+ ${fields.price}\u00A0₽`
			: `${fields.price}\u00A0₽`;
	}

	_checkMealRow(fields) {
		cy.elementHaveText('meal-row-name', fields.name);
		cy.elementHaveText('meal-row-quantity', this._getQuantityLabel(fields));
		cy.elementHaveText('meal-row-price', this._getPriceLabel(fields));
	}
}

export class CheckIntegrationOrder {
	// Проверяет заказ в списке заказов, что отображается ошибка интеграции
	checkFailedIntegrationListItem(orderId) {
		const orderListItemId = `order-list-item-${orderId}`;
		const orderListItemText = 'Добавьте в кассу';

		this.checkOrderFailedIntegrationLabel(orderListItemId, orderListItemText);
	}

	// проверяет детальный блок заказа, что отображается ошибка интеграции
	checkFailedIntegrationDetail() {
		const orderDetailText =
			'Заказ не интегрировался в кассу, необходимо добавить вручную.';

		this.checkOrderFailedIntegrationLabel(
			ORDER_PAGES_DC.ORDER.DETAIL,
			orderDetailText
		);
	}

	// проверяет, что у обычного заказа нет ошибок интеграции
	checkDefaultOrder(orderId) {
		const orderDefaultListItemId = `order-list-item-${orderId}`;

		this.checkOrderHasNotIntegrationLabel(orderDefaultListItemId);
		this.checkOrderHasNotIntegrationLabel(ORDER_PAGES_DC.ORDER.DETAIL);
	}

	// проверка блока по id, на наличие ошибки интеграции
	checkOrderFailedIntegrationLabel(id, text) {
		cy.getById(id).within(() => {
			cy.getById('order-failed-integration').should('exist');

			cy.elementHaveText('order-failed-integration-text', text);
		});
	}

	// проверка блока на отсутствие ошибки интеграции
	checkOrderHasNotIntegrationLabel(id) {
		cy.getById(id).within(() => {
			cy.get('order-failed-integration').should('not.exist');
		});
	}
}
