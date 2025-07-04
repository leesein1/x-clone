// ModalComponent.tsx
import Modal from "react-modal";
import styled, { createGlobalStyle } from "styled-components";
import { useEffect } from "react";

interface ModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
}

/* ───────── 모달 전역 스타일 ───────── */
const GlobalModalStyle = createGlobalStyle`
    .modal-overlay {
        background: rgba(0,0,0,0.6);
        z-index: 1000;
    }
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 360px;
        padding: 40px;
        border: none;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        text-align: center;
        color: #333;
        font-family: system-ui, sans-serif;
        outline: none;
}
`;


const Title = styled.h2`
    margin-bottom: 15px;
    font-size: 22px;
    font-weight: 700;
`;

const Message = styled.p`
    margin-bottom: 25px;
    font-size: 16px;
    line-height: 1.5;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: #fff;
`;

const ConfirmBtn = styled(Button)`
    background: #1d9bf0;
`;

const CancelBtn = styled(Button)`
    background: #e0e0e0;
    color: #333;
`;

export default function ModalComponent({
    title,
    message,
    onConfirm,
    onClose,
    }: ModalProps) {
    /* 접근성 경고 방지 – 앱 시작 시 한 번만 호출해도 OK */
    useEffect(() => {
        Modal.setAppElement("#root");
    }, []);

    return (
        <>
            <GlobalModalStyle />
            <Modal
                isOpen
                onRequestClose={onClose}
                overlayClassName="modal-overlay"
                className="modal-content"
            >
                <Title>{title}</Title>
                <Message>{message}</Message>

                <ButtonGroup>
                <ConfirmBtn onClick={onConfirm}>확인</ConfirmBtn>
                <CancelBtn onClick={onClose}>취소</CancelBtn>
                </ButtonGroup>
            </Modal>
        </>
    );
}
