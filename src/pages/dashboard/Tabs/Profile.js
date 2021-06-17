import React, {useEffect, useState} from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Card } from "reactstrap";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";
import AttachedFiles from "../../../components/AttachedFiles";

//Import Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';
import {addLoggedinUser} from "../../../redux/chat/actions";
import {useDispatch, useSelector} from "react-redux";
import firebase from "firebase";
import {getFirebaseBackend} from "../../../helpers/firebase";
import {getProfile} from "../../../redux/auth/actions";

function Profile(props) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [files] = useState([]);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
    };

    const toggle = () => setDropdownOpen(!dropdownOpen);

    const profile = useSelector(state => state.Auth.user)

    return (
        <React.Fragment>
            <div>
                            <div className="px-4 pt-4">
                                <div className="user-chat-nav float-end">
                                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                        <DropdownToggle tag="a" className="font-size-18 text-muted dropdown-toggle">
                                            <i className="ri-more-2-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>Редактировать</DropdownItem>
                                            {/*<DropdownItem>{t('Action')}</DropdownItem>*/}
                                            {/*<DropdownItem divider />*/}
                                            {/*<DropdownItem>{t('Another action')}</DropdownItem>*/}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <h4 className="mb-0">Мой профиль</h4>
                            </div>

                            <div className="text-center p-4 border-bottom">
                                <div className="mb-4">
                                    {
                                        profile.photoURL ? <img src={profile.photoURL} className="rounded-circle avatar-lg" alt="chatvia" />
                                          :
                                          <div className="avatar-md rounded-circle img-thumbnail" style={{marginLeft: '39%'}}>
                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary" style={{fontSize: '150%'}}>
                                                    {profile.displayName.charAt(0)}
                                                </span>
                                          </div>
                                    }

                                </div>

                                <h5 className="font-size-16 mb-1 text-truncate">{profile.displayName}</h5>
                                <p className="text-muted text-truncate mb-1"><i className="ri-record-circle-fill font-size-10 text-success me-1 d-inline-block"></i>Онлайн</p>
                            </div>
                           {/* End profile user  */}

                             {/* Start user-profile-desc */}
                            <div className="p-4 user-profile-desc">
                                {/*<div className="text-muted">*/}
                                {/*    <p className="mb-4">{t('If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.')}</p>*/}
                                {/*</div>*/}


                                <div id="profile-user-accordion-1" className="custom-accordion">
                                    <Card className="shadow-none border mb-2">
                                        {/* import collaps */}
                                        <CustomCollapse
                                            title = "Обо мне"
                                            iconClass = "ri-user-2-line"
                                            isOpen={isOpen1}
                                            toggleCollapse={toggleCollapse1}
                                        >
                                                <div>
                                                    <p className="text-muted mb-1">Имя</p>
                                                    <h5 className="font-size-14">{profile.displayName}</h5>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-muted mb-1">Email</p>
                                                    <h5 className="font-size-14">{profile.email}</h5>
                                                </div>

                                                {/*<div className="mt-4">*/}
                                                {/*    <p className="text-muted mb-1">{t('Time')}</p>*/}
                                                {/*    <h5 className="font-size-14">{t('11:40 AM')}</h5>*/}
                                                {/*</div>*/}

                                                <div className="mt-4">
                                                    <p className="text-muted mb-1">Расположение</p>
                                                    <h5 className="font-size-14 mb-0">{profile.location}</h5>
                                                </div>
                                        </CustomCollapse>
                                    </Card>
                                   {/* End About card  */}

                                    <Card className="mb-1 shadow-none border">
                                        {/* import collaps */}
                                        <CustomCollapse
                                            title = "Загруженные файлы"
                                            iconClass = "ri-attachment-line"
                                            isOpen={isOpen2}
                                            toggleCollapse={toggleCollapse2}
                                        >
                                            {/* attached files */}
                                            <AttachedFiles files={files} />
                                        </CustomCollapse>
                                    </Card>
                                   {/* End Attached Files card  */}
                                </div>
                                {/* end profile-user-accordion  */}

                            </div>
                            {/* end user-profile-desc  */}
                        </div>
        </React.Fragment>
    );
}

export default Profile;