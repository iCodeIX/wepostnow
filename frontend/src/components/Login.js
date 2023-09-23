import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Login.css";

const Login = () => {

    const navigate = useNavigate();

    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
        profileImg: "",
    })

    const [wrongPassDisp, setWrongPassDisp] = useState(false);
    const [error, setError] = useState("");
    const handleLoginFormChange = (e) => {

        const { name, value } = e.target;

        setLoginForm({
            ...loginForm,
            [name]: value,
        })
    }

    const loginUser = async (e) => {

        e.preventDefault();

        if (loginForm.username === "" || loginForm.password === "") {
            setWrongPassDisp(true);
            setError("Username or Password cannot be empty!")
        } else {
            try {

                const userCheck = await axios.post("/login", loginForm)
                    .then(response => {

                        return response.data;
                    })
                    .catch((err) => {
                        setWrongPassDisp(true);
                        setError(err.response.data.error);
                    });


                if (userCheck) {
                    navigate('/main');
                    localStorage.setItem('id', userCheck.user._id);
                    localStorage.setItem('profileImg', userCheck.user.profileImg);
                    console.log(userCheck.user);

                } else {
                    setWrongPassDisp(true);
                }
            } catch (err) {
                console.log(err);
            }
        }

    }

    const SignUpLinkStyle = {
        textDecoration: "none",
        color: "#1A72E8",
        fontWeight: "700",
        fontSize: "14px",
        letterSpacing: "1px",
        margin: "10px"
    }

    const ForgotPassLinkStyle = {
        textDecoration: "none",
        color: "red",
        fontWeight: "700",
        fontSize: "14px",
        letterSpacing: "1px",
        margin: "5px",
        alignSelf: "flex-end"
    }
    return (
        <div className="login-container">
            <p className="welcome-text">Welcome back</p>
            <form className="login-form" onSubmit={loginUser}>
                {wrongPassDisp && (
                    <>
                        <p className="wrongdetails-alert">{error}</p>
                    </>
                )}

                <div className="form-input-login">
                    <label htmlFor="name" className="text-light">Username</label>
                    <input type="text" id="name" value={loginForm.username} onChange={handleLoginFormChange} name="username" />
                </div>
                <div className="form-input-login">
                    <label htmlFor="password" className="text-light">Password</label>
                    <input type="password" id="password" value={loginForm.password} onChange={handleLoginFormChange} name="password" />
                </div>
                <Link to="/signup" style={ForgotPassLinkStyle}>Forgot Password</Link>
                <button className="login-btn" type="submit">Login</button>
            </form>
            <p className="nyam-text">Not yet a Member?</p>
            <Link to="/signup" style={SignUpLinkStyle}>Register here</Link>
        </div>
    )
}

export default Login;