import { isValid, isBefore } from "date-fns";

function validateDueDate(dueDate) {
  if (dueDate && !isValid(dueDate)) {
    throw new Error("Invalid due date format");
  } else if (dueDate && isBefore(new Date())) {
    throw new Error("Due date before current date");
  }
}

function validateTodoListDuplication(todoLists, listName) {
  if (todoLists[listName]) {
    throw new Error("Todo list already exists");
  }
}

function validateTodoListExistence(todoLists, listName) {
  if (!todoLists[listName]) {
    throw new Error("Todo list does not exist");
  }
}

export {
  validateDueDate,
  validateTodoListDuplication,
  validateTodoListExistence,
};
