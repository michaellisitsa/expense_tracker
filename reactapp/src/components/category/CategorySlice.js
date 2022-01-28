const IDLE_STATUS = "idle";
const LOADING_STATUS = "loading";
const SUCCESS_STATUS = "success";
const FAILURE_STATUS = "failure";

export function fetchCategories() {
  return async function fetchCategoriesThunk(dispatch, getState) {
    dispatch(expensesLoading());
    dispatch(expensesLoading());
    dispatch(expensesLoading());
    const response = await fetch("/api/expenseCategory", { method: "get" });
    const data = await response.json();
    dispatch(expensesLoaded(data.results));
  };
}

export function expensesLoaded(categories) {
  return { type: "expenses/expensesLoaded", payload: categories };
}

export function expensesLoading() {
  return { type: "expenses/expensesLoading" };
}

function fetchIdleCategoryReducer(state, action) {
  switch (action.type) {
    case "expenses/expensesLoading":
      return {
        ...state,
        status: LOADING_STATUS,
      };
    default:
      // So if expensesLoaded is called, it won't perform the action.
      // It enforces that a loading state should be called first.
      return state;
  }
}

function fetchLoadingCategoryReducer(state, action) {
  switch (action.type) {
    case "expenses/expensesLoaded":
      return {
        ...state,
        status: SUCCESS_STATUS,
        entities: action.payload,
      };
    default:
      // So if expenseLoading is called whilst its already in loading it won't do anything.
      return state;
  }
}

function fetchSuccessCategoryReducer(state, action) {
  switch (action.type) {
    case "expenses/expensesLoading":
      return {
        ...state,
        status: LOADING_STATUS,
      };
    default:
      // So if expensesLoaded is called, it won't perform the action.
      return state;
  }
}

function fetchFailureCategoryReducer(state, action) {
  switch (action.type) {
    case "expenses/expensesLoading":
      return {
        ...state,
        status: LOADING_STATUS,
      };
    default:
      // So if expensesLoaded is called, it won't perform the action.
      return state;
  }
}

const CategorySlice = (state = { status: "idle", entities: [] }, action) => {
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
