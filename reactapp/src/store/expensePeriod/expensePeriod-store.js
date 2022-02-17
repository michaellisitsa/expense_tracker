import { observable, makeObservable } from "mobx";

class ExpensePeriod {
  description = "";
  dateStart = "";
  dateEnd = "";
  constructor() {
    makeObservable(this, {
      description: observable,
      dateStart: observable,
      dateEnd: observable,
    });
  }
}

export default class ExpensePeriodsStore {}
