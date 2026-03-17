import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitato } from "../services/invitati";

function Invitato() {
  const { codice } = useParams();
  const [invitato, setInvitato] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await getInvitato(codice);

      if (!error) setInvitato(data);
      setLoading(false);
    }

    fetchData();
  }, [codice]);

  if (loading) return <p>Caricamento...</p>;
  if (!invitato) return <p>Invitato non trovato</p>;

  const disponibili = invitato.posti_previsti - invitato.posti_usati;

  return (
    <div style={{ padding: 30 }}>
      <h1>{invitato.nome}</h1>
      <p>
        Posti: {invitato.posti_usati} / {invitato.posti_previsti}
      </p>

      {disponibili > 0 ? (
        <p style={{ color: "green" }}>Posti disponibili</p>
      ) : (
        <p style={{ color: "red" }}>Evento pieno</p>
      )}
    </div>
  );
}

export default Invitato;