import React, { useState } from "react";


/** Form for adding.
 *
 * Props:
 * - initialFormData
 * - handleSave: function to call in parent.
 *
 * { App } -> TodoForm
 */

function TodoForm({ initialFormData, handleSave }) {

  const [formData, setFormData] = useState(initialFormData);
  console.log("TodoForm formData ->", formData);

  /** Update form input. */
  function handleChange(evt) {
    const { name, value } = evt.target
    setFormData(currData => ({ ...currData, [name]: value }));
  };

  /** Call parent function and clear form. */
  function handleSubmit(evt) {
    evt.preventDefault();
    handleSave(formData);
    setFormData(initialFormData);
  }

  return (
    <form className="NewTodoForm" onSubmit={handleSubmit}>

      <div className="form-group">
        <input
          id="newTodo-title"
          name="title"
          className="form-control"
          placeholder="Title"
          onChange={handleChange}
          value={formData.title}
          aria-label="Title"
        />
      </div>

      <div className="form-group">
        <textarea
          id="newTodo-description"
          name="description"
          className="form-control"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          aria-label="Description"
        />
      </div>

      <div className="form-group d-flex justify-content-between">
        <button className="btn-primary rig btn btn-sm">
          Add
          </button>
      </div>

    </form>
  );
}

export default TodoForm;
