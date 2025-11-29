import { useState } from "react";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

export default function CreateTaskPage() {
  const { request } = useApi();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  async function submitTask(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await request("https://localhost:7179/tasks", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/tasks");
    } else {
      alert("Error creating task");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={submitTask}
        className="bg-gray-900 p-6 rounded w-96 shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4">Create Task</h1>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-800"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className="w-full p-2 mb-3 rounded bg-gray-800"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 w-full p-2 rounded disabled:bg-gray-700"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
