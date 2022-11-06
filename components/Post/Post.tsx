import styles from "./Post.module.scss";
import { NextPage } from "next";
import { collection, doc, getDoc, query, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
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
  const [authorName, setAuthorName] = useState<string>();

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
    if (hours === 12)
      return `${hours}:${minutes.toString().padStart(2, "0")} PM`;
    if (hours > 12)
      return `${hours - 12}:${minutes.toString().padStart(2, "0")} PM`;
    if (hours === 0) return `12:${minutes.toString().padStart(2, "0")} AM`;
    return `${hours}:${minutes.toString().padStart(2, "0")} AM`;
  };

  useEffect(() => {
    !imagePaths && getImagePaths();
    !authorName && getAuthorName();
  });

  const getAuthorName = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) setAuthorName(docSnap.data().name);
  };

  const getImagePaths = () => {
    images.forEach((e) => {
      getDownloadURL(ref(storage, e)).then((url) => {
        if (!imagePaths) setImagePaths([url]);
        else setImagePaths([...imagePaths, url]);
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
        <div className="mb-4">
          <h2 className="text-5xl font-bold mb-4">{location}</h2>
          <h3 className="text-xl">{authorName}</h3>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <p>{`${months[start_time.toDate().getMonth()]} ${post_date
              .toDate()
              .getDate()}, ${start_time.toDate().getFullYear()}`}</p>
            <p className="text-right">{`${convertToAmPm(
              start_time.toDate().getHours(),
              start_time.toDate().getMinutes()
            )}`}</p>
          </div>
          <p className="mx-4 font-bold">-</p>
          <div>
            <p>{`${months[start_time.toDate().getMonth()]} ${post_date
              .toDate()
              .getDate()}, ${start_time.toDate().getFullYear()}`}</p>
            <p className="text-right">{`${convertToAmPm(
              end_time.toDate().getHours(),
              end_time.toDate().getMinutes()
            )}`}</p>
          </div>
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
