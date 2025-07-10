import { useEffect, useState } from "react";
import Modal from "react-modal";
import styled, { createGlobalStyle } from "styled-components";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, runTransaction, where } from "firebase/firestore";

const GlobalModalStyle = createGlobalStyle`
    .modal-overlay {
        background: rgba(0,0,0,0.6);
        z-index: 1000;
        position: fixed;
        top: 0; left: 0;
        right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: #fff;
        border: none;
        border-radius: 12px;
        padding: 30px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        outline: none;
        animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight:600;
    margin-bottom: 20px;
    text-align: center;
    color:#000;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;
    box-sizing: border-box;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Button = styled.button`
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    color: #fff;
    transition: background 0.2s ease-in-out;
`;

const CloseBtn = styled(Button)`
    background: #6c757d;


`;

const TweetBtn = styled(Button)`
    background: #1d9bf0;

`;

/*
    클로즈 호버
    &:hover {
        background: #5a6268;
    }
    오픈 호버
    &:hover {
        background: #1a8cd8;
    }

*/

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-top: -12px;
    margin-bottom: 10px;
`;

type Props = {
    title: string;
    currentName: string;
    onClose: () => void;
};

export default function EditModalProfileName({ title, currentName, onClose }: Props) {
    const user = auth.currentUser;
    const [newName, setNewName] = useState(currentName);
    const [error, setError] = useState("");

    useEffect(() => {
        setNewName(currentName);
    }, [currentName]);

    const onSave = async () => {
        if (!user) return setError("로그인이 필요합니다.");
        if (newName.trim() === "") return setError("닉네임을 입력해주세요.");
        if (user.displayName === newName.trim()) return setError("현재 닉네임과 동일합니다.");

        try {
            await runTransaction(db, async (transaction) => {
                const q = query(collection(db, "tweets"), where("userId", "==", user?.uid));
                const snapshot = await getDocs(q);
                snapshot.forEach((doc) => {
                    transaction.update(doc.ref, { username: newName });
                });
            });

            await updateProfile(user, { displayName: newName });

            onClose();
            setNewName("");
        } catch (e) {
            setError("닉네임 변경 실패 :"+ e);
        }
    };

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

                <Input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="새 닉네임을 입력하세요"
                />
                {/* 에러 메시지 표시 */}
                {error && <ErrorMessage>{error}</ErrorMessage>}

                <ButtonGroup>
                    <TweetBtn onClick={onSave}>저장</TweetBtn>
                    <CloseBtn onClick={onClose}>닫기</CloseBtn>
                </ButtonGroup>

            </Modal>
        </>
    );
}