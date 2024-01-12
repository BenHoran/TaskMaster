"use client";
import Signup from "@/components/Signup";
import CredentialsHeader from "@/components/CredentialsHeader";
import { Fragment } from "react";
import CredentialsCard from "@/components/CredentialsCard";

const Page = () => {
  return (
    <CredentialsCard>
      <CredentialsHeader
        heading="Signup to create an account"
        paragraph="Already have an account? "
        linkName="Login"
        linkUrl="/login"
      />
      <Signup />
    </CredentialsCard>
  );
};

export default Page;
