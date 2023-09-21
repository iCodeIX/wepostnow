import logo from "./images/logo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import "./styles/Header.css";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { UserContext } from "./UserContext";

const SearchUser = () => {
    const [showResult, setShowResult] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchUsers, setSearchUsers] = useState(null);


    const searchFormChange = (e) => {
        const searchTextInput = e.target.value;
        setSearchText(searchTextInput);

        setShowResult(true);
        fetchUsers(searchTextInput);
    }


    const fetchUsers = async (searchTextInput) => {
        await axios.post("/search-user", { searchText: searchTextInput }).
            then((response) => {
                setSearchUsers(response.data);
            }).catch((err) => {
                console.log(err);
            })
    }

    const searchResultLink = {
        fontSize: "10px",
    }


    function removePublic(src) {
        return String(src).replace("/public", "");
    }


    return (
        <form className="search-form">
            <div className="search-form-input">
                <span className="search-icon">
                    <SearchOutlinedIcon />
                </span>
                <input className="search-input" autoComplete="off" value={searchText} name="search" onChange={searchFormChange} type="text" placeholder="Search user" />
            </div>
            <div className="broker">
                {
                    showResult && (
                        <div className="result-container">
                            <p className="search-result-text">Search Result</p>
                            {
                                searchUsers !== null && searchUsers.length > 0 && searchText !== "" ? (
                                    searchUsers.map((user) => {
                                        return (
                                            <div key={user._id} className="result-item">
                                                <Link to={`/profile/${user._id}`} style={searchResultLink}>
                                                    <img className="search-photo profile-photo icon" src={removePublic(user.profileImg)} alt="user profile" />
                                                    <span className="search-name">{user.username}</span>
                                                </Link>
                                            </div>

                                        )
                                    }
                                    )
                                ) : (
                                    <p>No user found!</p>
                                )

                            }

                        </div>
                    )
                }
            </div>
        </form>
    )
}

const Header = () => {
    const id = localStorage.getItem('id');
    const user = useContext(UserContext);
    let profileImg = localStorage.getItem('profileImg');
    profileImg = profileImg.replace("/public", "");

    function removePublic(src) {
        return String(src).replace("/public", "");
    }

    return (
        <header>
            <img src={logo} className="logo icon" alt="site logo" />
            <SearchUser />
            <Link to={`/profile/${id}`}>
                <img className="profile-photo icon" src={user && removePublic(user.profileImg)} alt="user profile" />
            </Link>
        </header>
    )
}

export default Header;