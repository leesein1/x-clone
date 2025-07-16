import { styled } from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    position: relative;
    height:100vh;
    overflow-y: scroll;
    scrollbar-width: none;
        -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

export const AvatarUpload = styled.label`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #f2f2f2; 

    svg {
        width: 40px;
        height: 40px;
        color: #888;
    }
`;

export const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%; // 👈 이거 필수
    display: block;
`;

export const AvatarInput = styled.input`
    display: none;
`;

export const Name = styled.span`
    display: flex;
    align-items: center;
    font-size: 22px;
`;

export const Tweets = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    flex-grow: 1;
`;

export const EditProfile = styled.span`
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    svg {
        width: 22px;
        height: 22px;
    }
    cursor: pointer;
`;
