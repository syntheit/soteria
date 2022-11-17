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
import { index } from "../constants/metadata";
import Layout from "../components/Layout/Layout";

interface Props {}

const MyPosts: NextPage<Props> = () => {
  const [posts, setPosts] = useState<
    {
      description: string;
      end_time: Timestamp;
      location: string;
      post_date: Timestamp;
      start_time: Timestamp;
      uid: string;
      images: string[];
    }[]
  >([]);
  const [pageNumber, setPageNumber] = useState<number>();
  const [rerender, setRerender] = useState<number>(0);
  const [schoolId, setSchoolId] = useState<string>("");
  const [error, setError] = useState<string>();

  const getLatestPosts = async (interval: number) => {
    if (!auth.currentUser) return;

    const postsRef = query(
      collection(db, `schools/${schoolId}/users/${auth.currentUser.uid}/posts`)
    );
    const q = query(postsRef, orderBy("post_date", "desc"), limit(interval));
    const querySnapshot = await getDocs(q);
    let fetchedPosts: {
      description: string;
      end_time: Timestamp;
      location: string;
      post_date: Timestamp;
      start_time: Timestamp;
      uid: string;
      images: string[];
    }[] = [];
    querySnapshot.forEach((doc) => {
      fetchedPosts.push({
        description: doc.data().description,
        end_time: doc.data().end_time,
        location: doc.data().location,
        post_date: doc.data().post_date,
        start_time: doc.data().start_time,
        uid: doc.data().uid,
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
      setError("Error occured while getting school ID");
    }
  };

  useEffect(() => {
    schoolId === "" && getSchoolId();
    schoolId !== "" && posts.length === 0 && getLatestPosts(10);
  });

  return error || !posts ? (
    <p>Error: {error}</p>
  ) : (
    <Layout metadata={index}>
      <button
        onClick={() =>
          setRerender((currentCount) => {
            return currentCount + 1;
          })
        }
        className="text-white mb-8 absolute top-2 left-80"
      >
        Render Images
      </button>
      <div className="flex items-center justify-center w-full overflow-y-auto flex-wrap">
        {posts.map((post) => (
          <Post key={`${post.uid}-${post.post_date}`} {...post} />
        ))}
      </div>
    </Layout>
  );
};

export default MyPosts;
