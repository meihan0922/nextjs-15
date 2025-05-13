"use client";

import Image from "next/image";
import { OAuthProviderId } from "next-auth/providers";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";

const SocailAuthForm = () => {
  const btnClass =
    "background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-2 flex-1 px-4 py-3.5";
  const handleSignIn = async (
    provider: Extract<OAuthProviderId, "google" | "github">,
  ) => {
    try {
      await signIn(provider, {
        redirectTo: ROUTES.HOME,
      });
    } catch (err) {
      console.log(err);
      toast.error("Sign-in Failed", {
        description:
          err instanceof Error
            ? err.message
            : "An error occured during sign-in",
      });
    }
  };
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={btnClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Log in with Github</span>
      </Button>
      <Button className={btnClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocailAuthForm;
