import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Dashboard() {
  const [ingressi, setIngressi] = useState([]);
  const [totale, setTotale] = useState(0);

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
          setTotale((prev) => prev + payload.new.qta);
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

    const somma = (data || []).reduce((acc, i) => acc + i.qta, 0);
    setTotale(somma);
  }

  // 📤 EXPORT CSV
  function exportCSV() {
    const rows = [
      ["Nome", "Quantità", "Data"],
      ...ingressi.map((i) => [
        i.nome,
        i.qta,
        new Date(i.created_at).toLocaleString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(";")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "ingressi.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
      <h1>Dashboard Evento</h1>

      {/* KPI */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div style={card}>
          <h3>Totale ingressi</h3>
          <p style={numero}>{totale}</p>
        </div>

        <div style={card}>
          <h3>Eventi registrati</h3>
          <p style={numero}>{ingressi.length}</p>
        </div>
      </div>

      {/* EXPORT */}
      <button onClick={exportCSV} style={btnExport}>
        Esporta CSV
      </button>

      {/* LISTA */}
      <div style={{ marginTop: 20 }}>
        {ingressi.map((i) => (
          <div key={i.id} style={row}>
            <div>
              <b>{i.nome}</b>
              <br />
              <small>
                {new Date(i.created_at).toLocaleString()}
              </small>
            </div>

            <div style={badge}>+{i.qta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

// 🎨 STILI

const card = {
  flex: 1,
  padding: 20,
  background: "#f5f5f5",
  borderRadius: 12,
  textAlign: "center",
};

const numero = {
  fontSize: 28,
  fontWeight: "bold",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 12,
  borderBottom: "1px solid #eee",
};

const badge = {
  background: "green",
  color: "white",
  padding: "6px 12px",
  borderRadius: 20,
  fontWeight: "bold",
};

const btnExport = {
  padding: "10px 20px",
  background: "#000",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};