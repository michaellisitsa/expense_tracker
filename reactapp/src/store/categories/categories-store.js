import { runInAction, autorun, makeAutoObservable, action } from "mobx";
import { CSRFTOKEN } from "../../utils/csrftoken";

class Category {
  id = "";
  name = "";
  assignee = "";
  budget = "";
  description = "";
  status = "success";
  errorMessage = "";
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

  async delete() {
    this.status = "updating";
    await this.categoriesStore.deleteCategory(this);
    this.status = "success";
  }
}

export default class CategoriesStore {
  status = "idle";
  list = [];
  error = { status: false, message: "" };
  constructor() {
    makeAutoObservable(this, {
      loadCategories: action,
      addToServer: action,
      addCategory: action,
      deleteCategory: action,
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

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  addToServer({ name, assignee, budget, description }) {
    fetch("/api/expenseCategory/", {
      method: "post",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
      body: JSON.stringify({
        name,
        assignee,
        budget,
        description,
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
          this.addCategory(res);
          // console.log(res);
          this.error = { status: false, message: "" };
        });
      })
      .catch((err) => {
        this.error = { status: true, message: err };
      });
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
        // this.status = "loading";
        return fetch(`/api/expenseCategory/${category.id}`, {
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
              // this.status = "success";
            });
          })
          .catch((err) => {
            category.status = "failure";
            category.errorMessage = "Delete Failed";
          });
      default:
      // do nothing
    }
  }
}
