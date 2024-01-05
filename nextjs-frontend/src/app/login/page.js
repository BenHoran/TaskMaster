"use client";
import LoginPage from "@/components/LoginPage";
import CredentialsHeader from "@/components/CredentialsHeader";
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
      <LoginPage />
    </CredentialsCard>
  );
};

export default Page;
