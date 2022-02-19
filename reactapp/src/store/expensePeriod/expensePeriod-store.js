import { runInAction, autorun, makeAutoObservable } from "mobx";

class ExpensePeriod {
  id = "";
  description = "";
  dateStart = "";
  dateEnd = "";
  category = "";
  constructor(id, description, dateStart, dateEnd, category) {
    this.id = id;
    this.description = description;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.category = category;
    makeAutoObservable(this);
  }
}

export default class ExpensePeriodsStore {
  status = "idle";
  list = [];
  constructor() {
    makeAutoObservable(this);
    autorun(() =>
      console.log("Status:", this.status, "List of Expense Periods", this.list)
    );
  }

  // Fetch all categories from the server
  loadExpensePeriods() {
    switch (this.status) {
      case "idle":
        this.status = "loading";
        return fetch("/api/expenseTimePeriod/", {
          method: "get",
        })
          .then((res) => res.json())
          .then((res) => {
            runInAction(() => {
              res.results.map((result) => this.addExpensePeriod(result));
              this.status = "success";
            });
          });
      default:
      // do nothing
    }
  }

  addExpensePeriod(expensePeriod) {
    this.list.push(
      new ExpensePeriod(
        expensePeriod.id,
        expensePeriod.description,
        expensePeriod.dateStart,
        expensePeriod.dateEnd,
        expensePeriod.category
      )
    );
  }
}
