import { parseISO } from "date-fns";
import { saveData, loadData } from "./localStorage";
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
  const toggleStatus = () => {
    status = !status;
    updateLastModifiedDate();
  };

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

  const addTodoList = (listName, listData, fromStorage) => {
    try {
      validateTodoListDuplication(todoLists, listName);
      todoLists.set(listName, createTodoList(listName, listData));
      if (!fromStorage) {
        saveData(todoLists);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodoList = (listName) => {
    todoLists.delete(listName);
    saveData(todoLists);
  };

  const addTodoToList = (listName, todoData) => {
    try {
      validateTodoListExistence(todoLists, listName);
      todoLists.get(listName).addTodo(todoData);
      saveData(todoLists);
    } catch (error) {
      console.log(error);
    }
  };

  const removeTodoFromList = (listName, todoItem) => {
    getTodoList(listName).splice(todoItem, 1);
    saveData(todoLists);
  };

  const getTodoFromList = (listName, todoIndex) => {
    return getTodoList(listName)[todoIndex];
  };

  const toggleStatusOfTodoFromList = (listName, todoIndex) => {
    getTodoFromList(listName, todoIndex).toggleStatus();
    saveData(todoLists);
  };

  const loadFromStorage = () => {
    todoLists.clear();
    let todoListsStorage = loadData();

    for (const [listName, listObject] of Object.entries(todoListsStorage)) {
      addTodoList(listName, listObject, true);
    }
  };

  return {
    getTodoLists,
    getTodoList,
    addTodoList,
    deleteTodoList,
    addTodoToList,
    removeTodoFromList,
    getTodoFromList,
    toggleStatusOfTodoFromList,
    loadFromStorage,
  };
}

export { createTodoListManager };
