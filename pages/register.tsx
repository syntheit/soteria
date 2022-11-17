import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import { errors_authentication } from "../constants/Errors";
import { useRouter } from "next/router";

import { useEffect, useRef, useState } from "react";
import { auth, db, signup_key } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, getDocs, setDoc, doc } from "firebase/firestore";
import Dropdown from "react-dropdown";

const metadata: { title: string; description: string } = {
  title: "Register | Soteria",
  description: "Create an account",
};

// check email domain against database of emails
// have email verification
// optional signup code (could be an option for when a user isn't part of a registered organization)

interface Props {}

const Register: NextPage<Props> = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const signupKeyRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const schoolIdRef = useRef<any>(null); // figure out the correct ref type for dropdown menu... might use another implementation later anyways

  const [error, setError] = useState<string>("");
  const [schools, setSchools] = useState<{ label: string; value: string }[]>();
  const router = useRouter();

  const create = () => {
    if (!schoolIdRef.current) return;
    if (!emailRef.current) {
      setError("Invalid email");
      return;
    }
    if (!passwordRef.current) {
      setError("Invalid password");
      return;
    }
    if (signupKeyRef.current?.value !== signup_key) {
      setError("Invalid signup key");
      return;
    }
    if (!nameRef.current) {
      setError("Invalid name");
      return;
    }
    const name = nameRef.current.value;
    // remove the questionmarks from lines 60 and 64 since the check above should eliminate the need for those

    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          school: schoolIdRef.current.value,
          name,
        });
        await setDoc(
          doc(db, `schools/${schoolIdRef.current.value}/users`, user.uid),
          {
            name,
          }
        );
        await router.push("/");
      })
      .catch(({ code }) => {
        setError(code);
        return;
      });
  };

  const getSchools = async () => {
    const q = query(collection(db, "schools"));
    const querySnapshot = await getDocs(q);
    let fetchedSchools: { label: string; value: string; className: string }[] =
      [];
    querySnapshot.forEach((doc) => {
      fetchedSchools.push({
        label: doc.data().name,
        value: doc.id,
        className: "hover:bg-slate-100",
      });
    });
    setSchools(fetchedSchools);
  };

  useEffect(() => {
    !schools && getSchools();
  });

  return (
    <Layout metadata={metadata}>
      <div className="flex flex-col m-6 p-24 w-1/2 justify-evenly content-center">
        <h1 className="text-white text-5xl font-bold m-3">Create an account</h1>
        <input
          type="text"
          placeholder="First and last name"
          className="text-2xl font-medium m-3 p-2 rounded-md"
          ref={nameRef}
        />
        <input
          type="email"
          placeholder="Email"
          className="text-2xl font-medium m-3 p-2 rounded-md"
          ref={emailRef}
        />
        <input
          type="password"
          placeholder="Password"
          className="text-2xl font-medium m-3 p-2 rounded-md"
          ref={passwordRef}
        />
        <input
          type="password"
          placeholder="Signup Key"
          className="text-2xl font-medium m-3 p-2 rounded-md"
          ref={signupKeyRef}
        />
        {/* dropdown with current schools */}
        {error && (
          <p className="font-medium m-3 content-center text-white">
            {errors_authentication[error]
              ? "ERROR: " + errors_authentication[error]
              : error}
          </p>
        )}
        {schools && (
          <Dropdown
            className="text-2xl font-medium m-3 p-2 rounded-md bg-white hover:bg-slate-200 transition ease-in-out delay-50 cursor-pointer"
            placeholderClassName=""
            options={schools}
            ref={schoolIdRef}
            placeholder="Select a school"
          />
        )}
        <button
          className="text-2xl font-medium m-3 p-2 bg-slate-200 rounded-md hover:bg-slate-400 transition ease-in-out delay-50"
          onClick={create}
        >
          Create account
        </button>
      </div>
    </Layout>
  );
};

export default Register;
