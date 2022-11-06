import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { auth, db } from "../firebase"
import { collection, doc, setDoc, getDoc, DocumentReference, DocumentData, Timestamp } from "firebase/firestore";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const storage = getStorage();

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
    const [startTime, setStartTime]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [endTime, setEndTime]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [images, setImages] = useState(null) as unknown as [FileList, Dispatch<SetStateAction<FileList>>];
    const [startDate, setStartDate]: [Date, Dispatch<SetStateAction<Date>>] = useState(new Date());
    const [endDate, setEndDate]: [Date, Dispatch<SetStateAction<Date>>] = useState(new Date());

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
            start_time: Timestamp.fromDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), Number(startTime.substring(0, 2)), Number(startTime.substring(3)))),
            end_time: Timestamp.fromDate(new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), Number(endTime.substring(0, 2)), Number(endTime.substring(3)))),
            post_date: Timestamp.now(),
            location: location,
            images: images && images instanceof FileList ? Array.from(images).map(file => `images/${uid}/${newDoc.id}/${file.name}`) : [],
            uid: uid
        };

        await setDoc(newDoc, post);
        await setDoc(postsDoc, post);

        if (images && images instanceof FileList) {
            Array.from(images).forEach(file => uploadBytes(ref(storage, `images/${uid}/${newDoc.id}/${file.name}`), file).then((_) => {
                console.log('Uploaded a blob or file!');
            }));
        }
    }

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

                    await makeUserPost(schoolSnap.id, uid);
                } else {
                    console.log("No such school!");
                }
            } else {
                console.log("No such user!");
            }
        } else {
            console.log("Not logged in");
        }
    }

    return (
        <Layout metadata={metadata}>
            <Navbar currentPage="New Post"/>
            <div className="flex flex-col w-3/4 m-6 font-bold">
                <h1 className="text-7xl m-6">New Post</h1>

                <input type="text" id="location" placeholder="Where are the item(s) located?" className="text-2xl font-medium p-2 m-6" onChange={(e) => setLocation(e.target.value)}/>

                <input type="textarea" id="description" placeholder="Give a brief description of the item(s)" className="text-2xl font-medium m-6" onChange={(e) => setDescription(e.target.value)}/>

                <div className="flex flex-row justify-start flex-grow m-6">
                    <label htmlFor="startDate" className="text-2xl">Start Date:</label>
                    <Calendar id="startDate" className="m-3" onChange={setStartDate} value={startDate} />

                    <label htmlFor="endDate" className="text-2xl">End Date:</label>
                    <Calendar id="endDate" className="m-3" onChange={setEndDate} value={endDate} />
                </div>

                <div className="flex flex-row justify-evenly flex-grow m-6">
                    <label htmlFor="startTime" className="text-2xl">Start Time:</label>
                    <input type="time" id="startTime" onChange={(e) => setStartTime(e.target.value)}/>

                    <label htmlFor="endTime" className="text-2xl">End Time:</label>
                    <input type="time" id="endTime" onChange={(e) => setEndTime(e.target.value)}/>
                </div>




                <label htmlFor="images" className="text-2xl">End Time:</label>
                <input type="file" id="images" multiple={true} accept="image/png, image/jpeg, image/jpg" onChange={uploadToClient}/>

                <button onClick={uploadToServer}>Post</button>
            </div>
        </Layout>
    );
};

export default NewPost;