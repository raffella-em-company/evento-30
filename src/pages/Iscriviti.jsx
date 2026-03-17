import { useState } from "react";
import { creaInvitato, esisteEmail, getInvitatoByEmail } from "../services/invitati";

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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  if (invitato) {
    const link = `https://evento-30.vercel.app/e/${invitato.codice}`;

    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>Registrazione completata</h1>

        <p>{invitato.nome}</p>

        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${link}`}
          alt="QR"
        />

        <p>Mostra questo codice all’ingresso</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Registrazione Evento</h1>

      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" onChange={handleChange} required />
        <br /><br />

        <input name="cognome" placeholder="Cognome" onChange={handleChange} required />
        <br /><br />

        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <br /><br />

        <select name="tipo" onChange={handleChange}>
          <option value="cliente">Cliente</option>
          <option value="fornitore">Fornitore</option>
          <option value="dipendente">Dipendente</option>
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Invio..." : "Registrati"}
        </button>
      </form>
    </div>
  );
}

export default Iscriviti;