// src/App.tsx
import { lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddNote = lazy(() => import("./pages/AddNote"));
const EditNote = lazy(() => import("./pages/EditNote"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/add" element={<AddNote />} />
          <Route path="*" element={<Login />} />
          <Route path="/edit/:id" element={<EditNote />} /> {/* ✅ Add edit route */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
