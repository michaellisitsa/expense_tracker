import { createContext, useContext, useState } from "react";

const ExpenseContext = createContext();

function ExpenseProvider({ children }) {
  // The selectedCategory needs to be known at the ExpensePage (top) level
  // because it is used for visualisation.
  // TODO - to display all categories, we might need to also pass up categories array
  const [selectedCategory, setSelectedCategory] = useState({});
  // The below state is passed up from xxxContainer to allow responsive visualisations.
  // The entries selected for each table are tracked in top-level containers.
  // This allows passing data down to foreign key relations, for auto-filling
  // the FK field in forms or filtering by that foreign key.
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState({});
  const [expensePeriods, setExpensePeriods] = useState([]);
  const [expenses, setExpenses] = useState([]);

  return (
    <ExpenseContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedExpensePeriod,
        setSelectedExpensePeriod,
        expensePeriods,
        setExpensePeriods,
        expenses,
        setExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

function useExpenseContext() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("You need to wrap component in ExpenseContext Provider");
  }
  return context;
}

export { useExpenseContext };
export default ExpenseProvider;
