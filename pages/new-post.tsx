import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Navbar from "../components/Navbar/Navbar";

const metadata: { title: string; defaultDescription: boolean } = {
    title: "New Post",
    defaultDescription: true,
};

interface Props {}

const NewPost: NextPage<Props> = () => {
    return (
        <Layout metadata={metadata}>
            <Navbar currentPage="New Post" />
            <form className="flex flex-col">
                <h2>New Post</h2>

                <label htmlFor="location">Location:</label>
                <input type="text" id="location"/>

                <label htmlFor="description">Description:</label>
                <input type="textarea" id="description"/>

                <label htmlFor="startTime">Start Time:</label>
                <input type="time" id="startTime"/>

                <label htmlFor="startTime">End Time:</label>
                <input type="time" id="endTime"/>
            </form>
        </Layout>
    );
};

export default NewPost;