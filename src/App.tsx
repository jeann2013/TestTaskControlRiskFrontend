import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TasksPage from "./pages/TasksPage";
import PrivateRoute from "./components/PrivateRoute";
import CreateTaskPage from "./pages/CreateTaskPage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
    </ErrorBoundary>
  );
}

export default App;
