import { runInAction, autorun, makeAutoObservable } from "mobx";

class Category {
  id = "";
  name = "";
  assignee = "";
  budget = "";
  description = "";
  constructor(id, name, assignee, budget, description) {
    this.id = id;
    this.name = name;
    this.assignee = assignee;
    this.budget = budget;
    this.description = description;
    makeAutoObservable(this);
  }
}

export default class CategoriesStore {
  status = "idle";
  list = [];
  constructor() {
    makeAutoObservable(this);
    autorun(() =>
      console.log("Status:", this.status, "List of Categories", this.list)
    );
  }

  // Fetch all categories from the server
  loadCategories() {
    switch (this.status) {
      case "idle":
        this.status = "loading";
        return fetch("/api/expenseCategory/", {
          method: "get",
        })
          .then((res) => res.json())
          .then((res) => {
            runInAction(() => {
              res.results.map((result) => this.addCategory(result));
              this.status = "success";
            });
          });
      default:
      // do nothing
    }
  }

  addCategory(category) {
    this.list.push(
      new Category(
        category.id,
        category.name,
        category.assignee,
        category.budget,
        category.description
      )
    );
  }
}
