import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { Link } from "react-router-dom";

export default function Tasks() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => (await api.get("/tasks")).data,
  });

  const deleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onMutate: async (id) => {
      const previous = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old) =>
        old.filter((t) => t.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(["tasks"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries(["tasks"]),
  });

  if (tasksQuery.isLoading) return <p>Cargando...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Mis Tareas</h1>
        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded"
          to="/tasks/create"
        >
          Crear
        </Link>
      </div>

      <div className="space-y-3">
        {tasksQuery.data.map((t) => (
          <div key={t.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-bold">{t.title}</h3>
            <p>{t.description}</p>

            <div className="mt-3 flex gap-2">
              <Link
                to={`/tasks/edit/${t.id}`}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Editar
              </Link>

              <button
                onClick={() => deleteTask.mutate(t.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
