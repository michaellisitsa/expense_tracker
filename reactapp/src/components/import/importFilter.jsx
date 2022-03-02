import React from "react";
import styled from "styled-components";

function ImportFilter({ uploadedExpenses }) {
  const { source, entities } = uploadedExpenses;
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
        {entities.map((expense, index) => {
          const expenseId = source === "ofx" ? expense.id : index;
          const assigned = assignedExpenses.find(
            (expenseToFind) => expenseId === expenseToFind
          );
          if (assigned) {
            return null;
          }
          return (
            <ExpenseItem
              valid={expense.valid}
              onClick={(event) => handleSelectExpense(event, expenseId)}
              key={expenseId}
            >
              {expense.description}: ${expense.cost} ={">"}
              {expense.date.toLocaleDateString()}
            </ExpenseItem>
          );
        })}
      </ol>
      <ol>
        <h2>Assigned Expenses</h2>
        {entities.map((expense, index) => {
          const expenseId = source === "ofx" ? expense.id : index;
          const assigned = assignedExpenses.find(
            (expenseToFind) => expenseId === expenseToFind
          );
          if (!assigned) {
            return null;
          }
          return (
            <ExpenseItem
              valid={expense.valid}
              onClick={(event) => handleUnselectExpense(event, expenseId)}
              key={expenseId}
            >
              {expense.description}: {expense.date.toLocaleDateString()}
            </ExpenseItem>
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

const ExpenseItem = styled.li`
  ${(props) => props.valid || "color: grey; cursor: not-allowed"}
`;
