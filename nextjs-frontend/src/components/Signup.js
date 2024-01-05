"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { signupFields } from "../constants/formfields";
import FormAction from "./FormAction";
import Input from "./Input";

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

const Signup = () => {
  const [signupState, setSignupState] = useState(fieldsState);
  const [error, setError] = useState('')
  const router = useRouter();

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    setError('');
    e.preventDefault();
    console.log(signupState);
    if (signupState.password === signupState.confirmPassword){
      createAccount();
    }
    else {
      setError('Passwords do not match')
    }
  };

  //handle Signup API Integration here
  const createAccount = async () => {
    try {
      const response = await axios.post(
        "/api/signup",
        {
          email: signupState.emailAddress,
          username: signupState.username,
          password: signupState.password
        },
      );

      router.push("/login", { replace: true });
      setError("");
    } catch (error) {
      setError("Some other error");
      console.error("Account create failed:", error.message);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
        <p className="text-red-500 text-center">{error ? error : ''}</p>
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
};
export default Signup;
