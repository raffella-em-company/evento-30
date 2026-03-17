import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("invitati")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);

      setData(data || []);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Invitati</h1>
      {data.map((item) => (
        <div key={item.id}>
          {item.nome} - {item.codice}
        </div>
      ))}
    </div>
  );
}

export default App;