import {
  Button,
  CardFooter,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";
const categories = [{ value: "Work" }, { value: "School" }];
function CreateTask() {
  const { data: session } = useSession();

  const [taskTitle, setTaskTitle] = useState({ title: "" });

  const [taskCategory, setTaskCategory] = useState("");
  const trpc = api.useUtils();
  const response = api.task.add.useMutation({
    onSuccess(data) {
      console.log(data);
      trpc.task.get.invalidate();
    },
  });

  function updateForm(key: string) {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      setTaskTitle((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }
  function handleFormSubmit(e: React.FormEvent) {
    console.log("test");
    e.preventDefault();
    if (session == undefined) {
      console.log("Undefined");
      return;
    } else {
      console.log(session.user);
      console.log(session.user.id);
      console.log(session.user.name);
    }

    console.log(session.user);
    console.log(session.user.id);
    console.log(session.user.name);
    response.mutate({
      title: taskTitle.title,
      category: taskCategory,
    });
  }

  return (
    <>
      <CardFooter className="items-center gap-8">
        <Input
          className=""
          type="text"
          label="Task"
          placeholder="Enter your Task"
          onChange={updateForm("title")}
        />

        <Select
          label="Select a Category"
          className="max-w-xs"
          onChange={(e) => setTaskCategory(e.target.value)}
        >
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.value}
            </SelectItem>
          ))}
        </Select>
        <Button
          onClick={handleFormSubmit}
          className="m1-auto max-w-xs bg-blue-500 p-7 hover:bg-blue-700"
        >
          +
        </Button>
      </CardFooter>
    </>
  );
}

export default CreateTask;
