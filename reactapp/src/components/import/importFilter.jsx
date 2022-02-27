import React from "react";
import styled from "styled-components";

function ImportFilter({ uploadedExpenses }) {
  const { status, errorMessages, source, entities } = uploadedExpenses;
  const isLoaded = status === "success";
  const [assignedExpenses, setAssignedExpenses] = React.useState([]);

  function handleSelectExpense(event, expenseId) {
    setAssignedExpenses((prev) => [...prev, expenseId]);
  }

  function handleUnselectExpense(event, expenseId) {
    setAssignedExpenses((prev) =>
      prev.filter((prevId) => prevId !== expenseId)
    );
  }

  return (
    <ColumnsWrapper>
      <ol>
        <h2>Expenses to Import</h2>
        {isLoaded &&
          entities.map((expense, index) => {
            const expenseId = source === "ofx" ? expense.id : index;
            const assigned = assignedExpenses.find(
              (expenseToFind) => expenseId === expenseToFind
            );
            if (assigned) {
              return null;
            }
            return (
              <li
                onClick={(event) => handleSelectExpense(event, expenseId)}
                key={expenseId}
              >
                {expense.description}: {expense.date.toLocaleDateString()}
              </li>
            );
          })}
      </ol>
      <ol>
        <h2>Assigned Expenses</h2>
        {isLoaded &&
          entities.map((expense, index) => {
            const expenseId = source === "ofx" ? expense.id : index;
            const assigned = assignedExpenses.find(
              (expenseToFind) => expenseId === expenseToFind
            );
            if (!assigned) {
              return null;
            }
            return (
              <li
                onClick={(event) => handleUnselectExpense(event, expenseId)}
                key={expenseId}
              >
                {expense.description}: {expense.date.toLocaleDateString()}
              </li>
            );
          })}
      </ol>
    </ColumnsWrapper>
  );
}

export default ImportFilter;

const ColumnsWrapper = styled.div`
  display: flex;
  flex-direction: row;

  > ol {
    width: 49%;
  }
`;
