
import { useNavigate } from "react-router-dom";

import { addDoc, collection, updateDoc, doc as docRef } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    &::placeholder {
        font-size: 16px;
    }
    &:focus {
        outline: none;

    }
`;

const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;

const AttachFileInput = styled.input`
    display: none;
`;

const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

export default function PostTweetForm() {
    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false); // 트윗하는 상태 관리
    const [tweet, setTweet] = useState(""); // 트윗 내용 관리
    const [file, setFile] = useState<File | null>(null); // 첨부 파일

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
        const user = auth.currentUser;
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
                username:user.displayName || "Anonymous",
                userId : user.uid
            });
            if (file) {
                // 스토리지에 저장할 이름
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                // 저장한 결과 반환
                const result = await uploadBytes(locationRef, file);
                // 저장한 주소 반환
                const url = await getDownloadURL(result.ref);

                const tweetRef = docRef(db, "tweets", doc.id); // ✅ 명시적 문서 참조 생성
                await updateDoc(tweetRef, {
                photo: url,
                });
            }

            setTweet("");
            setFile(null);
        }catch(error){
            // 마지막에 무슨 에러인지도 보여줄 예정
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <Form onSubmit={onSubmit}>
            <TextArea rows={5} onChange={onChange} placeholder="무슨일이 있으신가요~?" />
            <AttachFileButton htmlFor="file">{file ? "Photo added" : "add Photo"}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} id="file" type="file" accept="image/*" />
            <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
        </Form>
    );
}
