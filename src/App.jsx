import { Routes, Route } from "react-router-dom";
import Invitato from "./Invitato";
import Admin from "./Admin";

function App() {
  return (
    <Routes>
      <Route path="/e/:codice" element={<Invitato />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;