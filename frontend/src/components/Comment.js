import axios from "axios";
import { useEffect, useState } from "react";
import "./styles/Comment.css";
import { Link } from "react-router-dom";
const Comment = ({ postId, userId }) => {

    const [comments, setComments] = useState(null);
    const [showCommentsContent, setShowCommentsContent] = useState(false);
    const [commentTextArea, setCommentTextArea] = useState("");
    const [commentsCount, setCommentsCount] = useState(0);

    useEffect(() => {
        fetchComments();

    }, []);

    const fetchComments = () => {

        axios.post("/fetch-comments", { postId })
            .then((response) => {
                setComments(response.data);
                setCommentsCount(response.data.length);
            })
            .catch((err) => {
                console.log(err);
            })


    }


    const commentFormChange = (e) => {
        const comment = e.target.value;
        setCommentTextArea(comment);
    }

    const addComment = async (e) => {
        e.preventDefault();

        await axios.post("/create-comment", {
            commentContent: commentTextArea,
            userId,
            postId
        }).then((response) => {
            setComments([...comments, response.data]);
            fetchComments();
        })


    }

    const profileLinkStyle = {
        width: "auto",
        textDecoration: "none"

    }
    return (
        <div className="comments-container">
            <button className="viewcomments-btn" onClick={() => setShowCommentsContent(!showCommentsContent)}>
                {
                    commentsCount === 0 && undefined ? "No comments" : `( ${commentsCount} )comments`
                }
            </button>

            {
                showCommentsContent && (
                    <div className="comment-content-container">
                        <form className="newcomment-form" onSubmit={addComment}>
                            <textarea className="newcomment-textarea" onChange={commentFormChange} name="comment" placeholder="Write a comment" value={commentTextArea} ></textarea>
                            <button className="comment-btn" type="submit">POST</button>
                        </form>
                        <p className="comment-text">Comments:</p>
                        <ul className="comments-list">
                            {
                                comments.length > 0 ? (
                                    comments.map((comment) => {
                                        return (
                                            <li className="comment-item" key={comment._id}>
                                                <div className="comment-user-details">
                                                    <Link style={profileLinkStyle} to={`/profile/${comment["user"]._id}`}>
                                                        <img src={comment["user"].profileImg} className="comment-user-photo" alt="profile" />
                                                        <span className="comment-user-name">{comment["user"].username}</span>
                                                    </Link>

                                                </div>
                                                <p className="comment-content">{comment.commentContent}</p>
                                            </li>
                                        )
                                    })
                                ) : (
                                    <p>No comments to show!</p>
                                )
                            }
                        </ul>
                    </div>
                )
            }

        </div >
    )
}

export default Comment;