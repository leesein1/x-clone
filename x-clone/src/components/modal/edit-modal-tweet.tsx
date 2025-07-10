// EditModal.tsx
import React, { useState } from "react";
import Modal from "react-modal";

import { auth, db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ButtonGroup, CloseBtn, FileButton, GlobalModalStyle, HiddenFileInput, TextArea, TweetBtn } from "../design/modal-design";

interface EditModalProps {
    content: string;
    tweetId: string;
    onClose: () => void;
}

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

