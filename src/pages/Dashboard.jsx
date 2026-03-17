import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Dashboard() {
  const [ingressi, setIngressi] = useState([]);

  useEffect(() => {
    fetchIngressi();

    const channel = supabase
      .channel("realtime-ingressi")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ingressi",
        },
        (payload) => {
          setIngressi((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchIngressi() {
    const { data } = await supabase
      .from("ingressi")
      .select("*")
      .order("created_at", { ascending: false });

    setIngressi(data || []);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Dashboard ingressi</h1>

      {ingressi.map((i) => (
        <div
          key={i.id}
          style={{
            padding: 10,
            marginBottom: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <b>{i.nome}</b> — +{i.qta}
          <br />
          <small>
            {new Date(i.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;