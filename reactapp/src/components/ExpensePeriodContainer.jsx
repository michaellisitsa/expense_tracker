import { useState, useEffect } from "react";
import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";

function ExpensePeriodContainer(props) {
  const [selectedExpensePeriodId, setSelectedExpensePeriodId] = useState("");
  const [expensePeriods, setExpensePeriods] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/expenseTimePeriod/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        console.table(res.results);
        setExpensePeriods(res.results);
        setIsLoaded(true);
      });
  }, [selectedExpensePeriodId]);

  function handleSelectExpensePeriod(event, id) {
    event.preventDefault();
    props.handleExpensePeriodFormSubmit(id);
  }

  function handleFormSubmit(id) {
    setSelectedExpensePeriodId(id);
  }

  return (
    <div>
      <ExpensePeriodForm
        selectedCategory={props.selectedCategory}
        onSubmit={handleFormSubmit}
      />
      <ExpensePeriodFilter
        expensePeriods={expensePeriods}
        handleSelectExpensePeriod={handleSelectExpensePeriod}
        selectedExpensePeriodId={selectedExpensePeriodId}
        isLoaded={isLoaded}
      />
    </div>
  );
}

export default ExpensePeriodContainer;
