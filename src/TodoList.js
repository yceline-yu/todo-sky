import Todo from "./Todo";

/** Show list of todos.
 *
 * Props:
 * - todos: array of [ todo, ... ]
 * - remove(): fn to call to remove a todo
 *
 * App -> TodoList -> Todo
 */
function TodoList({todos, remove}) {

  let list = todos.map(todo =>
      <Todo
        key={todo.id}
        todo={todo}
        remove={remove} />)

  return (
    <div>
      <ul>
        {list}
      </ul>
    </div>
  );
}

export default TodoList;