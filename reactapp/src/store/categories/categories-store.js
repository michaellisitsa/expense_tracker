import { runInAction, autorun, makeAutoObservable, action } from "mobx";
import { CSRFTOKEN } from "../../utils/csrftoken";

class Category {
  id = "";
  name = "";
  assignee = "";
  budget = "";
  description = "";
  constructor(id, name, assignee, budget, description, categoriesStore) {
    this.id = id;
    this.name = name;
    this.assignee = assignee;
    this.budget = budget;
    this.description = description;
    this.categoriesStore = categoriesStore;
    makeAutoObservable(this, {
      delete: action,
    });
  }

  delete() {
    this.categoriesStore.deleteCategory(this);
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
        category.description,
        this
      )
    );
  }

  deleteCategory(category) {
    switch (this.status) {
      case "success":
        this.status = "loading";
        fetch(`/api/expenseCategory/${category.id}`, {
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
            // categoriesStore((prev) =>
            //   prev.filter(
            //     (category) => category.id !== categoryToDelete.id
            //   )
            // );
            runInAction(() => {
              const categoryToDeleteIndex = this.list.indexOf(category);
              this.list.splice(categoryToDeleteIndex, 1);
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
