import { styled } from "styled-components";
import type { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useOutletContext } from "react-router-dom";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);

    
    &:hover {
        background-color: #eeeeee;
    }
`;

const Column = styled.div`
`;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const EditButton = styled(DeleteButton)`background-color: #1d9bf0;`;

export default function Tweet({ username, photo, tweet, userId, id}: ITweet) {
    const { openModal, openEditModal } = useOutletContext<{
        openModal: (opts: { title: string; message: string; onConfirm?: () => void }) => void;
        openEditModal : (opts:{ content: string; tweetId: string}) => void;
    }>();

    const user = auth.currentUser; 

    const onEdit = () => {
        openEditModal({
            content:tweet,
            tweetId:id
        })
    };

    const onDelete = () => {
        openModal({
            title: "트윗 삭제",
            message: "정말 이 트윗을 삭제하시겠습니까?",
            onConfirm: async () => {
            if (user?.uid !== userId) return;

            try {
                await deleteDoc(doc(db, "tweets", id));
                if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
                }
            } catch (e) {
                console.error("삭제 실패", e);
            }
            },
        });
    };

    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                <Payload>{tweet}</Payload>
                {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null}
                {user?.uid === userId ? <EditButton onClick={onEdit}>Edit.</EditButton> : null}
                
            </Column>
            {photo ? (
                <Column>
                <Photo src={photo} />
                </Column>
            ) : null}
        </Wrapper>
    );
}