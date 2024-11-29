import { supabase } from "@/lib/supabaseClient";

export async function GET(request) {
    const {data, error} = await supabase.from('user').select('*').limit(1);

    if(error){
        return new Response(JSON.stringify({ error: error.message}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response(JSON.stringify({data}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}