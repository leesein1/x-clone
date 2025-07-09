import { Outlet, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useState } from "react";
import ModalCoponent from "./modal-components";
import EditModal from "./edit.modal";
import EditModalProfileName from "./edit-modal-profilename";
import LeftNav from "./left-nav";
import RightNav from "./right-nav";
import EditModalHandle from "./edit-modal-handle";

const Wrapper = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 4fr 2fr;
    height: 100vh;
    padding: 10px 0px;
    max-width: 65%;
    overflow: hidden;
`;

const ContentBox = styled.div`
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    border-right: 1px solid #eee;
    border-left: 1px solid #eee;
`;

export default function Layout() {
    const navigate = useNavigate();

    const [editModal, setEditModal] = useState({
        isOpen: false,
        content: "",
        tweetId: ""
    });

    const [modalInfo, setModalInfo] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
    });

    const [modalProfileName, setModalProfileName] = useState({
        isOpen: false,
        title: "프로필 이름 수정",
        currentName: "",
    });
    
    const [modalHandle, setModalHandle] = useState({
        isOpen: false,
        title: "@handle 수정",
        currentHandle: "",
    });



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

    const openEditModal = (options: {
        isOpen: true;
        content: string;
        tweetId: "";
    }) => {
        setEditModal({
            isOpen: true,
            content: options.content,
            tweetId: options.tweetId
        });
    };

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

    const openModalHandle = (options: {
        isOpen: true;
        title: string;
        currentHandle: string;
    }) => {
        setModalHandle({
            isOpen: true,
            title: options.title,
            currentHandle: options.currentHandle,
        });
    };

    return (
        <Wrapper>
            <LeftNav onLogOut={onLogOut} />
            
            <ContentBox>
                <Outlet context={{ openModal, openEditModal, openModalProfileName, openModalHandle }} />
            </ContentBox>

            <RightNav />

            {modalInfo.isOpen && (
                <ModalCoponent
                    title={modalInfo.title}
                    message={modalInfo.message}
                    onConfirm={modalInfo.onConfirm}
                    onClose={() => setModalInfo(prev => ({ ...prev, isOpen: false }))}
                />
            )}

            {editModal.isOpen && (
                <EditModal
                    content={editModal.content}
                    tweetId={editModal.tweetId}
                    onClose={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
                />
            )}

            {modalProfileName.isOpen && (
                <EditModalProfileName
                    title={modalProfileName.title}
                    currentName={modalProfileName.currentName}
                    onClose={() => setModalProfileName(prev => ({ ...prev, isOpen: false }))}
                />
            )}

            {modalHandle.isOpen && (
                <EditModalHandle
                    title={modalHandle.title}
                    currentHandle={modalHandle.currentHandle}
                    onClose={() => setModalHandle(prev => ({ ...prev, isOpen: false }))}
                />
            )}
            
        </Wrapper>
    );
}
