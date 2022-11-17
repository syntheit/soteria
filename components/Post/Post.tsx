import styles from "./Post.module.scss";
import { NextPage } from "next";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import Carousel from "nuka-carousel";

type Props = {
  description: string;
  end_time: Timestamp;
  location: string;
  post_date: Timestamp;
  start_time: Timestamp;
  uid: string;
  images: string[];
};

const Post: NextPage<Props> = ({
  description,
  end_time,
  location,
  post_date,
  start_time,
  uid,
  images,
}) => {
  const [authorName, setAuthorName] = useState<string>();
  const [displayImages, setDisplayImages] = useState<boolean>(false);

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
    !authorName && getAuthorName();
    console.log(`Image length is ${images.length}`);
    if (images.length > 0) {
      setDisplayImages(true);
      console.log("Setting display images to true");
    }
  });

  const getAuthorName = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setAuthorName(docSnap.data().name);
  };

  return (
    <div
      className={[
        "flex justify-between flex-col w-[38rem] mb-14 mx-8 p-10 border-sot-focus border-2 border-solid text-slate-50	",
        styles.post_shadow,
      ].join(" ")}
    >
      <div>
        <div className="flex w-full items-center justify-between">
          <div className="mb-4">
            <h2 className="text-3xl font-bold mb-3">{location}</h2>
            <h3 className="text-lg">{authorName}</h3>
          </div>
        </div>
        {displayImages && (
          <Carousel className="flex justify-center items-center">
            {images.map((path) => (
              <img
                src={path}
                key={path}
                className="h-72 rounded-lg rounded-post"
              />
            ))}
          </Carousel>
        )}
        <h3 className="mt-6 mb-6 text-xl">{description}</h3>
      </div>
      <div className="flex items-center">
        <div className="flex">
          <p>
            {`${months[start_time.toDate().getMonth()]} ${post_date
              .toDate()
              .getDate()}, ${start_time.toDate().getFullYear()}`}
            ,&nbsp;&nbsp;
          </p>
          <p className="text-right">{`${convertToAmPm(
            start_time.toDate().getHours(),
            start_time.toDate().getMinutes()
          )}`}</p>
        </div>
        <p className="mx-4 font-bold">-</p>
        <div className="flex">
          <p>
            {`${months[start_time.toDate().getMonth()]} ${post_date
              .toDate()
              .getDate()}, ${start_time.toDate().getFullYear()}`}
            ,&nbsp;&nbsp;
          </p>
          <p className="text-right">{`${convertToAmPm(
            end_time.toDate().getHours(),
            end_time.toDate().getMinutes()
          )}`}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
