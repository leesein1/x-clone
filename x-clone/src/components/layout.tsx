import { Link, Outlet, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useState } from "react";
import ModalCoponent from "./modal-components";
import EditModal from "./edit.modal";
import EditModalProfileName from "./edit-modal-profilename";

const Wrapper = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 4fr 1fr;
    height: 100%;
    padding: 50px 0px;
    max-width:60%;
`;

const ContentBox = styled.div`
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    border-right: 1px solid #eee;
    width:100%;

    &#menu-right {
        border-left: 1px solid #eee;
        border-right: 0px;
        margin-left:30px;
    }
`;


const MenuSpan = styled.div`
    display:flex;
    margin-left: 10px;
    font-size: 1.5rem;
    font-weight: 700;
    text-decoration: none;
    align-items: center;
    justify-content: left;
`;


const MenuLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const HoverItem = styled.div`
    display: flex;
    padding: 10px 10px;
    border-radius: 50px;
    transition: background-color 0.2s ease-in-out, border-radius 0.2s ease-in-out;

    &:hover {
        background-color: #d4d4d4;
    }

    &#hover-logo {
        padding: 0px 5px;
    }
`;

const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start; /* 왼쪽 정렬 */
    border: 2px solid white;
    height: 5vh;
    width: 28vh;
    border-radius: 35px;

    svg {
        width: 3.7vh;
        fill: #000;
    }

    &:hover ${HoverItem} {
        background-color: #d4d4d4;
    }
`;



export default function Layout() {
    const navigate = useNavigate();
    
    // edit모달 작동을 위한 State
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        content: string;
        tweetId: string;
    }>({
        isOpen: false,
        content: "",
        tweetId: ""
    });

    // 확인 및 취소용 모달 State
    const [modalInfo, setModalInfo] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
    });

    // 프로필 네임 변경을 위한 모달 state
    const [modalProfileName, setModalProfileName] = useState<{
        isOpen: boolean;
        title: string;
        currentName: string;
        onConfirm?: (newName: string) => void;
    }>({
        isOpen: false,
        title: "프로필 이름 수정",
        currentName: "",
    });

    // 로그아웃 모달 fn
    const onLogOut = () => {
        setModalInfo({
            isOpen: true,
            title: "로그아웃",
            message: "정말 로그아웃 하시겠습니까?",
            onConfirm: async () => {
                await auth.signOut();
                navigate("/login");
            },
        });
    };
    
    // 확인용 모달 넘겨 주는 함수 
    const openModal = (options: { 
            title: string; 
            message: string; 
            onConfirm?: () => void | Promise<void>; 
        }) => {
            setModalInfo({
                isOpen: true,
                title: options.title,
                message: options.message,
                onConfirm: async () => {
                if (options.onConfirm) await options.onConfirm();
                setModalInfo(prev => ({ ...prev, isOpen: false }));
            },
        });
    };

    const openEditModal = (options:{
        isOpen: true;
        content: string;
        tweetId:"";
    }) => {
        setEditModal({
            isOpen: true,
            content: options.content,
            tweetId: options.tweetId
        })
    }

    const openModalProfileName = (options: {
        isOpen: true;
        title: string;
        currentName: string;
    }) => {
        setModalProfileName({
            isOpen: true,
            title: options.title,
            currentName: options.currentName,
        });
    };

    return (
        <Wrapper>
            <Menu>
                <MenuLink to="/">
                    <MenuItem>
                        <HoverItem id="hover-logo">
                            <svg id="logo-svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 24 24">
                                <path d="M 2.3671875 3 L 9.4628906 13.140625 L 2.7402344 21 L 5.3808594 21 L 10.644531 14.830078 L 14.960938 21 L 21.871094 21 L 14.449219 10.375 L 20.740234 3 L 18.140625 3 L 13.271484 8.6875 L 9.2988281 3 L 2.3671875 3 z M 6.2070312 5 L 8.2558594 5 L 18.033203 19 L 16.001953 19 L 6.2070312 5 z"></path>
                            </svg>
                        </HoverItem>
                    </MenuItem>
                </MenuLink>
                <MenuLink to="/">
                    <MenuItem>
                        <HoverItem>
                            <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            >
                            <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                            />
                            </svg>
                            <MenuSpan>홈</MenuSpan>
                        </HoverItem>
                    </MenuItem>
                </MenuLink>
                <MenuLink to="/profile">
                    <MenuItem>
                        <HoverItem>
                            <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            >
                            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                            </svg>
                            <MenuSpan>프로필</MenuSpan>
                        </HoverItem>
                    </MenuItem>
                </MenuLink>
                <MenuItem onClick={onLogOut} className="log-out">
                <HoverItem>
                    <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                    />
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                    />
                </svg>
                    <MenuSpan>로그아웃</MenuSpan>
                </HoverItem>

                </MenuItem>
            </Menu>

            <ContentBox>
                <Outlet context={{openModal, openEditModal, openModalProfileName}}/>
            </ContentBox>

            <Menu id="menu-right">
                <MenuItem>1번째 칸</MenuItem>
                <MenuItem>2번째 칸</MenuItem>
            </Menu>

            {/* 확인 / 취소 모달 */}
            {modalInfo.isOpen && (
                <ModalCoponent
                    title={modalInfo.title}
                    message={modalInfo.message}
                    onConfirm={modalInfo.onConfirm}
                    onClose={() =>
                        setModalInfo((prev) => ({ ...prev, isOpen: false }))
                    }
                />
            )}
            {/*editModal 현시*/}
            {editModal.isOpen && (
                <EditModal 
                    content={editModal.content}
                    tweetId={editModal.tweetId}     
                    onClose={() =>
                        setEditModal((prev) => ({ ...prev, isOpen: false }))
                    }
                />
                
            )}
            {/*프로필 네임 변경 모달*/}
            {modalProfileName.isOpen && (
            <EditModalProfileName
                title={modalProfileName.title}
                currentName={modalProfileName.currentName}
                onClose={() =>
                setModalProfileName((prev) => ({ ...prev, isOpen: false }))
                }
            />
            )}
        </Wrapper>
        
    );
}