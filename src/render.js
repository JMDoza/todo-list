import { createTodoListManager } from "./todo";
import { format } from "date-fns";
import {
  createElement,
  appendChildren,
  toggleElementDisplayBlock,
  toggleElementDisplayGrid,
} from "./domUtils";

const todoListManager = createTodoListManager();
const checkboxBlankSVG = `<svg class="check-box-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-blank</title><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;
const checkboxSVG = `<svg class="check-box-svg checked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-marked</title><path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;
const plusBox = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-box</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>`;
const menuOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>menu-open</title><path d="M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z" /></svg>`;
const deleteSVG = `<svg id="delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>`;

function renderTodoLists(listData) {
  const content = document.getElementById("content");

  content.innerHTML = "";

  if (!localStorage.getItem("todoLists")) {
    todoListManager.addTodoList("List 1", listData);
  } else {
    todoListManager.loadFromStorage();
  }

  const todoLists = todoListManager.getTodoLists();
  for (const [key, todoList] of todoLists) {
    appendChildren(content, renderTodoList(key, todoList));
  }
}

function renderTodoList(key, todoList) {
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
  addTodoDialogEventListener(menuOpenElement);
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

function addTodoDialogEventListener(element) {
  element.addEventListener("click", (event) => {
    const todoItem = event.currentTarget.closest("[data-todo-item]");
    const todoList = event.currentTarget.closest("[data-list]");
    const dialogDelete = document.getElementById("dialogDelete");
    dialogDelete.dataset.list = todoList.dataset.list;
    dialogDelete.dataset.todoItem = todoItem.dataset.todoItem;

    updateTodoDialog(todoList.dataset.list, todoItem.dataset.todoItem);
    toggleTodoDialog();
  });
}

function updateTodoDialog(listName, todoItem) {
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogDate = document.querySelector("#dialogDate > span");
  const dialogModifiedDate = document.querySelector(
    "#dialogModifiedDate > span"
  );
  const dialogDesc = document.getElementById("dialogDesc");
  const dialogPriority = document.querySelector("#dialogPriority > span");
  const dialogStatus = document.querySelector("#dialogStatus > span");
  const dialogDueDate = document.querySelector("#dialogDueDate > span");

  const todo = todoListManager.getTodoFromList(listName, todoItem);

  dialogTitle.textContent = todo.getTitle();
  dialogDate.textContent = format(todo.getCreatedDate(), "dd/MM/yyyy");
  dialogModifiedDate.textContent = format(
    todo.getLastModifiedDate(),
    "dd/MM/yyyy"
  );
  dialogDesc.textContent = todo.getDesc();
  dialogPriority.textContent = todo.getPriority();
  dialogStatus.textContent = todo.getStatus();
  dialogDueDate.textContent = todo.getDueDate()
    ? format(todo.getDueDate(), "dd/MM/yyyy")
    : "";
}

function setListNameFormValue(value) {
  const listNameForm = document.getElementById("listNameForm");
  listNameForm.value = value;
}

function toggleNewTodoDiaglog(condition) {
  const overlay = document.getElementById("overlay");
  const newTodoDialog = document.getElementById("newTodoDialog");

  if (!condition) {
    toggleElementDisplayBlock(overlay);
    toggleElementDisplayBlock(newTodoDialog);
    return;
  }

  overlay.classList.add("hide");
  newTodoDialog.classList.add("hide");
}

function toggleNewTodoListDiaglog(condition) {
  const overlay = document.getElementById("overlay");
  const newTodoListDialog = document.getElementById("newTodoListDialog");

  if (!condition) {
    toggleElementDisplayBlock(overlay);
    toggleElementDisplayBlock(newTodoListDialog);
    return;
  }

  overlay.classList.add("hide");
  newTodoListDialog.classList.add("hide");
}

function toggleDeleteTodoListDiaglog(condition) {
  const overlay = document.getElementById("overlay");
  const deleteTodoListDialog = document.getElementById("deleteTodoListDialog");

  if (!condition) {
    toggleElementDisplayBlock(overlay);
    toggleElementDisplayBlock(deleteTodoListDialog);
    return;
  }

  overlay.classList.add("hide");
  deleteTodoListDialog.classList.add("hide");
}

function toggleTodoDialog(condition) {
  const overlay = document.getElementById("overlay");
  const todoDialog = document.getElementById("todoDialog");

  if (!condition) {
    toggleElementDisplayBlock(overlay);
    toggleElementDisplayGrid(todoDialog);
    return;
  }

  overlay.classList.add("hide");
  overlay.classList.remove("display-grid");
  todoDialog.classList.add("hide");
  todoDialog.classList.remove("display-grid");
}

function populateDeleteDialog() {
  const todoLists = todoListManager.getTodoLists();
  const deleteLists = document.getElementById("deleteLists");
  deleteLists.innerHTML = "";
  for (const [key] of todoLists) {
    const dialogLists = createElement("div", "dialogLists");
    const title = createElement("h2");
    const SVG = createElement("div");

    title.textContent = key;
    SVG.innerHTML = deleteSVG;

    SVG.addEventListener("click", () => {
      todoListManager.deleteTodoList(key);
      toggleDeleteTodoListDiaglog();
      renderTodoLists();
    });

    appendChildren(dialogLists, title, SVG);
    appendChildren(deleteLists, dialogLists);
  }
}

(function initClickEventListener() {
  // click listeners for creating new todo lists
  const content = document.getElementById("content");
  const plusboxMultiple = document.getElementById("plus-box-multiple");
  plusboxMultiple.addEventListener("click", () => {
    toggleNewTodoListDiaglog();
  });

  // Click Listener for deleting todo list
  toggleDeleteTodoListDiaglog;
  const deleteIcon = document.querySelector("header > #delete");
  deleteIcon.addEventListener("click", () => {
    toggleDeleteTodoListDiaglog();
    populateDeleteDialog();
  });

  // click listeners for getting data from a form to add new todo to a list
  const newTodoForm = document.getElementById("newTodoForm");
  const newTodoListForm = document.getElementById("newTodoListForm");

  // click listener to toggle overlay and dialogs off
  document.getElementById("overlay").addEventListener("click", () => {
    toggleNewTodoDiaglog(true);
    toggleTodoDialog(true);
    toggleNewTodoListDiaglog(true);
    toggleDeleteTodoListDiaglog(true);
    newTodoForm.reset();
    newTodoListForm.reset();
  });

  document
    .querySelector("#newTodoDialog > form > button")
    .addEventListener("click", (event) => {
      try {
        event.preventDefault();

        if (!newTodoForm.checkValidity()) {
          try {
            newTodoForm.reportValidity();
            throw new Error("No Title");
          } catch (error) {
            console.log(error);
            toggleNewTodoDiaglog(true);
            return;
          }
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

  document
    .getElementById("inputListSubmit")
    .addEventListener("click", (event) => {
      event.preventDefault();

      if (!newTodoListForm.checkValidity()) {
        try {
          newTodoListForm.reportValidity();
          throw new Error("No List Name");
        } catch (error) {
          console.log(error);
          return;
        }
      }

      const formData = new FormData(newTodoListForm);
      const newListName = formData.get("listName");

      todoListManager.addTodoList(newListName);

      const temp = renderTodoList(
        newListName,
        todoListManager.getTodoLists().get(newListName)
      );

      toggleNewTodoListDiaglog();
      appendChildren(content, temp);
    });

  // click listener to delete a todo
  document.getElementById("dialogDelete").addEventListener("click", (event) => {
    const listName = event.currentTarget.dataset.list;
    const todoItem = event.currentTarget.dataset.todoItem;

    console.log(todoListManager.getTodoList(listName));
    todoListManager.removeTodoFromList(listName, todoItem);
    // todoListManager.getTodoList(listName).splice(3, 1);
    console.log(todoListManager.getTodoList(listName));

    renderTodoLists();

    console.log(todoItem);

    toggleTodoDialog(true);
  });
})();

export { todoListManager, renderTodoLists };
