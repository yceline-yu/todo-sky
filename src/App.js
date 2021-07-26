import { useState, useEffect } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { client } from './skynet';
import { ContentRecordDAC } from '@skynetlabs/content-record-library';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { uniqueId } from 'lodash';

/** App
 * props: none
 * state: none
 * 
 * App -> { TodoList, ToDoForm }
 */
function App() {
  const dataDomain = 'localhost';
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState(dataDomain + '/');
  const [userID, setUserID] = useState();
  const [mySky, setMySky] = useState();
  // const [dataKey, setDataKey] = useState('');
  const [loggedIn, setLoggedIn] = useState(null);

  const contentRecord = new ContentRecordDAC();

  console.log("APP client", client);

  // useEffect(() => {
  //   setFilePath(dataDomain + '/' + dataKey);
  // }, [dataKey]);

  useEffect(() => {
    // define async setup function
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);
        console.log("APP contentRecord", contentRecord);
        // load necessary DACs and permissions
        await mySky.loadDacs(contentRecord);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          let { data } = await mySky.getJSON(filePath);
          console.log("APP load data", data);
          if (data === null) {
            data = [];
          }
          setTodos(data);
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    }

    // call async setup function
    initMySky();

  }, []);

  const loadData = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('Loading user data from SkyDB');
    // Use getJSON to load the user's information from SkyDB
    let { data } = await mySky.getJSON(filePath);
    console.log("APP load data", data);
    if (data === null) {
      data = [];
    }
    setTodos(data);

    setLoading(false);
  };

  const handleMySkyWrite = async (jsonData) => {
    // Use setJSON to save the user's information to MySky file
    try {
      console.log('userID', userID);
      console.log('filePath', filePath);
      await mySky.setJSON(filePath, jsonData);
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }
  };

  const handleMySkyLogin = async () => {
    // Try login again, opening pop-up. Returns true if successful
    const status = await mySky.requestLoginAccess();

    // set react state
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }
  };

  const handleMySkyLogout = async () => {
    // call logout to globally logout of mysky
    await mySky.logout();

    //set react state
    setLoggedIn(false);
    setUserID('');
  };

  async function addTodo(newTodo) {
    let newDo = { ...newTodo, id: uniqueId() }
    console.log("newDo APP", newDo);
    let newTotalTodo = [...todos, newDo];
    setLoading(true);
    await handleMySkyWrite(newTotalTodo);
    setTodos(newTotalTodo);
    setLoading(false);
  }

  async function remove(id) {
    let updatedTodos = todos.filter(todo => todo.id !== id);
    setLoading(true);
    await handleMySkyWrite(updatedTodos);
    setTodos(updatedTodos);
    setLoading(false);
  }

  if (loggedIn === null) {
    return <div className="App">Loading...</div>
  }

  // if (loading) {
  //   return <div className="App">Updating...</div>
  // }

  let formSection = <><div className="col-md-3">
    <section>
      <h3 className="Todo-title mb-3">Todos</h3>
      {loading ? <p>"Updating..."</p> : null}
      {todos.length === 0
        ? <span className="text-muted">You have no todos.</span>
        : <TodoList todos={todos} remove={remove} />
      }
      {/* <button className="App-button btn btn-primary" onClick={loadData}>Load</button> */}
    </section>
  </div>
    <div className="col-md-3">
      <section>
        <h3 className="mb-3">Add Todo</h3>
        <TodoForm initialFormData={{ title: "", description: "" }} handleSave={addTodo} />
      </section>
    </div></>

  return (
    <main className="App">
      <div className="row">
        <div className="col-md-3">
          {loggedIn === true && (
            <button className="App-button btn btn-primary" onClick={handleMySkyLogout}>
              Log Out of MySky
            </button>
          )}
          {loggedIn === false && (
            <button className="App-button btn btn-primary" onClick={handleMySkyLogin}>
              Login with MySky
            </button>
          )}
        </div>
        {loggedIn === true && (formSection)}
      </div>
    </main>
  );
}

export default App;
