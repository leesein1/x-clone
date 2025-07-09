import { styled } from "styled-components";

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    padding: 16px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    gap: 12px;
`;

export const TextArea = styled.textarea`
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 20px;
    font-size: 16px;
    resize: none;
    line-height: 1.4;
    background-color: #f7f9f9;
    font-family: inherit;

    overflow: hidden;
    max-height: 75vh;

    &::placeholder {
        color: #555;
    }

    &:focus {
        outline: none;
        background-color: #fff;
        box-shadow: 0 0 0 2px #1d9bf0;
    }
`;

export const AttachFileButton = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e8f5fd;
    }

`;


export const AttachFileInput = styled.input`
    display: none;
`;

export const BottomRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const LeftIcons = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;

    svg {
        width: 26px;
        height: 26px;
        fill: #1d9bf0;
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }
`;

export const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #1a8cd8;
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

