import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import client from "@/lib/db";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import generateEmailTemplate from "@/utils/emailTemplate";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        console.log(name, email, password);

        const lowerCaseName = name.toLowerCase();

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);

        if (!client.isOpen) {
            await client.connect();
        }

        console.log('Client is open');
        
        const existingUser = await client.get(email);

        const userData = {
            name: lowerCaseName,
            password: hashedPassword,
            email: email
        };

        if (existingUser) {
            await client.setEx(email, 300, JSON.stringify(userData));
            console.log('Updating existing user!');
        } else {
            await client.setEx(email, 300, JSON.stringify(userData));
            console.log('Creating new user!');
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            digits: true,
            specialChars: false,
        });

        console.log('Otp is generated!');

        const existingOtpData = await client.get(`${email}_otp`);

        // if an otp is already available, update it
        if (existingOtpData) {
            await client.setEx(`${email}_otp`, 300, otp);
            console.log("Updated existing OTP data");
        } else {
            // if no otp is available, create a new one
            await client.setEx(`${email}_otp`, 300, otp);
            console.log("Created new OTP data");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        console.log('Transporter created!');
        
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Your AURA.IO OTP code',
            html: generateEmailTemplate(otp)
        };

        console.log('mail options created!');
        
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "OTP was sent successfully to your email!" }, { status: 200 });
    } catch (error) {
        console.error('The big error is!', error);
        return NextResponse.json({ success: false, error: 'An unexpected error occurred!' }, { status: 500 });
    }
}