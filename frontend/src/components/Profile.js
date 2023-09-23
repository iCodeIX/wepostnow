import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./styles/Profile.css";
import UserPosts from "./UserPosts";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Neutral from "./images/neutral.png";
import Male from "./images/male.png";
import Female from "./images/female.png";
import { UserPostsContext } from "./UserContext";

const UpdateProfile = ({ c_id, setToogleUpdate, bio, profileImg, fetchUser, fetchAllPosts }) => {
    const [photoPrevFile, setPhotoPrevFile] = useState(null);

    const [userProfile, setUserProfile] = useState({
        id: c_id,
        bio: bio,
        profileImg: profileImg
    });

    const photoPrevUrl = photoPrevFile !== null && URL.createObjectURL(photoPrevFile);

    const updateProfile = (e) => {
        e.preventDefault();
        axios.post("/update-profile", userProfile, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                setUserProfile(response.data);
                setToogleUpdate(false);
                fetchUser();
                fetchAllPosts();

            })
            .catch((err) => {
                console.log(err);
            })

    }


    const handleUpdateForm = (e) => {
        let bio = e.target.value;

        if (e.target.name === "profileImg") {
            setUserProfile({
                ...userProfile,
                "profileImg": e.target.files[0]
            })

            setPhotoPrevFile(
                e.target.files[0]
            )

        } else {
            setUserProfile({
                ...userProfile,
                bio
            })
        }
    }

    return (

        <div className="updateprofile-container">

            <button className="updatecancel-btn" onClick={() => setToogleUpdate(false)}><CloseOutlinedIcon /> </button>
            <div className="photoprev-container">
                <img src={photoPrevFile !== null && photoPrevUrl} alt="profile" />
            </div>
            <form className="updateProfile-form" onSubmit={updateProfile}>
                <input className="updatedPhotoInput" type="file" name="profileImg" onChange={handleUpdateForm} />
                <label>Bio:</label>
                <textarea className="updatedBioTextArea" name="updatedBio" value={userProfile.bio} onChange={handleUpdateForm}></textarea>
                <button className="updateProfile-btn" type="submit">UPDATE</button>
            </form>

        </div>
    )
}


const Profile = () => {
    const c_id = localStorage.getItem("id");
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [toogleUpdateProfile, setToogleUpdateProfile] = useState(false);
    const [userPosts, setUserPosts] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchAllPosts();

    }, []);

    const fetchUser = async () => {

        await axios.get("/profile/" + id)
            .then((response) => {

                setUser(response.data);
            })
            .catch(err => console.log(err));
    }

    const fetchAllPosts = async () => {

        await axios.post("/posts", { userId: id })
            .then((response) => {
                setUserPosts(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function removePublic(src) {
        return String(src).replace("/public", "");
    }

    return (
        <div className="profile-container">
            {
                user && (
                    <>
                        <div className="profile-details-container">
                            {
                                c_id === id && (<button className="edit-profile-btn" onClick={() => { setToogleUpdateProfile(!toogleUpdateProfile) }}><EditNoteOutlinedIcon /><span>Update Profile</span></button>)
                            }

                            {
                                toogleUpdateProfile && <UpdateProfile c_id={c_id} setToogleUpdate={setToogleUpdateProfile} bio={user.bio} profileImg={removePublic(user.profileImg)} fetchUser={fetchUser} fetchAllPosts={fetchAllPosts} />
                            }
                            <img className="user-profile-photo" src={removePublic(user.profileImg)} alt="profile" />
                            <div className="details-text-container">
                                <p className="profile-name">
                                    <img src={user.gender === "male" ? Male :
                                        user.gender === "female" ? Female :
                                            user.gender === "neutral" ? Neutral : ""}
                                        className="gender-icon" alt="gender" />{user.username}</p>
                                <p className="profile-bio">"{user.bio}"</p>
                            </div>
                        </div>
                        {
                            userPosts?.length > 0 ? (
                                <UserPostsContext.Provider value={userPosts}>
                                    <UserPosts />
                                </UserPostsContext.Provider>)
                                : (<div className="no-posts-container">
                                    <span className="no-posts">User has no post to show!</span>
                                </div>)
                        }




                    </>


                )

            }

        </div>
    )

}

export default Profile;