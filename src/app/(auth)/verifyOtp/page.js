"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    // Try to get email from searchParams (App Router)
    let emailParam = searchParams.get("email");

    // If email is not found in searchParams, try to parse it from the URL (Pages Router fallback)
    if (!emailParam && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      emailParam = urlParams.get("email");
    }

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      console.error("Email not found in URL parameters");
      // Optionally redirect to login page if email is not present
      // router.push('/login')
    }
  }, [searchParams]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  console.log("emaillll!!!!! ", email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/verification/verifiyOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp: otp.join("") }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("OTP verification was successful!", data);
      router.push("/home");
    } else {
      console.error("There was an error while verifying OTP: ", data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((data, index) => {
                return (
                  <Input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength="1"
                    value={data}
                    className="w-12 h-12 text-center text-2xl"
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                );
              })}
            </div>
            <Button type="submit" className="w-full">
              Verify
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Didn't receive the code?{" "}
            <Button variant="link" className="p-0">
              Resend
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
