import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
const categories = [{ value: "Work" }, { value: "School" }];

function CreateTask() {
  function handleCreateTask() {
    // todo
  }
  return (
    <Card className="flex w-2/4 flex-row gap-4 rounded border-black bg-neutral-300 p-4 dark:bg-neutral-600">
      <CardHeader className="gap-8 items-center">
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
        <Button onClick={handleCreateTask} className="ml-auto max-w-xs p-7">
          +
        </Button>
      </CardHeader>
      <CardBody className=""></CardBody>
    </Card>
  );
}

export default CreateTask;
