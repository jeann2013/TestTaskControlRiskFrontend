import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TasksPage from "./pages/TasksPage";
import PrivateRoute from "./components/PrivateRoute";
import CreateTaskPage from "./pages/CreateTaskPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<CreateTaskPage />} />


        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TasksPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
