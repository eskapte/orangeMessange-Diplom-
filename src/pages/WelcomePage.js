import React from 'react'

import '../assets/css/mycss/index.css';
import '../assets/css/mycss/welcome.css';

import logo from '../assets/images/myimg/Логотип.svg'
import mainImage from '../assets/images/myimg/Подростки.png'
import orange from '../assets/images/myimg/orange.png'

const WelcomePage = () => {

  document.title = "Orange | Добро пожаловать!"
    return (
        <main className='welcome-page'>
            <header className='welcome-header'>
                <a href='/welcome'><img src={logo} alt="Лого"/></a>
                <nav>
                    <a href="/login">Войти</a>
                    <a href="/registration">Регистрация</a>
                    <a href="#">Подробнее о нас</a>
                </nav>
            </header>
            <section>
                <h1>Пусть все будет под рукой!</h1>
                <p><b>Orange</b> - это мессенджер, который удобно
                использоваться как и для работы, учёбы, так и для
                обычного общения с друзьями. И все это в <b>ОДНОМ</b> месте</p>
                <a href="/registration">Регистрация</a>
            </section>
            <img className='main-image' src={mainImage} alt="Подростки"/>
            <div className="bg-images">
                <img className='orange-img' src={orange} alt=""/>
                <img className='orange-img' src={orange} alt=""/>
            </div>
        </main>
    )
};

export default WelcomePage
