import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  DocumentReference,
  DocumentData,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const storage = getStorage();

const metadata: { title: string; defaultDescription: boolean } = {
  title: "New Post",
  defaultDescription: true,
};

interface Props {}

const NewPost: NextPage<Props> = () => {
  const [location, setLocation]: [string, Dispatch<SetStateAction<string>>] =
    useState("");
  const [description, setDescription]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState("");
  const [startTime, setStartTime]: [string, Dispatch<SetStateAction<string>>] =
    useState("");
  const [endTime, setEndTime]: [string, Dispatch<SetStateAction<string>>] =
    useState("");
  const [images, setImages]: any = useState(null);

  const uploadToClient = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
      console.log(e.target.files);
    }
  };

  const makeUserPost = async (postsPath: string, uid: string) => {
    const newDoc = doc(collection(db, postsPath));

    const now: Date = new Date();

    await setDoc(newDoc, {
      description: description,
      start_time: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          Number(startTime.substring(0, 2)),
          Number(startTime.substring(3))
        )
      ),
      end_time: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          Number(endTime.substring(0, 2)),
          Number(endTime.substring(3))
        )
      ),
      post_date: Timestamp.now(),
      location: location,
      images:
        images && images instanceof FileList
          ? Array.from(images).map(
              (file) => "images/" + uid + "/" + newDoc.id + "/" + file.name
            )
          : [],
    });

    if (images && images instanceof FileList) {
      Array.from(images).forEach((file) =>
        uploadBytes(
          ref(storage, "images/" + uid + "/" + newDoc.id + "/" + file.name),
          file
        ).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        })
      );
    }
  };

  const uploadToServer = async () => {
    if (auth.currentUser !== null) {
      const uid: string = auth.currentUser.uid;
      const userRef: DocumentReference<DocumentData> = doc(db, "users", uid);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log("User data:", userSnap.data());

        const schoolRef = doc(db, "schools", userSnap.data().school);

        const schoolSnap = await getDoc(schoolRef);

        if (schoolSnap.exists()) {
          console.log("School data:", schoolSnap.data());

          await makeUserPost(
            "schools/" + schoolSnap.id + "/users/" + uid + "/posts/",
            uid
          );
        } else {
          console.log("No such school!");
        }
      } else {
        console.log("No such user!");
      }
    } else {
      console.log("Not logged in");
    }
  };

  return (
    <Layout metadata={metadata}>
      <Navbar currentPage="New Post" />
      <h2>New Post</h2>

      <label htmlFor="location">Location:</label>
      <input
        type="text"
        id="location"
        onChange={(e) => setLocation(e.target.value)}
      />

      <label htmlFor="description">Description:</label>
      <input
        type="textarea"
        id="description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="startTime">Start Time:</label>
      <input
        type="time"
        id="startTime"
        onChange={(e) => setStartTime(e.target.value)}
      />

      <label htmlFor="endTime">End Time:</label>
      <input
        type="time"
        id="endTime"
        onChange={(e) => setEndTime(e.target.value)}
      />

      <label htmlFor="images">End Time:</label>
      <input
        type="file"
        id="images"
        multiple={true}
        accept="image/png, image/jpeg"
        onChange={uploadToClient}
      />

      <button onClick={uploadToServer}>Post</button>
    </Layout>
  );
};

export default NewPost;
