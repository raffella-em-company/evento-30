import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function Invitato() {
  const { codice } = useParams();
  const [invitato, setInvitato] = useState(null);

  useEffect(() => {
    async function fetchInvitato() {
      const { data } = await supabase
        .from("invitati")
        .select("*")
        .eq("codice", codice)
        .single();

      setInvitato(data);
    }

    fetchInvitato();
  }, [codice]);

  if (!invitato) return <div>Caricamento...</div>;

  return (
    <div>
      <h1>{invitato.nome}</h1>
      <p>Codice: {invitato.codice}</p>
    </div>
  );
}

export default Invitato;