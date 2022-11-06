import "../styles/globals.scss";
import type { AppProps } from "next/app";

function Soteria({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

export default Soteria;
