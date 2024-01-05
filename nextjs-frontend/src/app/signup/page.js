"use client";
import Signup from "@/components/Signup";
import CredentialsHeader from "@/components/CredentialsHeader";
import { Fragment } from "react";
import CredentialsCard from "@/components/CredentialsCard";

const Page = () => {
  return (
    <CredentialsCard>
      <CredentialsHeader
        heading="Login to your account"
        paragraph="Don't have an account yet?"
        linkName="Signup"
        linkUrl="/signup"
      />
      <Signup />
    </CredentialsCard>
  );
};

export default Page;
