import React, {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import './ToDoList.css';

function ToDoList() {
const [taskTitle, setTaskTitle] = useState('');
const [taskDescription, setTaskDescription] = useState('');
const [dueDateTime, setDueDateTime] = useState('');
const [selectedPriority, setSelectedPriority] = useState('');
const [toDoList, setToDoList] = useState([]);
const [completedToDoList, setCompletedToDoList] = useState([]);
const [isCompleteScreen, setIsCompleteScreen] = useState(false);
const [showModal, setShowModal] = useState(false);
const [currentEdit, setCurrentEdit] = useState("");
const [currentEditedObj, setCurrentEditedObj] = useState("");

    const getDay = () =>{
        let today = new Date().getDay();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[today];
    };

    const setColor = (selectElement) => {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        selectElement.style.color = selectedOption.style.color;
      };

    const getBackgroundColor = (priority) => {
        if (priority === "High") {return "rgb(191 36 36)";}
        if (priority === "Medium") {return "rgb(194 138 17)";}
        return "#1d9d22";
    };

    const setDue = (toDoObj) => {
        var due = toDoObj.dueDateTime;
        const [datePart, timePart] = due.split('T');
        const [year, month, day] = datePart.split('-');
        const formattedDate = day + "/" + month + "/" + year;
        return(formattedDate + " at " + timePart);
    };

    const isOverdue = (dueDate) => {
        const currentDate = new Date();
        const taskDueDate = new Date(dueDate);
        return currentDate > taskDueDate;
    };

      //--> // Add the new task to the list of tasks(Next step)

    const handleCreateToDo = () =>{

        if (!taskTitle.trim()) {
            toast.error('Please add Task Title !');
        }
        else if(!taskDescription.trim()){
            toast.error('Please add Task Description !');
        }
        else if(!dueDateTime.trim()){
            toast.error('Please add Task Due !');
        }
        else if(!selectedPriority.trim()){
            toast.error('Please select Task Priority !');
        }
        else
        {
            const newToDoObject = {
                title: taskTitle,
                description: taskDescription,
                dueDateTime: dueDateTime,
                priority: selectedPriority
            };                                      

            let toDoArray = [...toDoList];
            toDoArray.push(newToDoObject);
            setToDoList(toDoArray);

            //OR
            // setToDoList([...toDoList, newToDoObject]); //--> step without creating the ToDoArray array.
            //OR
            // setToDos([...toDoList, {title: taskTitle, description: taskDescription, dueDateTime: dueDateTime, priority: selectedPriority}]) //--> directly passing the new toDo Object to the destructured toDoList array to store task details. 
        
            localStorage.setItem('toDoList', JSON.stringify(toDoArray));

            //// Clear the form fields and set the Color of priority back to element style color.
            setTaskTitle('');
            setTaskDescription('');
            setSelectedPriority('');
            setDueDateTime('');
            document.getElementById('task-priority').style.color = "#626464";
            toast.success('Task Added ! Scroll down to view');
        }
    };

    const handleDeleteToDo = (index) => {
        let reducedToDoArray = [...toDoList];
        reducedToDoArray.splice(index, 1);
        setToDoList(reducedToDoArray);

        localStorage.setItem('toDoList', JSON.stringify(reducedToDoArray));
    };

    const handleCompleteToDO = (index) =>{
        let now = new Date();
        let dd = now.getDate();
        let mm = now.getMonth() + 1;
        let yyyy = now.getFullYear();
        let h = now.getHours();
        let m = now.getMinutes();
        let s = now.getSeconds();
        let completedOn = dd + '/' + mm + '/' + yyyy + ' at ' + h + ':' + m + ':' + s;
        
        let completedTodoObj = {
        ...toDoList[index],
        completedOn: completedOn
        };

        let CompletedToDoArray = [...completedToDoList];
        CompletedToDoArray.push(completedTodoObj);
        setCompletedToDoList(CompletedToDoArray);

        handleDeleteToDo(index);

        localStorage.setItem('completedToDoList', JSON.stringify(CompletedToDoArray));
    };

    const handleDeleteCompletedToDo = (index) =>{
        let reducedCompletedToDoArray = [...completedToDoList];
        reducedCompletedToDoArray.splice(index, 1);
        setCompletedToDoList(reducedCompletedToDoArray);

        localStorage.setItem('completedToDoList', JSON.stringify(reducedCompletedToDoArray));
    };

    const handleEditToDo = (toDoObj, index) => {
        setCurrentEdit(index);
        setCurrentEditedObj(toDoObj);
        setShowModal(true);
    };

    const handleUpdateTitle = (value) =>{
        setCurrentEditedObj((prev) =>{
            return {...prev, title: value};
          })
    };

    const handleUpdateDescription = (value) =>{
        setCurrentEditedObj((prev) =>{
            return {...prev, description: value};
          })
    };

    const handleUpdateDue = (value) =>{
        setCurrentEditedObj((prev) =>{
            return {...prev, dueDateTime: value};
          })
    };

    const handleUpdatePriority = (value) =>{
        setCurrentEditedObj((prev) =>{
            return {...prev, priority: value};
          })
    };

    const handleUpdateToDo = () =>{
        let updatedToDoArray = [...toDoList];
        updatedToDoArray[currentEdit] = currentEditedObj;
        setToDoList(updatedToDoArray)
        setCurrentEdit('')
        toast.success('Task Updated ! ');

        localStorage.setItem('toDoList', JSON.stringify(updatedToDoArray));
    }

    useEffect(() => {
        let savedToDoList = JSON.parse(localStorage.getItem('toDoList'));
        let savedCompletedToDoList = JSON.parse(localStorage.getItem('completedToDoList'));

        if(savedToDoList) {
            setToDoList(savedToDoList);
        };

        
        if(savedCompletedToDoList){
            setCompletedToDoList(savedCompletedToDoList);
        }
    }, [])

  return (
    <div className='container-fluid'>
        <div className='header'>
            <h1 className='display-4'><span style={{color: "#05dba9"}}>T</span>o-<span style={{color: "#05dba9"}}>D</span>o <span style={{color: "#05dba9"}}>List</span></h1>
            <p className='h3 mt-5'>Whoop!... It's {getDay()}! Ready to plan ahead?</p>
        </div>

        <div className='todo-input-wrapper'>
            
            <div className='todo-input'>
                <div className='todo-input-item'>
                    <label htmlFor="task-title">Task Title:</label>
                    <input 
                    type='text' 
                    id="task-title" 
                    name="task-title" 
                    placeholder="What's the task title" 
                    value={taskTitle} 
                    onChange={(e) =>{
                        setTaskTitle(e.target.value);
                    }}></input>
                </div>

                <div className='todo-input-item'>
                    <label htmlFor="task-desc">Description:</label>
                    <textarea 
                    id="task-desc" 
                    name="task-desc" 
                    placeholder="What's the task description" 
                    rows={2}
                    value={taskDescription}
                    onChange={(e) => {
                        setTaskDescription(e.target.value);
                    }}></textarea>
                </div>
            </div>
            <div className='todo-input'>
                <div className='todo-input-item'>
                    <label htmlFor="task-due">Due:</label>
                    <input 
                    type="datetime-local" 
                    id="task-due" 
                    name="task-due"
                    value={dueDateTime}
                    onChange={(e) =>{
                        setDueDateTime(e.target.value);
                    }}></input>
                </div>

                <div className='todo-input-item'>
                    <label htmlFor="task-priority">Priority:</label>
                    <select 
                    id="task-priority" 
                    name="task-priority"
                    value={selectedPriority} 
                    onChange={(e) => {
                        setColor(e.target)
                        setSelectedPriority(e.target.value);}}>
                        <option disabled value=""> -- select an option -- </option>
                        <option value="Low" style={{color: "#00d100"}}>Low</option>
                        <option value="Medium" style={{color: "#ffb10a"}}>Medium</option>
                        <option value="High" style={{color: "#fd1c1c"}}>High</option>
                    </select>
                </div>            
            </div>
            <div className='todo-input-item'>
                    <button 
                    type='button' 
                    className='primaryBtn'
                    onClick={handleCreateToDo}>Create Task</button>
            </div>   
        </div>

        <div className='todo-display-wrapper'>
            <div className='todo-display'>
                <div className='btn-area'>
                    <button 
                    type='button' 
                    className = {`secondaryBtn ${isCompleteScreen === false && 'active'}`}
                    onClick={() => setIsCompleteScreen(false)}>To Do</button>
                    <button 
                    type='button' 
                    className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
                    onClick={() => setIsCompleteScreen(true)}>Completed</button>
                </div>

                <div className='todo-list'>
                    {
                        isCompleteScreen === false && toDoList.map((toDoObj, index) => {
                            return(
                                <div className = "card-wrapper" key={index}>
                                    <div className = "card-top"></div>
                                    <div className = "task-holder">
                                        <span className = "card-header px-3" style={{"backgroundColor": "#e6fef9", "borderRadius": "10px", "color": "#1f1e1e"}}>{toDoObj.title}</span>
                                        <span className = "desc mt-3" defaultValue="NA">{toDoObj.description}</span>
                                        <div className='due-container'>
                                            <p className='due' style={{ textDecoration: isOverdue(toDoObj.dueDateTime) ? 'line-through' : 'none' }}>Due on {setDue(toDoObj)} </p>
                                            {isOverdue(toDoObj.dueDateTime) && (
                                            <span className="overdue-tag">Overdue</span>
                                            )}
                                        </div>
                                        <span className = "priority-tag" style={{"backgroundColor":  getBackgroundColor(toDoObj.priority)}}>{toDoObj.priority} Priority</span>

                                        <div className='icons'>
                                            <i className="fa-solid fa-check check-icon"
                                            title="Mark as Completed"
                                            onClick={() => handleCompleteToDO(index)}></i>

                                            <i className = "far fa-edit mr-3 edit-icon"
                                            title="Edit Task"
                                            onClick={() => handleEditToDo(toDoObj, index)}
                                            ></i>

                                            <i className="fa-solid fa-trash delete-icon"
                                            title="Delete Task"
                                            onClick={() => {handleDeleteToDo(index)}}></i> 
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        isCompleteScreen === true && completedToDoList.map((toDoObj, index)=>{
                        return(
                            <div className = "card-wrapper" key={index}>
                                <div className = "card-top"></div>
                                <div className = "task-holder">
                                    <span className = "card-header px-3" style={{"backgroundColor": "#e6fef9", "borderRadius": "10px", "color": "#1f1e1e"}}>{toDoObj.title}</span>
                                    <span className = "desc mt-3" defaultValue="NA">{toDoObj.description}</span>
                                    <p className='due' style={{"textDecoration": "line-through"}}>Due on {setDue(toDoObj)} .</p>
                                    <p className='status'>Completed on {toDoObj.completedOn}</p>
                                    <span className = "priority-tag" style={{"backgroundColor":  getBackgroundColor(toDoObj.priority)}}>{toDoObj.priority} Priority</span>

                                    <div className='icons'>
                                        <i 
                                        className="fa-solid fa-trash delete-icon"
                                        title="Delete Task"
                                        onClick={() => {handleDeleteCompletedToDo(index)}}></i>
                                        
                                    </div>
                                </div>
                            </div>
                        )}
                        )
                    }

                    {
                    showModal && toDoList.map((toDoObj, index)=>{
                        if(currentEdit === index){
                        return (
                            <div className="modal fade show" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" key={index} style={{ display: 'block' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Task</h1>
                                    <button 
                                    type="button" 
                                    className="btn-close" 
                                    data-bs-dismiss="modal" 
                                    aria-label="Close" 
                                    onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                    <div className="mb-3">
                                        <label htmlFor="task-title" className="form-label">Task Title</label>
                                        <input 
                                        type="text" 
                                        className="form-control" 
                                        id="task-title" 
                                        name="task-title" 
                                        placeholder="What's the task title"
                                        onChange={(e) => handleUpdateTitle(e.target.value)}
                                        value={currentEditedObj.title}/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="task-desc" className="form-label">Description</label>
                                        <textarea 
                                        className="form-control" 
                                        id="task-desc" 
                                        name="task-desc" 
                                        placeholder="What's the task description"
                                        onChange={(e) => handleUpdateDescription(e.target.value)}
                                        value={currentEditedObj.description}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="task-due" className="form-label">Due</label>
                                        <input 
                                        type="datetime-local" 
                                        className="form-control" 
                                        id="task-due" 
                                        name="task-due" 
                                        onChange={(e) => handleUpdateDue(e.target.value)}
                                        value={currentEditedObj.dueDateTime}/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="task-priority" className="form-label">Priority</label>
                                        <select 
                                        className="form-control" 
                                        id="task-priority" 
                                        name="task-priority"
                                        onChange={(e) => {
                                            setColor(e.target)
                                            handleUpdatePriority(e.target.value)}}
                                        value={currentEditedObj.priority}>
                                            <option disabled value=""> -- select an option -- </option>
                                            <option value="Low" style={{color: "#00d100"}}>Low</option>
                                            <option value="Medium" style={{color: "#ffb10a"}}>Medium</option>
                                            <option value="High" style={{color: "#fd1c1c"}}>High</option>
                                        </select>
                                    </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                                    <button 
                                    type="button" 
                                    className="primaryBtn"
                                    onClick={handleUpdateToDo}>Update</button>
                                </div>
                                </div>
                            </div>
                            </div>
                        )}
                        else{
                            return null
                        }
                        })
                    }
                </div>         
            </div>
        </div>
    </div>
  )
}

export default ToDoList