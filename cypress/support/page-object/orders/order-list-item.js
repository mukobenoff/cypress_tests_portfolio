export const ORDER_WITH_COURIER_ARRIVED = {
	ORDER_DETAIL_INFO_TEXT: 'Курьер уже в ресторане и ждёт этот заказ.',
	ORDER_WITH_COURIER_AND_CONFRIM_TIME_EXPIRED: {
		ICONS: ['ami-courier', 'ami-timer'],
		ORDER_ID: 1478910,
	},
	ORDER_WITH_COURIER_AND_STATUS_NOT_EQUAL_CREATED_OR_DELIVERY: {
		ICON: ['ami-courier'],
		ORDER_ID: 1998559,
	},
	ORDER_WITH_COURIER_AND_CONFRIM_TIME_NOT_EXPIRED: {
		ORDER_ID: 1105850,
	},
};

export class OrderListItem {
	// check

	/**
	 * Проверить что у заказа с номером @param orderId
	 * существуют большие иконки из массива @param arrayOfIcons
	 * @param  {array} arrayOfIcons - массив из названий иконок
	 * @param  {number} orderId - номер заказа
	 */
	checkLargeIconsMatch(arrayOfIcons, orderId) {
		const list = [];
		cy.getById(`order-list-item-${orderId}-large-icon`)
			.should('have.length', arrayOfIcons.length)
			.each(($li) => {
				const icon = Array.from($li[0].classList)
					.find((item) => item.includes('ami-'));

				list.push(icon);
			}).wrap(list).should('deep.equal', arrayOfIcons);
	}

	/**
	 * Проверить что у заказа с номером @param orderId
	 * существует маленькая иконка
	 * @param  {number} orderId - номер заказа
	 */
	checkSmallIconExist(orderId) {
		cy.getById(`order-list-item-${orderId}-small-icon`).should('exist');
	}
}
