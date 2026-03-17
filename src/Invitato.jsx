import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function Invitato() {
  const { codice } = useParams();
  const [invitato, setInvitato] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successo, setSuccesso] = useState(false);
  const isStaff = false; // temporaneo

  {isStaff && disponibili > 0 && (
  <>
    <button onClick={() => entra(1)}>Entra 1</button>
    ...
  </>
)}

  async function fetchInvitato() {
    const { data, error } = await supabase
      .from("invitati")
      .select("*")
      .eq("codice", codice)
      .single();

    if (!error) setInvitato(data);
  }

  useEffect(() => {
    fetchInvitato();

    const channel = supabase
      .channel("realtime-invitati")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "invitati",
          filter: `codice=eq.${codice}`,
        },
        (payload) => {
          setInvitato(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [codice]);

    async function entra(numero) {
    if (!invitato) return;

    setLoading(true);

    const { data, error } = await supabase.rpc("incrementa_posti", {
        id_invitato: invitato.id,
        quanti: numero,
    });

    if (error) {
        alert("Errore");
    } else if (data === "NOT_FOUND") {
        alert("Invitato non trovato");
    } else if (data === "FULL") {
        alert("Posti esauriti");
    } else if (data === "OK") {
        setSuccesso(true);

        if (navigator.vibrate) navigator.vibrate(100);

        setTimeout(() => setSuccesso(false), 2500);
    }

    setLoading(false);
    }

  if (!invitato) return <div>Caricamento...</div>;

  const disponibili =
    invitato.posti_previsti - invitato.posti_usati;

  // 🔥 BOTTONI DINAMICI
  const opzioni = Array.from(
    { length: disponibili },
    (_, i) => i + 1
  );

  return (
    <div style={{ padding: 40 }}>
      <h1>{invitato.nome}</h1>

      <h2>Disponibili: {disponibili}</h2>

      {successo && (
        <div
          style={{
            background: "#00c853",
            color: "white",
            padding: "20px",
            fontSize: "24px",
            textAlign: "center",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          ✔ INGRESSO REGISTRATO
        </div>
      )}

      {disponibili > 0 ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {opzioni.map((n) => (
            <button
              key={n}
              onClick={() => entra(n)}
              disabled={loading}
              style={{
                padding: "15px 20px",
                fontSize: "18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Entra {n}
            </button>
          ))}
        </div>
      ) : (
        <h2 style={{ color: "red" }}>COMPLETO</h2>
      )}
    </div>
  );
}

export default Invitato;