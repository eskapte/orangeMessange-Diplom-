import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {FORGET_PASSWORD} from "../auth/constants";
import {ADD_NEW_CHAT_USER} from "./constants";
import firebase from "firebase";
import {getFirebaseBackend} from "../../helpers/firebase";

function* addNewChatUser({payload}) {

  const db = yield call(firebase.firestore);
  const authUser = getFirebaseBackend().getAuthenticatedUser();
  const doc = db.collection('users').doc(authUser.email)
  const receiver = db.collection('users').doc(payload.email)

  yield call(async () => await doc.update({
    'chats': firebase.firestore.FieldValue.arrayUnion(payload)
  }))

  const currentUser = {
    email: authUser.email,
    name: authUser.displayName,
    profilePicture: authUser.photoURL,
    status: authUser.status,
    unRead: 0,
    isGroup: false,
    location: authUser.location,
    messages: []
  }

  yield call(async() => await receiver.update({
    'chats': firebase.firestore.FieldValue.arrayUnion(currentUser)
  }))
}

export function* watchAddNewChatUser() {
  yield takeEvery(ADD_NEW_CHAT_USER, addNewChatUser);
}

function* chatSaga() {
  yield all([
    fork(watchAddNewChatUser)
  ])
}

export default chatSaga;