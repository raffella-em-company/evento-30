import { useState } from "react";
import { supabase } from "./lib/supabase";

function Iscriviti() {
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    tipo: "cliente",
    accompagnatori: 1,
  });

  const [invitato, setInvitato] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "accompagnatori" ? parseInt(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase
      .from("invitati")
      .insert([
        {
          nome: `${form.nome} ${form.cognome}`,
          email: form.email,
          tipo: form.tipo,
          posti_previsti: form.accompagnatori,
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Errore registrazione");
    } else {
      setInvitato(data);
    }

    setLoading(false);
  }

  // 🔥 SE REGISTRATO → MOSTRA QR
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
        <input
          name="nome"
          placeholder="Nome"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="cognome"
          placeholder="Cognome"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
        />

        <br /><br />

        <select name="tipo" onChange={handleChange}>
          <option value="cliente">Cliente</option>
          <option value="fornitore">Fornitore</option>
          <option value="dipendente">Dipendente</option>
        </select>

        <br /><br />

        <input
          name="accompagnatori"
          type="number"
          min="1"
          max="10"
          defaultValue={1}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Invio..." : "Registrati"}
        </button>
      </form>
    </div>
  );
}

export default Iscriviti;