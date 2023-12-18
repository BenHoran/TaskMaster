// LoginPage.js
import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./store";
import axios from "axios";
import Header from "./Header/Header";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const basicAuthToken = btoa(`${username}:${password}`);
      const response = await axios.post(
        "/api/login",
        {},
        {
          headers: {
            Authorization: `Basic ${basicAuthToken}`,
          },
        }
      );

      const { access_token, user } = response.data;

      dispatch(login({ username: user, access_token }));
      navigate("/app", { replace: true });
      setError("");
    } catch (error) {
      setError("Incorrect username or password. Please try again.");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <Fragment>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <form className={styles.form} action="#">
            <h3 className={styles.title}>
              Sign in to our platform
            </h3>
            <div>
              <label
                htmlFor="username"
                className={styles.label}
              >
                Your email
              </label>
              <input
                // type="email"
                type="text"
                // name="email"
                // id="email"
                name="username"
                id="username"
                className={styles.input}
                placeholder="name@company.com"
                required=""
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className={styles.label}
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className={styles.input}
                required=""
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button
              onClick={handleLogin}
              className={styles.button}
            >
              Login to your account
            </button>
            <div className="items-start">
              <Link
                to={"/recover"}
                className={styles.recover}
              >
                Lost Password?
              </Link>
            </div>
            <div className={styles.register}>
              Not registered?{" "}
              <Link
                to={"/signup"}
                className={styles.register_link}
              >
                Create account
              </Link>
            </div>
          </form>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </Fragment>
  );
};

const styles = {
  button: "w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
  error: "text-red-500",
  label: "text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300",
  title: "text-xl font-medium text-gray-900 dark:text-white",
  container: "max-w-2xl mx-auto",
  form: "space-y-6",
  card: "bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700",
  input: "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white",
  recover: "text-sm text-blue-700 hover:underline ml-auto dark:text-blue-500",
  register: "text-sm font-medium text-gray-500 dark:text-gray-300",
  register_link:"text-blue-700 hover:underline dark:text-blue-500"
}

export default LoginPage;
