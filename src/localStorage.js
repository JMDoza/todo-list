function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function saveData(data) {
  const todoListObject = {};

  //List of todoLists
  const todoLists = Array.from(data);

  // Loop through array of todo lists
  for (const [listName, listObject] of todoLists) {
    // loop through todo items of each list then create object with data and
    todoListObject[listName] = listObject.getTodoList().map((todo) => ({
      title: todo.getTitle(),
      desc: todo.getDesc(),
      priority: todo.getPriority(),
      status: todo.getStatus(),
      createdDate: todo.getCreatedDate(),
      lastModifiedDate: todo.getLastModifiedDate(),
      dueDate: todo.getDueDate(),
    }));
  }
  localStorage.setItem("todoLists", JSON.stringify(todoListObject));
  console.log("Saved");
}

function loadData() {
  return JSON.parse(localStorage.getItem("todoLists"));
}

export { saveData, loadData };
