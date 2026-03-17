import { supabase } from "../lib/supabase";

export async function getInvitato(codice) {
  return await supabase
    .from("invitati")
    .select("*")
    .eq("codice", codice)
    .single();
}

export async function entraInvitato(codice, qta = 1) {
  return await supabase.rpc("incrementa_posti", {
    codice_input: codice,
    qta_input: qta,
  });
}

export async function creaInvitato(payload) {
  return await supabase
    .from("invitati")
    .insert([payload])
    .select()
    .single();
}
export async function esisteEmail(email) {
  return await supabase
    .from("invitati")
    .select("id")
    .eq("email", email)
    .maybeSingle();
}
export async function getInvitatoByEmail(email) {
  return await supabase
    .from("invitati")
    .select("*")
    .eq("email", email)
    .single();
}