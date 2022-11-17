import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getUsername = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data().name;
};
