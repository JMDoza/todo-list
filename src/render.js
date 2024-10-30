import { createTodoList } from "./todo";

function renderTodoList(listData) {
  const list1 = createTodoList(listData);

  console.log(list1.getTodoList());
}

export { renderTodoList };
