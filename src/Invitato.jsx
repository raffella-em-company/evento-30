import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function Invitato() {
  const { codice } = useParams();
  const [invitato, setInvitato] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchInvitato() {
    const { data } = await supabase
      .from("invitati")
      .select("*")
      .eq("codice", codice)
      .single();

    setInvitato(data);
  }

  useEffect(() => {
    fetchInvitato();
  }, [codice]);

  async function entra(numero) {
    if (!invitato) return;

    const nuoviUsati = invitato.posti_usati + numero;

    if (nuoviUsati > invitato.posti_previsti) {
      alert("Posti esauriti");
      return;
    }

    setLoading(true);

    await supabase
      .from("invitati")
      .update({ posti_usati: nuoviUsati })
      .eq("id", invitato.id);

    await fetchInvitato();
    setLoading(false);
  }

  if (!invitato) return <div>Caricamento...</div>;

  const disponibili =
    invitato.posti_previsti - invitato.posti_usati;

  return (
    <div style={{ padding: 40 }}>
      <h1>{invitato.nome}</h1>

      <h2>Disponibili: {disponibili}</h2>

      {disponibili > 0 ? (
        <>
          <button onClick={() => entra(1)} disabled={loading}>
            Entra 1
          </button>

          <button onClick={() => entra(2)} disabled={loading}>
            Entra 2
          </button>

          <button onClick={() => entra(3)} disabled={loading}>
            Entra 3
          </button>
        </>
      ) : (
        <h2 style={{ color: "red" }}>COMPLETO</h2>
      )}
    </div>
  );
}

export default Invitato;