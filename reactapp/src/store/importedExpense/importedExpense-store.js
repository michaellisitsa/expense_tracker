import { runInAction, makeAutoObservable, action, autorun } from "mobx";
import { CSRFTOKEN } from "../../utils/csrftoken";

class ImportedExpense {
  id = "";
  description = "";
  cost = "";
  date = "";
  category = "";
  constructor(id, description, cost, date, category, importedExpensesStore) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.date = date;
    this.category = category;
    this.importedExpensesStore = importedExpensesStore;
    makeAutoObservable(this, {
      delete: action,
    });
  }

  delete() {
    this.importedExpensesStore.deleteExpense(this);
  }
}

export default class ImportedExpensesStore {
  source = undefined;
  valid = true;
  list = [];
  constructor() {
    makeAutoObservable(this, {
      deleteExpense: action,
      addExpense: action,
    });
    autorun(() => {
      console.log(this.report);
    });
  }

  get report() {
    return `List is now ${
      this.list.length
    } long. The items include ${this.list.map((item) => item?.description)}`;
  }

  addExpense(expense) {
    this.list.push(
      new ImportedExpense(
        expense.id,
        expense.description,
        expense.cost,
        expense.date,
        expense.category,
        this
      )
    );
  }

  deleteExpense(expense) {
    const expenseToDeleteIndex = this.list.indexOf(expense);
    this.list.splice(expenseToDeleteIndex, 1);
  }
}
