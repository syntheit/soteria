import { NextPage } from "next";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { links } from "../../constants/Links";
import Link from "next/link";
import { getUsername } from "../../lib/GetUsername";
import GlowButton from "../GlowButton/GlowButton";

type Props = {};

const Sidebar: NextPage<Props> = () => {
  const [signedIn, setSignedIn] = useState<boolean>(
    auth.currentUser ? true : false
  );
  const [username, setUsername] = useState<string>();

  useEffect(() =>
    auth.onAuthStateChanged((user) => {
      user ? setSignedIn(true) : setSignedIn(false);
    })
  );

  useEffect(() => {
    if (signedIn) {
      const fetchedUsername = async () => {
        if (auth.currentUser)
          setUsername(await getUsername(auth.currentUser.uid));
      };
      fetchedUsername().catch(console.error);
    }
  }, [signedIn]);

  const logout = () => {
    auth.signOut();
  };

  // collapse sidebar after certain width

  return (
    <div className="flex w-[22rem] items-center justify-center p-5 box-border border-r-white border-[1px] border-solid select-none">
      <div className="flex flex-col justify-between h-full w-full">
        <div>
          {/* <h1 className="text-9xl font-bold mb-5 font-caveat soteriaTextGradient w-full text-center">
            Soteria
          </h1> */}
          <h2 className="text-white mb-5 text-2xl font-bold ml-4 soteriaTextGradient">Soteria</h2>
          <div className="flex flex-col items-center text-white">
            <div className="w-full">
              {links.map(
                ({
                  url,
                  label,
                  icon_name,
                  show_only_when_logged_in,
                  show_only_when_logged_out,
                }) =>
                  ((signedIn && show_only_when_logged_in) ||
                    (!signedIn && show_only_when_logged_out) ||
                    (!show_only_when_logged_in &&
                      !show_only_when_logged_out)) && (
                    <Link key={label} href={url}>
                      {/* bold text and increase stroke width (should probably switch to exclusively tabler icons in that case) if current page */}
                      <div className="flex items-center mb-3 pointer cursor-pointer">
                        <div className="flex items-center hover:bg-hov rounded-full py-2 px-4 transition ease-in-out duration-300">
                          {icon_name && (
                            <svg className="w-7 h-7 mr-2 text-white">
                              <use
                                href={`/icons/${icon_name}.svg#${icon_name}`}
                              />
                            </svg>
                          )}
                          <a className="text-xl">{label}</a>
                        </div>
                      </div>
                    </Link>
                  )
              )}
            </div>
            {signedIn && (
              <>
                <Link href={`/my-posts`}>
                  <div className="flex w-full mb-7 cursor-pointer">
                    <div className="flex items-center hover:bg-hov rounded-full py-2 px-4 transition ease-in-out duration-300">
                      <svg className="w-7 h-7 text-white mr-2">
                        <use href={`/icons/bookmark.svg#bookmark`} />
                      </svg>
                      <a className="text-xl">My Posts</a>
                    </div>
                  </div>
                </Link>
                <GlowButton url="/new-post" label="New Post" />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full p-5">
          {signedIn && (
            <>
              <p className="text-white text-md mb-1">Welcome,</p>
              <p className="text-white mb-5 text-xl font-bold">{username}</p>
            </>
          )}
          {signedIn ? (
            <div className="flex flex-col text-white">
              <p className="mb-3">{auth.currentUser?.email}</p>
              <a onClick={logout} className="cursor-pointer">
                Logout
              </a>
            </div>
          ) : (
            <div className="flex flex-col">
              <Link href="/login" className="cursor-pointer">
                <a className="text-white text-2xl mb-1 font-bold">Login</a>
              </Link>
              <Link href="/register" className="cursor-pointer">
                <a className="text-white text-lg">Create an account</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
