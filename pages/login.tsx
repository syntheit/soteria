import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";

const metadata: { title: string; description: string } = {
  title: "Login | Clowncar",
  description: "Login or create an account",
};

interface Props {}

const Login: NextPage<Props> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        setError(errorCode);
      });
  };

  return (
    <Layout metadata={metadata}>
      <Navbar currentPage="Home" />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <p>{error}</p>
      <button onClick={login}>Login</button>
      <a href="/register">Create an Account</a>
    </Layout>
  );
};

export default Login;
