import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function Invitato() {
  const { codice } = useParams();
  const [invitato, setInvitato] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchInvitato() {
    const { data, error } = await supabase
      .from("invitati")
      .select("*")
      .eq("codice", codice)
      .single();

    if (!error) {
      setInvitato(data);
    }
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

    if (error || data === false) {
      alert("Posti esauriti");
    }

    setLoading(false);
  }

  if (!invitato) return <div>Caricamento...</div>;

  const disponibili =
    invitato.posti_previsti - invitato.posti_usati;

  const puòEntrare = (numero) => disponibili >= numero;

  return (
    <div style={{ padding: 40 }}>
      <h1>{invitato.nome}</h1>

      <h2>Disponibili: {disponibili}</h2>

      {disponibili > 0 ? (
        <>
          {puòEntrare(1) && (
            <button
              onClick={() => entra(1)}
              disabled={loading}
            >
              Entra 1
            </button>
          )}

          {puòEntrare(2) && (
            <button
              onClick={() => entra(2)}
              disabled={loading}
            >
              Entra 2
            </button>
          )}

          {puòEntrare(3) && (
            <button
              onClick={() => entra(3)}
              disabled={loading}
            >
              Entra 3
            </button>
          )}
        </>
      ) : (
        <h2 style={{ color: "red" }}>COMPLETO</h2>
      )}
    </div>
  );
}

export default Invitato;