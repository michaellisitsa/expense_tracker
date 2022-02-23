import { runInAction, makeAutoObservable, action } from "mobx";
import { CSRFTOKEN } from "../../utils/csrftoken";

class ExpensePeriod {
  id = "";
  description = "";
  dateStart = "";
  dateEnd = "";
  category = "";
  constructor(
    id,
    description,
    dateStart,
    dateEnd,
    category,
    expensePeriodsStore
  ) {
    this.id = id;
    this.description = description;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.category = category;
    this.expensePeriodsStore = expensePeriodsStore;
    makeAutoObservable(this, {
      delete: action,
    });
  }

  delete() {
    this.expensePeriodsStore.deleteExpensePeriod(this);
  }
}

export default class ExpensePeriodsStore {
  status = "idle";
  list = [];
  errorMessage = "";
  constructor() {
    makeAutoObservable(this, {
      deleteExpensePeriod: action,
    });
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
              this.errorMessage = "";
            });
          })
          .catch((err) => {
            runInAction(() => {
              this.status = "failure";
              this.errorMessage = "Failed to Load Expense Periods";
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
        expensePeriod.category,
        this
      )
    );
  }

  deleteExpensePeriod(expensePeriod) {
    switch (this.status) {
      case "success":
        this.status = "loading";
        return fetch(`/api/expenseTimePeriod/${expensePeriod.id}`, {
          method: "delete",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "X-CSRFToken": CSRFTOKEN,
          },
        })
          .then((res) => res.text())
          .then((res) => {
            // QUESTION: Is there any way to improve this selective filtering state storage.
            //           As seen below we have to duplicate setting the info several times.
            //TODO: replace with domain object method for deletion
            // expensePeriodsStore((prev) =>
            //   prev.filter(
            //     (expensePeriod) => expensePeriod.id !== expensePeriodToDelete.id
            //   )
            // );
            runInAction(() => {
              const expensePeriodToDeleteIndex =
                this.list.indexOf(expensePeriod);
              this.list.splice(expensePeriodToDeleteIndex, 1);
              this.status = "success";
            });
          })
          .catch((err) => {
            // Filter out the delete category.
            // Comparison is on the entire object rather than just the id.
            console.log(err.message);
          });
      default:
      // do nothing
    }
  }
}
