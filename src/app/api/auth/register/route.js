import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        console.log(name, email, password);

        const lowerCaseName = name.toLowerCase();

        const { data: existingUser, error: fetchError } = await supabase
            .from('user')
            .select('id')
            .eq('email', email)
            .single();

        console.log(existingUser);

        console.log(fetchError);

        if (fetchError && fetchError.code !== 'PGRST116') {
            return NextResponse.json({ error: 'User with this email already exists!' }, { status: 409 });
        }

        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists!' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);

        const { error: profileError } = await supabase.from('profiles').insert({
            password: hashedPassword,
            name: lowerCaseName,
            email: email,
        });

        console.log(profileError);

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'User registered successfully!' }, { status: 200 });

    } catch (error) {
        console.log('The big error is!', error);
        return NextResponse.json({ error: 'An unexpected error occurred!' }, { status: 500 });
    }
}