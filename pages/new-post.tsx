import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { auth, db } from "../firebase"
import { collection, doc, setDoc, getDoc, DocumentReference, DocumentData, Timestamp } from "firebase/firestore";
import 'react-calendar/dist/Calendar.css';
import { storage } from '../firebase'

const metadata: { title: string; defaultDescription: boolean } = {
    title: "New Post",
    defaultDescription: true,
};

interface Props {}

class Post {
    description: string = "";
    start_time: Timestamp = Timestamp.now();
    end_time: Timestamp = Timestamp.now();
    post_date: Timestamp = Timestamp.now();
    location: string = "";
    images: string[] = [];
    uid: string = "";
}

const NewPost: NextPage<Props> = () => {
    const [location, setLocation]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [description, setDescription]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [images, setImages] = useState<FileList>();
    const [startDate, setStartDate]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [endDate, setEndDate]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const uploadToClient = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(e.target.files)
            console.log(e.target.files);
        }
    }

    const makeUserPost = async (schoolid: string, uid: string) => {
        const newDoc = doc(collection(db, `schools/${schoolid}/posts/`));
        const postsDoc = doc(collection(db, `schools/${schoolid}/users/${uid}/posts/`), newDoc.id);

        const post: Post = {
            description: description,
            start_time: Timestamp.fromDate(new Date(startDate)),
            end_time: Timestamp.fromDate(new Date(endDate)),
            post_date: Timestamp.now(),
            location: location,
            images: images instanceof FileList ? Array.from(images).map(file => `images/${uid}/${newDoc.id}/${file.name}`) : [],
            uid: uid
        };

        await setDoc(newDoc, post);
        await setDoc(postsDoc, post);

        if (images instanceof FileList) {
            Array.from(images).forEach(file => uploadBytes(ref(storage, `images/${uid}/${newDoc.id}/${file.name}`), file).then((_) => {
                console.log('Uploaded a blob or file!');
            }));
        }
    }

    const uploadToServer = async () => {
        if (!auth.currentUser) return;

        const uid: string = auth.currentUser.uid;
        const userSnap = await getDoc(doc(db, "users", uid));

        if (!userSnap.exists()) return;

        const schoolSnap = await getDoc(doc(db, "schools", userSnap.data().school))
        await makeUserPost(schoolSnap.id, uid);
    }

    return (
        <Layout metadata={metadata}>
            <Navbar currentPage="New Post"/>
            <div className="flex flex-col w-3/4 m-6 font-bold">
                <h1 className="text-7xl m-6">New Post</h1>

                <input type="text" id="location" placeholder="Where are the item(s) located?" className="text-2xl font-medium p-2 m-6" onChange={(e) => setLocation(e.target.value)}/>

                <textarea rows={4} cols={50} id="description" placeholder="Give a brief description of the item(s)" className="text-2xl font-medium p-2 m-6" onChange={(e) => setDescription(e.target.value)}/>

                <div className="flex flex-row justify-evenly flex-grow m-6 text-2xl">
                    <label htmlFor="startDate">Start Time:</label>
                    <input type="datetime-local" id="startDate" onChange={(e) => setStartDate(e.target.value)}/>

                    <label htmlFor="endDate">End Time:</label>
                    <input type="datetime-local" id="endDate" onChange={(e) => setEndDate(e.target.value)}/>
                </div>

                <label htmlFor="images" className="text-2xl">End Time:</label>
                <input type="file" id="images" multiple={true} accept="image/png, image/jpeg, image/jpg" onChange={uploadToClient}/>

                <button onClick={uploadToServer}>Post</button>
            </div>
        </Layout>
    );
};

export default NewPost;