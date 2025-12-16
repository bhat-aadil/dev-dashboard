import { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DEFAULT_WORK = 25 * 60;
const DEFAULT_BREAK = 5 * 60;

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

export default function PomodoroWidget() {
  const [workSeconds, setWorkSeconds] = useState(DEFAULT_WORK);
  const [breakSeconds, setBreakSeconds] = useState(DEFAULT_BREAK);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    const raw = localStorage.getItem("pomodoro-sessions") || "0";
    return Number(raw);
  });

  const intervalRef = useRef(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    localStorage.setItem("pomodoro-sessions", String(sessionsCompleted));
  }, [sessionsCompleted]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // switch mode between break and work
          if (!onBreak) {
            notify("Work session complete! Time for a break ");
            setOnBreak(true);
            setSessionsCompleted((prev) => prev + 1);
            return breakSeconds;
          } else {
            notify("Break over — back to work ");
            setOnBreak(false);
            return workSeconds;
          }
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning, onBreak, workSeconds, breakSeconds]);

  useEffect(() => {
    setSecondsLeft(onBreak ? breakSeconds : workSeconds);
    console.log(workSeconds);
    console.log(breakSeconds);
  }, [onBreak, workSeconds, breakSeconds]);

  function notify(msg) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(msg);
    } else {
      alert(msg);
    }
  }

  const percent = Math.round(
    (((onBreak ? breakSeconds : workSeconds) - secondsLeft) /
      (onBreak ? breakSeconds : workSeconds)) *
      100
  );
  //convert seconds into hours-minutes-seconds format
  function convertSecondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSecondsAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const seconds = remainingSecondsAfterHours % 60;

    // add leading zeros for single-digit values
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div className="p-4 bg-gray-800 text-gray-400 rounded-2xl shadow h-full flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Pomodoro</h3>

      <div style={{ width: 140, height: 140 }}>
        <CircularProgressbar
          value={percent}
          text={convertSecondsToHMS(secondsLeft)}
          // {`${Math.floor(secondsLeft / 60)
          //   .toString()
          //   .padStart(2, "0")}:${(secondsLeft % 60)
          //   .toString()
          //   .padStart(2, "0")}`}
          styles={buildStyles({
            textSize: "14px",
            pathTransitionDuration: 0.5,
            pathColor: onBreak ? "#10b981" : "#ef4444",
            textColor: "white",
            trailColor: "#d1d5db",
          })}
        />
      </div>

      <div className="mt-3 text-sm">{onBreak ? "Break" : "Work time"}</div>

      <div className="p-2 m-2 flex flex-col items-center">
        <h3>Choose Session</h3>
        <select
          name=""
          id=""
          onChange={(e) => setWorkSeconds(Number(e.target.value))}
          className=" bg-gray-900 border rounded cursor-pointer"
        >
          <option value="1500">Default</option>
          <option value="3600">One Hour</option>
          <option value="5400">90 Minutes</option>
          <option value="7200">Two Hours</option>
          <option value="10800">Three Hours</option>
        </select>
      </div>

      <div className="mt-3 flex gap-2">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="px-3 py-1 bg-yellow-500 text-black rounded cursor-pointer"
          >
            Pause
          </button>
        )}
        <button
          onClick={() => {
            setIsRunning(false);
            setOnBreak(false);
            setSecondsLeft(workSeconds);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="mt-3 text-sm">
        Sessions completed: <strong>{sessionsCompleted}</strong>
      </div>
    </div>
  );
}
