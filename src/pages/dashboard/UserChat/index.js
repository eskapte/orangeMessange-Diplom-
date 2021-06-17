import React, { useState,useEffect, useRef } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter } from "reactstrap";
import {connect, useSelector} from "react-redux";

import SimpleBar from "simplebar-react";

import { withRouter } from 'react-router-dom';

//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput";
import FileList from "./FileList";

//actions
import { openUserSidebar,setFullUser } from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';
import firebase from "firebase";
import {getFirebaseBackend} from "../../../helpers/firebase";

function UserChat(props) {

    const ref = useRef();

    const [modal, setModal] = useState(false);

    const db = firebase.firestore();
    const authUser = getFirebaseBackend().getAuthenticatedUser();

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    //demo conversation messages
    //userType must be required
    const [ allUsers ] = useState(props.recentChatList);
    const [chatMessages, setchatMessages] = useState(props.recentChatList[props.active_user].messages);

    useEffect(() => {
        try {
            setchatMessages(props.recentChatList[props.active_user].messages);
            ref.current.recalculate();
            if (ref.current.el) {
                ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
            }
        }
        catch (e)
        {
            return null
        }
    },[props.active_user, props.recentChatList]);

    const toggle = () => setModal(!modal);

    const loadMessageToFirestore = async(message) => {

        const receiver = props.recentChatList[props.active_user];

        const authUserDoc = db.collection('users').doc(authUser.email)
        const receiverDoc = db.collection('users').doc(receiver.email)

        const authData = await authUserDoc.get()
        const authChats = authData.data().chats
        const currentChatIndex = authChats.findIndex(chat => chat.email === receiver.email)

        const receiverData = await receiverDoc.get()
        const receiverChats = receiverData.data().chats
        const receiverChatIndex = receiverChats.findIndex(chat => chat.email === authUser.email)

        authChats[currentChatIndex].messages.push(message);
        authChats[currentChatIndex].unRead = 0;
        receiverChats[receiverChatIndex].messages.push({...message, userType: 'receiver'})
        receiverChats[receiverChatIndex].unRead++;

        await authUserDoc.update({
            'chats': authChats
        })
        await receiverDoc.update({
            'chats': receiverChats
        })
    }

    const addMessage = async(message, type) => {
        var messageObj = null;

        let d = new Date();
        let h = d.getHours()
        if (h < 10) h = "0" + h;

        let m = d.getMinutes()
        if (m < 10) m = "0" + m;

        const storageRef = firebase.storage().ref()

        //matches the message type is text, file or image, and create object according to it
        switch (type) {
            case "textMessage":
                messageObj = {
                    message : message,
                    time : h + ":" + m,
                    userType : "sender",
                    isFileMessage : false,
                    isImageMessage : false
                }
                break;

            case "fileMessage":
                const fileRef = storageRef.child('messages/' + message.name)
                await fileRef.put(message.file)
                const fileURL = await fileRef.getDownloadURL()

                messageObj = {
                    message : message.name,
                    fileMessage : message.name,
                    fileURL: fileURL,
                    size : (+message.size * 0.0009765625 * 0.0009765625).toFixed(2),
                    time : h + ":" + m,
                    userType : "sender",
                    isFileMessage : true,
                    isImageMessage : false
                }
                break;

            case "imageMessage":

                const imageRef = storageRef.child('messages/' + message.name)
                await imageRef.put(message)
                const imageURL = await imageRef.getDownloadURL()

                let imageMessage = [
                    {image: imageURL}
                ]

                messageObj = {
                    message : message.name,
                    imageMessage : imageMessage,
                    size : message.size,
                    time : h + ":" + m,
                    userType : "sender",
                    isImageMessage : true,
                    isFileMessage : false
                }
                break;
        
            default:
                break;
        }
     
        //add message object to chat        
        setchatMessages([...chatMessages, messageObj]);

        await loadMessageToFirestore(messageObj);

        let copyallUsers = [...allUsers];
        copyallUsers[props.active_user].messages = [...chatMessages, messageObj];
        copyallUsers[props.active_user].isTyping = false;
        props.setFullUser(copyallUsers);

        scrolltoBottom();
    }

    function scrolltoBottom(){
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }


    const deleteMessage = (id) => {
        let conversation = chatMessages;

        var filtered = conversation.filter(function (item) {
            return item.id !== id;
        });

        setchatMessages(filtered);
    }

    const profile = useSelector(state => state.Auth.user)
    
    return (
        <React.Fragment>
            <div className="user-chat w-100 user-chat-show">
                    <div className="d-lg-flex">

                        <div className={props.userSidebar ? "w-70" : "w-100"}>

                            {/* render user head */}
                            <UserHead/>

                            <SimpleBar
                              style={{maxHeight: "100%"}}
                              ref={ref}
                              className="chat-conversation p-3 p-lg-4"
                              id="messages">
                                <ul className="list-unstyled mb-0">

                                    {
                                        chatMessages.map((chat, key) =>
                                          chat.isToday && chat.isToday === true ? <li key={"dayTitle" + key}>
                                                <div className="chat-day-title">
                                                    <span className="title">Сегодня</span>
                                                </div>
                                            </li> :
                                            (props.recentChatList[props.active_user].isGroup === true) ?
                                              <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                  <div className="conversation-list">

                                                      <div className="chat-avatar">
                                                          {chat.userType === "sender" ?
                                                            <img src={avatar1} alt="chatvia"/> :
                                                            props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                              <div className="chat-user-img align-self-center me-3">
                                                                  <div className="avatar-xs">
                                                                        <span
                                                                          className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                            {chat.userName && chat.userName.charAt(0)}
                                                                        </span>
                                                                  </div>
                                                              </div>
                                                              : <img
                                                                src={props.recentChatList[props.active_user].profilePicture}
                                                                alt="chatvia"/>
                                                          }
                                                      </div>

                                                      <div className="user-chat-content">
                                                          <div className="ctext-wrap">
                                                              <div className="ctext-wrap-content">
                                                                  {
                                                                      chat.message &&
                                                                      <p className="mb-0">
                                                                          {chat.message}
                                                                      </p>
                                                                  }
                                                                  {
                                                                      chat.imageMessage &&
                                                                      // image list component
                                                                      <ImageList images={chat.imageMessage}/>
                                                                  }
                                                                  {
                                                                      chat.fileMessage &&
                                                                      //file input component
                                                                      <FileList fileName={chat.fileMessage}
                                                                                fileSize={chat.size}
                                                                                fileURL={chat.fileURL}
                                                                      />
                                                                  }
                                                                  {
                                                                      chat.isTyping &&
                                                                      <p className="mb-0">
                                                                          Печатает
                                                                          <span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                      </p>
                                                                  }
                                                                  {
                                                                      !chat.isTyping && <p className="chat-time mb-0"><i
                                                                        className="ri-time-line align-middle"></i> <span
                                                                        className="align-middle">{chat.time}</span></p>
                                                                  }
                                                              </div>
                                                              {
                                                                  !chat.isTyping &&
                                                                  <UncontrolledDropdown className="align-self-start">
                                                                      <DropdownToggle tag="a">
                                                                          <i className="ri-more-2-fill"></i>
                                                                      </DropdownToggle>
                                                                      <DropdownMenu>
                                                                          {/*<DropdownItem>{t('Copy')} <i*/}
                                                                          {/*  className="ri-file-copy-line float-end text-muted"></i></DropdownItem>*/}
                                                                          {/*<DropdownItem>{t('Save')} <i*/}
                                                                          {/*  className="ri-save-line float-end text-muted"></i></DropdownItem>*/}
                                                                          {/*<DropdownItem onClick={toggle}>Forward <i*/}
                                                                          {/*  className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>*/}
                                                                          <DropdownItem
                                                                            onClick={() => deleteMessage(chat.id)}>Delete <i
                                                                            className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                      </DropdownMenu>
                                                                  </UncontrolledDropdown>
                                                              }

                                                          </div>
                                                          {
                                                              <div
                                                                className="conversation-name">{chat.userType === "sender" ? profile.displayName : chat.userName}</div>
                                                          }
                                                      </div>
                                                  </div>
                                              </li>
                                              :
                                              <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                  <div className="conversation-list">
                                                      {
                                                          //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                                          chatMessages[key + 1] ? chatMessages[key].userType === chatMessages[key + 1].userType ?

                                                            <div className="chat-avatar">
                                                                <div className="blank-div"></div>
                                                            </div>
                                                            :
                                                            <div className="chat-avatar">
                                                                {chat.userType === "sender" ?
                                                                  profile.photoURL ?
                                                                  <img src={profile.photoURL} alt="chatvia"/> :
                                                                    <div className="avatar-xs">
                                                                        <span
                                                                          className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                            {profile.displayName.charAt(0)}
                                                                        </span>
                                                                    </div> :
                                                                  props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                    <div
                                                                      className="chat-user-img align-self-center me-3">
                                                                        <div className="avatar-xs">
                                                                                                <span
                                                                                                  className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                                </span>
                                                                        </div>
                                                                    </div>
                                                                    : <img
                                                                      src={props.recentChatList[props.active_user].profilePicture}
                                                                      alt="chatvia"/>
                                                                }
                                                            </div>
                                                            : <div className="chat-avatar">
                                                                {chat.userType === "sender" ?
                                                                  profile.photoURL ?
                                                                  <img src={profile.photoURL} alt="chatvia"/> :
                                                                    <div className="avatar-xs">
                                                                                                <span
                                                                                                  className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {profile.displayName.charAt(0)}
                                                                                                </span>
                                                                    </div>
                                                                  :
                                                                  props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                    <div className="chat-user-img align-self-center me-3">
                                                                        <div className="avatar-xs">
                                                                                                <span
                                                                                                  className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                                </span>
                                                                        </div>
                                                                    </div>
                                                                    : <img
                                                                      src={props.recentChatList[props.active_user].profilePicture}
                                                                      alt="chatvia"/>
                                                                }
                                                            </div>
                                                      }


                                                      <div className="user-chat-content">
                                                          <div className="ctext-wrap">
                                                              <div className="ctext-wrap-content">
                                                                  {
                                                                      chat.message &&
                                                                      <p className="mb-0">
                                                                          {chat.message}
                                                                      </p>
                                                                  }
                                                                  {
                                                                      chat.imageMessage &&
                                                                      // image list component
                                                                      <ImageList images={chat.imageMessage}/>
                                                                  }
                                                                  {
                                                                      chat.fileMessage &&
                                                                      //file input component
                                                                      <FileList fileName={chat.fileMessage}
                                                                                fileSize={chat.size}
                                                                                fileURL={chat.fileURL}
                                                                      />
                                                                  }
                                                                  {
                                                                      chat.isTyping &&
                                                                      <p className="mb-0">
                                                                          Печатает
                                                                          <span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                      </p>
                                                                  }
                                                                  {
                                                                      !chat.isTyping && <p className="chat-time mb-0"><i
                                                                        className="ri-time-line align-middle"></i> <span
                                                                        className="align-middle">{chat.time}</span></p>
                                                                  }
                                                              </div>
                                                              {
                                                                  !chat.isTyping &&
                                                                  <UncontrolledDropdown className="align-self-start">
                                                                      <DropdownToggle tag="a">
                                                                          <i className="ri-more-2-fill"></i>
                                                                      </DropdownToggle>
                                                                      <DropdownMenu>
                                                                          {/*<DropdownItem>{t('Copy')} <i*/}
                                                                          {/*  className="ri-file-copy-line float-end text-muted"></i></DropdownItem>*/}
                                                                          {/*<DropdownItem>{t('Save')} <i*/}
                                                                          {/*  className="ri-save-line float-end text-muted"></i></DropdownItem>*/}
                                                                          {/*<DropdownItem onClick={toggle}>Forward <i*/}
                                                                          {/*  className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>*/}
                                                                          <DropdownItem
                                                                            onClick={() => deleteMessage(chat.id)}>Удалить <i
                                                                            className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                      </DropdownMenu>
                                                                  </UncontrolledDropdown>
                                                              }

                                                          </div>
                                                          {
                                                              chatMessages[key + 1] ? chatMessages[key].userType === chatMessages[key + 1].userType ? null :
                                                                <div
                                                                  className="conversation-name">{chat.userType === "sender" ? profile.displayName : props.recentChatList[props.active_user].name}</div> :
                                                                <div
                                                                  className="conversation-name">{chat.userType === "sender" ? profile.displayName : props.recentChatList[props.active_user].name}</div>
                                                          }
                                                            {/*<div className="conversation-name">{chat.userType === "sender" ? "Admin" : props.recentChatList[props.active_user].name}</div>*/}

                                                      </div>
                                                  </div>
                                              </li>
                                        )
                                    }
                                </ul>
                            </SimpleBar>

                            <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
                                <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
                                <ModalBody>
                                    <CardBody className="p-2">
                                        <SimpleBar style={{maxHeight: "200px"}}>
                                            <SelectContact handleCheck={() => {
                                            }}/>
                                        </SimpleBar>
                                        <ModalFooter className="border-0">
                                            <Button color="primary">Forward</Button>
                                        </ModalFooter>
                                    </CardBody>
                                </ModalBody>
                            </Modal>

                            <ChatInput onaddMessage={addMessage}/>
                        </div>

                        <UserProfileSidebar activeUser={props.recentChatList[props.active_user]}/>

                    </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    const { userSidebar } = state.Layout;
    return { active_user,userSidebar };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar,setFullUser })(UserChat));

