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
