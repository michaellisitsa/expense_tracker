import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import PrimaryButton from "../../uiKit/button/PrimaryButton";
import FilterRow from "./FilterRow";

function ImportFilter({ importedExpensesStore, categoriesStore }) {
  const [editMode, setEditMode] = React.useState(false);

  // Load initial categories, and set the selectory category
  React.useEffect(() => {
    async function loadData() {
      await categoriesStore.loadCategories();
    }
    loadData();
  }, []);

  function handleEditModeToggle() {
    importedExpensesStore.clearAllSelected();
    setEditMode((bool) => !bool);
  }

  return (
    <div>
      <EditRow>
        <PrimaryButton onClick={handleEditModeToggle} selected={editMode}>
          Edit Mode
        </PrimaryButton>
      </EditRow>
      <ImportTable>
        <caption>Imported Expenses</caption>
        <thead>
          <tr>
            <th>Description</th>
            <th>Cost</th>
            <th>Date</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {importedExpensesStore.list.map((expense) => (
            <FilterRow
              editMode={editMode}
              key={expense.id}
              expense={expense}
              categoriesStore={categoriesStore}
            />
          ))}
        </tbody>
      </ImportTable>
    </div>
  );
}

export default observer(ImportFilter);

const EditRow = styled.div`
  display: flex;
  gap: 1em;
  margin: 0 1em;
`;

const ImportTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  caption {
    font-size: 32px;
  }

  th {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
`;
