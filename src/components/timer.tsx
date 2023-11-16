import { faPause, faPlay, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Input,
} from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import CreateTask from "./createTask";
const POMODORO_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

function Timer() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isEnabled, setIsEnabled] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [isPomodoroMode, setIsPomodoroMode] = useState(true);
  const [customTime, setCustomTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startTimer = () => {
    setIsEnabled(true);
  };

  const pauseTimer = () => {
    setIsEnabled(false);
  };

  const resetTimer = () => {
    setIsEnabled(false);
    if (isPomodoroMode == false) {
      setTimeLeft(customTime);
    } else {
      setTimeLeft(POMODORO_TIME);
    }
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isEnabled && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isEnabled && timeLeft <= 0) {
      clearInterval(interval);
      audioRef.current?.play();

      if (isPomodoroMode) {
        if (cycles < 3) {
          setTimeLeft(SHORT_BREAK);
          setCycles(cycles + 1);
        } else {
          setTimeLeft(LONG_BREAK);
          setCycles(0);
        }
      } else {
        setIsEnabled(false);
      }
    } else {
      clearInterval(interval);
      setIsEnabled(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEnabled, timeLeft, isPomodoroMode, cycles]);
  const handlePomodoroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPomodoroMode(e.target.checked);
    if (e.target.checked) {
      setTimeLeft(POMODORO_TIME);
      setCycles(0);
    } else {
      setTimeLeft(customTime);
    }
  };

  return (
    <>
      <Card className="flex w-2/4 gap-4 rounded border-black bg-neutral-300 p-4 dark:bg-neutral-600 mt-20">
        <CardHeader className="flex h-12 gap-3">
          <button onClick={startTimer}>
            <FontAwesomeIcon
              icon={faPlay}
              className="text-blue-500 hover:text-blue-700"
            />
          </button>
          <button onClick={pauseTimer}>
            <FontAwesomeIcon
              icon={faPause}
              className="text-blue-500 hover:text-blue-700"
            />
          </button>
          <button onClick={resetTimer}>
            <FontAwesomeIcon
              icon={faRedo}
              className="text-blue-500 hover:text-blue-700"
            />
          </button>
          {!isPomodoroMode && (
            <>
              <label className="ml-auto font-bold" htmlFor="customTime">
                Set Time (minutes):
              </label>
              <Input
                type="number"
                id="customTime"
                value={String(customTime / 60)}
                onChange={(e) => {
                  setCustomTime(e.target.valueAsNumber * 60);
                  setTimeLeft(e.target.valueAsNumber * 60);
                }}
                className="h-12 w-24 rounded p-2"
              />
            </>
          )}
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-row">
          <p className="px-4 font-bold">{formatTime(timeLeft)}</p>
          <p className="ml-auto mr-4 font-bold">Pomodoro</p>
          <Checkbox
            defaultSelected
            type="checkbox"
            id="pomodoro"
            name="vehicle1"
            value="pomodoro"
            className="max-w-md"
            checked={isPomodoroMode}
            onChange={handlePomodoroChange}
            size="sm"
          />
        </CardBody>
        <Divider />
        <CreateTask />
      </Card>
      <audio ref={audioRef} src="/alarm.mp3" preload="auto"></audio>
    </>
  );
}

export default Timer;
