import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { APIClient } from '../../helpers/apiClient';
import { getFirebaseBackend } from "../../helpers/firebase";


import {
    LOGIN_USER,
    LOGOUT_USER,
    REGISTER_USER,
    FORGET_PASSWORD
} from './constants';


import {
    loginUserSuccess,
    registerUserSuccess,
    forgetPasswordSuccess,
    apiError
} from './actions';
import firebase from "firebase";
import {yellow} from "@material-ui/core/colors";
import {replace} from "formik";
import {setLoggedInUser} from "../../helpers/authUtils";


//Initilize firebase
const fireBaseBackend = getFirebaseBackend();


/**
 * Sets the session
 * @param {*} user 
 */

const create = new APIClient().create;

/**
 * Login the user
 * @param {*} payload - username and password 
 */
function* login({ payload: { username, password, history } }) {
    try {
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const response = yield call(fireBaseBackend.loginUser, username, password);

            const db = yield call(firebase.firestore)

            const profileResponse = db.collection('users').doc(response['email'])
            const data = yield call(async() => await profileResponse.get())
            const profile = data.data().profile

            const userData = {
                uid: response.uid,
                displayName: profile.displayName ? profile.displayName : "Аноним",
                photoURL: profile.photoURL,
                location: profile.location ? profile.location : "Неизвестно",
                email: response.email,
                phoneNumber: response.phoneNumber,
                providerData: response.providerData,
                apiKey: response.apiKey,
                authDomain: response.authDomain,
                status: 'online'
            }

            yield call(setLoggedInUser, userData)
            yield call( async() => profileResponse.update({
                'profile.status': 'онлайн'
            }))
            yield put(loginUserSuccess(userData));
        } else {
            const response = yield call(create, '/login', { username, password });
            localStorage.setItem("authUser", JSON.stringify(response));
            yield put(loginUserSuccess(response));
        }
        history.push('/dashboard');
        window.location.href='/dashboard';
    } catch (error) {
        yield put(apiError(error));
    }
}


/**
 * Logout the user
 * @param {*} param0 
 */
function* logout({ payload: { history } }) {
    try {
        if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
            const authUser = yield call(() => getFirebaseBackend().getAuthenticatedUser())
            const db = yield call(() => firebase.firestore())
            const profile = db.collection('users').doc(authUser['email'])
            yield call(fireBaseBackend.logout);
            window.location.href = '/login';
            yield call( async () => profile.update({
                'profile.status': 'оффлайн'
            }) );
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Register the user
 */
function* register({ payload: { user } }) {
    try {
        const email = user.email;
        const password = user.password;
        if(process.env.REACT_APP_DEFAULTAUTH === "firebase"){
            const response = yield call(fireBaseBackend.registerUser, email, password);
            yield put(registerUserSuccess(response));

            const db = yield call(firebase.firestore)
            const newUserProfile = db.collection('users').doc(email)
            yield call(async() => await newUserProfile.set({
                chats: [],
                profile: {
                    displayName: "",
                    location: "",
                    photoURL: "Null",
                    status: "оффлайн"
                },
                friends: []
            }))

        } else {
            const response = yield call(create, '/register', user);
            yield put(registerUserSuccess(response));
        }
        window.location.href='/login';
        
    } catch (error) {
        yield put(apiError(error));
    }
}

/**
 * forget password
 */
function* forgetPassword({ payload: { email } }) {
    try {
        if(process.env.REACT_APP_DEFAULTAUTH === "firebase"){
            const response = yield call(fireBaseBackend.forgetPassword, email);
            if (response) {
              yield put(
                forgetPasswordSuccess(
                  "Reset link are sended to your mailbox, check there first"
                )
              );
            }
        } else {
            const response = yield call(create, '/forget-pwd', { email });
            yield put(forgetPasswordSuccess(response));
        }
    } catch (error) {
        yield put(apiError(error));
    }
}


export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword() {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

function* authSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgetPassword),
    ]);
}

export default authSaga;