import styles from "./Navbar.module.scss";
import { NextPage } from "next";
import Link from "next/link";
import { links_loggedOut } from "../../constants/Links";
import { auth } from "../../firebase";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  currentPage: string;
}

const Navbar: NextPage<Props> = ({ currentPage }) => {
  auth.onAuthStateChanged((user) => {
    user ? setSignedIn(true) : setSignedIn(false);
  });

  const [signedIn, setSignedIn]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(auth.currentUser ? true : false);

  const logout = () => {
    auth.signOut();
  };

  return (
    <div className="flex flex-col w-full mb-10">
      <div className="flex items-center justify-between h-16 pr-8 pl-10">
        <h2 className="w-2/12">Clowncar</h2>
        {/* replace with logo */}
        <div className="flex justify-center w-8/12">
          {links_loggedOut.map(({ url, label }) => (
            <Link key={label} href={url}>
              {currentPage === label ? (
                <a className="mr-10 font-bold">{label}</a>
              ) : (
                <a className="mr-10">{label}</a>
              )}
            </Link>
          ))}
        </div>
        <div className="flex justify-end w-2/12">
          {signedIn ? (
            <div className="flex">
              <p className="mr-3">{auth.currentUser?.email}</p>
              <p>|</p>
              <a onClick={logout} className="ml-3 cursor-pointer">
                Logout
              </a>
            </div>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
      <div className={styles.gradientBar}></div>
    </div>
  );
};

export default Navbar;
