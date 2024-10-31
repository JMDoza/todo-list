import { createTodoListManager } from "./todo";
import { createElement, appendChildren } from "./domUtils";

const todoListManager = createTodoListManager();
const checkboxBlankSVG = `<svg class="check-box-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-blank</title><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;
const checkboxSVG = `<svg class="check-box-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-marked</title><path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;

function renderTodoList(listData) {
  // getTodoLists, getTodoList, addTodoList, addTodoToList
  const content = document.getElementById("content");
  content.innerHTML = "";

  const plusBox = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-box</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;

  if (listData) {
    todoListManager.addTodoList("List 1", listData);
    todoListManager.addTodoList("List 2", listData);
  }

  const todoLists = todoListManager.getTodoLists();
  for (const [key, todoList] of todoLists) {
    console.log(key);
    console.log(todoList);

    const todoListElement = createElement("div", "todo-list-container");
    const plusboxElement = createElement("div", "plus-box");
    const todoListTitle = createElement("h2", "", todoList.getListName());
    const todoItemsContainer = createElement("div", "todo-items-container");

    const todoItems = todoList.getTodoList();
    todoItems.forEach((todoItem, index) => {
      const todoItemElement = renderTodoItem(todoItem, index);
      appendChildren(todoItemsContainer, todoItemElement);
    });

    todoListElement.dataset.list = key;
    plusboxElement.innerHTML = plusBox;
    appendChildren(
      todoListElement,
      todoListTitle,
      plusboxElement,
      todoItemsContainer
    );
    addCreateNewTodoEventListener(plusboxElement);
    appendChildren(content, todoListElement);
  }
}

function renderTodoItem(todoItem, index) {
  const todoItemElement = createElement("div", "todo-item");
  const checkboxElement = createElement("div", "check-box");
  const todoInfoElement = createElement("div", "todo-information");

  const todoItemTitleElement = createElement("h4", "", todoItem.getTitle());
  const todoItemDescElement = createElement("p", "", todoItem.getDesc());

  checkboxElement.innerHTML = todoItem.getStatus()
    ? checkboxSVG
    : checkboxBlankSVG;

  todoItemElement.dataset.todoItem = index;
  addToggleStatusEventListener(checkboxElement);
  appendChildren(todoInfoElement, todoItemTitleElement, todoItemDescElement);
  appendChildren(todoItemElement, checkboxElement, todoInfoElement);

  return todoItemElement;
}

function addToggleStatusEventListener(element) {
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

function addCreateNewTodoEventListener(element) {
  element.addEventListener("click", (event) => {
    const todoListElement = event.currentTarget.closest("[data-list]");
    const todoItemsElement = event.currentTarget.nextElementSibling;

    const dummyTodo = {
      title: "Task 6",
      desc: "This is my 6th Task!",
    };

    const todoListKey = todoListElement.dataset.list;

    todoListManager.addTodoToList(todoListKey, dummyTodo);
    const todoList = todoListManager.getTodoList(todoListKey);
    const todoListLastIndex = todoList.length - 1;

    const newTodo = renderTodoItem(
      todoList[todoListLastIndex],
      todoListLastIndex
    );

    appendChildren(todoItemsElement, newTodo);
  });
}

export { renderTodoList };
