import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Button = styled.button`
    width: 100%;
    color: black;
    background-color: white;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 50px;
    border: 1px solid gray;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #eee;
    }
`;

const Logo = styled.img`
    height: 25px;
`;

export function GoogleButton({ setError }: { setError: (msg: string) => void }) {
    const navigate = useNavigate();

    const onClick = async () => {
        setError(""); // 기존 에러 초기화

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                switch (e.code) {
                    case "auth/account-exists-with-different-credential":
                        setError("이미 다른 로그인 방식으로 가입된 이메일입니다. 해당 방식으로 로그인해주세요.");
                        break;
                    case "auth/popup-closed-by-user":
                        setError("로그인 창이 닫혔습니다. 다시 시도해주세요.");
                        break;
                    case "auth/cancelled-popup-request":
                        setError("다른 로그인 요청이 진행 중입니다.");
                        break;
                    case "auth/popup-blocked":
                        setError("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.");
                        break;
                    case "auth/operation-not-allowed":
                        setError("Google 로그인 기능이 비활성화되어 있습니다.");
                        break;
                    case "auth/network-request-failed":
                        setError("네트워크 오류입니다. 인터넷 연결을 확인해주세요.");
                        break;
                    default:
                        setError("Google 로그인 중 오류가 발생했습니다.");
                        break;
                }
            } else {
                setError("예기치 못한 오류가 발생했습니다.");
            }
            console.error("Google login failed:", e);
        }
    };

    return (
        <Button onClick={onClick}>
            <Logo src="/google-logo.svg" alt="Google Logo" />
            Continue with Google
        </Button>
    );
}
