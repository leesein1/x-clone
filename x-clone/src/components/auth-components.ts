import { styled } from "styled-components";

export const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    width:100%
    padding: 50px 0px;
`;

export const Logo = styled.div`
    width: 55%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const MadeByTag = styled.h1`
    
`;

export const Switchger = styled.span`
    margin-top: 20px;
`;

export const Content = styled.div`
    width: 45%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`;

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 400px;
`;



export const Title = styled.h1`
    font-size: 54px;
    font-weight:700;
    width:720px;
`;

export const SubTitle = styled.h1`
    font-size: 34px;
    font-weight:600;
    width:720px;
    margin-top:50px;
`;

export const Form = styled.form`
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

export const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: 1px solid gray;
    width: 100%;
    font-size: 16px;
    &[type="submit"] {
        cursor: pointer;
        background-color: #1d9bf0;
        color: white;
        border: none;
        &:hover {
            opacity: 0.8;
        }
    }
`;

export const Error = styled.span`
    font-weight: 600;
    color: tomato;
`;

export const OrText = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    font-size: 21px;
    font-weight: 400;
    width:100%;
    margin-top:3px;
    margin-bottom:6px;
`;