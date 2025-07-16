import { useEffect, useState } from "react";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/tweet/timeline";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import {
    LoaderWrapper,
    PayLoader,
    StickyBox,
    Tab,
    TabBox,
    TabText,
    Wrapper,
} from "../components/design/home-design";

export default function Home() {
    const [activeTab, setActiveTab] = useState<"suggest" | "following">("suggest");
    const [isLoading, setIsLoading] = useState(true);

    const { openModalHandle } = useOutletContext<{
        openModalHandle: (opts: {
        isOpen: true;
        title: string;
        currentHandle: string;
        }) => void;
    }>();

    useEffect(() => {
        const fetchUserInfo = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.isAutoHandle) {
            openModalHandle({
                isOpen: true,
                title: "@handle을 수정해주세요",
                currentHandle: data.handle || "",
            });
            }
        }
        };

        fetchUserInfo();
    }, []);

    return (
        <Wrapper>
        <StickyBox>
            <TabBox>
            <Tab onClick={() => setActiveTab("suggest")}>
                <TabText active={activeTab === "suggest"}>추천</TabText>
            </Tab>
            <Tab onClick={() => setActiveTab("following")}>
                <TabText active={activeTab === "following"}>팔로잉</TabText>
            </Tab>
            </TabBox>

            <PostTweetForm />
        </StickyBox>

        {/* isLoading 상태일 때만 로딩 스피너 보여주기 */}
        {isLoading && (
            <LoaderWrapper>
                <PayLoader />
            </LoaderWrapper>
        )}

        {/* 항상 타임라인 렌더링 */}
        <Timeline mode={activeTab} onLoadEnd={() => setIsLoading(false)} />

        </Wrapper>
    );
}
