import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const { phone_number, email } = location.state || {};
  const [code, setCode] = useState("");
  const { login } = useAuth();

  if (!phone_number && !email) {
    navigate("/register");
    return null;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.verify({ phone_number, email, code });
      if (res.data) {
        login(res.data.user, res.data.token);
        toast.success("Verification successful!");
        navigate("/");
      } else {
        toast.error(res.message || "Verification failed");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleResend = async () => {
    try {
      const res = await authService.resendOTP({ phone_number, email });
      toast.success(res.message || "OTP resent successfully");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter verification code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to {email || phone_number}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                <InputOTP 
                  maxLength={6} 
                  id="otp" 
                  value={code}
                  onChange={setCode}
                  required
                >
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription>
                  Enter the 6-digit code sent to your {email ? 'email' : 'phone'}.
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Button type="submit" className="w-full">Verify</Button>
                <FieldDescription className="text-center">
                  Didn't receive the code? <a onClick={handleResend} className="cursor-pointer hover:underline">Resend</a>
                </FieldDescription>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
