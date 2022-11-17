import type { NextPage } from "next";

interface Props {}

const Splash: NextPage<Props> = () => {
  return (
    <div className="flex flex-col justify-center items-center w-6/12 text-white">
      <h1 className="text-7xl font-bold mb-5">Soteria</h1>
      <h2 className="text-2xl leading-10 text-center">
        Named after the ancient Greek Goddess of Preservation, Soteria acts as a
        chance to second life for technology that has satisfied a user's need.
        Rather than simply being thrown out as ewaste, Soteria connects those
        looking to get rid of their technology to those in need of it on campus.
      </h2>
    </div>
  );
};

export default Splash;
