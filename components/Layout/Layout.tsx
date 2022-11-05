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
          ""
        )}
        {metadata.defaultDescription ? (
          <meta name="description" content={defaultDescription} />
        ) : (
          ""
        )}
      </Head>
      <main className={styles.main}>
        <div className={styles.wrapper}>{children}</div>
      </main>
    </div>
  );
};
