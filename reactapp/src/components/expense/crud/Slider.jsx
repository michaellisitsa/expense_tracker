import { useState, useEffect } from "react";
import { format, set, differenceInDays, addDays } from "date-fns";
import TimeRange from "react-timeline-range-slider";
import "./Slider.css";

const now = new Date();
const getDaysFromToday = (days = 0) => addDays(now, days);

function Slider(props) {
  const [selectedInterval, setSelectedInterval] = useState([]);
  const [timelineInterval, setTimelineInterval] = useState([]);

  const [filteredExpensePeriodIntervals, setfilteredExpensePeriodIntervals] =
    useState([]);

  // Map all expense Periods onto timeline
  // Adjust the extents of the timeline
  useEffect(() => {
    const filteredIntervals = props.filteredExpensePeriods.map((period) => {
      return {
        start: new Date(period.dateStart + "T00:00"),
        end: new Date(period.dateEnd + "T00:00"),
      };
    });
    setfilteredExpensePeriodIntervals(filteredIntervals);

    // Find extents of expense periods
    if (filteredIntervals.length !== 0) {
      // Find the date extents of all filteredExpensePeriods
      const maxDate = new Date(
        Math.max(...filteredIntervals.map((t) => t.end))
      );
      const minDate = new Date(
        Math.min(...filteredIntervals.map((t) => t.start))
      );
      // Whenever filteredExpensePeriods changes, user has selected a different category or posted a form
      // In both cases, the timeline is re-adjusted to the new extent of periods.
      setTimelineInterval([minDate, maxDate]);
      setSelectedInterval([minDate, maxDate]);
    } else {
      // Reset timeline when expense periods array is empty
      setSelectedInterval([]);
      setTimelineInterval([]);
    }
  }, [props.filteredExpensePeriods]);

  // When changing selected extents, send new filteredByDate list up to Container component
  const onChangeCallback = (selectedInterval) => {
    const [selectedDateStart, selectedDateEnd] = selectedInterval;
    setSelectedInterval(selectedInterval);
    const filteredByDate = props.filteredExpensePeriods.filter(
      (expensePeriod) =>
        new Date(expensePeriod.dateStart + "T00:00") <= selectedDateEnd &&
        new Date(expensePeriod.dateEnd + "T00:00") >= selectedDateStart
    );
    // Send the filtered list of expense periods back up to the ExpensePeriodContainer component.
    props.onSliderChange(filteredByDate);
  };

  return (
    <div className="container">
      <div className="info">
        <span>Selected Interval: </span>
        {selectedInterval.map((d, i) => (
          <span key={i}>{format(d, "dd MMM")}</span>
        ))}
      </div>

      <TimeRange
        ticksNumber={10}
        formatTick={(ms) => format(new Date(ms), "dd MMM")}
        selectedInterval={selectedInterval}
        timelineInterval={timelineInterval}
        onUpdateCallback={() => {}}
        onChangeCallback={onChangeCallback}
        disabledIntervals={filteredExpensePeriodIntervals}
      />
    </div>
  );
}

export default Slider;
