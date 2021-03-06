import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Card, Button, UncontrolledDropdown, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";

import SimpleBar from "simplebar-react";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

//Import Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import MyInput from "../../../components/MyInput";
import firebase from "firebase";
import {getFirebaseBackend} from "../../../helpers/firebase";
import {setLoggedInUser} from "../../../helpers/authUtils";
import {refreshProfile, refreshtProfile} from "../../../redux/auth/actions";

function Settings(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);

    const profile = useSelector(state => state.Auth.user)

    const [name, setName] = useState(profile.displayName)
    const [email, setEmail] = useState(profile.email)
    const [location, setLocation] = useState(profile.location)

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const toggleCollapse3 = () => {
        setIsOpen3(!isOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen4(false);
    };

    const toggleCollapse4 = () => {
        setIsOpen4(!isOpen4);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen2(false);
    };

    const toggle = () => setDropdownOpen(!dropdownOpen);

    const dispatch = useDispatch()
    const db = firebase.firestore()
    const authUser = getFirebaseBackend().getAuthenticatedUser()

    const editProfile = async(e) => {

        e.preventDefault()

        const response = db.collection('users').doc(authUser.email)

        if (profile.email !== email && email.trim() !== "")
        {
            firebase.auth().currentUser.updateEmail(email).then( () => {
                console.log("email ????????????????")
                response.update({
                    'profile.email': email
                })
                authUser.email = email

            }).catch((err) => {
                console.error(err)
                setEmail(profile.email)
            })
        }
        else
            setEmail(profile.email)

        if (profile.name !== name && name.trim() !== "")
        {
            if (profile.name !== "????????????") {
                response.update({
                    'profile.displayName': name
                }).then(() => {
                    console.log("?????? ??????????????????")
                }).catch((e) => {
                    console.error(e)
                    setName(profile.name)
                })
            }
        }
        else
            setName(profile.name)

        if (profile.location !== location && location.trim() !== "")
        {
            await response.update({
                'profile.location': location
            })
        }
        else
            setLocation(profile.location)

        const newUserData = {...authUser, displayName: name, location: location}
        dispatch(refreshProfile(newUserData))
        localStorage.setItem('authUser', JSON.stringify(newUserData));

    }

    const uploadAvatar = async(e) => {

        let input = document.createElement('input')
        input.type='file'
        input.accept='image/*'
        let avatar = null;

        input.onchange = async(evt) => {
            if (evt.target.files.length !== 0)
            {
                avatar = evt.target.files[0]
                if (['image/jpeg', 'image/jpg', 'image/png'].includes(avatar.type))
                {
                    const storageRef = firebase.storage().ref()
                    const avatarRef = storageRef.child('avatars/' + avatar.name)
                    await avatarRef.put(avatar)
                    const avatarURL = await avatarRef.getDownloadURL()

                    const db = firebase.firestore();
                    const authUser = getFirebaseBackend().getAuthenticatedUser();

                    const authUserDoc = db.collection('users').doc(authUser.email)
                    await authUserDoc.update({
                        'profile.photoURL': avatarURL
                    })

                    const newUserData = {...authUser, photoURL: avatarURL}
                    dispatch(refreshProfile(newUserData))
                    localStorage.setItem('authUser', JSON.stringify(newUserData));
                }
            }
        }
        input.click()
    }

    return (
        <React.Fragment>
            <div>
                <div className="px-4 pt-4">
                    <h4 className="mb-0">??????????????????</h4>
                </div>

                <div className="text-center border-bottom p-4">
                    <div className="mb-4 profile-user">
                        {
                            profile.photoURL ?
                              <img src={profile.photoURL} className="rounded-circle avatar-lg"
                                   alt="chatvia"/>
                              :
                              <div className="avatar-md rounded-circle img-thumbnail">
                                <span className="avatar-title rounded-circle bg-soft-primary text-primary"
                                      style={{fontSize: '150%'}}>
                                    {profile.displayName.charAt(0)}
                                </span>
                              </div>
                        }
                            <Button type="button" color="light" className="avatar-xs p-0 rounded-circle profile-photo-edit" onClick={(e) => uploadAvatar(e)}>
                                <i className="ri-pencil-fill"></i>
                            </Button>
                    </div>

                    <h5 className="font-size-16 mb-1 text-truncate">{profile.displayName}</h5>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="d-inline-block mb-1">
                        <DropdownToggle tag="a" className="text-muted pb-1 d-block" >
                            {profile.status} <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>

                        <DropdownMenu>
                            <DropdownItem>????????????</DropdownItem>
                            <DropdownItem>??????????</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                {/* End profile user */}

                {/* Start User profile description */}
                <SimpleBar style={{ maxHeight: "100%" }} className="p-4 user-profile-desc">

                    <div id="profile-setting-accordion" className="custom-accordion">
                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="???????????????????????? ????????????????????"
                                isOpen={isOpen1}
                                toggleCollapse={toggleCollapse1}
                            >

                                <div className="float-end">
                                    <Button color="light" size="sm" type="button" onClick={(e) => editProfile(e)}><i className="ri-edit-fill me-1 align-middle"></i>??????.</Button>
                                </div>

                                <div>
                                    <p className="text-muted mb-1">??????</p>
                                    {/*<h5 className="font-size-14" contentEditable={true} onChange={(e) => console.log(e.target)}>{name}</h5>*/}
                                    <MyInput value={name} onChange={(e) => setName(e.target.value)}/>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">Email</p>
                                    {/*<h5 className="font-size-14">{email}</h5>*/}
                                    <MyInput value={email} onChange={(e) => setEmail(e.target.value)} disabled/>
                                </div>

                                {/*<div className="mt-4">*/}
                                {/*    <p className="text-muted mb-1">{t('Time')}</p>*/}
                                {/*    <h5 className="font-size-14">{t('11:40 AM')}</h5>*/}
                                {/*</div>*/}

                                <div className="mt-4">
                                    <p className="text-muted mb-1">????????????????????????</p>
                                    {/*<h5 className="font-size-14 mb-0">{location}</h5>*/}
                                    <MyInput value={location} onChange={(e) => setLocation(e.target.value)}/>
                                </div>
                            </CustomCollapse>
                        </Card>
                        {/* end profile card */}

                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="??????????????????????"
                                isOpen={isOpen2}
                                toggleCollapse={toggleCollapse2}
                            >

                                <div className="py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">???????? ??????????????</h5>
                                        </div>
                                        <UncontrolledDropdown className="ms-2">
                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                ?????????????? <i className="mdi mdi-chevron-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem>??????????????</DropdownItem>
                                                <DropdownItem>??????????????????</DropdownItem>
                                                <DropdownItem>????????????</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">?????????????????? ?????? ????????????</h5>

                                        </div>
                                        <div className="ms-2">
                                            <div className="form-check form-switch">
                                                <Input type="checkbox" className="form-check-input" id="privacy-lastseenSwitch" defaultChecked />
                                                <Label className="form-check-label" htmlFor="privacy-lastseenSwitch"></Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">????????????</h5>

                                        </div>
                                        <UncontrolledDropdown className="ms-2">
                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                ?????????????? <i className="mdi mdi-chevron-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem>??????????????</DropdownItem>
                                                <DropdownItem>??????????????????</DropdownItem>
                                                <DropdownItem>????????????</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>

                                {/*<div className="py-3 border-top">*/}
                                {/*    <div className="d-flex align-items-center">*/}
                                {/*        <div className="flex-1 overflow-hidden">*/}
                                {/*            <h5 className="font-size-13 mb-0 text-truncate">{t('Read receipts')}</h5>*/}

                                {/*        </div>*/}
                                {/*        <div className="ms-2">*/}
                                {/*            <div className="form-check form-switch">*/}
                                {/*                <Input type="checkbox" className="form-check-input" id="privacy-readreceiptSwitch" defaultChecked />*/}
                                {/*                <Label className="form-check-label" htmlFor="privacy-readreceiptSwitch"></Label>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/*<div className="py-3 border-top">*/}
                                {/*    <div className="d-flex align-items-center">*/}
                                {/*        <div className="flex-1 overflow-hidden">*/}
                                {/*            <h5 className="font-size-13 mb-0 text-truncate">{t('Groups')}</h5>*/}

                                {/*        </div>*/}
                                {/*        <UncontrolledDropdown className="ms-2">*/}
                                {/*            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">*/}
                                {/*                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>*/}
                                {/*            </DropdownToggle>*/}
                                {/*            <DropdownMenu right>*/}
                                {/*                <DropdownItem>{t('Everyone')}</DropdownItem>*/}
                                {/*                <DropdownItem>{t('selected')}</DropdownItem>*/}
                                {/*                <DropdownItem>{t('Nobody')}</DropdownItem>*/}
                                {/*            </DropdownMenu>*/}
                                {/*        </UncontrolledDropdown>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </CustomCollapse>
                        </Card>
                        {/* end Privacy card */}

                        {/*<Card className="accordion-item border mb-2">*/}
                        {/*    <CustomCollapse*/}
                        {/*        title="????????????????????????"*/}
                        {/*        isOpen={isOpen3}*/}
                        {/*        toggleCollapse={toggleCollapse3}*/}
                        {/*    >*/}

                        {/*        <div>*/}
                        {/*            <div className="d-flex align-items-center">*/}
                        {/*                <div className="flex-1 overflow-hidden">*/}
                        {/*                    <h5 className="font-size-13 mb-0 text-truncate">{t('Show security notification')}</h5>*/}

                        {/*                </div>*/}
                        {/*                <div className="ms-2 me-0">*/}
                        {/*                    <div className="form-check form-switch">*/}
                        {/*                        <Input type="checkbox" className="form-check-input" id="security-notificationswitch" />*/}
                        {/*                        <Label className="form-check-label" htmlFor="security-notificationswitch"></Label>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </CustomCollapse>*/}
                        {/*</Card>*/}
                        {/* end Security card */}

                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="????????????"
                                isOpen={isOpen4}
                                toggleCollapse={toggleCollapse4}
                            >

                                <div>
                                    <div className="py-3">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('FAQs')}</Link></h5>
                                    </div>
                                    <div className="py-3 border-top">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">????????????????</Link></h5>
                                    </div>
                                    <div className="py-3 border-top">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">GitHub</Link></h5>
                                    </div>
                                </div>
                            </CustomCollapse>
                        </Card>
                        {/* end Help card */}
                    </div>
                    {/* end profile-setting-accordion */}
                </SimpleBar>
                {/* End User profile description */}
            </div>
        </React.Fragment>
    );
}

export default Settings;