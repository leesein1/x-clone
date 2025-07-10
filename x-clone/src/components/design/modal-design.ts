// styles/modal-style.ts
import styled, { createGlobalStyle } from "styled-components";

/* ───────── 공통 모달 전역 스타일 ───────── */
export const GlobalModalStyle = createGlobalStyle`
    .modal-overlay {
        background: rgba(0, 0, 0, 0.6);
        z-index: 1000;
        position: fixed;
        top: 0; left: 0;
        right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: #fff;
        border: none;
        border-radius: 12px;
        padding: 30px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        outline: none;
        animation: fadeIn 0.2s ease-in-out;
        text-align: center;
        font-family: system-ui, sans-serif;
        color: #333;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;

/* ───────── 타이틀, 메시지 ───────── */
export const Title = styled.h2`
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 15px;
`;

export const Message = styled.p`
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 25px;
`;

/* ───────── 인풋/텍스트에어리어 ───────── */
export const Input = styled.input`
    width: 100%;
    padding: 12px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;
    box-sizing: border-box;
`;

export const TextArea = styled.textarea`
    width: 100%;
    resize: vertical;
    padding: 12px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;
    box-sizing: border-box;
`;

/* ───────── 버튼 그룹 및 공통 버튼 ───────── */
export const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    &.horizontal {
        flex-direction: row;
        justify-content: center;
        gap: 12px;
    }
`;

export const Button = styled.button`
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    color: #fff;

    &.sm {
        padding: 10px 20px;
        font-size: 14px;
        border-radius: 6px;
        width: auto;
    }
`;

export const TweetBtn = styled(Button)`
    background: #1d9bf0;
`;

export const CloseBtn = styled(Button)`
    background: #6c757d;
`;

export const ConfirmBtn = styled(Button)`
    background: #1d9bf0;
`;

export const CancelBtn = styled(Button)`
    background: #e0e0e0;
    color: #333;
`;

/* ───────── 에러 메시지 ───────── */
export const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-top: -12px;
    margin-bottom: 10px;
`;

/* ───────── 파일 업로드 버튼 ───────── */
export const FileButton = styled.label`
    background-color: #000;
    color: #fff;
    padding: 12px 0;
    border-radius: 25px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    display: block;
    width: 100%;
    margin-bottom: 10px;
`;

export const HiddenFileInput = styled.input`
    display: none;
`;
