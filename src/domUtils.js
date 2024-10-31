function createElement(elementType, className = "", textContent = "", id = "") {
  const element = document.createElement(elementType);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  if (id) {
    element.id = id;
  }

  return element;
}

function appendChildren(parent, ...children) {
  children.forEach((child) => parent.appendChild(child));
}

function toggleElementDisplayBlock(element) {
  element.classList.toggle("hide");
}

export { createElement, appendChildren, toggleElementDisplayBlock };
