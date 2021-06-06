// @flow
import {
	SET_ACTIVE_TAB,
	OPEN_USER_PROFILE_SIDEBAR,
	CLOSE_USER_PROFILE_SIDEBAR,
	SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	CHANGE_THEME
} from "./constants";

const INIT_STATE = {
	activeTab : "chat",
	userSidebar : false,
	conversationName : "Doris Brown",
	darkTheme: window.localStorage.getItem('darkTheme') ?? false
};

const Layout = (state = INIT_STATE, action) => {
	switch (action.type) {
		case SET_ACTIVE_TAB:
			return {
				...state,
				activeTab: action.payload
			};

		case OPEN_USER_PROFILE_SIDEBAR:
			return {
				...state,
				userSidebar: true
			};

		case CLOSE_USER_PROFILE_SIDEBAR:
			return {
				...state,
				userSidebar: false
			};

		case SET_CONVERSATION_NAME_IN_OPEN_CHAT:
			return {
				...state,
				conversationName: action.payload
			};
		case CHANGE_THEME:
			return {
				...state,
				darkTheme: !state.darkTheme
			}
		default:
			return state;
	}
};

export default Layout;
