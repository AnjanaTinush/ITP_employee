import { useState, useEffect } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import logo from "../css/delete-icon.png";
import "../css/AllTasks.css";
import { Link } from "react-router-dom";

export default function AllTask() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [taskIdToDelete, setTaskIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/auth/users/AllTasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCompleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: true } : task
      )
    );
  };

  // Function to handle the search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter tasks based on search term for both task name and staff ID
  const filteredTasks = tasks.filter(
    (task) =>
      task.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.stafffid.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="task-list-heading text-2xl font-bold mb-4">All Tasks</h2>
      <h3 id="select-task-topic" className="text-lg mb-6 font-serif font-bold">
        Please select your task according to your assigned staff ID
      </h3>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by task name or staff ID"
          className="border-3 border-blue-800 rounded-2xl p-2  text-center"
          style={{ width: "528px" }}
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="task-list grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="task-item bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col"
            >
              <div className="task-item-details mb-4">
                <h4 className="text-lg font-semibold text-gray-800 text-center">
                  {task.task_name}
                </h4>
                <p className="text-sm text-gray-600">
                  <strong className="font-semibold">Staff ID:</strong>{" "}
                  {task.stafffid}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-semibold">Description:</strong>{" "}
                  {task.task_description}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-semibold">Start Date:</strong>{" "}
                  {task.start_date}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-semibold">End Date:</strong>{" "}
                  {task.end_date}
                </p>
              </div>
              <div className="task-item-actions flex justify-between items-center mt-auto">
                <Link
                  to={`/update-task/${task._id}`}
                  className="task-item-update-btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  onClick={() => handleCompleteTask(task._id)}
                >
                  Update My Task
                </Link>
                <button
                  className="task-item-status-btn text-white py-1 px-3 rounded"
                  style={{
                    backgroundColor: task.is_complete ? "red" : "yellow",
                  }}
                >
                  {task.is_complete ? "Completed" : "Pending"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">You have no tasks yet!</p>
      )}
    </div>
  );
}
