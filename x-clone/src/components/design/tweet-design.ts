import { styled } from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid #e1e8ed;

    &:hover {
        background-color: #f7f9f9;
    }
`;

export const ProfileColumn = styled.div``;

export const ProfileImage = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
`;

export const ContentColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
`;

export const Username = styled.span`
    font-weight: bold;
`;

export const Handle = styled.span`
    color: #657786;
`;

export const Dot = styled.span`
    color: #657786;
`;

export const DateText = styled.span`
    color: #657786;
`;

export const Payload = styled.p`
    margin: 4px 0;
    font-size: 15px;
`;

export const TweetImage = styled.img`
    max-width: 100%;
    max-height: 400px;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 16px;
    margin-top: 10px;
    display: block;
`;

export const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
`;

export const ActionGroup = styled.div`
    display: flex;
    gap: 10px;
`;

export const ActionIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;



export const IconButton = styled.button`
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 9999px;
    background: transparent;
    color: #536471;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        background-color: rgba(29, 155, 240, 0.1);
        color: #1d9bf0;
    }

    svg {
        width: 20px;
        height: 20px;

    }
`;

export const ButtonRow = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;

export const DeleteButton = styled.button`
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 9999px;
    background: transparent;
    color: #536471;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
        background-color: rgba(29, 155, 240, 0.1); /* 하늘색 배경 */
        color: red; /* 아이콘 색 강조 */
    }

    svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

export const EditButton = styled.button`
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 9999px;
    background: transparent;
    color: #536471;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
        background-color: rgba(29, 155, 240, 0.1); /* 하늘색 배경 */
        color: #1d9bf0; /* 아이콘 색 강조 */
    }

    svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
    }
`;
