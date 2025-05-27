"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/actions/auth.action";
import Image from "next/image";

type FormType = 'sign-in' | 'sign-up';

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Get the user's ID token
      const idToken = await user.getIdToken();
      if (!idToken) {
        toast.error("Google sign in failed. Please try again.");
        return;
      }

      // For sign up, we need to check if the user exists and create if not
      if (type === "sign-up") {
        const result = await signUp({
          uid: user.uid,
          name: user.displayName || "Google User",
          email: user.email!,
          profileImage: user.photoURL || undefined,
        });

        if (!result.success && !result.message.includes("already exists")) {
          toast.error(result.message);
          return;
        }
      }

      // Sign in the user
      await signIn({
        email: user.email!,
        idToken,
      });

      toast.success("Signed in with Google successfully.");
      router.push("/");
    } catch (error: unknown) {
      console.error("Google sign in error:", error);
      // Handle specific Firebase auth errors
      if (error instanceof Error && 'code' in error && error.code === "auth/popup-closed-by-user") {
        toast.error("Sign in cancelled. Please try again.");
      } else if (error instanceof Error) {
        toast.error(`Google sign in failed: ${error.message}`);
      } else {
        toast.error("Google sign in failed. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="card-border m-3 w-full md:max-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-5 md:px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">ProofPrep</h2>
        </div>

        <h3 className="text-center text-xl md:text-2xl">Practice job interviews with AI</h3>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 cursor-pointer" 
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <span className="animate-spin inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </Button>
        
        <p className="text-center text-sm text-light-300 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
