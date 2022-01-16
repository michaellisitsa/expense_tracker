import { useState, createContext } from "react";
import CRUD from "./crud/CRUD";
import Visualisation from "./visualisation/Visualisation";
import "./ExpensePage.css";
import Chart from "./visualisation/Chart";
import SummaryTable from "./visualisation/SummaryTable";
import ExpenseProvider from "./ExpenseProvider";
import ExpenseContainer from "./crud/ExpenseContainer";
import CategorySelect from "./crud/CategorySelect";
import ExpensePeriodContainer from "./crud/ExpensePeriodContainer";

function ExpensePage() {
  return (
    <ExpenseProvider className="wrapper">
      <Visualisation>
        <SummaryTable />
        <Chart />
      </Visualisation>
      <CRUD>
        <section className="expensePeriods-container">
          <CategorySelect />
          <ExpensePeriodContainer />
        </section>
        <ExpenseContainer />
      </CRUD>
    </ExpenseProvider>
  );
}

export default ExpensePage;
