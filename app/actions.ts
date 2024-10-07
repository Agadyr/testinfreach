"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import generateOtp from "@/utils/otp";
import { Verify } from "./protected/forgot-password/verify/verify";


export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};



export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export const sendOtpAction = async (formData: FormData) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const email = formData.get("email")?.toString();

  if (!email) {
    return { error: "Email is required" };
  }

  const otp = generateOtp();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 2); 

  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: `That is your OTP code please verify it "${otp}" expires at ${expiresAt}`,
    react: Verify({ name :'User' }),
  });

  if (error) {
    return { 
      error: {
        message: error.message || "Unknown error", 
        name: error.name || "error",
        statusCode: error.statusCode || 500,
      } 
    }
  } 
  return {
    data,
    otp,
    expiresAt
  }
};

export const verifyOtp = (generatedOtp: string, enteredOtp: string) => {
  if (generatedOtp === enteredOtp) {
    return encodedRedirect(
      "success",
      "change-password",
      "Confirming",
    );
  } else {
    return {
        name: "That is not correct confirm again",
        code: 400
    }
  }
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "change-password",
      "Password and confirm password are required",
    );
  }

  if (password.length <= 5 || confirmPassword.length <= 5) {
    encodedRedirect(
      "error",
      "change-password",
      "Password required min 6 symbols",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "change-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "protected/change-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected", "Password updated");
};