import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import chatSaga from "./chat/saga";
import firebase from "firebase";
import {getFirebaseBackend} from "../helpers/firebase";

export default function* rootSaga(getState) {

    yield all([
        authSaga(),
        chatSaga(),
    ]);
}
