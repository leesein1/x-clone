import { styled } from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    position: relative;
`;
export const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;
export const AvatarImg = styled.img`
    width: 100%;
`;
export const AvatarInput = styled.input`
    display: none;
`;
export const Name = styled.span`
    display:flex;
    align-items: center;
    font-size: 22px;
    
`;
export const Tweets = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
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