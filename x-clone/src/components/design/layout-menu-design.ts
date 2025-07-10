import { Link } from "react-router-dom";
import { styled } from "styled-components";

export const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 98.5vh;

    #menu-right-inner {
        min-width:334px;
    }
`;

export const MenuLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

export const MenuInnerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width:100%;
    overflow:hidden;
`;

export const HoverItem = styled.div`
    display: flex;
    padding: 10px 10px;
    border-radius: 50px;
    transition: background-color 0.2s ease-in-out, border-radius 0.2s ease-in-out;

    &:hover {
        background-color: #d4d4d4;
    }

    &#hover-logo {
        padding: 0px 5px;
    }
`;

export const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 2px solid white;
    height: 45px;
    width: 164px;
    border-radius: 35px;

    svg {
        width: 34px;
        fill: #000;
    }

    &:hover ${HoverItem} {
        background-color: #d4d4d4;
    }

`;

export const MenuSpan = styled.div<{ $active?: boolean }>`
    display: flex;
    margin-left: 10px;
    font-size: 1.5rem;
    font-weight: ${(props) => (props.$active ? 700 : 400)};
    text-decoration: none;
    align-items: center;
    justify-content: left;
`;

/* 검색창 UI*/
export const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
`;

export const SearchInput = styled.input`
    border: none;
    outline: none;
    font-size: 14px;
    width: 100%;
    color: #14171a;
    background-color: transparent;

    &::placeholder {
        color: #657786;
    }
`;

export const SearchIcon = styled.div`
    margin-right: 10px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
    }
`;

export const SearchResult = styled.div<{ $focused?: boolean }>`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    min-height: 10vh;
    max-height: 100vh;
    background-color: white;
    border: 1px solid #cfd9de;
    border-radius: 15px;
    padding: 15px 15px;
    z-index: 1000;

    display: ${(props) => (props.$focused ? "block" : "none")};
`;

export const SearchBox =styled.div<{ $focused?: boolean }>`
    display: flex;
    align-items: center;
    border: 2px solid ${(props) => (props.$focused ? "#1d9bf0" : "#cfd9de")};
    border-radius: 50px;
    padding: 10px 15px;
    width: 100%;
    color: #657786;
    background-color: #fff;
`;


// 오른쪽 user 추천 styled
export const SetSuggetUserBox = styled.div`
    width:100%;
    height:100%;
    border: 1px solid #cfd9de;
    border-radius: 15px;
    padding: 15px 15px;
`;

export const RightSuggest = styled.div`
    width:100%;
    min-height:33vh;
`;

export const SuggestText = styled.div`
    font-size:1.5rem;
    font-weight:900;
`;


export const RightSuggestBox = styled.div`
    width: 100%;
    padding: 0 0px;
`;

export const SetSuggestUserBox = styled.div`
    border: 1px solid #cfd9de;
    padding: 16px 0px;
    border-radius: 16px;
`;

export const SuggestUserText = styled.h3`
    font-size: 1.25rem;
    font-weight: 900;
    margin-bottom: 12px;
    padding: 0 16px;
`;

export const FollowUserItem = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 16px;
    border-bottom: 1px solid #ddd;

    width:100%;

    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
        background-color: #f0f0f0;
    }

    &:last-child {
        border-bottom: none;
    }

    img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        object-fit: cover;
    }

    .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        gap:5px;
        justify-content: center;

        strong {
            font-size: 1rem;
            font-weight:700;
        }

        span {
            font-size: 1rem;
            color: gray;
        }
    }
`;

export const FollowButton = styled.button`
    background-color: black;
    color: white;
    border: none;
    border-radius: 9999px;
    padding: 6px 12px;
    font-size: 0.8rem;
    cursor: pointer;

    &:hover {
        background-color: #222;
    }
`;