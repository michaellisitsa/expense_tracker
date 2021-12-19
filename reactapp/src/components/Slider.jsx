import React from "react";
import { format, set } from "date-fns";
import TimeRange from "react-timeline-range-slider";

import "./Slider.css";

const now = new Date();

const getTodayAtSpecificHour = (hour = 12) =>
  set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });

class Slider extends React.Component {
  state = {
    error: false,
    selectedInterval: [getTodayAtSpecificHour(-48), getTodayAtSpecificHour(0)],
  };

  errorHandler = ({ error }) => {
    console.log(error);
    this.setState({ error });
  };

  onChangeCallback = (selectedInterval) => {
    console.log("start", format(this.state.selectedInterval[0], "yyyy-LL-dd"));
    console.log("end", format(this.state.selectedInterval[1], "yyyy-LL-dd"));
    this.setState({ selectedInterval });
  };

  render() {
    const timelineInterval = [
      getTodayAtSpecificHour(-100),
      getTodayAtSpecificHour(100),
    ];

    const disabledIntervals = [
      { start: getTodayAtSpecificHour(30), end: getTodayAtSpecificHour(40) },
    ];

    // console.log(disabledIntervals);
    const { selectedInterval, error } = this.state;
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
          onUpdateCallback={this.errorHandler}
          onChangeCallback={this.onChangeCallback}
          disabledIntervals={disabledIntervals}
        />
      </div>
    );
  }
}

export default Slider;
