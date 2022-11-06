import type { NextPage } from "next";
import Link from "next/link"
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import {NextRouter, useRouter} from "next/router";

const metadata: { title: string; description: string } = {
  title: "Login | Soteria",
  description: "Login or create an account",
};

interface Props {}

const Login: NextPage<Props> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router: NextRouter = useRouter();

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
          router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        setError(errorCode);
      });
  };

  return (
    <Layout metadata={metadata}>
      <Navbar currentPage="Home" />
        <div className="flex flex-col m-6 p-24 w-1/2 justify-evenly content-center">
            <input
                type="email"
                placeholder="Email"
                className="text-2xl font-medium m-3 p-2 rounded-md"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <input
                type="password"
                placeholder="Password"
                className="text-2xl font-medium m-3 p-2 rounded-md"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <p>{error}</p>
            <button className="text-2xl font-medium m-3 p-2 bg-slate-200 rounded-md hover:bg-slate-400 transition ease-in-out delay-50" onClick={login}>Login</button>
            <Link href="/register" ><p className="font-medium m-3 content-center cursor-pointer">Create an Account</p></Link>
        </div>
    </Layout>
  );
};

export default Login;
