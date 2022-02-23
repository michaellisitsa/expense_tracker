import CategoriesStore from "./categories/categories-store";
import ExpensesStore from "./expense/expense-store";
import ExpensePeriodsStore from "./expensePeriod/expensePeriod-store";

class RootStore {
  categoriesStore;
  expensesStore;
  expensePeriodsStore;
  constructor() {
    this.categoriesStore = new CategoriesStore();
    this.expensesStore = new ExpensesStore();
    this.expensePeriodsStore = new ExpensePeriodsStore();
  }
}

export default RootStore;
