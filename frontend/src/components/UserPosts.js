import { Link } from "react-router-dom";
import "./styles/Post.css";
import LazyLoad from 'react-lazy-load';
import Comment from "./Comment";
import { UserPostsContext } from "./UserContext";
import { useContext } from "react";

const UserPosts = () => {

    const userId = localStorage.getItem('id');
    const userPosts = useContext(UserPostsContext);

    function removePublic(src) {
        return String(src).replace("/public", "");
    }

    function getDate(str) {
        const date = new Date(str.slice(0, 10));
        const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
        const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

        const day = days[date.getDay()];
        const month = months[date.getMonth()];
        const d = date.getDate();

        return `${day}, ${month} ${d}, ${date.getFullYear()}`;
    }

    function getTime(str) {
        let newStr = str.substring(11, 19);
        let addTime = 8 + Number(newStr[0] + newStr[1]);
        let removedHour = newStr.substring(2, 9);
        let aMpM = "";

        aMpM = addTime >= 12 ? " PM" : " AM";
        addTime = addTime > 12 ? "0" + String(addTime - 12) : String(0) + addTime;
        addTime = addTime > 9 ? addTime.substring(1, 3) : addTime;

        return addTime + removedHour + aMpM;
    }


    const profileLinkStyle = {
        width: "auto",
        textDecoration: "none"

    }
    return (

        <ul className="posts-list">
            <p className="userposts-text">User posts</p>
            {

                userPosts?.length > 0 ? (
                    userPosts.map(function (post) {

                        return (
                            <LazyLoad key={post._id}>

                                <li className="post-item" key={post._id}>

                                    <div className="link-container">
                                        <Link to={`/profile/${post["user"]._id}`} style={profileLinkStyle}>
                                            <img className="post-user--photo" alt={post["user"].username} src={removePublic(post["user"].profileImg)} />
                                            <span className="post-username">{post["user"].username}</span>
                                        </Link>
                                    </div>
                                    <span className="post-date">
                                        {getDate(post.createdAt)}
                                    </span>
                                    <span className="post-time">
                                        {getTime(post.createdAt)}
                                    </span>
                                    <p className="post-content">{post.postContent}</p>
                                    <Comment postId={post._id} userId={userId} />
                                </li>
                            </LazyLoad>

                        )
                    }
                    )

                ) : (<p>No posts to show right</p>)
            }



        </ul>

    )
}

export default UserPosts;