import { styled } from "styled-components";

export const Wrapper = styled.div`
    padding: 20px;
    display:flex;
    flex-direction: column;
    gap:20px;
`;

export const ProfileRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const ProfileImage = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 9999px;
`;

export const Username = styled.div`
    font-weight: bold;
`;

export const Handle = styled.div`
    color: gray;
`;

export const Dot = styled.span`
    margin: 0 6px;
`;

export const DateText = styled.span`
    color: gray;
`;

export const TweetContent = styled.div`
    margin: 18px 0;
    font-size: 18px;
`;

export const TweetMedia = styled.img`
    max-width:100%;
    max-height:590px;
    border-radius: 16px;
`;

export const MetaDataRow = styled.div`
    color: gray;
    font-size: 14px;
    margin: 8px 0;
`;

export const ActionRow = styled.div`
    display: flex;
    justify-content: space-around;
    padding: 12px 0;
`;

export const ActionIcon = styled.div`
    cursor: pointer;
`;

export const ReplyBox = styled.div`
    display: flex;
    gap: 8px;
    border-top: 1px solid #eee;
    padding-top: 12px;
    input {
        flex: 1;
        border: none;
        outline: none;
    }
    button {
        background: #1d9bf0;
        color: white;
        border-radius: 9999px;
        padding: 6px 12px;
        border: none;
        cursor: pointer;
    }
`;

export const Headers = styled.div`
    svg{
        width:30px;

    }
    gap:25px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const BackImg = styled.div`
    padding: 6px;
    border-radius: 9999px; /* 완전 동그랗게 */
    transition: background-color 0.2s ease, transform 0.2s ease; /* 부드러운 트랜지션 */
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #eee;
        transform: scale(1.05); /* 살짝 커지는 효과 */
    }

    &:active {
        transform: scale(0.96); /* 클릭 시 살짝 눌리는 느낌 */
    }
`;

export const HeaderText = styled.div`
    width:100%;
    font-size:1.35rem;
    font-weight:900;
`;

export const ScrollBox = styled.div`
    height: calc(100vh - 100px);
    overflow-y:scroll;

    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
    }
    -ms-overflow-style: none;  /* IE/Edge */
    scrollbar-width: none;     /* Firefox */
`;