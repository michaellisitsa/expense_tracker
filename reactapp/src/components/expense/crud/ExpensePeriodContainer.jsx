import { useState, useEffect } from "react";
import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";
import { CSRFTOKEN } from "../../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import "./ExpensePeriodContainer.css";
import { observer } from "mobx-react-lite";

// Component takes care of posting/rendering expense periods
// Also it renders the slider to filter the expense periods by time range
// Each expense period has a FK category which is passed down and filters the inputs
// as well as appended when form is submitted.
function ExpensePeriodContainer({
  selectedExpensePeriod,
  selectedCategory,
  setSelectedExpensePeriod,
  expensePeriodsStore,
  // setExpensePeriods,
}) {
  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.

  // The slider component will send back a filtered list of expense periods
  // This function sets these in the state so that it can be passed down to the xxxFilter component.
  // function handleSliderChange(ExpensePeriodsByDate) {
  //   setFilteredExpensePeriodsByDateRange(ExpensePeriodsByDate);
  // }

  return (
    <div className="expensePeriods">
      <h1>Expense Period:</h1>
      {/* <Slider
        className="categorySelect__Slider"
        onSliderChange={handleSliderChange}
        filteredExpensePeriods={filteredExpensePeriods}
      /> */}
      <ExpensePeriodForm
        selectedCategory={selectedCategory}
        setSelectedExpensePeriod={setSelectedExpensePeriod}
        expensePeriodsStore={expensePeriodsStore}
      />
      <ExpensePeriodFilter
        selectedCategory={selectedCategory}
        expensePeriodsStore={expensePeriodsStore}
        selectedExpensePeriod={selectedExpensePeriod}
        setSelectedExpensePeriod={setSelectedExpensePeriod}
      />
    </div>
  );
}

export default observer(ExpensePeriodContainer);
