import { observable, makeObservable, runInAction, autorun, action } from "mobx";

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
    makeObservable(this, {
      id: observable,
      name: observable,
      assignee: observable,
      budget: observable,
      description: observable,
    });
  }
}

export default class CategoriesStore {
  status = "idle";
  list = [];
  constructor() {
    makeObservable(this, {
      list: observable,
      status: observable,
      loadCategories: action,
      addCategory: action,
    });
    autorun(() =>
      console.log("Status:", this.status, "List of Categories", this.list)
    );
  }

  // Fetch all categories from the server
  loadCategories() {
    switch (this.status) {
      case "idle":
        this.status = "loading";
        fetch("/api/expenseCategory/", {
          method: "get",
        })
          .then((res) => res.json())
          .then((res) => {
            runInAction(() => {
              res.results.map((result) => this.addCategory(result));
              this.status = "success";
            });
          });
        break;
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
