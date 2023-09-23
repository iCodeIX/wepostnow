import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Signup from "./Signup";
import Main from "./Main";
import Profile from "./Profile";
import "./styles/App.css";


function App() {


  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/main' element={<Main />}></Route>
        <Route path='/profile/:id' element={<Profile />}></Route>
      </Routes>
    </div >
  );
}

export default App;
