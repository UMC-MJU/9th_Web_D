import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout";
import NameEnterModal from "./components/NameEnterModal";

function App() {
  const [username, setUsername] = useState("");
  const location = useLocation();

  const handleNameSubmit = (name: string) => {
    setUsername(name);
  };

  return (
    <>
      <Layout username={username}>
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold text-white">
            {username ? `Welcome, ${username}!` : "Welcome"}
          </h1>
        </div>
      </Layout>
      <Routes>
        <Route
          path="/enter-name"
          element={
            <NameEnterModal
              isOpen={location.pathname === "/enter-name"}
              onClose={() => {}}
              onNameSubmit={handleNameSubmit}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
