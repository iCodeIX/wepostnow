import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./styles/Signup.css";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


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
    const navigate = useNavigate();

    const handleCreateFormChange = (e) => {
        const { name, value } = e.target;


        if (name === "profileImg") {

            setCreateForm(
                {
                    ...createForm,
                    [name]: e.target.files[0]
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
            try {
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
            } catch (error) {
                console.log(error);
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

            <form className="signup-form" onSubmit={createUser}>

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