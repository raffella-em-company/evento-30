import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invitato from "./pages/Invitato";
import Iscriviti from "./pages/Iscriviti";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/e/:codice" element={<Invitato />} />
        <Route path="/iscriviti" element={<Iscriviti />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;