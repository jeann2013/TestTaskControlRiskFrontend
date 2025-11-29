import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { useAuthStore } from "../auth/useAuthStore";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  subtasks: string[];
}

export default function TasksPage() {
  const { request } = useApi();
  const { role } = useAuthStore();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "pending",
  });

  // IA Analysis result
const [aiResult, setAiResult] = useState<any | null>(null);

// Subtask suggestions result
const [suggestResult, setSuggestResult] = useState<any | null>(null);



  async function loadTasks() {
    try {
      const res = await request("https://localhost:7179/tasks?Page=1&PageSize=10");

      if (!res.ok) throw new Error("Failed to load tasks");

      const data = await res.json();
      
      const tasksArray = Array.isArray(data) ? data : (data.items || data.tasks || data.data || []);
      setTasks(tasksArray);
    } catch (err) {
      console.error(err);
      alert("Error loading tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function startEditing(task: TaskItem) {
    setEditingTask(task);
    setEditForm({
      title: task.title || (task as any).Title,
      description: task.description || (task as any).Description,
      priority: (task.priority || (task as any).Priority) ?? "pending",
    });
  }

  async function analyzeTask(task: TaskItem) {
  const res = await request("https://localhost:7179/tasks/analyze", {
    method: "POST",
    body: JSON.stringify({ text: task.description })
  });

  if (!res.ok) {
    alert("Error analyzing task");
    return;
  }

  const data = await res.json();
  setAiResult(data);
}

async function suggestSubtasks(task: TaskItem) {
  const res = await request("https://localhost:7179/tasks/suggest", {
    method: "POST",
    body: JSON.stringify({ text: task.description })
  });

  if (!res.ok) {
    alert("Error getting suggestions");
    return;
  }

  const data = await res.json();
  setSuggestResult(data);
}


  async function completeTask(id: string) {
  const res = await request(`https://localhost:7179/tasks/${id}/complete`, {
    method: "PATCH",
  });

  if (!res.ok) {
    alert("Error completing task");
    return;
  }

  // Update the UI without reloading everything
  setTasks((prev) =>
    prev.map((t) =>
      t.id === id ? { ...t, priority: "done" } : t
    )
  );

  alert("Task marked as completed!");
}


  async function deleteTask(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const res = await request(`https://localhost:7179/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Error deleting task");
      return;
    }

    // Remove task from UI instantly (Optimistic Update)
    setTasks((prev) => prev.filter((t) => t.id !== id));

    alert("Task deleted");
}


  async function updateTask() {
    if (!editingTask) return;

    const res = await request(
      `https://localhost:7179/tasks/${editingTask.id || (editingTask as any).Id}`,
      {
        method: "PUT",
        body: JSON.stringify(editForm),
      }
    );

    if (res.ok) {
      await loadTasks();
      setEditingTask(null);
      return;
    }

    alert("Failed to update task");
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Tasks (Role: {role})</h1>

      <div className="flex justify-end mb-4">
        {role === 'Admin' && (
          <a
            href="/create"
            className="bg-blue-600 px-3 py-2 rounded"
          >
            + Add Task
          </a>
        )}
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        
        <ul className="space-y-4">
          {tasks.map((task) => (
          <li
            key={task.id || (task as any).Id}
            className={`bg-white p-4 rounded mb-2 border flex justify-between items-start ${
              (task.priority || (task as any).Priority) === "done" ? "opacity-50 line-through" : ""
            }`}
          >
            <div>
              <h3 className="text-lg font-bold text-black">{task.title || (task as any).Title}</h3>
              <p className="text-gray-600">{task.description || (task as any).Description}</p>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                className="bg-yellow-600 px-3 py-1 rounded"
                onClick={() => startEditing(task)}
              >
                Edit
              </button>

              {(task.priority || (task as any).Priority) !== "done" && (
                <button
                  className="bg-green-600 px-3 py-1 rounded"
                  onClick={() => completeTask(task.id || (task as any).Id)}
                >
                  Complete
                </button>
              )}

              {role === 'Admin' && (
                <button
                  className="bg-red-600 px-3 py-1 rounded"
                  onClick={() => deleteTask(task.id || (task as any).Id)}
                >
                  Delete
                </button>
              )}

              <button
                className="bg-purple-600 px-3 py-1 rounded"
                onClick={() => analyzeTask(task)}
              >
                Analyze
              </button>

              <button
                className="bg-indigo-600 px-3 py-1 rounded"
                onClick={() => suggestSubtasks(task)}
              >
                Suggest
              </button>
            </div>
          </li>

          ))}
        </ul>
      )}

      {aiResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">

          <div className="bg-gray-900 p-6 rounded w-96">
            
            <h2 className="text-xl mb-4">AI Analysis</h2>

            <p className="mb-2"><strong>Summary:</strong> {aiResult.summary}</p>
            <p className="mb-2"><strong>Suggested Priority:</strong> {aiResult.priority}</p>

            <button
              className="bg-gray-700 px-3 py-1 rounded mt-4"
              onClick={() => setAiResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {suggestResult && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-900 p-6 rounded w-96">
          
          <h2 className="text-xl mb-4">Suggested Subtasks</h2>

          <ul className="list-disc pl-5">
            {suggestResult.subtasks.map((s: string, index: number) => (
              <li key={index}>{s}</li>
            ))}
          </ul>

          <button
            className="bg-gray-700 px-3 py-1 rounded mt-4"
            onClick={() => setSuggestResult(null)}
          >
            Close
          </button>
        </div>
      </div>
    )}



      {/* ✔ MODAL PARA EDITAR TAREA */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded w-96">
            <h2 className="text-xl mb-4">Edit Task</h2>

            <input
              className="w-full p-2 mb-2 bg-gray-800 rounded"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />

            <textarea
              className="w-full p-2 mb-2 bg-gray-800 rounded"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-700 px-3 py-1 rounded"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>

              <button
                className="bg-blue-600 px-3 py-1 rounded"
                onClick={updateTask}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
