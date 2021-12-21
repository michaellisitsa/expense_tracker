import "./Chart.css";
import React, { MouseEvent, useRef } from "react";
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
import {
  Chart as ReactChart,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "react-chartjs-2";
import { summariseTimePeriod } from "./summariseTimePeriod";

ChartJS.register(
  LinearScale,
  CategoryScale,
  LineElement,
  LineController,
  PointElement,
  Legend,
  Tooltip
);

// Presents a tooltip with the label of the line, and the X-value and Y-value
// Could use this to take the median date of each range.
// Alternatively will need to discretise the moving average calculations for each week / month.
// Therefore could just draw a point for each moving average point.
// To simplify initially could do a fixed 12 month timeline
// Then show a vertical strip for areas of the graph that actually have data.
function Chart(props) {
  const { selectedCategory, expensePeriods, expenses } = props;
  // Below methods are to print to console the properties of the clicked point.
  // We could use these to instead update something in future. Will leave in to plot to console.

  // Configuration options
  const options = {
    legend: {
      display: false,
    },
    response: true, // responds to size of page
    maintainAspectRatio: false, // when scaling, stretch width not height respectively
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Labels for x-axis.
  // TODO: Create an array of elements for the total extent of dates

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "August",
  ];

  //
  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "Expenditure (Moving Average)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        fill: false,
        data: [65, 59, 80, 81, 56, 80, 30], // get y-axis data from moving average expenditure
      },
      {
        type: "line",
        label: "Budget",
        borderColor: "rgb(0, 128, 0)",
        borderWidth: 1,
        fill: false,
        data: Array(7).fill(selectedCategory.budget), // get y-axis data from moving average expenditure
      },
    ],
  };

  const printDatasetAtEvent = (dataset) => {
    if (!dataset.length) return;

    const datasetIndex = dataset[0].datasetIndex;

    console.log(data.datasets[datasetIndex].label);
  };

  const printElementAtEvent = (element) => {
    if (!element.length) return;

    const { datasetIndex, index } = element[0];

    console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
  };

  const printElementsAtEvent = (elements) => {
    if (!elements.length) return;

    console.log(elements.length);
  };

  const chartRef = useRef(null);

  const onClick = (event) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }

    printDatasetAtEvent(getDatasetAtEvent(chart, event)); // logs the dataset (label of line)
    printElementAtEvent(getElementAtEvent(chart, event)); // logs the x, y values
    printElementsAtEvent(getElementsAtEvent(chart, event)); // logs "1", maybe the dataset number
  };

  return (
    <div className="graph">
      <ReactChart
        ref={chartRef}
        onClick={onClick}
        options={options}
        data={data}
      />
    </div>
  );
}

export default Chart;
