import { useEffect, useState } from "react";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";

const Wrapper = styled.div`
    display: grid;
    gap: 50px;
    overflow-y: scroll;
    grid-template-rows: auto auto 1fr;
    height: 100vh;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const TabBox = styled.div`
    display: flex;
`;

const Tab = styled.div`
    display: flex;
    width: 50%;
    height: 5vh;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
        background-color: #d4d4d4;
    }
`;

const TabText = styled.div.withConfig({shouldForwardProp: (prop) => prop !== "active"})<{ active?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-weight: ${(props) => (props.active ? "700" : "400")};
    position: relative;
    width: 21%;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background-color: ${(props) => (props.active ? "#1d9bf0" : "transparent")};
        transition: background-color 0.2s ease-in-out;
        border-radius: 2px;
    }
`;




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
            <Timeline />
        </Wrapper>
    );
}