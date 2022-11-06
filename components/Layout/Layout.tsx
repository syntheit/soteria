import styles from "./Layout.module.scss";
import { NextSeo } from "next-seo";

export const defaultDescription = "One man's trash is another man's treasure";

const Layout = ({ children, metadata }) => {
  return (
    <div className={styles.container}>
      <NextSeo {...metadata} />
      <main className="flex justify-center">
        <div className="flex justify-center items-center flex-col w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
