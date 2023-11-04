import { faPause, faPlay, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
const POMODORO_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

function Timer() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isEnabled, setIsEnabled] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [isPomodoroMode, setIsPomodoroMode] = useState(true);
  const [customTime, setCustomTime] = useState(0);
  const { data: session, status } = useSession();

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
  function handleCreateTask() {
    // todo
  }
  const categories = [{ value: "Work" }, { value: "School" }];

  return (
    <Card className="flex w-2/4 gap-4 rounded border-black bg-neutral-300 p-4 dark:bg-neutral-600">
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
            <label className="font-bold ml-auto" htmlFor="customTime">
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
        <p className="font-bold px-4">{formatTime(timeLeft)}</p>
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
      <CardFooter className="items-center gap-8">
        <Input
          className=""
          type="text"
          label="Task"
          placeholder="Enter your Task"
        />
        <Select label="Select a Category" className="max-w-xs">
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.value}
            </SelectItem>
          ))}
        </Select>
        <Button onClick={handleCreateTask} className="ml-auto max-w-xs p-7 bg-blue-500 hover:bg-blue-700">
          +
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Timer;
