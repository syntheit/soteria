import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Feed from "../pages/feed";
import { auth } from "../firebase";
import Splash from "./splash";
import { useEffect, useState } from "react";
import { index } from "../constants/metadata";

interface Props {}

const Home: NextPage<Props> = () => {
  const [signedIn, setSignedIn] = useState<number>(-1);
  useEffect(() =>
    auth.onAuthStateChanged((user) => {
      user ? setSignedIn(1) : setSignedIn(0);
    })
  );

  return (
    <Layout metadata={index}>
      {signedIn === 1 && <Feed />}
      {signedIn === 0 && <Splash />}
    </Layout>
  );
};

export default Home;
