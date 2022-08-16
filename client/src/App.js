import React ,{Component} from 'react';
import { BrowserRouter,Route, Routes, Link } from "react-router-dom";
import logo from './img/logo192.png';
import './App.css';

import LadingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";

//react-router-dom v6으로 업그레이드 됨에 따라 수정됨

function App() {
  return (
      <BrowserRouter>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Login />} />
          <Route path="/login" element={<Register />} />
        </Routes>

      </BrowserRouter>
  );
}

function Home() {
  return (
      <LadingPage />
  );
}

function Login() {
  return (
      <RegisterPage/>
  );
}

function Register() {
  return (
      <LoginPage/>
  );
}

export default App;
