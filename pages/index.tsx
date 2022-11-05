import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";

const metadata: { title: string } = {
  title: "Clowncar",
};

interface Props {}

const Home: NextPage<Props> = () => {
  return (
    <Layout metadata={metadata}>
      <Navbar currentPage="Home" />
    </Layout>
  );
};

export default Home;
