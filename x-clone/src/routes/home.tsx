import PostTweetForm from "../components/post-tweet-form"
import Timeline from "../components/timeline"
import styled from "styled-components";

const Wrapper = styled.div`
    display: grid;
    gap: 50px;
    overflow-y: scroll;
    grid-template-rows: 1fr 5fr;

    /* 스크롤바 숨기기 */
    scrollbar-width: none;          /* Firefox */
    -ms-overflow-style: none;       /* IE, Edge */
    
    &::-webkit-scrollbar {
        display: none;                /* Chrome, Safari */
    }
`;

export default function Home() {
    return <Wrapper>
        <PostTweetForm/>
        <Timeline/>
    </Wrapper>
}