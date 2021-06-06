import React, {useEffect, useState} from 'react'

import '../assets/css/mycss/index.css';
import '../assets/css/mycss/reg.css';

import logo from '../assets/images/myimg/Логотип.svg'
import cat from '../assets/images/myimg/cat.png'
import orange from "../assets/images/myimg/orange.png";

import MyInput from "../components/MyInput";

import {registerUser, apiError} from "../redux/auth/actions";
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";

const RegPage = () => {

  document.title = 'Orange | Регистрация'

  const dispatch = useDispatch()

  const errors = {
    login: {
      voidInput: "Пустое поле",
      withoutError: "Придумайте никнейм на английском",
      loginExist: "Такой логин уже существует"
    }
  }

  const clearError = () => {
    dispatch(apiError(""));
  }

  useEffect(clearError)

  const [loginText, setLoginText] = useState('')
  const [passwordText, setPasswordText] = useState('')
  const [passwordRepeatText, setPasswordRepeatText] = useState('')

  const [loginError, setLoginError] = useState(errors.login.withoutError)
  const [passwordError, setPasswordError] = useState(false)
  const [passwordRepeatError, setPasswordRepeatError] = useState(false)

  const sendForm = (e) => {
    e.preventDefault()

    setLoginText(loginText.trim())
    setPasswordText(passwordText.trim())
    setPasswordRepeatText(passwordRepeatText.trim())

    setLoginError(errors.login.withoutError)
    setPasswordError(false)
    setPasswordRepeatError(false)

    if (loginText.length < 1) {
      setLoginError(errors.login.voidInput)
      return
    }

    if (passwordText !== passwordRepeatText) {
      setPasswordRepeatError(true)
      return
    }

    if (passwordText.length < 8) {
      setPasswordError(true)
      return
    }

    if (loginError === errors.login.withoutError && !passwordError && !passwordRepeatError)
    {
      dispatch(registerUser({email: loginText, password: passwordText}))
    }
  }

    return (
        <main className='reg-page'>
          <section>
            <a href='/welcome'><img src={logo} alt="Лого"/></a>
            <span>
              <h1>Добро пожаловать в Orange!</h1>
              <a href="/login">Уже есть аккаунт?</a>
            </span>
              <div className='reg-form'>
                <h2>Регистрация</h2>
                <form>
                  <MyInput value={loginText} onChange={(e) => setLoginText(e.target.value)} id='login' label='Никнейм'
                           variant='outlined'
                           helperText={loginError}
                           error={loginError !== errors.login.withoutError}
                           onClick={() => setLoginError(errors.login.withoutError)}
                           autoFocus
                  />
                  <MyInput value={passwordText} onChange={(e) => setPasswordText(e.target.value)} id='password'
                           label='Пароль' variant='outlined'
                           helperText='Пароль, минимум 8 символов'
                           type='password'
                           error={passwordError}
                           onClick={() => setPasswordError(false)}
                  />
                  <MyInput value={passwordRepeatText} onChange={(e) => setPasswordRepeatText(e.target.value)}
                           id='password-repeat' label='Повтор пароля' variant='outlined'
                           helperText={passwordRepeatError ? 'Пароли не совпадают' : 'Пожалуйста, повторите пароль'}
                           type='password' error={passwordRepeatError}
                           onClick={() => setPasswordRepeatError(false)}
                  />
                  <button onClick={(e) => sendForm(e)}>Зарегестрироваться</button>
                </form>
              </div>
          </section>
        <div className="bg-images-reg">
          <img className='orange-img-o' src={orange} alt=""/>
          <img className='orange-img-o' src={orange} alt=""/>
          <img className='orange-img-o' src={orange} alt=""/>
          <img className='orange-img-o' src={orange} alt=""/>
          <img className='orange-img-o' src={cat} alt=""/>
        </div>
        </main>
    )
}

export default RegPage