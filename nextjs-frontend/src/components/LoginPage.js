"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { login } from "@/lib/features/auth/authSlice";
import { useState, Fragment } from "react";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginFields } from "@/constants/formfields";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";

const fields = loginFields;
let fieldState = {};
fields.forEach((field) => (fieldState[field.id] = ""));

const LoginPage = () => {
  const [loginState, setLoginState] = useState(fieldState);
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChange = (event) => {
    setLoginState({ ...loginState, [event.target.id]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateUser();
  };

  const authenticateUser = async () => {
    try {
      const basicAuthToken = btoa(`${loginState.emailAddress}:${loginState.password}`);
      const response = await axios.post(
        "/api/login",
        {},
        {
          headers: {
            Authorization: `Basic ${basicAuthToken}`,
          },
        }
      );

      const { access_token, refresh_token, user } = response.data;

      dispatch(login({ username: user, access_token, refresh_token }));
      router.push("/app", { replace: true });
      setError("");
    } catch (error) {
      setError("Incorrect username or password. Please try again.");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      <p className="text-red-500 text-center">{error ? error : ''}</p>
      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
};

// const styles = {
//   button:
//     "w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
//   error: "text-red-500",
//   label: "text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300",
//   title: "text-xl font-medium text-gray-900 dark:text-white",
//   container: "max-w-2xl mx-auto",
//   form: "space-y-6",
//   card: "bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700",
//   input:
//     "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white",
//   recover: "text-sm text-blue-700 hover:underline ml-auto dark:text-blue-500",
//   register: "text-sm font-medium text-gray-500 dark:text-gray-300",
//   register_link: "text-blue-700 hover:underline dark:text-blue-500",
// };

export default LoginPage;
