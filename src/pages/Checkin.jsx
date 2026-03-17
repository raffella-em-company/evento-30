import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function Admin() {
  const [invitati, setInvitati] = useState([]);

  useEffect(() => {
    fetchInvitati();
  }, []);

  async function fetchInvitati() {
    const { data } = await supabase
      .from("invitati")
      .select("*")
      .order("nome");

    setInvitati(data || []);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Lista Invitati</h1>

      {invitati.map((inv) => {
        const link = `https://evento-30.vercel.app/e/${inv.codice}`;

        return (
          <div
            key={inv.id}
            style={{
              border: "1px solid #ccc",
              padding: 20,
              marginBottom: 20,
              borderRadius: 10,
            }}
          >
            <h2>{inv.nome}</h2>

            <p>
              Posti: {inv.posti_usati}/{inv.posti_previsti}
            </p>

            <a href={link} target="_blank">
              Apri link
            </a>

            <br />

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${link}`}
              alt="QR"
            />

            <br />

            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${link}`;
                a.download = `${inv.nome}.png`;
                a.click();
              }}
            >
              Scarica QR
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Admin;