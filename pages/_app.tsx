import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Sidebar from "../components/Sidebar/Sidebar";

// use a global state to keep track of the current page

function Soteria({ Component, pageProps }: AppProps) {
  return (
    <div className="flex h-[100vh] w-full">
      <Sidebar />
      <div className="h-full w-full overflow-y-auto">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default Soteria;
