import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Dropdown from "react-dropdown";

const metadata: { title: string; description: string } = {
  title: "Register | Clowncar",
  description: "Create an account",
};

interface Props {}

const Register: NextPage<Props> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [schoolId, setSchoolId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [schools, setSchools] = useState<{ label: string; value: string }[]>();

  const create = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          school: schoolId,
          name,
        });

        await setDoc(doc(db, `schools/${schoolId}/users`, user.uid), {
          name,
        });
      })
      .catch(({ code }) => {
        setError(code);
      });
  };

  const getSchools = async () => {
    const q = query(collection(db, "schools"));
    const querySnapshot = await getDocs(q);
    let fetchedSchools: { label: string; value: string }[] = [];
    querySnapshot.forEach((doc) => {
      fetchedSchools.push({ label: doc.data().name, value: doc.id });
    });
    setSchools(fetchedSchools);
  };

  useEffect(() => {
    schools ? "" : getSchools();
  });

  return (
    <Layout metadata={metadata}>
      <Navbar currentPage="Home" />
      <input
        type="text"
        placeholder="First and last name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
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
      {/* dropdown with current schools */}
      <p>{error}</p>
      <p>Select your school:</p>
      {schools && (
        <Dropdown
          className="bg-slate-200"
          placeholderClassName="bg-white"
          options={schools}
          onChange={(e) => {
            setSchoolId(e.value);
          }}
          placeholder="Select a school"
        />
      )}
      <button onClick={create}>Create account</button>
    </Layout>
  );
};

export default Register;
