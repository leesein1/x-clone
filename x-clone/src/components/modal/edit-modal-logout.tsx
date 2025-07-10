// ModalComponent.tsx
import Modal from "react-modal";
import { ButtonGroup, CancelBtn, ConfirmBtn, GlobalModalStyle, Message, Title } from "../design/modal-design";


interface ModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ModalComponent({
        title,
        message,
        onConfirm,
        onClose,
    }   : ModalProps) {
    return (
        <>
            <GlobalModalStyle />
            <Modal
                isOpen
                onRequestClose={onClose}
                overlayClassName="modal-overlay"
                className="modal-content"
                ariaHideApp={false}
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
