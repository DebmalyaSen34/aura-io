"use client";

import { useState, useEffect, Suspense } from "react";
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
import AuraLoader from "@/components/common/AuraLoader";

function VerifyPageContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [error, setError] = useState({});

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
      router.push("/login");
    }
  }, [searchParams]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to the next input field if the current one is filled
    if (element.value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  console.log("emaillll!!!!! ", email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
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
      } else if (response.status === 401) {
        console.error("There was an error while verifying OTP: ", data);
        setError({
          verficationError: "Wrong OTP provided! Check your OTP.",
        });
      } else {
        setError({
          verificationError:
            "There was something wrong while verifying your OTP. Please try again!",
        });
      }
    } catch (error) {
      console.error("Error while verifying OTP: ", error);
    } finally {
      setIsLoading(false);
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
                    id={`otp-input-${index}`}
                    key={index}
                    type="text"
                    name="otp"
                    maxLength="1"
                    value={data}
                    inputMode="numeric"
                    className="w-12 h-12 text-center text-2xl"
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                  />
                );
              })}
            </div>
            {error.verificationError && (
              <p className="text-red-500 text-sm text-center">
                {error.verificationError}
              </p>
            )}
            <Button type="submit" className="w-full">
              {isLoading ? <AuraLoader /> : "Verify"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* Find a better way to resend OTPs */}
          {/* <p className="text-sm text-center">
            Didn't receive the code?{" "}
            <Button variant="link" className="p-0">
              Resend
            </Button>
          </p> */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}
