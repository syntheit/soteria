import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";
import { tutorial } from "../constants/metadata";
import { tutorialText } from "../constants/tutorial";

interface Props {}

const Home: NextPage<Props> = () => {
  return (
    <Layout metadata={tutorial}>
      <Navbar currentPage="Home" />
      <div className="flex items-center flex-col w-8/12 mb-16">
        <h1 className="text-4xl font-bold mb-5">
          Instructions for Proper Electronics Disposal for Reuse
        </h1>
        <div className="flex items-center justify-center flex-col">
          {tutorialText.map(({ title, description }) => (
            <div className="flex items-center justify-center flex-col mb-5">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-xl">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
