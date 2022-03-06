import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

function FilterRow({ expense, categoriesStore, editMode }) {
  function handleToggleSelected() {
    if (editMode) {
      expense.toggleSelected();
    }
  }
  return (
    <TableRow
      editMode={editMode}
      expense={expense}
      onClick={handleToggleSelected}
    >
      <DataCell editable>{expense.description}</DataCell>
      <DataCell editable>{expense.cost}</DataCell>
      <DataCell editable>{expense.date.toLocaleDateString()}</DataCell>
      <DataCell>
        <select
          value={expense.category}
          onChange={(event) => {
            console.log(event.target.value);
            expense.setCategory(parseFloat(event.target.value));
          }}
        >
          <optgroup>
            <option disabled selected value="Select..."></option>
            {categoriesStore.list.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </optgroup>
        </select>
      </DataCell>
      <DeleteBtn onClick={() => expense.delete()}>X</DeleteBtn>
    </TableRow>
  );
}

export default observer(FilterRow);

const TableRow = observer(styled.tr`
  background-color: ${(props) =>
    props.editMode && props.expense.selected ? "lightblue" : ""};

  &:hover {
    background-color: lightgrey;
  }
`);

const DataCell = styled.td`
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: ${(props) => (props.editable ? "white" : "")};
  }

  select {
    border: solid 1px #e0e6ed;
    border-radius: 0.3em;
    padding: 0.5em 1em;
    width: auto;
  }
`;

const DeleteBtn = styled.td`
  text-align: center;
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
