import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return new Response("Email and password are required", { status: 400 });
        }

        const { data: existingUser, error: fetchError } = await supabase
            .from('user')
            .select('id, password')
            .eq('email', email)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 })
        }

        const token = jwt.sign(
            { userId: existingUser.id, email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // Create the response
        const response = NextResponse.json(
            { message: "User successfully logged in!" },
            { status: 200 }
        );

        // Set the JWT as an HTTP-only cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day in seconds
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('An error has occured while trying to authenticate the user! ', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}