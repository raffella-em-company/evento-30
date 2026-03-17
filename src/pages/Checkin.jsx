import { useState } from "react";
import { getInvitato, entraInvitato } from "../services/invitati";

function Checkin() {
  const [codice, setCodice] = useState("");
  const [invitato, setInvitato] = useState(null);

  async function cerca() {
    const { data } = await getInvitato(codice);
    setInvitato(data);
  }

  async function entra() {
    await entraInvitato(codice, 1);

    const { data } = await getInvitato(codice);
    setInvitato(data);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Check-in</h1>

      <input
        placeholder="Scansiona o inserisci codice"
        value={codice}
        onChange={(e) => setCodice(e.target.value)}
      />

      <button onClick={cerca}>Cerca</button>

      {invitato && (
        <div style={{ marginTop: 30 }}>
          <h2>{invitato.nome}</h2>

          <p>
            {invitato.posti_usati}/{invitato.posti_previsti}
          </p>

          <button onClick={entra}>+1 Entrata</button>
        </div>
      )}
    </div>
  );
}

export default Checkin;