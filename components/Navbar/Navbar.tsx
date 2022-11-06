import styles from "./Navbar.module.scss";
import { NextPage } from "next";
import Link from "next/link";
import { links_loggedOut } from "../../constants/Links";
import { auth } from "../../firebase";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import GlowButton from "../GlowButton/GlowButton";

interface Props {
  currentPage: string;
}

const Navbar: NextPage<Props> = ({ currentPage }) => {
  useEffect(() =>
    auth.onAuthStateChanged((user) => {
      user ? setSignedIn(true) : setSignedIn(false);
    })
  );

  const [signedIn, setSignedIn]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(auth.currentUser ? true : false);

  const logout = () => {
    auth.signOut();
  };

  return (
    <div className="flex items-center flex-col w-full mb-10">
      <div className="flex w-11/12 justify-between items-center h-16">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img className="h-12" src="/favicon-192.png" />
            <p className="ml-4 font-bold">Soteria</p>
          </div>
        </Link>
        <div className="flex items-center justify-center select-none">
          <div className="flex justify-center">
            {links_loggedOut[0].map(({ url, label, visibleWhenLoggedIn }) => (
              visibleWhenLoggedIn && (<Link key={label} href={url}>
                {currentPage === label ? (
                  <a className="ml-5 mr-5 font-bold">{label}</a>
                ) : (
                  <a className="mr-5 ml-5">{label}</a>
                )}
              </Link>)
            ))}
          </div>
          {signedIn && <GlowButton url="/new-post" label="New Post" />}
          <div className="flex justify-center">
            {links_loggedOut[1].map(({ url, label }) => (
              <Link key={label} href={url}>
                {currentPage === label ? (
                  <a className="ml-5 mr-5 font-bold">{label}</a>
                ) : (
                  <a className="mr-5 ml-5">{label}</a>
                )}
              </Link>
            ))}
          </div>
          {signedIn && (
            <Link href={`${auth.currentUser?.uid}/posts`}>
              {currentPage === "posts" ? (
                <a className="ml-5 mr-5 font-bold">My Posts</a>
              ) : (
                <a className="mr-5 ml-5">My Posts</a>
              )}
            </Link>
          )}
        </div>
        <div className="mr-10">
          {signedIn ? (
            <div className="flex">
              <p className="mr-3">{auth.currentUser?.email}</p>
              <p>|</p>
              <a onClick={logout} className="ml-3 cursor-pointer">
                Logout
              </a>
            </div>
          ) : (
            <Link href="/login" className="cursor-pointer">
              Login
            </Link>
          )}
        </div>
      </div>
      <div className={styles.gradientBar}></div>
    </div>
  );
};

export default Navbar;
