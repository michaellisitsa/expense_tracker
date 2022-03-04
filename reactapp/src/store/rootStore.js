import CategoriesStore from "./categories/categories-store";
import ExpensesStore from "./expense/expense-store";
import ExpensePeriodsStore from "./expensePeriod/expensePeriod-store";
import ImportedExpensesStore from "./importedExpense/importedExpense-store";

class RootStore {
  categoriesStore;
  expensesStore;
  expensePeriodsStore;
  importedExpensesStore;
  constructor() {
    this.categoriesStore = new CategoriesStore();
    this.expensesStore = new ExpensesStore();
    this.expensePeriodsStore = new ExpensePeriodsStore();
    this.importedExpensesStore = new ImportedExpensesStore();
  }
}

export default RootStore;
