import { useState } from "react";
import { auth } from "../firebase"; // Firebase auth 객체를 가져옵니다.
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom"; // Link 컴포넌트를 사용하여 페이지 이동을 구현합니다.
import{ Error, Form, Input, Switchger, Title, Wrapper } from "../components/auth-components"; // auth 통합 컴포넌트를 가져옵니다.
import { FirebaseError } from "firebase/app"; // Firebase 에러 처리를 위한 FirebaseError 클래스
import { GitHubButton } from "../components/github-btn";

export default function CreateAccount() {
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

    // 로딩 중일 때는 버튼을 비활성화하고 로딩 중임
    const [isLoading, setIsLoading] = useState(false);

    // 로그인에 필요한 정보들을 관리하기 위한 state
    const [email, setEmail] = useState(""); // 이메일을 관리하기 위한 state
    const [password, setPassword] = useState(""); // 비밀번호를 관리하기 위한 state
    const [error, setError] = useState(""); // 에러 메시지를 관리하기 위한 state


    // input 변경 핸들러
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    // 폼 제출 핸들러
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError(""); // 에러 메시지를 초기화
        e.preventDefault();
        console.log("Creating account with", { email, password });

        if(isLoading || email === "" || password === "" ) {
            setError("로그인 또는 비밀번호를 입력해주세요.");
            return;
        }
        try {
        setIsLoading(true); // 로딩 시작
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/"); // 성공 시 홈으로 이동
        } catch (error) {
        if (error instanceof FirebaseError) {
            console.log(error.code)   
            switch (error.code) {
            case "auth/invalid-email":
                setError("유효하지 않은 이메일 형식입니다.");
                break;
            case "auth/user-disabled":
                setError("비활성화된 계정입니다. 관리자에게 문의하세요.");
                break;
            case "auth/user-not-found":
                setError("존재하지 않는 사용자입니다.");
                break;
            case "auth/wrong-password":
                setError("비밀번호가 일치하지 않습니다.");
                break;
            case "auth/too-many-requests":
                setError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
                break;
            case "auth/invalid-login-credentials":
                setError("이메일 또는 비밀번호가 올바르지 않습니다.");
                break;
            default:
                setError("로그인 중 알 수 없는 오류가 발생했습니다.");
                break;
            }
        } else {
            setError("예기치 못한 오류가 발생했습니다.");
        }
        } finally {
        setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <Wrapper> 
            <Title>Log into 𝕏</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="email" value={email} type="email" placeholder="Email" required />
                <Input onChange={onChange} name="password" value={password} type="password" placeholder="Password" required />
                <Input type="submit" value={isLoading ? "Loading..." : "Login"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switchger>
                계정이 없으신가요 ? <Link to="/create-account">Create Account</Link>
            </Switchger>
            <GitHubButton setError={setError} />
        </Wrapper>
    )
}