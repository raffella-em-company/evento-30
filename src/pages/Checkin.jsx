import { useState } from "react";
import { getInvitato, entraInvitato } from "../services/invitati";

function Checkin() {
  const [codice, setCodice] = useState("");
  const [invitato, setInvitato] = useState(null);
  const [loading, setLoading] = useState(false);

  async function cerca() {
    if (!codice) return;

    setLoading(true);

    const { data, error } = await getInvitato(codice);

    if (!error) {
      setInvitato(data);
    } else {
      setInvitato(null);
      alert("Invitato non trovato");
    }

    setLoading(false);
  }

  async function handleEntra() {
    if (!invitato) return;

    await entraInvitato(invitato.codice, 1);

    // ricarica dati aggiornati
    const { data } = await getInvitato(invitato.codice);
    setInvitato(data);
  }

  const disponibili =
    invitato && invitato.posti_previsti - invitato.posti_usati;

  return (
    <div style={{ padding: 40 }}>
      <h1>Check-in Staff</h1>

      {/* INPUT CODICE */}
      <input
        placeholder="Scansiona o incolla codice"
        value={codice}
        onChange={(e) => setCodice(e.target.value)}
        style={{
          fontSize: 18,
          padding: 10,
          width: "100%",
          maxWidth: 400,
        }}
      />

      <br /><br />

      <button onClick={cerca} disabled={loading}>
        {loading ? "Caricamento..." : "Cerca"}
      </button>

      {/* RISULTATO */}
      {invitato && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 10,
          }}
        >
          <h2>{invitato.nome}</h2>

          <p style={{ fontSize: 18 }}>
            {invitato.posti_usati} / {invitato.posti_previsti}
          </p>

          {/* STATO */}
          <p
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: disponibili > 0 ? "green" : "red",
            }}
          >
            {disponibili > 0 ? "ACCESSO CONSENTITO" : "ESAURITO"}
          </p>

          {/* BOTTONI */}
          {disponibili > 0 && (
            <button
              onClick={handleEntra}
              style={{
                marginTop: 10,
                padding: 15,
                fontSize: 18,
                background: "green",
                color: "white",
                border: "none",
                borderRadius: 8,
              }}
            >
              +1 ENTRATA
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Checkin;