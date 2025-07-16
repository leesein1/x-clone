import styled, { keyframes } from 'styled-components';

const riseUp = keyframes`
    0% {
        opacity: 0;
        transform: translateY(60px) scale(0.8);
    }
    50% {
        opacity: 1;
        transform: translateY(0px) scale(1);
    }
    70% {
        transform: translateY(-10px) scale(1.05) rotate(3deg);
    }
    100% {
        opacity: 0;
        transform: translateY(-60px) scale(0.7);
    }
`;

const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
`;

const Logo = styled.img`
    width: 80px;
    height: 80px;
    animation: ${riseUp} 2.5s ease-in-out forwards;
`;

export default function LoadingScreen() {
        return (
            <Wrapper>
            <Logo src="./public/x-social-media-black-icon.svg" alt="loading" />
            </Wrapper>
        );
    }
