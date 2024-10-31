import { parseISO, format } from "date-fns";
import {
  validateDueDate,
  validateTodoListDuplication,
  validateTodoListExistence,
} from "./todoValidator";

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

function createTodoList(listName, listData) {
  let todoList = [];

  const getListName = () => listName;

  const addTodo = (todoData) => todoList.push(createTodoItem(todoData));

  const getTodoList = () => todoList;

  if (listData) {
    listData.forEach((todoData) => {
      addTodo(todoData);
    });
  }

  return { getListName, addTodo, getTodoList, createTodoList };
}

function createTodoListManager() {
  let todoLists = new Map();

  const getTodoLists = () => todoLists;

  const getTodoList = (listName) => todoLists.get(listName).getTodoList() || [];

  const addTodoList = (listName, listData) => {
    validateTodoListDuplication(todoLists, listName);
    todoLists.set(listName, createTodoList(listName, listData));
  };

  const addTodoToList = (listName, todoData) => {
    validateTodoListExistence(todoLists, listName);

    todoLists.get(listName).addTodo(todoData);
  };

  return {
    getTodoLists,
    getTodoList,
    addTodoList,
    addTodoToList,
  };
}

export { createTodoListManager };
