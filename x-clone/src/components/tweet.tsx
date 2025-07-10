import type { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useOutletContext } from "react-router-dom";
import { ActionGroup, ActionIcon, Actions, ButtonRow, ContentColumn, DateText, Dot, Handle, Header, IconButton, Payload, ProfileColumn, ProfileImage, TweetImage, Username, Wrapper } from "./design/tweet-design";
import TweetLike from "./tweet-likes"

export default function Tweet({ username, photo, tweet, userId, id, userPhotoURL, createdAtString, userHandle}: ITweet) {
    const { openModal, openEditModal } = useOutletContext<{
        openModal: (opts: { title: string; message: string; onConfirm?: () => void }) => void;
        openEditModal : (opts:{ content: string; tweetId: string}) => void;
    }>();

    const user = auth.currentUser;  // 지금 로그인 한 user

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
                    <Dot>-</Dot>
                    <DateText>{createdAtString}</DateText>
                </Header>

                <Payload>{tweet}</Payload>

                {photo && <TweetImage src={photo} alt="트윗 이미지" />}

                <Actions>
                    <ActionGroup>
                        {/* 댓글 */}
                        <ActionIcon>
                        <IconButton>
                        <svg data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                        </svg>
                        </IconButton>
                        </ActionIcon>

                        {/* 좋아요 */}
                        <TweetLike tweetId={id}/>

                        {/* 북마크 */}
                        <ActionIcon>
                        <IconButton>
                        <svg data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
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