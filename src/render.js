import { createTodoListManager } from "./todo";
import { createElement, appendChildren } from "./domUtils";

const todoListManager = createTodoListManager();

function renderTodoList(listData) {
  // getTodoLists, getTodoList, addTodoList, addTodoToList
  const content = document.getElementById("content");

  todoListManager.addTodoList("List 1", listData);
  todoListManager.addTodoList("List 2", listData);

  console.log(todoListManager.getTodoLists());

  const todoLists = todoListManager.getTodoLists();
  for (const [key, todoList] of todoLists) {
    console.log(key);
    console.log(todoList);

    const todoListElement = createElement("div", "todo-list-container");
    const todoListTitle = createElement("h2", "", todoList.getListName());
    const todoItemsContainer = createElement("div", "todo-items-container");

    const todoItems = todoList.getTodoList();
    todoItems.forEach((todoItem, index) => {
      const todoItemElement = renderTodoItem(todoItem);
      todoItemElement.dataset.todoItem = index;
      appendChildren(todoItemsContainer, todoItemElement);
    });

    todoListElement.dataset.list = key;
    appendChildren(todoListElement, todoListTitle, todoItemsContainer);
    appendChildren(content, todoListElement);
  }
}

function renderTodoItem(todoItem) {
  const checkboxBlankSVG = `<svg class="check-box-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-blank</title><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;

  const todoItemElement = createElement("div", "todo-item");
  const checkboxElement = createElement("div", "check-box");
  const todoInfoElement = createElement("div", "todo-information");

  const todoItemTitleElement = createElement("h4", "", todoItem.getTitle());
  const todoItemDescElement = createElement("p", "", todoItem.getDesc());

  checkboxElement.innerHTML = checkboxBlankSVG;
  addToggleStatusEventListener(checkboxElement);
  appendChildren(todoInfoElement, todoItemTitleElement, todoItemDescElement);
  appendChildren(todoItemElement, checkboxElement, todoInfoElement);

  return todoItemElement;
}

function addToggleStatusEventListener(element) {
  const checkboxSVG = `<svg class="check-box-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-marked</title><path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;
  const checkboxBlankSVG = `<svg class="check-box-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-blank</title><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;

  element.addEventListener("click", (event) => {
    const todoListElement = event.currentTarget.closest("[data-list]");
    const todoItemElement = event.currentTarget.closest("[data-todo-item]");
    const checkboxElement = event.currentTarget.closest(".check-box");

    const todoList = todoListElement.dataset.list;
    const todoItem = todoItemElement.dataset.todoItem;

    todoListManager.toggleStatusOfTodoFromList(todoList, todoItem);

    checkboxElement.innerHTML = todoListManager
      .getTodoFromList(todoList, todoItem)
      .getStatus()
      ? checkboxSVG
      : checkboxBlankSVG;
  });
}

export { renderTodoList };
