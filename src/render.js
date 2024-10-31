import { createTodoListManager } from "./todo";
import {
  createElement,
  appendChildren,
  toggleElementDisplayBlock,
} from "./domUtils";

const todoListManager = createTodoListManager();
const checkboxBlankSVG = `<svg class="check-box-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-blank</title><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;
const checkboxSVG = `<svg class="check-box-svg checked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-marked</title><path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;
const plusBox = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-box</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;
const menuOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>menu-open</title><path d="M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z" /></svg>`;

function renderTodoLists(listData) {
  // getTodoLists, getTodoList, addTodoList, addTodoToList
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (listData) {
    todoListManager.addTodoList("List 1", listData);
    todoListManager.addTodoList("List 2", listData);
  }

  const todoLists = todoListManager.getTodoLists();
  for (const [key, todoList] of todoLists) {
    appendChildren(content, renderTodoList(key, todoList));
  }
}

function renderTodoList(key, todoList) {
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
  return todoListElement;
}

function renderTodoItem(todoItem, index) {
  const todoItemElement = createElement("div", "todo-item");
  const checkboxElement = createElement("div", "check-box");
  const todoInfoElement = createElement("div", "todo-information");

  const todoItemTitleElement = createElement("h4", "", todoItem.getTitle());
  const todoItemDescElement = createElement("p", "", todoItem.getDesc());

  const menuOpenElement = createElement("div", "menu-open");

  checkboxElement.innerHTML = todoItem.getStatus()
    ? checkboxSVG
    : checkboxBlankSVG;

  menuOpenElement.innerHTML = menuOpen;
  todoItemElement.dataset.todoItem = index;
  addToggleStatusEventListener(checkboxElement);
  appendChildren(todoInfoElement, todoItemTitleElement, todoItemDescElement);
  appendChildren(
    todoItemElement,
    checkboxElement,
    todoInfoElement,
    menuOpenElement
  );

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

    toggleNewTodoDiaglog();

    const todoListKey = todoListElement.dataset.list;

    setListNameFormValue(todoListKey);
  });
}

function setListNameFormValue(value) {
  const listNameForm = document.getElementById("listNameForm");
  listNameForm.value = value;
}

function toggleNewTodoDiaglog() {
  toggleElementDisplayBlock(document.getElementById("overlay"));
  toggleElementDisplayBlock(document.getElementById("newTodoDialog"));
}

(function initClickEventListener() {
  const content = document.getElementById("content");
  const plusboxMultiple = document.getElementById("plus-box-multiple");
  const newListName = "List #";
  plusboxMultiple.addEventListener("click", (event) => {
    todoListManager.addTodoList(newListName);

    const temp = renderTodoList(
      newListName,
      todoListManager.getTodoLists().get(newListName)
    );
    appendChildren(content, temp);
  });

  const newTodoForm = document.getElementById("newTodoForm");

  document.getElementById("overlay").addEventListener("click", (event) => {
    toggleNewTodoDiaglog();
    newTodoForm.reset();
  });

  const dummyTodo = {
    title: "Task 6",
    desc: "This is my 6th Task!",
  };

  document
    .querySelector("#newTodoDialog > form > button")
    .addEventListener("click", (event) => {
      try {
        event.preventDefault();
        if (!newTodoForm.checkValidity()) {
          newTodoForm.reportValidity();
          throw new Error("No Title");
        }

        const formData = new FormData(newTodoForm);
        const todoListKey = formData.get("listName");
        const todoItemsElement = document.querySelector(
          `[data-list="${todoListKey}"] > .todo-items-container`
        );

        todoListManager.addTodoToList(todoListKey, {
          title: formData.get("title"),
          desc: formData.get("desc"),
          priority: formData.get("priority"),
        });

        const todoList = todoListManager.getTodoList(todoListKey);
        const todoListLastIndex = todoList.length - 1;

        const newTodo = renderTodoItem(
          todoList[todoListLastIndex],
          todoListLastIndex
        );

        appendChildren(todoItemsElement, newTodo);

        toggleNewTodoDiaglog();
        newTodoForm.reset();
      } catch (error) {
        console.log(error);
      }
    });
})();

export { renderTodoLists };
