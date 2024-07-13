import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import ToDoList from './components/ToDoList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer theme='dark' autoClose={3000} closeOnClick/>
      < ToDoList />
    </div>
  );
}

export default App;
