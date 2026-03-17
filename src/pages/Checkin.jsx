import { useEffect, useState } from "react";
import { getListaInvitati, entraInvitato } from "../services/invitati";

function Checkin() {
  const [invitati, setInvitati] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await getListaInvitati();
      setInvitati(data || []);
    }

    load();
  }, []);

  async function handleEntra(codice) {
    await entraInvitato(codice, 1);

    // refresh
    const { data } = await getListaInvitati();
    setInvitati(data || []);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Check-in</h1>

      {invitati.map((inv) => {
        const disponibili = inv.posti_previsti - inv.posti_usati;

        return (
          <div key={inv.id} style={{ marginBottom: 20 }}>
            <h3>{inv.nome}</h3>
            <p>
              {inv.posti_usati}/{inv.posti_previsti}
            </p>

            {disponibili > 0 && (
              <button onClick={() => handleEntra(inv.codice)}>
                Entra 1
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Checkin;