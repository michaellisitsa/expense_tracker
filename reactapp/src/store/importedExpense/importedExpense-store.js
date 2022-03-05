import { runInAction, makeAutoObservable, action, autorun } from "mobx";
import { CSRFTOKEN } from "../../utils/csrftoken";
import { nextFriday, parse } from "date-fns";

class ImportedExpense {
  id = "";
  description = "";
  cost = "";
  date = "";
  category = "Select...";
  valid = false;
  constructor(id, description, cost, date, valid, importedExpensesStore) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.date = date;
    this.valid = true;
    this.importedExpensesStore = importedExpensesStore;
    makeAutoObservable(this, {
      delete: action,
      setCategory: action,
    });
  }

  delete() {
    this.importedExpensesStore.deleteExpense(this);
  }

  setCategory(categoryId) {
    this.category = categoryId;
  }
}

export default class ImportedExpensesStore {
  source = undefined;
  valid = true;
  list = [];
  constructor() {
    makeAutoObservable(this, {
      deleteExpense: action,
      importOfxExpenses: action,
      importCsvExpenses: action,
      addExpense: action,
    });
  }

  get nextId() {
    if (this.list.length === 0) {
      return 1;
    }
    return Math.max(...this.list.map((expense) => expense.id)) + 1;
  }

  importOfxExpenses(expenses) {
    this.source = "ofx";
    expenses.forEach((expense) => {
      this.addExpense({
        id: expense.FITID,
        description: expense.MEMO,
        cost: expense.TRNAMT,
        date: parse(expense.DTUSER, "yyyyMMdd", new Date()),
        valid: expense.valid,
      });
    });
  }

  importCsvExpenses(expenses) {
    this.source = "csv";
    expenses.forEach((expense) => {
      this.addExpense({
        id: this.nextId,
        description: expense.description,
        cost: expense.cost,
        date: expense.date,
        valid: true,
      });
    });
  }

  addExpense(expense) {
    this.list.push(
      new ImportedExpense(
        expense.id,
        expense.description,
        expense.cost,
        expense.date,
        expense.valid,
        this
      )
    );
  }

  deleteExpense(expense) {
    const expenseToDeleteIndex = this.list.indexOf(expense);
    this.list.splice(expenseToDeleteIndex, 1);
  }
}
