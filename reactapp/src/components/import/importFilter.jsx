import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import FilterRow from "./FilterRow";

function ImportFilter({ importedExpensesStore, categoriesStore }) {
  const params = useParams();
  const [assignedExpenses, setAssignedExpenses] = React.useState([]);
  // Load initial categories, and set the selectory category

  React.useEffect(() => {
    async function loadData() {
      await categoriesStore.loadCategories();
      // const categoryFromParams = categoriesStore.list.find(
      //   (result) => result.id === parseFloat(params.id)
      // );
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
          {importedExpensesStore.list.map((expense) => (
            <FilterRow
              key={expense.id}
              expense={expense}
              categoriesStore={categoriesStore}
            />
          ))}
        </tbody>
      </ImportTable>
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
