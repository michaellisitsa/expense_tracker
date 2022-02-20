import { runInAction, autorun, makeAutoObservable, action } from "mobx";
import { CSRFTOKEN } from "../../utils/csrftoken";

class Expense {
  id = "";
  description = "";
  cost = "";
  expenseTimePeriod = "";
  constructor(id, description, cost, expenseTimePeriod, expensesStore) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.expenseTimePeriod = expenseTimePeriod;
    this.expensesStore = expensesStore;
    makeAutoObservable(this, {
      delete: action,
    });
  }

  delete() {
    this.expensesStore.deleteExpense(this);
  }
}

export default class ExpensesStore {
  status = "idle";
  list = [];
  errorMessage = "";
  constructor() {
    makeAutoObservable(this, {
      deleteExpense: action,
      loadExpenses: action,
    });
    autorun(() =>
      console.log("Status:", this.status, "List of Expenses", this.list)
    );
  }

  // Fetch all categories from the server
  loadExpenses() {
    switch (this.status) {
      case "idle":
        this.status = "loading";
        return fetch("/api/expense/", {
          method: "get",
        })
          .then((res) => res.json())
          .then((res) => {
            runInAction(() => {
              res.results.map((result) => this.addExpense(result));
              this.status = "success";
            });
          })
          .catch((err) => {
            runInAction(() => {
              this.status = "failure";
              this.errorMessage = "Loading Expenses Failed";
              console.log(this.errorMessage);
            });
          });
      default:
      // do nothing
    }
  }

  addExpense(expense) {
    this.list.push(
      new Expense(
        expense.id,
        expense.description,
        expense.cost,
        expense.expenseTimePeriod,
        this
      )
    );
  }

  deleteExpense(expense) {
    switch (this.status) {
      case "success":
        this.status = "loading";
        return fetch(`/api/expense/${expense.id}`, {
          method: "delete",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "X-CSRFToken": CSRFTOKEN,
          },
        })
          .then((res) => res.text())
          .then((res) => {
            runInAction(() => {
              const expenseToDeleteIndex = this.list.indexOf(expense);
              this.list.splice(expenseToDeleteIndex, 1);
              this.status = "success";
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
      default:
      // do nothing
    }
  }
}
