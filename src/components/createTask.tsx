import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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

  const [taskCategory, setTaskCategory] = useState({ category: "" });
  const response = api.task.add.useMutation({
    onSuccess(data) {
      console.log(data);
    },
  });
  function updateCategory(key: string) {
    return function (e: React.MouseEvent<HTMLLIElement>) {
      const selectedCategory = e.currentTarget.getAttribute("data-value");
      setTaskCategory((prev) => ({ ...prev, [key]: selectedCategory }));
    };
  }
  function updateForm(key: string) {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      setTaskTitle((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }
  function handleFormSubmit(e: React.FormEvent) {
    console.log("test")
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
      category: taskCategory.category,
      
    });
  }

  return (
    <>
      <CardFooter className="items-center gap-8">
        <form></form>
        <Input
          className=""
          type="text"
          label="Task"
          placeholder="Enter your Task"
          onChange={updateForm("title")}
        />

        <Select label="Select a Category" className="max-w-xs">
          {categories.map((category) => (
            <SelectItem
              onSelect={updateCategory("category")}
              key={category.value}
              value={category.value}
            >
              {category.value}
            </SelectItem>
          ))}
        </Select>
        <Button
          onClick={handleFormSubmit}
          className="m1-auto bg-blue-500 max-w-xs p-7 hover:bg-blue-700"
        >
          +
        </Button>
      </CardFooter>
    </>
  );
}

export default CreateTask;
