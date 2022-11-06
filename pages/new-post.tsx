import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";
import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

const metadata: { title: string; defaultDescription: boolean } = {
    title: "New Post",
    defaultDescription: true,
};

interface Props {}


const NewPost: NextPage<Props> = () => {
    const [location, setLocation]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [description, setDescription]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [startTime, setStartTime]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [endTime, setEndTime]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [images, setImages]: any = useState(null);

    const uploadToClient = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(e.target.files)
            console.log(e.target.files);
        }
    }

    const uploadToServer = () => {
        if (images && images instanceof FileList) {
            Array.from(images).forEach(file => uploadBytes(ref(storage, 'images/' + file.name + '.png'), file).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            }));
        }
    }

    return (
        <Layout metadata={metadata}>
            <Navbar currentPage="New Post" />
                <h2>New Post</h2>

                <label htmlFor="location">Location:</label>
                <input type="text" id="location" onChange={(e) => setLocation(e.target.value)}/>

                <label htmlFor="description">Description:</label>
                <input type="textarea" id="description" onChange={(e) => setDescription(e.target.value)}/>

                <label htmlFor="startTime">Start Time:</label>
                <input type="time" id="startTime" onChange={(e) => setStartTime(e.target.value)}/>

                <label htmlFor="endTime">End Time:</label>
                <input type="time" id="endTime" onChange={(e) => setEndTime(e.target.value)}/>

                <label htmlFor="images">End Time:</label>
                <input type="file" id="images" multiple={true} accept="image/png, image/jpeg" onChange={uploadToClient}/>

                <button onClick={uploadToServer}>Post</button>
        </Layout>
    );
};

export default NewPost;