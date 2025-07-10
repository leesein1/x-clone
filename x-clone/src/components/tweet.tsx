import type { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useOutletContext } from "react-router-dom";
import { ActionGroup, ActionIcon, Actions, ButtonRow, ContentColumn, DateText, Dot, Handle, Header, IconButton, Payload, ProfileColumn, ProfileImage, TweetImage, Username, Wrapper } from "./design/tweet-design";


export default function Tweet({ username, photo, tweet, userId, id, userPhotoURL, createdAtString, userHandle}: ITweet) {
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
            <ProfileColumn>
                <ProfileImage
                    src={userPhotoURL || "/UserCircle.svg"}
                    alt="프로필"
                />
            </ProfileColumn>

            <ContentColumn>
                <Header>
                    <Username>{username}</Username>
                    <Handle>@{userHandle}</Handle>
                    <Dot>·</Dot>
                    <DateText>{createdAtString}</DateText>
                </Header>

                <Payload>{tweet}</Payload>

                {photo && <TweetImage src={photo} alt="트윗 이미지" />}

                <Actions>
                    <ActionGroup>
                        {/* 댓글 */}
                        <ActionIcon>
                        <IconButton>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h.008v.008H7.5V12zm4.5 0h.008v.008H12V12zm4.5 0h.008v.008H16.5V12z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.093-.88L3 20l1.21-3.628A8.962 8.962 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </IconButton>
                        </ActionIcon>

                        {/* 리트윗 */}
                        <ActionIcon>
                        <IconButton>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-9A2.25 2.25 0 003 6.75v9A2.25 2.25 0 005.25 18h3.75m3 0h6.75a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-3.75" />
                            </svg>
                        </IconButton>
                        </ActionIcon>

                        {/* 북마크 */}
                        <ActionIcon>
                        <IconButton>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75v12.634a.75.75 0 01-1.204.611L12 17.25l-4.046 2.745a.75.75 0 01-1.204-.61V6.75A2.25 2.25 0 019 4.5h6a2.25 2.25 0 012.25 2.25z" />
                            </svg>
                        </IconButton>
                        </ActionIcon>
                    </ActionGroup>

                    
                    {user?.uid === userId && (
                    <ActionGroup>
                        {/* 수정 */}
                        <ActionIcon>
                            <IconButton onClick={onEdit}>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.123 2.123 0 113.001 3.001L7.5 18.75H4.5v-3l12.362-12.263z" />
                            </svg>
                            </IconButton>
                        </ActionIcon>

                        {/* 삭제 */}
                        <ActionIcon>
                            <IconButton onClick={onDelete}>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            </IconButton>
                        </ActionIcon>
                    </ActionGroup>
                    )}
                </Actions>



                {user?.uid === userId && (
                    <ButtonRow>
                    </ButtonRow>
                )}
            </ContentColumn>
        </Wrapper>
    );
}