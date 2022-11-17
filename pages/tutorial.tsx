import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import { tutorial } from "../constants/metadata";
import { tutorialText } from "../constants/tutorial";

interface Props {}

const Home: NextPage<Props> = () => {
  return (
    <Layout metadata={tutorial}>
      <div className="flex flex-col w-8/12 mb-16 text-white">
        <h1 className="text-5xl font-bold mb-10">
          How to properly recycle electionics for reuse
        </h1>
        <div className="flex justify-center flex-col">
          {tutorialText.map(({ title, description }) => (
            <div key={title} className="flex justify-center flex-col mb-5">
              <h2 className="text-2xl mb-2">{title}</h2>
              <p className="text-xl">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
