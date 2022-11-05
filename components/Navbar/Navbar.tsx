import styles from "./Navbar.module.scss";
import { NextPage } from "next";
import Link from "next/link";
import { links_loggedOut } from "../../constants/Links";

interface Props {
  currentPage: string;
}

const Navbar: NextPage<Props> = ({ currentPage }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between h-16 pr-8 pl-10">
        <h2>Clowncar</h2>
        {/* replace with logo */}
        <div className="flex justify-center w-7/12">
          {links_loggedOut.map(({ url, label }) => (
            <Link href={url}>
              {currentPage === label ? (
                <a className="mr-10 font-bold">{label}</a>
              ) : (
                <a className="mr-10">{label}</a>
              )}
            </Link>
          ))}
        </div>
        <h2>Login</h2>
      </div>
      <div className={styles.gradientBar}></div>
    </div>
  );
};

export default Navbar;
