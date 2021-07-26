import React from "react";
import "./Todo.css";

/** Simple presentation component for a todo.
 *
 * Props:
 * - todo: like { id, title, description }
 * - remove()
 *
 * { TodoList } -> Todo
 **/

function Todo({ todo, remove }) {
  console.log("Todo", todo);

  function handleDelete() {
    remove(todo.id);
  }

  return (
    <div className="Todo card">
      <div><b>{todo.title}</b></div>
      <div><small>{todo.description}.</small></div>
      <div><button
              className="btn btn-sm text-danger"
              onClick={handleDelete}>
              Remove
          </button>
      </div>
    </div>
  );
}

export default Todo;
