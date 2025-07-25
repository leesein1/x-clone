
import { useNavigate } from "react-router-dom";

import { addDoc, collection, updateDoc, doc as docRef } from "firebase/firestore";
import { useRef, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AttachFileButton, AttachFileInput, BottomRow, Form, LeftIcons, PostBox, PostProfileImg, PostTweetBox, SubmitBtn, TextArea } from "./design/post-tweet-form-design";
import EmojiButton from "./emoji-picker";
import useUserInfo from "./user-info";

export default function PostTweetForm() {
    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false); // 트윗하는 상태 관리
    const [tweet, setTweet] = useState(""); // 트윗 내용 관리
    const [file, setFile] = useState<File | null>(null); // 첨부 파일

    const textAreaRef = useRef<HTMLTextAreaElement>(null); // 이모지 첨부를 위해

    const user = auth.currentUser;
    const uid = user?.uid || null;
    const userInfo = useUserInfo(uid);
    
    const insertEmoji = (emoji: string) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newTweet =
            tweet.slice(0, start) + emoji + tweet.slice(end);

        setTweet(newTweet);

        // 커서 위치 갱신
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    }
    // const 안에 event만 받아와도 되지만, TypeScript에서는
    // 타입 지정하는걸 지향함 오류 방지 
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

    const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 로딩 중 혹은 빈문자 이거나 길이가 너무 길면 트윗 막기
        if(isLoading || tweet === "" || tweet.length > 180) return;
        // 혹시라도 user 정보가 없는데 접근한경우 방지


        if (!user) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
        
        try{
            setIsLoading(true);
            // user의 트윗 이름 받아서 이미지 저장 매칭을 위해
            const doc = await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username:userInfo?.name || "Anonymous",
                userId : user.uid,
                userPhotoURL: userInfo?.photoURL,
                userHandle: userInfo?.handle
            });
            if (file) {
                // 스토리지에 저장할 이름
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                // 저장한 결과 반환
                const result = await uploadBytes(locationRef, file);
                // 저장한 주소 반환
                const url = await getDownloadURL(result.ref);

                const tweetRef = docRef(db, "tweets", doc.id);
                await updateDoc(tweetRef, {
                photo: url,
                });
            }

            setTweet("");
            setFile(null);
        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = "auto"; // 높이 초기화
        e.target.style.height = `${e.target.scrollHeight}px`; // 내용만큼 다시 확장
        onChange(e); // 기존 onChange도 같이 실행
    };

    return (
        <Form onSubmit={onSubmit}>
            <PostBox>
                <PostProfileImg>
                    {user && (
                        <img
                            src={userInfo?.photoURL || "./public/UserCircle.svg"}
                            alt="프로필"
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                        />
                    )}
                </PostProfileImg>
                <PostTweetBox>
                        <TextArea
                            ref={textAreaRef}
                            value={tweet}
                            onChange={onChange}
                            onInput={autoResize}
                            placeholder="무슨 일이 있으신가요?"
                            rows={1}
                        />
                        <BottomRow>
                        <LeftIcons>

                        <AttachFileButton htmlFor="file">
                            <svg data-slot="icon" fill="none" strokeWidth={1.5} stroke="#1d9bf0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </AttachFileButton>

                        <AttachFileInput onChange={onFileChange} id="file" type="file" accept="image/*" />
                        <EmojiButton onSelect={insertEmoji} />
                        </LeftIcons>
                        <SubmitBtn type="submit" value={isLoading ? "Posting..." : "게시하기"} />
                    </BottomRow>
                </PostTweetBox>
            </PostBox>

        </Form>
    );
}
