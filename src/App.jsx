import { Routes, Route } from "react-router-dom";
import Invitato from "./Invitato";

function App() {
  return (
    <Routes>
      <Route path="/e/:codice" element={<Invitato />} />
    </Routes>
  );
}

export default App;