import { Input, Select, Table, PaginationBlock, Checkbox } from '../common-pageobject';
import getMealsByNameFixture from '../../../fixtures/menu/table/partner/request-body/get_meals_by_name';
import mealListInTable from '../../../fixtures/menu/table/partner/response/meal_list';
import categories from '../../../fixtures/categories/response/categories_list';
import { MEAL_STATUSES } from '../menu-page';

const input = new Input();
const select = new Select();
const table = new Table();
const paginationBlock = new PaginationBlock();
const checkbox = new Checkbox();

export const MENU_TABLE_FILTER_VALUES = {
	NAME: getMealsByNameFixture.search.name,
	STATUS: MEAL_STATUSES.active,
	CATEGORY: 'Уточная',
};

const MENU_TABLE_DC = {
	FILTER_BY_MEAL_NAME_INPUT: 'filter-by-meal-name-input',
	FILTER_BY_MEAL_CATEGORY_SELECT: 'filter-by-meal-category-select',
	FILTER_BY_MEAL_STATUS_SELECT: 'filter-by-meal-status-select',
	FILTER_BY_HIDDEN_MEAL_CHECKBOX: 'filter-by-hidden-meal-checkbox',
	FILTER_BUTTON: 'filter-button',
	RESET_FILTER_BUTTON: 'reset-filters-button',
	PAGINATION_BLOCK: 'pagination-block',
	MEAL_TABLE: 'meal-table',
	TABLE_DATA_NAME: 'table-data-name',
	TABLE_DATA_CATEGORY: 'table-data-category',
	TABLE_DATA_STATUS: 'table-data-status',
};

export const MENU_TABLE_REQ_FIXTURES = {
	GET_HIDDEN_MEALS: '/menu/table/partner/request-body/get_hidden_meals',
	GET_MEALS_BY_ALL_FILTERS: '/menu/table/partner/request-body/get_meals_by_all_filters',
	GET_MEALS_BY_EMPTY_FILTERS: '/menu/table/partner/request-body/get_meals_by_empty_filters',
	GET_MEALS_BY_CATEGORY: '/menu/table/partner/request-body/get_meals_by_category',
	GET_MEALS_BY_NAME: '/menu/table/partner/request-body/get_meals_by_name',
	GET_MEALS_BY_STATUS: '/menu/table/partner/request-body/get_meals_by_status',
	GET_MEALS_BY_PAGINATION: '/menu/table/partner/request-body/get_meals_by_pagination',
};

export class MealsTable {
	// gets

	/**
	 * Получить кнопку поиска блюд по заданным фильтрам
	 */
	getFilterButton() {
		return cy.getById(MENU_TABLE_DC.FILTER_BUTTON);
	}

	/**
	 * Получить блок пагинации
	 */
	getPaginationBlock() {
		return cy.getById(MENU_TABLE_DC.PAGINATION_BLOCK);
	}

	// types

	/**
	 * Ввод имени блюда в поле "поиск по названию блюда"
	 * @param {string} mealName - название блюда
	 */
	typeMealName(mealName = 'Блюдо') {
		input.typeInput(MENU_TABLE_DC.FILTER_BY_MEAL_NAME_INPUT, mealName);
	}

	// selects

	/**
	 * Выбор категории блюда
	 * @param {string} categoryName - название категории блюда
	 */
	selectMealCategory(categoryName = 'Категория') {
		select.selectByText(MENU_TABLE_DC.FILTER_BY_MEAL_CATEGORY_SELECT, categoryName);
	}

	/**
	 * Выбор статус блюда
	 * @param {string} categoryName - статус блюда
	 */
	selectMealStatus(mealStatus = 'активные') {
		select.selectByText(MENU_TABLE_DC.FILTER_BY_MEAL_STATUS_SELECT, mealStatus);
	}

	// clicks

	/**
	 * Нажимает на кнопку поиска блюда по заданным фильтрам
	 */
	clickOnFilterButton() {
		this.getFilterButton().click();
	}

	/**
	 * Нажимает на номер страницы в пагинации
	 * @param {Number} pageNumber - число пагинации
	 */
	clickOnPaginationNumber(pageNumber = 8) {
		paginationBlock.clickOnPaginationNumber(MENU_TABLE_DC.PAGINATION_BLOCK, pageNumber);
	}

	// resets

	/**
	 * Сбрасывает значение у фильтра по имени
	 */
	clearNameFilter() {
		input.clearInput(MENU_TABLE_DC.FILTER_BY_MEAL_NAME_INPUT);
	}

	// checks

	/**
	 * Проверяет наличие пагинации
	 */
	checkPaginationBlockExist() {
		paginationBlock.checkPaginationBlockExist(MENU_TABLE_DC.PAGINATION_BLOCK, 8);
	}

	/**
	 * Проверяет содержимое таблицы блюд
	 */
	checkTableContent() {
		const mealsFromFixture = mealListInTable.products;
		const rowQuantity = mealsFromFixture.length;
		table.checkTableRowsQuantity(MENU_TABLE_DC.MEAL_TABLE, rowQuantity);

		cy.getById(MENU_TABLE_DC.MEAL_TABLE)
			.within(() => {
				for (let i = 0; i < rowQuantity; i++) {
					cy.get(table.tableRows).eq(i).within(() => {
						const { partner_categories, name, status } = mealsFromFixture[i];
						// Проверяем отображаемое имя
						cy.getById('table-data-name').should('contain', name);

						// Проверяем отображаемую категорию
						// Берем id категории из фикстуры блюда, и по id ищем объект категории
						// в фикстуре категорий. Далее из объекта берем имя категории
						const categoryId = partner_categories[0];
						const categoryName = categories.categories.find(({ id }) => id === categoryId).display_name;
						cy.getById('table-data-category').should('contain', categoryName);

						// Проверяем отображаемый статус
						cy.getById('table-data-status').should('contain', MEAL_STATUSES[status]);
					});
				}
			});
	}

	// toggles

	/**
	 * Нажимает на чекбокс показывающий/скрывающий скрытые блюда
	 */
	toggleHiddenMeals() {
		checkbox.toggleCheckboxById(MENU_TABLE_DC.FILTER_BY_HIDDEN_MEAL_CHECKBOX);
	}
}
