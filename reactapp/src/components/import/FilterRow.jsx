import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

function FilterRow({ expense, categoriesStore }) {
  return (
    <tr>
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
}

export default observer(FilterRow);

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
