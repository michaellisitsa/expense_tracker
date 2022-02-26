import { runInAction, makeAutoObservable, action } from "mobx";
import { CSRFTOKEN } from "../../utils/csrftoken";

class Expense {
  id = "";
  description = "";
  cost = "";
  date = "";
  expenseTimePeriod = "";
  constructor(id, description, cost, date, expenseTimePeriod, expensesStore) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.date = date;
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

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  addToServer({ description, cost, date, expenseTimePeriod }) {
    fetch("/api/expense/", {
      method: "post",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
      body: JSON.stringify({
        description,
        cost,
        date,
        expenseTimePeriod,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((res) => {
        runInAction(() => {
          this.addExpense(res);
          this.status = "success";
          this.errorMessage = "";
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.status = "failure";
          this.errorMessage = "accessed catch statement";
        });
      });
  }

  addMultipleToServer({ description, cost, date, expenseTimePeriod }) {
    fetch("/api/multipleExpenses/", {
      method: "post",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
      body: JSON.stringify({
        expenses: [
          {
            description,
            cost,
            date,
            expenseTimePeriod,
          },
          {
            description,
            cost,
            date,
            expenseTimePeriod,
          },
        ],
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((res) => {
        runInAction(() => {
          this.addExpense(res);
          this.status = "success";
          this.errorMessage = "";
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.status = "failure";
          this.errorMessage = "accessed catch statement";
        });
      });
  }

  addExpense(expense) {
    this.list.push(
      new Expense(
        expense.id,
        expense.description,
        expense.cost,
        expense.date,
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
