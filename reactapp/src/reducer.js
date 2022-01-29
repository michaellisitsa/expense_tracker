import { combineReducers } from "redux";
import CategorySlice from "./components/category/CategorySlice";
import ExpensePeriodSlice from "./components/expense/crud/ExpensePeriodSlice";
import ExpenseSlice from "./components/expense/crud/ExpenseSlice";

export const rootReducer = combineReducers({
  expenses: ExpenseSlice,
  expensePeriods: ExpensePeriodSlice,
  categories: CategorySlice,
});
