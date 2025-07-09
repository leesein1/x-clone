import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { styled } from "styled-components";
import { auth, db } from "../firebase"; // auth, db 모두 사용
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Button = styled.button`
    margin-top: 50px;
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

// 랜덤 handle 생성기
const generateRandomHandle = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6자리 숫자
    return `user_${randomNum}`;
};

export function GitHubButton({ setError }: { setError: (msg: string) => void }) {
    const navigate = useNavigate();

    const onClick = async () => {
        setError("");

        try {
            const provider = new GithubAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            // Firestore에 등록되지 않은 사용자면 랜덤 핸들로 자동 생성
            if (!userDoc.exists()) {
                const randomHandle = generateRandomHandle();
                    await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName || "",
                    handle: randomHandle,
                    email: user.email || "",
                    photoURL: user.photoURL || "",
                    createdAt: Date.now(),
                    isAutoHandle: true
                });
            }
            // 메인으로 이동
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
                    setError("GitHub 로그인 기능이 비활성화되어 있습니다.");
                    break;
                case "auth/network-request-failed":
                    setError("네트워크 오류입니다. 인터넷 연결을 확인해주세요.");
                    break;
                default:
                    setError("GitHub 로그인 중 오류가 발생했습니다.");
                    break;
                }
        } else {
            setError("예기치 못한 오류가 발생했습니다.");
        }
            console.error("GitHub login failed:", e);
    }
};

    return (
        <Button onClick={onClick}>
        <Logo src="/github-logo.svg" alt="GitHub Logo" />
            Continue with Github
        </Button>
    );
}
