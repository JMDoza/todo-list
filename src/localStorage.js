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
