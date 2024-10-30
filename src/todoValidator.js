import { isValid, isBefore } from "date-fns";

function validateDueDate(dueDate) {
  if (dueDate && !isValid(dueDate)) {
    throw new Error("Invalid due date format");
  } else if (dueDate && isBefore(new Date())) {
    throw new Error("Due date before current date");
  }
}

export { validateDueDate };
