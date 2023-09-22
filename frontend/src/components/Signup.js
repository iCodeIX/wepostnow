import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./styles/Signup.css";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Compressor from 'compressorjs';

const Signup = () => {
    const [createForm, setCreateForm] = useState({
        username: "",
        email: "",
        password: "",
        profileImg: "",
        gender: "male"
    });
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);
    const [compressedFile, setCompressedFile] = useState(null);
    const navigate = useNavigate();

    const handleCreateFormChange = (e) => {
        const { name, value } = e.target;
        
        const image = e.target.files[0];

        new Compressor(image, {
            quality: 0.2, // 0.6 can also be used, but its not recommended to go below.
            success: (compressedResult) => {
                // compressedResult has the compressed file.
                // Use the compressed file to upload the images to your server.        
                setCompressedFile(compressedResult)
            },
        });


        if (name === "profileImg") {
            setCreateForm(
                {
                    ...createForm,
                    [name]: compressedFile,
                }
            )
        }
        else {
            setCreateForm(
                {
                    ...createForm,
                    [name]: value,
                }
            )
        }

    }

    const handleGenderChange = (e) => {
        const gender = e.target.value;
        setCreateForm(
            {
                ...createForm,
                gender,
            }
        )
    }

    const createUser = async (e) => {
        e.preventDefault();

        if (handleFormValidation()) {
            const userCreate = await axios.post("/signup", createForm, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((response) => {
                    return response.data;
                })
                .catch((err) => {
                    setShowError(true);
                    setError(err.response.data.error);
                });


            if (userCreate) {
                navigate('/main');
                localStorage.setItem('id', userCreate._id);
            }
        }
    }

    const handleFormValidation = () => {

        if (!createForm.username) {
            setError(`Username cannot be empty!`);
        } else if (createForm.username.match(/[^A-z0-9_-]/g)) {
            setError(`Username must have no special symbols other than _ and - `);
        } else if (createForm.username.length < 4) {
            setError(`Username must be four(4) characters or above!`);
        } else if (!createForm.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(createForm.email)) {
            setError("Email cannot be empty! No special symbols other than _ , . and @!")
        } else if (createForm.password.match(/[^A-z0-9.]/g)) {
            setError(`Password must have no special symbols other than dot (.)!`);
        } else if (!createForm.password) {
            setError(`Password cannot be empty!`);
        } else if (createForm.password.length < 6) {
            setError(`Password must be six(6) characters or above!`);
        } else {
            setShowError(false);
            return true;
        }
        setError && setShowError(true);
    }

    const LoginLinkStyle = {
        textDecoration: "none",
        color: "#1A72E8",
        fontWeight: "700",
        fontSize: "16px",
        letterSpacing: "1px"
    }

    return (
        <div className="signup-container">

            <form className="signup-form" encType="multipart/form-data" onSubmit={createUser}>

                <p className="signup-text">Create your Account</p>
                {showError && (<p className="error-msg">{error}</p>)}
                <div className="form-input-reg">
                    <label htmlFor="name" className="text-light">Username</label>
                    <input type="text" id="name" value={createForm.username} onChange={handleCreateFormChange} name="username" />
                </div>
                <div className="form-input-reg">
                    <label htmlFor="email" className="text-light">Email</label>
                    <input type="email" id="email" value={createForm.email} onChange={handleCreateFormChange} name="email" />
                </div>
                <div className="form-input-reg">
                    <div className="password-visibility-container">
                        <label htmlFor="password" className="text-light">Password</label>
                        <span className="visibility-icon" onClick={() => setPasswordShow(!passwordShow)}>
                            {
                                passwordShow ? <VisibilityIcon /> : <VisibilityOffIcon />
                            }
                        </span>
                    </div>

                    <input type={passwordShow ? "text" : "password"} id="password" value={createForm.password} onChange={handleCreateFormChange} name="password" />
                </div>
                <div className="form-input-reg">
                    <label>Gender</label>
                    <div className="gender-radio-btns">
                        <input type="radio" name="gender" value="male" onChange={handleGenderChange} checked={createForm.gender === "male"} /><label className="gender-label">Male</label>
                        <input type="radio" name="gender" value="female" onChange={handleGenderChange} checked={createForm.gender === "female"} /><label className="gender-label">Female</label>
                        <input type="radio" name="gender" value="neutral" onChange={handleGenderChange} checked={createForm.gender === "neutral"} /><label className="gender-label">Neutral</label>
                    </div>
                </div>
                <div className="form-input-reg">
                    <label htmlFor="avatar" className="text-light">Profile Photo</label>
                    <input type="file" id="profileImg" name="profileImg" onChange={handleCreateFormChange} />
                </div>


                <button className="signup-btn" type="submit">Create Account</button>
            </form>
            <Link to="/login" style={LoginLinkStyle}>Log in instead</Link>
        </div>
    )
}

export default Signup;