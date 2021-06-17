import React, { useState } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Link } from "react-router-dom";


//i18n
import { useTranslation } from 'react-i18next';

//lightbox
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function ImageList(props) {
    const [isOpen, setisOpen] = useState(false);
    const [currentImage, setcurrentImage] = useState(null);
    const [images] = useState(props.images);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const toggleLightbox = (currentImage) => {
        setisOpen(!isOpen);
        setcurrentImage(currentImage);
    }

    const createBlob = (image) => {
        const blob = new Blob(
          [image.image],
          {type: 'image/*'}
        )
        return URL.createObjectURL(blob)
    }

    const getImageNameFromURl = (url) => {
        const urlWithOutParams = url.split('messages%2F')[1]
        return urlWithOutParams.split('?')[0]
    }

    const downloadImage = (e, imgMsg) => {

        e.preventDefault()

        let xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        let blob = null;
        xhr.onload = event => {
            try {
                blob = xhr.response
                let a = document.createElement('a')
                let url = window.URL.createObjectURL(blob)
                a.href = url
                a.download = getImageNameFromURl(imgMsg.image) ?? "Image.jpg"
                a.click()
                window.URL.revokeObjectURL(url)
            }
            catch (e)
            {
                console.log(e)
            }
        }
        xhr.open("GET", 'https://api.allorigins.win/get?url=' + imgMsg.image.trim())
        xhr.send()
    }

    return (
        <React.Fragment>
            <ul className="list-inline message-img  mb-0">
                {/* image list */}
                {
                    images.map((imgMsg, key) =>
                    <li key={key} className="list-inline-item message-img-list">
                                                            <div>
                                                                <Link to="#" onClick={() => toggleLightbox(imgMsg.image)} className="popup-img d-inline-block m-1" title="Project 1">
                                                                    <img src={imgMsg.image} alt="chat" className="rounded border" />
                                                                </Link>
                                                            </div>
                                                            <div className="message-img-link">
                                                                <ul className="list-inline mb-0">
                                                                    <li className="list-inline-item">
                                                                        <Link to={imgMsg.image} download onClick={(e) => downloadImage(e, imgMsg)}>
                                                                            <i className="ri-download-2-line">

                                                                            </i>
                                                                        </Link>
                                                                    </li>
                                                                    <UncontrolledDropdown tag="li" className="list-inline-item">
                                                                    {/*<DropdownToggle tag="a">*/}
                                                                    {/*    <i className="ri-more-fill"></i>*/}
                                                                    {/*</DropdownToggle>*/}
                                                                    <DropdownMenu>
                                                                        {/*<DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-end text-muted"></i></DropdownItem>*/}
                                                                        {/*<DropdownItem>{t('Save')} <i className="ri-save-line float-end text-muted"></i></DropdownItem>*/}
                                                                        {/*<DropdownItem>{t('Forward')} <i className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>*/}
                                                                        <DropdownItem>Удалить <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                    </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                                </ul>
                                                            </div>
                                                        </li>
                    )
                }

                                                                {isOpen && (
                                                                    <Lightbox
                                                                        mainSrc={currentImage}
                                                                        onCloseRequest={toggleLightbox}
                                                                        imageTitle='Изображение'
                                                                    />
                                                                )}
                                                        
            </ul>
        </React.Fragment>
    );
}

export default ImageList;