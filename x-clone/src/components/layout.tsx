import { Link, Outlet, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useState } from "react";
import Modal from "react-modal";
import ModalCoponent from "./modal-components";
import EditModal from "./edit.modal";

const Wrapper = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 4fr;
    height: 100%;
    padding: 50px 0px;
    width: 100%;
    max-width: 860px;
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    svg {
        width: 30px;
        fill: white;
    }
    &.log-out {
        border-color: tomato;
        svg {
        fill: tomato;
        }
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

    return (
        <Wrapper>
        <Menu>
            <Link to="/">
                <MenuItem>
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
                </MenuItem>
            </Link>
            <Link to="/profile">
                <MenuItem>
                    <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    >
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                </MenuItem>
            </Link>
            <MenuItem onClick={onLogOut} className="log-out">
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
            </MenuItem>
        </Menu>
        <Outlet context={{openModal, openEditModal}}/>
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
        </Wrapper>
    );
}