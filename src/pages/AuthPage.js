import React, {useState} from 'react'

import logo from "../assets/images/myimg/Логотип.svg"
import smile from '../assets/images/myimg/smile.png'
import orange from '../assets/images/myimg/orange.png'
import simpson from '../assets/images/myimg/simpson.png'

import '../assets/css/mycss/index.css'
import '../assets/css/mycss/auth.css'

import MyInput from "../components/MyInput"

import {loginUser, apiError} from "../redux/auth/actions";
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";

const AuthPage = (props) => {
  document.title = 'Orange | Авторизация'

  const [loginText, setLoginText] = useState('')
  const [passwordText, setPasswordText] = useState('')

  const dispatch = useDispatch()

  const sendForm = (evt) => {
    evt.preventDefault();

    setLoginText(loginText.trim())
    setLoginText(passwordText.trim())

    dispatch(loginUser(loginText, passwordText, props.history))

    if (localStorage.getItem("authUser")) {
      return <Redirect to="/dashboard" />;
    }
  }

  return (
    <main className='auth-page'>
      <section>
        <a href='/welcome'><img src={logo} alt="Лого"/></a>
        <span className='header-text'>
            <h1>Рады видеть вас снова!<img src={smile}/></h1>
            <span>Если вы впервые у нас, то приглашаем на <a href='/registration'>регистрацию</a></span>
        </span>
        <div className="auth-form">
          <h2>Авторизация</h2>
          <form>
            <MyInput id='login' label='Логин' helperText='Ваш логин' variant='outlined' autoFocus
              onChange={ e => setLoginText(e.target.value)}
            />
            <MyInput id='password' label='Пароль' helperText='Ваш пароль' variant='outlined'
              type='password'
              onChange={ e => setPasswordText(e.target.value) }
            />
            <button onClick={(evt) => sendForm(evt)}>Войти</button>
          </form>
        </div>
      </section>
      <div className="bg-images-auth">
        <img className='orange-img-o' src={orange} alt=""/>
        <img className='orange-img-o' src={orange} alt=""/>
        <img className='orange-img-o' src={orange} alt=""/>
        <img className='orange-img-o' src={orange} alt=""/>
        <img className='orange-img-o' src={simpson} alt=""/>
      </div>
    </main>
  )
}

export default AuthPage