import { useState, useEffect } from "react";

function App() {
  const [ showForm, setShowForm] = useState(false);

 const [tasks, setTasks] = useState(() => {
  try {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
 });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const [ showManager, setShowManager] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } , [tasks]);

function submitTask (){
  const newTask ={
    id: Date.now(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    image: image,
    message: message,
    status: "todo"
  };

  setTasks([...tasks,newTask]);

  setFirstName("");
  setLastName("");
  setEmail("");
  setImage("");
  setMessage("");

  setShowForm(false);
}

function handleDragStart(e, taskId) {
  e.dataTransfer.setData("taskId", taskId.toString());
}

function handleDrop(e, newStatus) {
  e.preventDefault();

  const taskId = Number(e.dataTransfer.getData("taskId"));

  setTasks((previousTasks) =>
    previousTasks.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    )
  );
}

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">
         <span className="logo-icon">✓</span>
         <span className="logo-text">Talksy</span>
       </div>

        <div className="auth-buttons">
          <button>Sign up</button>
          <button>Register</button>
        </div>
      </header>

      {/* Main Content */}
      <main>

        {/*WELCOME SCREEN */}

        {!showForm && !showManager && (
  <section className="welcome-section">
    <div className="welcome-content">
      <p className="welcome-small">WELCOME TO TASKLY</p>

      <h1>
        Organize your work.
        <br />
        <span>Get things done.</span>
      </h1>

      <p className="welcome-description">
        Create tasks, manage your work and move completed
        tasks from TO-DO to DONE.
      </p>

      <div className="welcome-stats">
        <div>
          <strong>{tasks.length}</strong>
          <span>Total Tasks</span>
        </div>

        <div>
          <strong>
            {tasks.filter((task) => task.status === "todo").length}
          </strong>
          <span>To-Do</span>
        </div>

        <div>
          <strong>
            {tasks.filter((task) => task.status === "done").length}
          </strong>
          <span>Completed</span>
        </div>
      </div>
    </div>

    <div className="welcome-visual">
      <div className="floating-card card-one">
        <span>✓</span>
        Finish Project
      </div>

      <div className="floating-card card-two">
        <span>○</span>
        Design Homepage
      </div>

      <div className="floating-card card-three">
        <span>✓</span>
        Team Meeting
      </div>
    </div>
  </section>
)}

        {/* Task Buttons */}
        <div className="task-buttons">
          <button 
          onClick={() => {
            setShowForm(true);
            setShowManager(false);
            }}
            >Add Task</button>
          <button 
          onClick={() => {
            setShowManager(true);
            setShowForm(false);
          }}
            >Task Manager</button>
        </div>

        {/* Form Section */}
        {showForm && (
        <section className="task-section">

          <div className="task-form">

            <h2>Add to Task</h2>

            <p>Fill out the form below.</p>

            {/* First Name and Last Name */}
            <div className="name-row">

              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

            </div>

            {/* Email */}
            <div className="form-group full-width">
              <label>Email</label>

              <input
                type="email"
                placeholder="john.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Image */}
            <div className="form-group full-width">
              <label>Image</label>

              <select
                value={image}
                onChange={(e) => setImage(e.target.value)}
              >
                <option value="">Select an image</option>
                <option value="Profile Image">Profile Image</option>
                <option value="Company Image">Company Image</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="form-group full-width">
              <label>Description</label>

              <textarea
                placeholder="Describe Your day..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            {/* Submit */}
            <button 
            className="submit-btn"
            onClick={submitTask}
            >
              Submit 
            </button>

          </div>

        </section>
        )}

        {/*  TASK MANAGER */}

          {showManager && (
      <section className="task-manager">

        <h2>Task Manager</h2>
       <button
            className="clear-btn"
            onClick={() => setTasks([])}
          >
            🗑️ Clear All Tasks
          </button>  
        <div className="task-board">

        

          {/* TO-DO */}
          <div
      className="task-column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, "todo")}
    >
      <h3>📋 TO-DO</h3>

      {tasks
        .filter((task) => task.status === "todo")
        .map((task) => (
          <div
            className="task-card"
            key={task.id}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, task.id)}
          >
            <h3>
              {task.firstName} {task.lastName}
            </h3>

            <p>
              <strong>Email:</strong> {task.email}
            </p>

            <p>
              <strong>Image:</strong> {task.image}
            </p>

            <p>
              <strong>Description:</strong> {task.message}
            </p>
          </div>
        ))}
    </div>


              {/* DONE */}
              <div
          className="task-column"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "done")}
        >
          <h3>✅ DONE</h3>

          {tasks
            .filter((task) => task.status === "done")
            .map((task) => (
              <div
                className="task-card"
                key={task.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <h3>
                  {task.firstName} {task.lastName}
                </h3>

                <p>
                  <strong>Email:</strong> {task.email}
                </p>

                <p>
                  <strong>Image:</strong> {task.image}
                </p>

                <p>
                  <strong>Description:</strong> {task.message}
                </p>

                <p>✅ Completed</p>
              </div>
            ))}
        </div>

            </div>

  </section>
)}

      </main>

    </div>
  );
}

export default App;