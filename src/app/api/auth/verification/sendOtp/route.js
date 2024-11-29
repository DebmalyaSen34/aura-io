import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import client from "@/lib/db";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false }, { message: "Invalid email or no email!" }, { status: 404 });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            digits: true,
            specialChars: false,
        });

        const otpExpiration = new Date().getTime() + 300000; // 5 minutes

        if(!client.isOpen){
            await client.connect();
        }

        // first check if an otp is already available for the given email

        const existingOtpData = await client.get(email);
        
        // if an otp is already available, update it
        if(existingOtpData){
            await client.setEx(email, 300, JSON.stringify({otp, otpExpiration}));
            console.log("Updated existing OTP data");
        }else{
            // if no otp is available, create a new one
            await client.set(email, 300, JSON.stringify({otp, otpExpiration}));
            console.log("Created new OTP data");
        }

        // Send the OTP to the user's email address
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Your AURA.IO OTP code',
            text: `Your OTP code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        await client.disconnect();

        return NextResponse.json({ success: true }, { message: "OTP was sent successfully to your email!" }, { status: 200 });

    } catch (error) {
        console.log('Catch was called with error: ', error);
        return NextResponse.json({ success: false }, { message: "An unexpected error occurred!" }, { status: 500 });
    }
}