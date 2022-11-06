import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";
import { errors_authentication } from "../constants/Errors";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, getDocs, setDoc, doc } from "firebase/firestore";
import Dropdown from "react-dropdown";

const metadata: { title: string; description: string } = {
  title: "Register | Soteria",
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
    if (!schoolId) return;

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
    let fetchedSchools: { label: string; value: string; className: string }[] = [];
    querySnapshot.forEach((doc) => {
      fetchedSchools.push({ label: doc.data().name, value: doc.id, className: "hover:bg-slate-100" });
    });
    setSchools(fetchedSchools);
  };

  useEffect(() => {
    schools ? "" : getSchools();
  });

  return (
    <Layout metadata={metadata}>
      <Navbar currentPage="Home" />
        <div className="flex flex-col m-6 p-24 w-1/2 justify-evenly content-center">
            <input
                type="text"
                placeholder="First and last name"
                className="text-2xl font-medium m-3 p-2 rounded-md"
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
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
            {/* dropdown with current schools */}
            <p className="font-medium m-3 content-center">{errors_authentication[error] ? "ERROR: " + errors_authentication[error] : "ERROR: Internal error occurred."}</p>
            {/*<p className="font-medium m-3 content-center cursor-pointer">Select your school:</p>*/}
            {schools && (
                <Dropdown
                    className="text-2xl font-medium m-3 p-2 rounded-md hover:bg-slate-200 transition ease-in-out delay-50 cursor-pointer"
                    placeholderClassName=""
                    options={schools}
                    onChange={(e) => {
                        setSchoolId(e.value);
                    }}
                    placeholder="Select a school"
                />
            )}
            <button className="text-2xl font-medium m-3 p-2 bg-slate-200 rounded-md hover:bg-slate-400 transition ease-in-out delay-50" onClick={create}>Create account</button>
        </div>

    </Layout>
  );
};

export default Register;
