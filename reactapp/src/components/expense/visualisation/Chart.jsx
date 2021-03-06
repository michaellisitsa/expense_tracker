import "./Chart.css";
import React, { useRef, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  LineElement,
  LineController,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
// import {
//   getDatasetAtEvent,
//   getElementAtEvent,
//   getElementsAtEvent,
// } from "react-chartjs-2"; // for logging any interactions with charts
import { summariseTimePeriod } from "./summariseTimePeriod";
import { subDays, eachMonthOfInterval, format, endOfMonth } from "date-fns";
import { formatNumber } from "../../../utils/formatNumber";
import { observer } from "mobx-react-lite";
ChartJS.register(
  LinearScale,
  CategoryScale,
  LineElement,
  LineController,
  PointElement,
  Legend,
  Tooltip
);

// Configuration options
const options = {
  legend: {
    display: false,
  },
  spanGaps: true,
  response: true, // responds to size of page
  maintainAspectRatio: false, // when scaling, stretch width not height respectively
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return "$" + formatNumber(value);
        },
      }, // some magic from https://stackoverflow.com/a/44614470 to format y-axis with cost
      beginAtZero: true,
      title: {
        display: true,
        text: "Expense (month)",
      },
    },
  },
  elements: {
    line: {
      fill: true,
    },
  },
};

// Presents a tooltip with the label of the line, and the X-value and Y-value
// Could use this to take the median date of each range.
// Alternatively will need to discretise the moving average calculations for each week / month.
// Therefore could just draw a point for each moving average point.
// To simplify initially could do a fixed 12 month timeline
// Then show a vertical strip for areas of the graph that actually have data.
function Chart({ selectedCategory, expensePeriodsStore, expensesStore }) {
  // const [filteredExpensePeriods, setFilteredExpensePeriods] = useState([]);
  // const [filteredExpenses, setFilteredExpenses] = useState([]);
  const expensePeriods = expensePeriodsStore.list;
  const expenses = expensesStore.list;

  let filteredExpensePeriods = [];
  let filteredExpenses = [];
  if (selectedCategory?.id) {
    filteredExpensePeriods = [...expensePeriods].filter(
      (expensePeriod) => expensePeriod.category === selectedCategory.id
    );
    filteredExpenses = [...expenses].filter((expense) =>
      filteredExpensePeriods.find(
        (filteredExpensePeriod) =>
          filteredExpensePeriod.id === expense.expenseTimePeriod
      )
    );
  }

  // Labels for x-axis.
  // TODO: Create an array of elements for the total extent of dates
  const currentDate = new Date();
  const prevDate = subDays(currentDate, 30 * 12);

  const monthStartDates = eachMonthOfInterval({
    start: prevDate,
    end: currentDate,
  });

  const monthEndDates = monthStartDates.map((month) => endOfMonth(month));

  const labels = monthStartDates.map((month) => format(month, "MMM yy"));

  const monthlyAverages = monthStartDates.map((startDate, index) =>
    summariseTimePeriod(
      filteredExpensePeriods,
      filteredExpenses,
      startDate,
      monthEndDates[index]
    )
  );

  // Data for the
  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "Expense",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        fill: true,
        data: monthlyAverages,
      },
      {
        type: "line",
        label: "Budget",
        borderColor: "rgb(0, 128, 0)",
        pointRadius: 0,
        backgroundColor: "rgb(0, 128, 0)",
        pointHoverRadius: 0,
        borderWidth: 2,
        fillColor: "rgb(75, 192, 192)",
        fill: true,
        data: Array(monthStartDates?.length).fill(selectedCategory?.budget), // get y-axis data from moving average expenditure
      },
    ],
  };

  // Below methods are used when logging interaction events to the console.

  // const printDatasetAtEvent = (dataset) => {
  //   if (!dataset.length) return;

  //   const datasetIndex = dataset[0].datasetIndex;

  //   // console.log(data.datasets[datasetIndex].label);
  // };

  // const printElementAtEvent = (element) => {
  //   if (!element.length) return;

  //   const { datasetIndex, index } = element[0];

  //   // console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
  // };

  // const printElementsAtEvent = (elements) => {
  //   if (!elements.length) return;

  //   // console.log(elements.length);
  // };

  const chartRef = useRef(null);

  const onClick = (event) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }

    // printDatasetAtEvent(getDatasetAtEvent(chart, event)); // logs the dataset (label of line)
    // printElementAtEvent(getElementAtEvent(chart, event)); // logs the x, y values
    // printElementsAtEvent(getElementsAtEvent(chart, event)); // logs "1", maybe the dataset number
  };

  return (
    <div className="chart-container">
      <ReactChart
        ref={chartRef}
        onClick={onClick}
        options={options}
        data={data}
      />
    </div>
  );
}

export default observer(Chart);
