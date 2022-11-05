import Head from "next/head";
import styles from "./Layout.module.scss";

export const defaultDescription = "One man's trash is another man's treasure";

export default ({ children, metadata }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.ico" />
        {metadata.description ? (
          <meta name="description" content={metadata.description} />
        ) : (
          <meta name="description" content={defaultDescription} />
        )}
      </Head>
      <main className="flex justify-center">
        <div className="flex justify-center items-center flex-col w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
