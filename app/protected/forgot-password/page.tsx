'use client';
import { sendOtpAction, verifyOtp } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { decodeOtp, encodeOtp } from "@/utils/otp";
import Link from "next/link";
import { useEffect, useState } from "react";
import InputField from "./InputField/inputField";
import { Button } from "@/components/ui/button";

export default function ResetPassword({ searchParams, firstName }: { searchParams: Message, firstName: string }) {
  const [form, setForm] = useState({ email: "", code: "" });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const[time,setTime]  = useState(180)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.email) {
      setError("Заполните все поля");
      return;
    }
    setError("");
    
    const formData = new FormData();
    formData.append("email", form.email);

    const result = await sendOtpAction(formData);
    if (result.otp) {
      setSuccessMessage("We sent the code to your email, please enter it.");
      localStorage.setItem('otp', encodeOtp(result.otp));
    }
    else if (result?.error?.statusCode === 422) {
      setError("Invalid email address. Please ensure it follows the format example@ex.com.");
    } 
    else if (result?.error?.statusCode === 401) {
      setSuccessMessage("Now you can only send to kairambekovmadi@gmail.com");
    }
  };

  const handleSubmitCode = async (event: React.FormEvent) => {
    !form.code ? setError("This field is required") : ""
    event.preventDefault();
    const otp = localStorage.getItem('otp');

    if (otp) {
      const isValid = await verifyOtp(decodeOtp(otp), form.code);
      if (isValid?.code === 400) {
        setError(isValid.name);
      }
    }
  };

  useEffect(() => {
    let interval;
    if(successMessage){
        interval = setInterval(() =>{
            if(time !== 0)
            {
                setTime(time => time - 1)
            }
        },1000)
    } else if(interval){
        clearInterval(interval)
    }
  },[successMessage])
  const minutes = parseInt((time / 60).toString());
  const sec = time % 60

  useEffect(() => {
    if (time <= 0) {
      setTime(180)
      setError("Try again")
      setSuccessMessage('')
    }
  }, [time])
  return (
    <form className="flex-1 flex flex-col min-w-64 max-w-64">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <div className="flex flex-col gap-2 mt-8">
        <InputField successMessage={successMessage} form={form} handleInputChange={handleInputChange} />
        
        <p className="text-sm text-red-500 break-words">{error}</p>
        {!error && <p className="text-sm text-green-500 break-words">{successMessage}</p>}

        {!successMessage && (
          <SubmitButton onClick={handleSendOtp} pendingText="Sending...">
            Send
          </SubmitButton>
        )}

        {successMessage && (
          <>
            <Button onClick={handleSubmitCode}>
              Submit Code
            </Button>
            <p>Your Otp code will be limit after {minutes}:{sec}</p>
          </>
        )}

        <p className="text-sm text-foreground">
          Already have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
