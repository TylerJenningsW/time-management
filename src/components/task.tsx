import { Card, CardBody } from "@nextui-org/react";

function Task(props: string) {
  return (
    <Card>
      <CardBody>
        <p>{props}</p>
      </CardBody>
    </Card>
  );
}

export default Task;
