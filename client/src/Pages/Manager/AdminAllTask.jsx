import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import logo from "../css/delete-icon.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/AdminTasks.css";

export default function AdminAllTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) =>
        task.stafffid.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/auth/users/AllTasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/user/deletetask/${orderIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("Delete failed:", data.message);
      } else {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== orderIdToDelete)
        );
        setOrderIdToDelete("");
        console.log("Task deleted successfully");
      }
      setShowModal(false);
    } catch (error) {
      console.log("Error deleting task:", error.message);
    }
  };

  const handleCompleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, is_complete: true } : task
      )
    );
  };

  return (
    <div className="task-overview">
      <h2 className="overview-heading">Admin All Tasks</h2>

      <div className="search-container">
        <TextInput
          id="search"
          type="text"
          placeholder="Search by user name"
          required={true}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTasks.length > 0 ? (
        <ul className="task-list-container">
          {filteredTasks.map((task) => (
            <li key={task._id} className="task-item-card">
              <div className="task-info">
                <h4 className="task-info-detail task-name">{task.task_name}</h4>
                <p className="task-info-detail">
                  <strong>User name:</strong> {task.stafffid}
                </p>
                <p className="task-info-detail">
                  <strong>Description:</strong> {task.task_description}
                </p>
                <p className="task-info-detail">
                  <strong>Start Date:</strong> {task.start_date}
                </p>
                <p className="task-info-detail">
                  <strong>End Date:</strong> {task.end_date}
                </p>
              </div>
              <div className="task-action-buttons">
               
                <Button
                  color="failure"
                  onClick={() => {
                    setShowModal(true);
                    setOrderIdToDelete(task._id);
                  }}
                  className="delete-task-button"
                >
                  <img
                    src={logo}
                    alt="delete icon"
                    className="delete-icon-img"
                  />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-tasks-message">No tasks found.</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="modal-content-wrapper">
            <HiOutlineExclamationCircle className="modal-warning-icon" />
            <h3 className="modal-warning-text">
              Are you sure you want to delete this Task?
            </h3>
          </div>
          <div className="modal-action-buttons">
            <Button
              color="failure"
              onClick={handleDeleteOrder}
              className="modal-confirm-button"
            >
              Yes, I'm sure
            </Button>
            <Button
              color="gray"
              onClick={() => setShowModal(false)}
              className="modal-cancel-button"
            >
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}