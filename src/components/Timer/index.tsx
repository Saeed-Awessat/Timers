import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { convertNumberToTime, convertTimeToNumber } from "../../util/functions";

import "./Timer.css";

interface TimerObj {
  target: number;
  current: number;
}

interface TimerProps {
  index: number;
  timers: Array<any>;
  counter: number;
  timer: TimerObj;
  isCounterStart: boolean;
  updateTimersContainer: (arr: Array<any>) => void;
  updateMaxCounter: (counter: number) => void;
}

const Timer = ({
  index,
  timers,
  counter,
  timer,
  isCounterStart,
  updateTimersContainer,
  updateMaxCounter,
}: TimerProps) => {
  let { target, current } = timer;

  const editTarget = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arr = timers.slice();
    const newTarget = event?.target?.value;
    const targetAsNumber = convertTimeToNumber(newTarget);
    arr[index] = { ...timer, target: targetAsNumber };

    if (targetAsNumber > counter) updateMaxCounter(targetAsNumber);
    localStorage.setItem("timersList", JSON.stringify(arr));
    updateTimersContainer(arr);
  };

  const deleteTimer = () => {
    const arr = timers.slice();
    arr.splice(index, 1);

    localStorage.setItem("timersList", JSON.stringify(arr));
    updateTimersContainer(arr);
  };

  return (
    <>
      <div className="timer-container">
        {!isCounterStart ? (
          <button type="button" className="close-btn" onClick={deleteTimer}>
            X
          </button>
        ) : null}
        <main>
          <div>
            <input
              value={`${convertNumberToTime(target)}`}
              className="edit-target"
              type="text"
              id="timeInput"
              placeholder="MM:SS"
              onChange={editTarget}
              disabled={isCounterStart}
            />
          </div>
          <section>
            <CircularProgressbar
              value={current}
              maxValue={target}
              text={`${convertNumberToTime(current)}`}
              styles={{
                // Customize the path, i.e. the "completed progress"
                path: {
                  // Path color
                  stroke: "#01FFE1",
                },
                text: {
                  // Text color
                  fill: "#fff",
                  // Text size
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                },
              }}
            />
          </section>
        </main>
      </div>
    </>
  );
};

export default Timer;
