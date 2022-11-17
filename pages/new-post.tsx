import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { auth, db } from "../firebase";
import { collection, doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import "react-calendar/dist/Calendar.css";
import { storage } from "../firebase";
import { NextRouter, useRouter } from "next/router";

const metadata: { title: string; defaultDescription: boolean } = {
  title: "New Post",
  defaultDescription: true,
};

interface Props {}

type Post = {
  description: string;
  start_time: Timestamp;
  end_time: Timestamp;
  post_date: Timestamp;
  location: string;
  images: string[];
  uid: string;
};

const NewPost: NextPage<Props> = () => {
  const locationRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const startDate = useRef<HTMLInputElement>(null);
  const endDate = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<FileList>(); // does this need to be a state? (is a rerender needed after uploading an image?)
  const [error, setError] = useState<string>();
  const router = useRouter();

  const uploadToClient = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(e.target.files);
  };

  const makeUserPost = async (schoolid: string, uid: string) => {
    if (!locationRef.current) {
      setError("Invalid location");
      return;
    }
    if (!descriptionRef.current) {
      setError("Invalid description");
      return;
    }
    if (!startDate.current) {
      setError("Invalid start date");
      return;
    }
    if (!endDate.current) {
      setError("Invalid end date");
      return;
    }
    const newDoc = doc(collection(db, `schools/${schoolid}/posts/`));
    const postsDoc = doc(
      collection(db, `schools/${schoolid}/users/${uid}/posts/`),
      newDoc.id
    );

    const post: Post = {
      description: descriptionRef.current.value,
      start_time: Timestamp.fromDate(new Date(startDate.current.value)),
      end_time: Timestamp.fromDate(new Date(endDate.current.value)),
      post_date: Timestamp.now(),
      location: locationRef.current.value,
      images: images
        ? Array.from(images).map(
            (file) => `images/${uid}/${newDoc.id}/${file.name}`
          )
        : [],
      uid: uid,
    };

    await setDoc(newDoc, post);
    await setDoc(postsDoc, post);

    if (images) {
      Array.from(images).forEach((file) =>
        uploadBytes(
          ref(storage, `images/${uid}/${newDoc.id}/${file.name}`),
          file
        ).then((_) => {})
      );
    }
    await router.push("/");
  };

  const uploadToServer = async () => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const userSnap = await getDoc(doc(db, "users", uid));

    if (!userSnap.exists()) return;

    const schoolSnap = await getDoc(doc(db, "schools", userSnap.data().school));
    await makeUserPost(schoolSnap.id, uid);
  };

  return (
    <Layout metadata={metadata}>
      <div className="flex flex-col w-3/4 m-6 font-bold text-white">
        <h1 className="text-5xl m-6 font-bold">New Post</h1>
        <input
          type="text"
          id="location"
          placeholder="Where are the item(s) located?"
          className="text-2xl font-medium p-2 m-6"
          ref={locationRef}
        />
        <textarea
          rows={4}
          cols={50}
          id="description"
          placeholder="Give a brief description of the item(s)"
          className="text-2xl font-medium p-2 m-6"
          ref={descriptionRef}
        />

        <div className="flex flex-row justify-evenly flex-grow m-6 text-2xl">
          <label htmlFor="startDate">Start Time:</label>
          <input
            type="datetime-local"
            id="startDate"
            ref={startDate}
          />

          <label htmlFor="endDate">End Time:</label>
          <input
            type="datetime-local"
            id="endDate"
            ref={endDate}
          />

          <label htmlFor="images" className="text-2xl">
            Upload Images:
          </label>
          <input
            type="file"
            id="images"
            multiple={true}
            accept="image/png, image/jpeg, image/jpg"
            onChange={uploadToClient}
          />
        </div>
        <button
          className="text-2xl font-medium m-3 p-2 bg-slate-200 rounded-md hover:bg-slate-400 transition ease-in-out delay-50"
          onClick={uploadToServer}
        >
          Post
        </button>
        {error && <p>{error}</p>}
      </div>
    </Layout>
  );
};

export default NewPost;
