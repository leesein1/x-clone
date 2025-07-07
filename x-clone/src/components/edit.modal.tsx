// EditModal.tsx
import React, { useState } from "react";
import Modal from "react-modal";
import styled, { createGlobalStyle } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface EditModalProps {
    content: string;
    tweetId: string;
    onClose: () => void;
}

const GlobalModalStyle = createGlobalStyle`
    .modal-overlay {
        background: rgba(0,0,0,0.6);
        z-index: 1000;
    }
    .modal-content {
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        width: 40%;
        padding: 30px;
        border-radius: 12px;
        background: #fff;
        border: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        outline: none;
        min-width:400px;
}
`;


const TextArea = styled.textarea`
    width: 100%;
    resize: vertical;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;

`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    color: #fff;
`;

const CloseBtn = styled(Button)`
    background: gray;
`;

const TweetBtn = styled(Button)`
    background: #1d9bf0;

`;

const FileButton = styled.label`
    background-color: #000;
    color: #fff;
    padding: 12px 0;
    border-radius: 25px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    display: block;
    width: 100%;
    margin-bottom: 10px;
`;

const HiddenFileInput = styled.input`
    display: none;
`;

export default function EditModal({content: initialContent, tweetId: initialTweetId, onClose,}: EditModalProps) {
    const [content, setContent] = useState(initialContent); // 새로운 content (tweet)
    const [tweetId] = useState(initialTweetId);
    const [file, setFile] = useState<File | null>(null);;

    const [isLoading, setIsLoading] = useState(false); // 트윗하는 상태 관리
    const navigate = useNavigate();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            const selectedFile = files[0];
            const MAX_SIZE = 10 * 1024 * 1024; // 10MB

            if (selectedFile.size > MAX_SIZE) {
                alert("이미지 크기는 최대 10MB까지 업로드할 수 있습니다.");
                setFile(null);
                e.target.value = ""; // 같은 파일 다시 선택 가능하게 초기화
                return;
            }

            setFile(selectedFile);
        } else {
            setFile(null);
        }
    };
    
    const onUpdate = async () => {
        if (isLoading || content === "" || content.length > 180) return;

        const user = auth.currentUser;
        if (!user) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        try {
            setIsLoading(true);
            const tweetRef = doc(db, "tweets", tweetId); // tweetId는 수정할 문서 ID

            await updateDoc(tweetRef, {
                tweet: content,
                updatedAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            });

            if (file) {
                // 스토리지에 저장할 이름
                const locationRef = ref(storage, `tweets/${user.uid}/${tweetId}`);
                // 저장한 결과 반환
                const result = await uploadBytes(locationRef, file);
                // 저장한 주소 반환
                const url = await getDownloadURL(result.ref);

                const tweetRef = doc(db, "tweets", tweetId); 

                await updateDoc(tweetRef, {
                    photo: url,
                });
            }

            setContent("");
            setFile(null);
            // 필요하면 파일 업로드 후 photo 필드도 업데이트
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    return (
        <>
        {/* 한 번만 선언해 두면 전역에서 모달 스타일을 재사용할 수 있다 */}
        <GlobalModalStyle />

        <Modal
            isOpen onRequestClose={onClose} ariaHideApp={false} 
            overlayClassName="modal-overlay" className="modal-content">

            <TextArea rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <ButtonGroup>
                <FileButton htmlFor="fileInput">{file ? "Photo added" : "add Photo"}</FileButton>
                <HiddenFileInput id="fileInput" type="file" accept="image/*" onChange={onFileChange} />
                <TweetBtn onClick={onUpdate}>Tweet</TweetBtn>
                <CloseBtn onClick={onClose}>Close</CloseBtn>
            </ButtonGroup>
        </Modal>
        </>
    );
}

