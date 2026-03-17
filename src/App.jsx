import { Routes, Route } from "react-router-dom";
import Invitato from "./Invitato";
import Admin from "./Admin";
import Iscriviti from "./Iscriviti";

function App() {
  return (
    <Routes>
      <Route path="/e/:codice" element={<Invitato />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/iscriviti" element={<Iscriviti />} />
    </Routes>
  );
}

export default App;