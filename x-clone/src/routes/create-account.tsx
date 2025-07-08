import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

import { auth } from "../firebase"; // Firebase auth 객체를 가져옵니다.
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom"; // Link 컴포넌트를 사용하여 페이지 이동을 구현합니다.
import{ Content, Error, Form, FormWrapper, Input, Logo, Switchger, Title, Wrapper } from "../components/auth-components"; // auth 통합 컴포넌트를 가져옵니다.
import { GitHubButton } from "../components/github-btn"; // GitHub 로그인 버튼 컴포넌트
import { GoogleButton } from "../components/google-btn";

export default function CreateAccount() {
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

    // 로딩 중일 때는 버튼을 비활성화하고 로딩 중임
    const [isLoading, setIsLoading] = useState(false);

    // 계정 생성에 필요한 정보들을 관리하기 위한 state
    const [name, setName] = useState(""); // 이름을 관리하기 위한 state
    const [email, setEmail] = useState(""); // 이메일을 관리하기 위한 state
    const [password, setPassword] = useState(""); // 비밀번호를 관리하기 위한 state
    const [error, setError] = useState(""); // 에러 메시지를 관리하기 위한 state


    // input 변경 핸들러
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = event;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    // 폼 제출 핸들러
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError(""); // 에러 메시지를 초기화
        e.preventDefault();
        console.log("Creating account with", { name, email, password });

        if(isLoading || email === "" || password === "" || name === "") {
            setError("All fields are required.");
            return;
        }

        try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credentials.user, { displayName: name });
        navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                switch (e.code) {
                case "auth/email-already-in-use":
                    setError("이미 가입된 이메일입니다.");
                    break;
                case "auth/invalid-email":
                    setError("유효하지 않은 이메일 형식입니다.");
                    break;
                case "auth/weak-password":
                    setError("비밀번호는 최소 6자 이상이어야 합니다.");
                    break;
                case "auth/missing-password":
                    setError("비밀번호를 입력해주세요.");
                    break;
                case "auth/too-many-requests":
                    setError("잠시 후 다시 시도해주세요. 요청이 너무 많습니다.");
                    break;
                case "auth/operation-not-allowed":
                    setError("이메일/비밀번호 계정 생성이 허용되지 않았습니다.");
                    break;
                default:
                    setError("계정 생성 중 알 수 없는 오류가 발생했습니다.");
                    break;
                }
            } else {
                setError("예기치 못한 오류가 발생했습니다.");
            }
        }finally {
            setIsLoading(false); // 로딩 상태를 false로 변경
        }
    };

    return (
        <Wrapper> 
            <Logo>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="450" height="380" viewBox="0 0 32 24">
                    <path d="M 2.3671875 3 L 9.4628906 13.140625 L 2.7402344 21 L 5.3808594 21 L 10.644531 14.830078 L 14.960938 21 L 21.871094 21 L 14.449219 10.375 L 20.740234 3 L 18.140625 3 L 13.271484 8.6875 L 9.2988281 3 L 2.3671875 3 z M 6.2070312 5 L 8.2558594 5 L 18.033203 19 L 16.001953 19 L 6.2070312 5 z"></path>
                    <text x="25.5" y="21" textAnchor="middle" fontSize="1.5" fill="#666">
                        @silee.dev
                    </text>
                </svg>
            </Logo>
            <Content>
            <Title>계정을 생성하세요</Title>
                <FormWrapper>
                    <Form onSubmit={onSubmit}>
                        <Input onChange={onChange} name="name" value={name} type="text" placeholder="Name" required />
                        <Input onChange={onChange} name="email" value={email} type="email" placeholder="Email" required />
                        <Input onChange={onChange} name="password" value={password} type="password" placeholder="Password" required />
                        <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
                    </Form>
                    {error !== "" ? <Error>{error}</Error> : null}
                    <Switchger>
                        이미 가입한 계정이 있으신가요? ? <Link to="/login">Log in</Link>
                    </Switchger>
                </FormWrapper>
            </Content>
        </Wrapper>
    );
}