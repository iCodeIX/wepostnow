import "./styles/Main.css";
import Post from "./Post";
import NewPostField from "./NewPostField";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { UserContext } from "./UserContext";
import { PostContext } from "./UserContext";

const Main = () => {
    const id = localStorage.getItem('id');
    const [posts, setPosts] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchuser();
    }, []);

    useEffect(() => {
        fetchAllPosts();
    }, []);


    const fetchuser = async () => {
        axios.post("/fetch-user", { id })
            .then((response) => {
                setUser(response.data);
            })
    }

    const fetchAllPosts = async () => {
        try {
            await axios.post("/posts")
                .then((response) => {
                    setPosts(response.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (error) {
            console.log("post error : ", error)
        }

    }


    return (
        <div className="main-container">
            <UserContext.Provider value={user}>
                <Header />
            </UserContext.Provider>
            <PostContext.Provider value={{ posts, setPosts }}>
                <NewPostField fetchPosts={fetchAllPosts} />
                <Post />
            </PostContext.Provider>
        </div>
    )
}

export default Main;