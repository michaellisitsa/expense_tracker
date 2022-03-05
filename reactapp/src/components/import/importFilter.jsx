import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

function ImportFilter({ importedExpensesStore, categoriesStore }) {
  const params = useParams();
  const { source, list, valid } = importedExpensesStore;
  const [assignedExpenses, setAssignedExpenses] = React.useState([]);
  // Load initial categories, and set the selectory category

  React.useEffect(() => {
    async function loadData() {
      await categoriesStore.loadCategories();
      const categoryFromParams = categoriesStore.list.find(
        (result) => result.id === parseFloat(params.id)
      );
      // if (categoryFromParams) {
      //   setSelectedCategory(categoryFromParams);
      // } else {

      // }
    }
    loadData();
  }, []);

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
      <ImportTable>
        <caption>Our products</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>In Stock</th>
          </tr>
        </thead>
        <tbody>
          {list.map((expense, index) => {
            const expenseId = source === "ofx" ? expense.id : index;
            const assigned = assignedExpenses.find(
              (expenseToFind) => expenseId === expenseToFind
            );
            return (
              <tr key={expenseId}>
                <DataCell>{expense.description}</DataCell>
                <DataCell>{expense.cost}</DataCell>
                <DataCell>{expense.date.toLocaleDateString()}</DataCell>
                <DataCell editable>
                  <select
                    className="category-select__select"
                    value={expense.category}
                    onChange={(event) => {
                      console.log(event.target.value);
                      expense.setCategory(parseFloat(event.target.value));
                    }}
                  >
                    <optgroup>
                      <option disabled selected value="Select..."></option>
                      {categoriesStore.list.map((category) => (
                        <option
                          className="category-select__option"
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </DataCell>
                <DeleteBtn onClick={() => expense.delete()}>X</DeleteBtn>
              </tr>
            );
          })}
        </tbody>
      </ImportTable>

      <ol>
        <h2>Assigned Expenses</h2>
        {list.map((expense, index) => {
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

export default observer(ImportFilter);

const ColumnsWrapper = styled.div`
  display: flex;
  flex-direction: row;

  > ol {
    width: 49%;
  }
`;

// TO DELETE
const ExpenseItem = styled.li`
  ${(props) => props.valid || "color: grey; cursor: not-allowed"}
`;

const ImportTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  tr:hover {
    background-color: lightgrey;
  }
`;

const DataCell = styled.td`
  &:hover {
    background-color: ${(props) => (props.editable ? "" : "white")};
  }
`;

const DeleteBtn = styled.td`
  font-size: 16px;
  font-weight: 400px;
  color: lightcoral;
  box-sizing: border-box;
  border: 3px solid rgb(0, 0, 0, 0);

  &:hover {
    font-size: 16px;
    font-weight: 700px;
    background-color: red;
    color: white;
    cursor: pointer;
  }

  &:active {
    border: 3px solid lightgrey;
  }
`;
