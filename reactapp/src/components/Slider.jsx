import { useState } from "react";
import { format, set } from "date-fns";
import TimeRange from "react-timeline-range-slider";

import "./Slider.css";

const now = new Date();

const getDaysFromToday = (days = 0) =>
  set(now, { date: days, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

function Slider(props) {
  const [error, setError] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState([
    getDaysFromToday(-48 / 24),
    getDaysFromToday(0),
  ]);

  const timelineInterval = [
    getDaysFromToday(-100 / 24),
    getDaysFromToday(100 / 24),
  ];

  const disabledIntervals = [
    { start: getDaysFromToday(0 / 24), end: getDaysFromToday(40 / 24) },
  ];

  const errorHandler = ({ error }) => {
    console.log(error);
    setError(error);
  };

  const onChangeCallback = (selectedInterval) => {
    console.log("start", format(selectedInterval[0], "yyyy-LL-dd"));
    console.log("end", format(selectedInterval[1], "yyyy-LL-dd"));
    setSelectedInterval(selectedInterval);
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
        error={error}
        ticksNumber={10}
        formatTick={(ms) => format(new Date(ms), "dd MMM")}
        selectedInterval={selectedInterval}
        timelineInterval={timelineInterval}
        onUpdateCallback={errorHandler}
        onChangeCallback={onChangeCallback}
        disabledIntervals={disabledIntervals}
      />
    </div>
  );
}

export default Slider;
