import { useState, useEffect } from "react";
import "../css/AllTasks.css";
import { Button, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Add this import
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AllTask() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderIdToDelete, setOrderIdToDelete] = useState("");
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

  const handleCompleteTask = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";

    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_complete: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, is_complete: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.stafffid.toString().includes(searchTerm)
  );

  const generateReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const pdfName = `Tasks_Report_${currentDate}.pdf`;

    doc.setFontSize(20);
    doc.text("Tasks Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 20, 30);
    doc.text(`Time: ${currentTime}`, doc.internal.pageSize.getWidth() - 50, 30);

    const tableHeaders = [
      "Staff ID",
      "Task Name",
      "Description",
      "Start Date",
      "End Date",
      "Status",
    ];

    const data = filteredTasks.map((task) => [
      task.stafffid,
      task.task_name,
      task.task_description,
      task.start_date,
      task.end_date,
      task.is_complete ? "Completed" : "Pending",
    ]);

    doc.autoTable({
      startY: 40,
      head: [tableHeaders],
      body: data,
    });

    doc.save(pdfName);
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

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="task-list-heading text-2xl font-bold mb-4">All Tasks</h2>
      <h3 id="select-task-topic" className="text-lg mb-6 font-serif font-bold">
        Here are all staff tasks according to your assigned staff ID
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
        <button
          icon={
            <Icon
              icon="ph:printer"
              className="text-gray-300 h-12 w-12 bg-rounded-lg"
            />
          }
          className="bg-green-600 text-white py-1 px-3 rounded"
          onClick={generateReport}
        >
          Explore PDF
        </button>
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
                  <strong className="font-semibold">User name :</strong>{" "}
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
                >
                  Update Task
                </Link>

                <Button
                  color="failure"
                  onClick={() => {
                    setShowModal(true);
                    setOrderIdToDelete(task._id);
                  }}
                  className="task-item-delete-btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                >
                  Delete
                </Button>
              </div>

              {/* Modal for confirming delete */}
              <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500">
                      Are you sure you want to delete this task?
                    </h3>
                    <div className="flex justify-center gap-4">
                      <Button color="failure" onClick={handleDeleteOrder}>
                        Yes, I'm sure
                      </Button>
                      <Button
                        color="gray"
                        onClick={() => setShowModal(false)}
                      >
                        No, cancel
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No tasks found.</p>
      )}
    </div>
  );
}
