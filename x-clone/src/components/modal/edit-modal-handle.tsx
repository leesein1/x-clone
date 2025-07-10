import { useEffect, useState } from "react";
import Modal from "react-modal";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  runTransaction,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ButtonGroup, CloseBtn, ErrorMessage, GlobalModalStyle, Input, Title, TweetBtn } from "../design/modal-design";

type Props = {
    title: string;
    currentHandle: string;
    onClose: () => void;
};

export default function EditModalHandle({ title, currentHandle, onClose }: Props) {
    const user = auth.currentUser;
    const [newHandle, setNewHandle] = useState(currentHandle);
    const [error, setError] = useState("");

    useEffect(() => {
        setNewHandle(currentHandle);
    }, [currentHandle]);

    const onSave = async () => {
        if (!user) return setError("로그인이 필요합니다.");
        if (newHandle.trim() === "") return setError("handle을 입력해주세요.");
        if (newHandle.trim() === currentHandle.trim()) return setError("현재 handle과 동일합니다.");

        try {
            // handle 중복 체크
            const q = query(collection(db, "users"), where("handle", "==", newHandle.trim()));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) return setError("이미 사용 중인 handle입니다.");

            // 트랜잭션으로 users/{uid} 업데이트
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, "users", user.uid);
                transaction.update(userRef, {
                handle: newHandle.trim(),
                isAutoHandle: false,
                });
            });

            const tweetsQuery = query(collection(db, "tweets"), where("userId", "==", user.uid));
            const tweetSnapshots = await getDocs(tweetsQuery);

            const updates = tweetSnapshots.docs.map((tweetDoc) =>
              updateDoc(tweetDoc.ref, {
                userHandle: newHandle.trim(),
              })
            );

            await Promise.all(updates);
            
            onClose();
            setNewHandle("");
            } catch (e) {
                setError("handle 변경 실패: " + (e instanceof Error ? e.message : String(e)));
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
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="새 @handle을 입력하세요"
                />
                    
                {error && <ErrorMessage>{error}</ErrorMessage>}

                <ButtonGroup>
                    <TweetBtn onClick={onSave}>저장</TweetBtn>
                    <CloseBtn onClick={onClose}>닫기</CloseBtn>
                </ButtonGroup>
            </Modal>
        </>
    );
}
