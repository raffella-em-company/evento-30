import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitato, entraInvitato } from "../services/invitati";

function Invitato() {
  const { codice } = useParams();

  const [invitato, setInvitato] = useState(null);
  const [loading, setLoading] = useState(true);

  //  staff mode persistente
  const [isStaff, setIsStaff] = useState(
    sessionStorage.getItem("staff") === "1"
  );

  useEffect(() => {
    fetchData();
  }, [codice]);

  async function fetchData() {
    const { data, error } = await getInvitato(codice);

    if (!error) setInvitato(data);
    setLoading(false);
  }

  async function handleEntra(qta = 1) {
    const { error } = await entraInvitato(invitato.codice, qta);

    if (error) {
      alert("Errore ingresso");
      return;
    }

    fetchData();
  }

  function sbloccaStaff() {
    const password = prompt("Password staff");

    if (password === "EM2026") {
      sessionStorage.setItem("staff", "1");
      setIsStaff(true);
    } else {
      alert("Password errata");
    }
  }

  if (loading) return <p>Caricamento...</p>;
  if (!invitato) return <p>Invitato non trovato</p>;

  //  calcolo posti disponibili (sicuro)
  const disponibili = Math.max(
    0,
    invitato.posti_previsti - invitato.posti_usati
  );

  //  stile base bottone
  const btn = {
    margin: 5,
    padding: 20,
    fontSize: 18,
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>{invitato.nome}</h1>

      <p style={{ fontSize: 18 }}>
        {invitato.posti_usati} / {invitato.posti_previsti}
      </p>

      {/* STATO */}
      <p
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: disponibili > 0 ? "green" : "red",
        }}
      >
        {disponibili > 0
          ? "ACCESSO CONSENTITO"
          : "ACCESSO ESAURITO"}
      </p>

      {/* BOTTONI STAFF */}
      {isStaff && disponibili > 0 && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => handleEntra(1)}
            style={{
              ...btn,
              background: disponibili === 1 ? "orange" : "green",
            }}
          >
            +1
          </button>

          {disponibili >= 2 && (
            <button
              onClick={() => handleEntra(2)}
              style={{ ...btn, background: "green" }}
            >
              +2
            </button>
          )}

          {disponibili >= 3 && (
            <button
              onClick={() => handleEntra(disponibili)}
              style={{ ...btn, background: "#222" }}
            >
              TUTTI ({disponibili})
            </button>
          )}
        </div>
      )}

      {/* SBLOCCO STAFF */}
      {!isStaff && (
        <p
          onClick={sbloccaStaff}
          style={{
            marginTop: 40,
            fontSize: 12,
            opacity: 0.3,
            cursor: "pointer",
          }}
        >
          staff
        </p>
      )}
    </div>
  );
}

export default Invitato;