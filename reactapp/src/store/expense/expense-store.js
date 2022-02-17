import { observable, makeObservable } from "mobx";

class Expense {
  description = "";
  cost = "";
  constructor() {
    makeObservable(this, {
      description: observable,
      cost: observable,
    });
  }
}

export default class ExpensesStore {}
