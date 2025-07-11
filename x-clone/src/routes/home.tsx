import { useEffect, useState } from "react";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/tweet/timeline";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import { Tab, TabBox, TabText, Wrapper } from "../components/design/home-design";


export default function Home() {
    const [activeTab, setActiveTab] = useState<"suggest" | "following">("suggest");

    const { openModalHandle } = useOutletContext<{
        openModalHandle: (opts: { isOpen: true; title: string; currentHandle: string }) => void;
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
            <TabBox>
                <Tab onClick={() => setActiveTab("suggest")}>
                    <TabText active={activeTab === "suggest"}>추천</TabText>
                </Tab>
                <Tab onClick={() => setActiveTab("following")}>
                    <TabText active={activeTab === "following"}>팔로잉</TabText>
                </Tab>
            </TabBox>

            <PostTweetForm />
            {/*여기가 이제 타임라인 분기 점*/}
            <Timeline mode={activeTab}/>
        </Wrapper>
    );
}