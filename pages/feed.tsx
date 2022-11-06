import type { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Post from "../components/Post/Post";

interface Props {}

const Feed: NextPage<Props> = () => {
  const [posts, setPosts] = useState<
    {
      description: string;
      end_time: Timestamp;
      location: string;
      post_date: Timestamp;
      start_time: Timestamp;
      images: string[];
    }[]
  >();
  const [pageNumber, setPageNumber] = useState<number>();
  const [schoolId, setSchoolId] = useState<string>();
  const [error, setError] = useState<string>();

  const getLatestPosts = async (interval: number) => {
    const postsRef = query(collection(db, `schools/${schoolId}/posts`));
    const q = query(postsRef, orderBy("post_date"), limit(interval));
    const querySnapshot = await getDocs(q);
    let fetchedPosts: {
      description: string;
      end_time: Timestamp;
      location: string;
      post_date: Timestamp;
      start_time: Timestamp;
      images: string[];
    }[] = [];
    querySnapshot.forEach((doc) => {
      fetchedPosts.push({
        description: doc.data().description,
        end_time: doc.data().end_time,
        location: doc.data().location,
        post_date: doc.data().post_date,
        start_time: doc.data().start_time,
        images: doc.data().images,
      });
    });
    setPosts(fetchedPosts);
  };

  const getSchoolId = async () => {
    const uid = auth.currentUser ? auth.currentUser.uid : "";
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSchoolId(docSnap.data().school);
    } else {
      setError("Error occured while getting student ID");
    }
  };

  useEffect(() => {
    !schoolId && getSchoolId();
    !posts && getLatestPosts(10);
  });

  return error || !posts ? (
    <p>{error}</p>
  ) : (
    <div className="flex items-center flex-col w-full">
      {posts.map((post) => (
        <Post key={`${post.start_time}-${post.end_time}`} {...post} />
      ))}
    </div>
  );
};

export default Feed;
