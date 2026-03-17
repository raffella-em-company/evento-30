import { useState } from "react";
import {
  creaInvitato,
  esisteEmail,
  getInvitatoByEmail,
} from "../services/invitati";

function Iscriviti() {
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    tipo: "cliente",
  });

  const [invitato, setInvitato] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!form.nome || !form.cognome || !form.email) {
      alert("Compila tutti i campi");
      setLoading(false);
      return;
    }

    const emailPulita = form.email.trim().toLowerCase();

    const { data: esistente } = await esisteEmail(emailPulita);

    if (esistente) {
      const { data } = await getInvitatoByEmail(emailPulita);
      setInvitato(data);
      setLoading(false);
      return;
    }

    const { data, error } = await creaInvitato({
      nome: `${form.nome} ${form.cognome}`,
      email: emailPulita,
      tipo: form.tipo,
      posti_previsti: 1,
    });

    if (error) {
      alert("Errore registrazione");
    } else {
      setInvitato(data);
    }

    setLoading(false);
  }

  // 🎟️ DOPO REGISTRAZIONE
  if (invitato) {
    const link = `https://evento-30.vercel.app/e/${invitato.codice}`;

    return (
      <div style={wrap}>
        <div style={card}>
          <h1 style={title}>Registrazione completata</h1>

          <p style={subtitle}>{invitato.nome}</p>

          <img
            style={{ margin: "20px 0" }}
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${link}`}
            alt="QR"
          />

          <p style={{ fontSize: 14, opacity: 0.7 }}>
            Mostra questo QR all’ingresso
          </p>
        </div>
      </div>
    );
  }

  // 📝 FORM
  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={title}>Registrazione Evento</h1>
        <p style={subtitle}>
          Compila i tuoi dati per ricevere il tuo accesso
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <input
            name="nome"
            placeholder="Nome"
            onChange={handleChange}
            style={input}
            required
          />

          <input
            name="cognome"
            placeholder="Cognome"
            onChange={handleChange}
            style={input}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            style={input}
            required
          />

          <select name="tipo" onChange={handleChange} style={input}>
            <option value="cliente">Cliente</option>
            <option value="fornitore">Fornitore</option>
            <option value="dipendente">Dipendente</option>
          </select>

          <button type="submit" disabled={loading} style={button}>
            {loading ? "Invio..." : "Registrati"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Iscriviti;

//
// 🎨 STILI
//

const wrap = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #111, #333)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const card = {
  background: "white",
  padding: 30,
  borderRadius: 16,
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  textAlign: "center",
};

const title = {
  marginBottom: 10,
};

const subtitle = {
  fontSize: 14,
  opacity: 0.6,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
};

const button = {
  width: "100%",
  padding: 14,
  background: "#000",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  cursor: "pointer",
};