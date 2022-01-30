const IDLE_STATUS = "idle";
const LOADING_STATUS = "loading";
const SUCCESS_STATUS = "success";
const FAILURE_STATUS = "failure";

const initialState = { status: "idle", selectedId: null, entities: [] };

export const selectCategoriesStatus = (state) => state.categories.status;

export function fetchCategories() {
  return async function fetchCategoriesThunk(dispatch, getState) {
    dispatch(categoriesLoading());
    try {
      const response = await fetch("/api/expenseCategory", { method: "get" });
      const data = await response.json();
      dispatch(categoriesLoaded(data.results));
    } catch (err) {
      console.log(err.message);
      dispatch(categoriesFailedToLoad(err.message));
    }
  };
}

export function categoriesFailedToLoad(categories) {
  return { type: "categories/categoriesFailedToLoad" };
}

export function categoriesLoaded(categories) {
  return { type: "categories/categoriesLoaded", payload: categories };
}

export function categoriesLoading() {
  return { type: "categories/categoriesLoading" };
}

export function updateSelectedCategory(categoryId) {
  return { type: "categories/updateSelectedCategory", payload: categoryId };
}

function fetchIdleCategoryReducer(state, action) {
  switch (action.type) {
    case "categories/categoriesLoading":
      return {
        ...state,
        status: LOADING_STATUS,
      };
    default:
      // So if categoriesLoaded is called, it won't perform the action.
      // It enforces that a loading state should be called first.
      return state;
  }
}

function fetchLoadingCategoryReducer(state, action) {
  switch (action.type) {
    case "categories/categoriesLoaded":
      return {
        ...state,
        status: SUCCESS_STATUS,
        entities: action.payload,
      };
    case "categories/categoriesFailedToLoad":
      return {
        ...state,
        status: FAILURE_STATUS,
      };
    default:
      // So if expenseLoading is called whilst its already in loading it won't do anything.
      return state;
  }
}

function fetchSuccessCategoryReducer(state, action) {
  switch (action.type) {
    case "categories/categoriesLoading":
      return {
        ...state,
        status: LOADING_STATUS,
      };
    case "categories/updateSelectedCategory":
      // If the selection doesn't exist within the list of categories, don't set it.
      if (state.entities.length !== 0) {
        if (state.entities.find((category) => category.id === action.payload)) {
          return {
            ...state,
            selectedId: action.payload,
          };
        }
      }
      return state;
    default:
      // So if categoriesLoaded is called, it won't perform the action.
      return state;
  }
}

function fetchFailureCategoryReducer(state, action) {
  switch (action.type) {
    case "categories/categoriesLoading":
      return {
        ...state,
        status: LOADING_STATUS,
      };
    default:
      // So if categoriesLoaded is called, it won't perform the action.
      return state;
  }
}

const CategorySlice = (state = initialState, action) => {
  switch (state.status) {
    case IDLE_STATUS:
      return fetchIdleCategoryReducer(state, action);
    case LOADING_STATUS:
      return fetchLoadingCategoryReducer(state, action);
    case SUCCESS_STATUS:
      return fetchSuccessCategoryReducer(state, action);
    case FAILURE_STATUS:
      return fetchFailureCategoryReducer(state, action);
    default:
      // this should never be reached
      return state;
  }
};

export default CategorySlice;
