import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invitato from "./pages/Invitato";
import Iscriviti from "./pages/Iscriviti";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/e/:codice" element={<Invitato />} />
        <Route path="/iscriviti" element={<Iscriviti />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;