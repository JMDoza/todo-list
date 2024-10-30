import { parseISO } from "date-fns";
import { validateDueDate } from "./todoValidator";

function createTodoItem({
  title,
  desc,
  priority = 1,
  status = false,
  createdDate = new Date(),
  lastModifiedDate = new Date(),
  dueDate,
}) {
  dueDate = dueDate ? parseISO(dueDate) : undefined;
  validateDueDate(dueDate);

  const getTitle = () => title;
  const setTitle = (newTitle) => (title = newTitle);

  const getDesc = () => desc;
  const setDesc = (newDesc) => (desc = newDesc);

  const getPriority = () => priority;
  const setPriority = (newPriority) => (priority = newPriority);

  const getStatus = () => status;
  const toggleStatus = () => (status = !status);

  const getCreatedDate = () => createdDate;
  const getLastModifiedDate = () => lastModifiedDate;
  const updateLastModifiedDate = () => (lastModifiedDate = new Date());

  const getDueDate = () => dueDate;
  const setDueDate = (newDate) => (dueDate = newDate);

  return {
    getTitle,
    setTitle,
    getDesc,
    setDesc,
    getPriority,
    setPriority,
    getStatus,
    toggleStatus,
    getCreatedDate,
    getLastModifiedDate,
    updateLastModifiedDate,
    getDueDate,
    setDueDate,
  };
}

function createTodoList(listData) {
  let todoList = [];

  const addTodo = (todoData) => {
    todoList.push(createTodoItem(todoData));
  };

  const getTodoList = () => {
    return todoList;
  };

  if (listData) {
    listData.forEach((todoData) => {
      addTodo(todoData);
    });
  }

  return { addTodo, getTodoList };
}

export { createTodoList };
