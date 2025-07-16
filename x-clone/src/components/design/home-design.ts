import styled, { keyframes } from "styled-components";

export const Wrapper = styled.div`
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

export const TabBox = styled.div`
    display: flex;
    width:100%;
`;

export const StickyBox = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white; /* 배경색 없으면 겹쳐 보여서 꼭 넣어 */
    border-bottom: 1px solid #eee; /* 선택사항 */
`;

export const StickyBox2 = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white; /* 배경색 없으면 겹쳐 보여서 꼭 넣어 */
    border-bottom: 1px solid #eee; /* 선택사항 */
    width:100%;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
`;

export const Tab = styled.div`
    display: flex;
    width: 100%;
    height: 5vh;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
        background-color: #d4d4d4;
    }
`;

export const RenderBox = styled.div``;

export const TabText = styled.div.withConfig({shouldForwardProp: (prop) => prop !== "active"})<{ active?: boolean }>`
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

export const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const PayLoader = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid rgba(29, 155, 240, 0.2); /* 연한 파랑 */
    border-top: 4px solid #1d9bf0; /* 트위터 파랑 */
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin: 80px auto; /* 중앙 정렬 */
`;

export const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 0;
    height:80vh;
`;

export const LoaderWrapper2 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 0;
    height:100vh;
`;