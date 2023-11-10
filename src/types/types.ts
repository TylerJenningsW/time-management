export type GoogleEvent = {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  recurrence?: string[];
};

export type Contact = {
  name: string;
  email: string;
};
export interface Task {
  id: number;
  title: string;
  category: string;
}

export interface HomeProps {
  tasks: Task[];
}
