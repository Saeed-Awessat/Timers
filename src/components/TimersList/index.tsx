import { useEffect, useRef, useState } from "react";
import "./TimersList.css";

import Timer from "../Timer";
import { INITIAL_TIMER_OBJ } from "../../constants/config";

const TimersList = () => {
  const [delay, setDelay] = useState(1000);
  const startTime = useRef(Date.now());
  const [timers, setTimers] = useState<Array<any>>(
    JSON.parse(window.localStorage.getItem("timersList") ?? "[]")
  );
  const [counter, setCounter] = useState(() => {
    let maxCounter = 0;
    if (timers.length) {
      timers.forEach((timer) => {
        const { target } = timer;
        maxCounter = target > maxCounter ? target : maxCounter;
      });
    }
    return maxCounter;
  });
  const [counterState, setCounterState] = useState({
    isStart: false,
    isResume: false,
  });

  const { isStart: isCounterStart, isResume: isCounterResume } = counterState;

  // to start the interval
  useEffect(() => {
    if (isCounterStart && isCounterResume) {
      const countTimeout = setInterval(() => {
        const currentDate = Date.now();
        const diff = currentDate - startTime.current;

        const arr = timers.map((timer) => {
          const clonedTimer = structuredClone(timer);
          if (counter <= clonedTimer.target) {
            clonedTimer.current++;
          }
          return clonedTimer;
        });

        setDelay(diff - 1000 > 0 ? 2000 - diff : diff);

        // localStorage.setItem("timersList", JSON.stringify(arr));
        setTimers(arr);
        setCounter((prevCounter) => prevCounter - 1);
        startTime.current = currentDate;
      }, delay);

      if (counter === 0) {
        setCounterState({ isStart: false, isResume: false });
        return () => {
          clearInterval(countTimeout);
        };
      }

      return () => {
        clearInterval(countTimeout);
      };
    }
  }, [counter, counterState, delay]);

  // add new timer to list
  const addNewTimer = () => {
    const arr = timers.slice();
    const timerObj = INITIAL_TIMER_OBJ;
    arr.push(timerObj);

    localStorage.setItem("timersList", JSON.stringify(arr));
    setTimers(arr);
  };

  // reset timers targets
  const resetAllTheTimers = () => {
    const arr = timers.map((timer) => {
      return INITIAL_TIMER_OBJ;
    });

    localStorage.setItem("timersList", JSON.stringify(arr));
    setTimers(arr);
    setCounter(0);
  };

  // empty the list of timers
  const deleteAll = () => {
    localStorage.setItem("timersList", JSON.stringify([]));
    setTimers([]);
  };

  // activates all the timers
  const activatesAll = () => {
    if (timers.length) {
      let maxCounter = 0;
      const arr = timers.map((timer) => {
        const clonedTimer = structuredClone(timer);
        const { target } = clonedTimer;
        clonedTimer.current = 0;
        maxCounter = target > maxCounter ? target : maxCounter;
        return clonedTimer;
      });

      localStorage.setItem("timersList", JSON.stringify(arr));
      setTimers(arr);
      setCounter(maxCounter);
      setCounterState({ isStart: true, isResume: true });
      setDelay(1000);
      startTime.current = Date.now();
    }
  };

  // Change the status of timers from pause to resume and vice versa
  const updateTimersStatus = () => {
    if (!isCounterResume) {
      setDelay(1000);
      startTime.current = Date.now();
    }
    setCounterState({ ...counterState, isResume: !isCounterResume });
  };

  const resetTimersToZero = () => {
    setCounterState({ ...counterState, isStart: false });
  };

  // restart all the timers
  const resetAllAndStartAgain = () => {
    let maxCounter = 0;
    const arr = timers.map((timer) => {
      const clonedTimer = structuredClone(timer);
      const { target } = clonedTimer;
      clonedTimer.current = 0;
      maxCounter = target > maxCounter ? target : maxCounter;
      return clonedTimer;
    });

    localStorage.setItem("timersList", JSON.stringify(arr));
    setTimers(arr);
    setCounter(maxCounter);
    setCounterState({ ...counterState, isResume: true });
    setDelay(1000);
    startTime.current = Date.now();
  };

  return (
    <div className="container">
      <header>
        <div className="btns-on-stopped">
          <button disabled={isCounterStart} onClick={addNewTimer}>
            + Add New
          </button>
          <button disabled={isCounterStart} onClick={resetAllTheTimers}>
            Reset
          </button>
          <button disabled={isCounterStart} onClick={deleteAll}>
            Delete All
          </button>
          <button disabled={isCounterStart} onClick={activatesAll}>
            Start
          </button>
        </div>
      </header>
      <main className="main-section">
        <div className="btns-on-running">
          <button disabled={!isCounterStart} onClick={updateTimersStatus}>
            {!isCounterStart ? "Resume" : isCounterResume ? "Pause" : "Resume"}
          </button>
          <button disabled={!isCounterStart} onClick={resetTimersToZero}>
            Stop
          </button>
          <button disabled={!isCounterStart} onClick={resetAllAndStartAgain}>
            Reset
          </button>
        </div>
        <section className="timers-list">
          {timers.map((timer, ind) => {
            return (
              <div key={`timer${ind}`} style={{ margin: "1rem" }}>
                <Timer
                  key={ind}
                  index={ind}
                  timers={timers}
                  counter={counter}
                  timer={timer}
                  isCounterStart={isCounterStart}
                  updateTimersContainer={setTimers}
                  updateMaxCounter={setCounter}
                />
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default TimersList;
