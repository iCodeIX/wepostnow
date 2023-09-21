import axios from "axios";
import "./styles/NewPostField.css";
import { useContext, useState } from "react";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { PostContext } from "./UserContext";

const NewPostField = ({fetchPosts}) => {
    const c_id = localStorage.getItem("id");
    const [toogleNewPostForm, setToogleNewPostForm] = useState(false);
    const [notifyPosted, setNotifyPosted] = useState(false);
    const [postForm, setPostForm] = useState({
        postContent: "",
        userId: c_id
    });

    const {setPosts, posts} = useContext(PostContext);

    function handlePostForm(e) {
        const { name, value } = e.target;

        setPostForm({
            ...postForm,
            [name]: value,
        })

    }

    async function addPost(e) {
        e.preventDefault();
        const newpost = await axios.post("/create-post", postForm)
            .catch((err) => console.log(err));

        setPosts([
            ...posts,
            newpost.data
        ]);



        setToogleNewPostForm(!toogleNewPostForm);
        setNotifyPosted(true);
        closeNotify();
        fetchPosts();
    }

    function closeNotify() {
        setTimeout(() => {
            setNotifyPosted(false);
        }, "2000")
    }


    return (
        <div className="newpost-containter">
            <button className="post-btn" onClick={() => setToogleNewPostForm(true)}>What's on your mind?</button>
            {
                toogleNewPostForm && (
                    <div className="newpostfield-container">
                        <button className="cancelpost-btn" onClick={() => setToogleNewPostForm(!toogleNewPostForm)}><CloseOutlinedIcon /></button>
                        <form className="newpost-form" onSubmit={addPost}>
                            <div className="form-textarea">
                                <textarea onChange={handlePostForm} value={postForm.postContent} name="postContent" className="form-textarea-input" placeholder="Whats on your mind?"></textarea>
                            </div>
                            <button className="newpost-btn" type="submit">POST</button>
                        </form>
                    </div>
                )
            }
            {
                notifyPosted && (
                    <p className="notify-posted"> Message posted!</p>

                )
            }
        </div>
    )
}

export default NewPostField;