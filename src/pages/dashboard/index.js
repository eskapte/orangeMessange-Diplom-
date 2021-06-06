import React, {Component, useEffect, useState} from 'react';

import "../../assets/scss/themes.scss";
import "../../assets/css/mycss/rewrite.css";

//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import firebase from "firebase";
import {getFirebaseBackend} from "../../helpers/firebase";

import {connect, useDispatch, useSelector} from "react-redux";
import {activeUser, addContact, addLoggedinUser, createGroup, reloadUsers} from "../../redux/chat/actions";
import {dark} from "@material-ui/core/styles/createPalette";


// class Index extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {}
//         this.db = firebase.database()
//         this.dispatch = useDispatch()
//     }
//
//     async componentDidMount() {
//         try {
//             this.db.ref("chats/users").on("value", value => {
//                 value.forEach(user => {
//                     users.push(user.val())
//                 })
//                 console.log(this.state)
//             })
//         }
//         catch (error) {
//             console.log(error)
//         }
//     }
//
//     render() {
//
//         return (
//             <React.Fragment>
//                 {/* chat left sidebar */}
//                 <ChatLeftSidebar recentChatList={this.props.users} />
//
//                 {/* user chat */}
//                 <UserChat recentChatList={this.props.users} />
//
//             </React.Fragment>
//         );
//     }
// }

const Index = (props) => {

    document.title = "Orange | Мессенджер";
    const dispatch = useDispatch()
    const db = firebase.firestore()
    const authUser = getFirebaseBackend().getAuthenticatedUser()

    const users = useSelector(state => state.Chat.users)
    const userDoc = db.collection('users').doc(authUser['email'])
    const activeUser = useSelector(state => state.Chat.active_user)
    const displayChat = useSelector(state => state.Chat.displayChat)


    useEffect(() => {
        userDoc.onSnapshot(async(snapshot) => {

            const chats = snapshot.data().chats

            if (chats) {
                const newChats = chats.map(chat => {
                    return {...chat, profilePicture: chat.profilePicture ? chat.profilePicture : "Null"}
                })

                dispatch(reloadUsers(newChats))

                const userChat = document.getElementsByClassName('user-chat')
                if (userChat[0])
                    userChat[0].scrollTop = userChat[0].scrollHeight + 100;
            }
        })
    }, [])

    // useEffect(async () => {
    //     const response = db.collection('users').doc(authUser['email'])
    //     const data = await response.get()
    //     const chats = data.data().chats
    //     chats.forEach(chat => {
    //         dispatch(addLoggedinUser({...chat, profilePicture: chat.profilePicture ? chat.profilePicture : "Null"}))
    //     })
    //
    // }, [])

    useEffect(async() => {
        const db = firebase.firestore();
        const usersRef = db.collection('users');
        const users = await usersRef.where('profile.displayName', '!=', '').get();

        if (users.empty) return ;

        users.forEach(user => {
            if (user.id !== authUser.email) {
                const newUser = user.data();
                dispatch(createGroup({
                    email: user.id,
                    ...newUser.profile
                }))
            }
        })
    }, [])

    return (
      <React.Fragment>
          {/* chat left sidebar */}
          <ChatLeftSidebar recentChatList={users} />
          {/* user chat */}
          {/*<UserChat recentChatList={users} />*/}
          {
              displayChat ? <UserChat recentChatList={users}/> : <div></div>
          }

      </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { users } = state.Chat;
    return { users };
};

export default connect(mapStateToProps, {  })(Index);