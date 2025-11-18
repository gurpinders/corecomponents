import { supabase } from "./supabase";

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    return { data, error };
}

export async function signOut(){
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getUser(){
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
}