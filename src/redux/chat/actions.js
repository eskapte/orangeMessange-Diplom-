import {
    CHAT_USER,
    ACTIVE_USER,
    FULL_USER,
    ADD_LOGGED_USER,
    CREATE_GROUP,
    SHOW_CHAT,
    HIDE_CHAT,
    ADD_CONTACT, ADD_NEW_CHAT_USER, RELOAD_USERS,
} from './constants';


export const chatUser = () => ({
    type: CHAT_USER
});

export const activeUser = (userId) => ({
    type: ACTIVE_USER,
    payload : userId
});

export const setFullUser = (fullUser) => ({
    type: FULL_USER,
    payload : fullUser
});

export const addLoggedinUser = (userData) => ({
    type: ADD_LOGGED_USER,
    payload : userData
});

export const createGroup = (groupData) => ({
    type : CREATE_GROUP,
    payload : groupData
})

export const addContact = (contact) => ({
    type: ADD_CONTACT,
    payload: contact
})

export const showChat = () => ({
    type: SHOW_CHAT
})

export const hideChat = () => ({
    type: HIDE_CHAT
})

export const addNewChatUser = (userData) => ({
    type: ADD_NEW_CHAT_USER,
    payload : userData
});

export const reloadUsers = (users) => ({
    type: RELOAD_USERS,
    payload: users
})