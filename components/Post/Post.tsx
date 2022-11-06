import styles from "./Post.module.scss";
import { NextPage } from "next";
import { Timestamp } from "firebase/firestore";
import { storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import Carousel from "nuka-carousel";

interface Props {
  description: string;
  end_time: Timestamp;
  location: string;
  post_date: Timestamp;
  start_time: Timestamp;
  uid: string;
  images: string[];
}

const Post: NextPage<Props> = ({
  description,
  end_time,
  location,
  post_date,
  start_time,
  uid,
  images,
}) => {
  const [imagePaths, setImagePaths] = useState<string[]>();
  const [test, setTest] = useState<number>(0);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const convertToAmPm = (hours: number, minutes: number): string => {
    if (hours === 12) return `${hours}:${minutes.toString().padStart(2)} PM`;
    if (hours > 12) return `${hours - 12}:${minutes.toString().padStart(2)} PM`;
    return `${hours}:${minutes.toString().padStart(2)} AM`;
    // return hours >= 12 ? `${hours - 12} PM` : `${hours > 0 ? hours : 12} AM`;
  };

  useEffect(() => {
    console.log(`Image length: ${images.length}`);
    console.log(`imagePaths length: ${imagePaths?.length}`);
    !imagePaths && getImagePaths();
    console.log(`imagePaths length after push: ${imagePaths?.length}`);
  });

  const getImagePaths = () => {
    images.forEach((e) => {
      console.log(`Iterating: ${e}`);
      getDownloadURL(ref(storage, e))
        .then((url) => {
          console.log(`Pushing ${url}`);
          if (!imagePaths) setImagePaths([url]);
          else setImagePaths([...imagePaths, url]);
        })
        .catch((error) => {
          console.log(`Error:::: ${error}`);
        });
    });
  };

  return (
    <div
      className={[
        "flex flex-col w-8/12 h-post mb-20 p-7",
        styles.post_shadow,
      ].join(" ")}
    >
      <div className="flex w-full items-center justify-between">
        <h2 className="text-5xl font-bold mb-3">{location}</h2>
        <div className="flex justify-center items-end flex-col">
          <p>{`${months[start_time.toDate().getMonth()]} ${post_date
            .toDate()
            .getDate()}, ${start_time.toDate().getFullYear()}`}</p>
          <p>{`${convertToAmPm(
            start_time.toDate().getHours(),
            start_time.toDate().getMinutes()
          )}`}</p>
        </div>
      </div>
      {imagePaths && (
        <Carousel className="flex justify-center items-center">
          {imagePaths.map((path) => (
            <img
              src={path}
              key={path}
              className="h-72 rounded-lg rounded-post"
            />
          ))}
        </Carousel>
      )}
      <h3 className="mt-6 text-xl">{description}</h3>
    </div>
  );
};

export default Post;
