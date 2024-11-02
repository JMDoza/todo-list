import "./styles.css";
import { renderTodoLists } from "./render";

const listData = [
  { title: "Task 1", desc: "This is my 1st Task!" },
  { title: "Task 2", desc: "This is my 2nd Task!", priority: 2 },
  { title: "Task 3", desc: "This is my 3rd Task!", priority: 4 },
  {
    title: "Task 4",
    desc: "This is my 4th Task!",
    priority: 8,
    dueDate: "2024-10-31",
  },
  {
    title: "Task 5",
    desc: "This is my 5th Task!",
    priority: 16,
    dueDate: "2024-11-01",
  },
];

renderTodoLists(listData);

