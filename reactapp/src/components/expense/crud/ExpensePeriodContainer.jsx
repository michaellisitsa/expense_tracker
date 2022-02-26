import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";
import "./ExpensePeriodContainer.css";

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
  const navigate = useNavigate();

  // const [csvfile, setCsvfile] = React.useState();
  // function handleChange(event) {
  //   setCsvfile = event.target.files[0];
  //   readString(csvString, {
  //     worker: true,
  //     complete: (results) => {
  //       console.log('---------------------------');
  //       console.log(results);
  //       console.log('---------------------------');
  //     },
  //   });
  // }

  // function importCSV() {
  //   Papa.parse(csvfile, {
  //     complete: updateData,
  //     header: true,
  //   });
  // }

  // function updateData(result) {
  //   var data = result.data;
  //   console.log(data);
  // }

  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.

  // The slider component will send back a filtered list of expense periods
  // This function sets these in the state so that it can be passed down to the xxxFilter component.
  // function handleSliderChange(ExpensePeriodsByDate) {
  //   setFilteredExpensePeriodsByDateRange(ExpensePeriodsByDate);
  // }

  return (
    <div className="expensePeriods">
      <button onClick={() => navigate(`/import/`)}>Import from CSV</button>
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
