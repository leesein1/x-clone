import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { createGlobalStyle, styled } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtecteRoute from "./components/protected-route";
import Modal from "react-modal";
import TweetSelect from "./components/tweet/tweet-select"

const router = createBrowserRouter([
  { 
    path: '/',
    element: <ProtecteRoute><Layout /></ProtecteRoute>,
    children: [
      {
        path: '',
        element: <ProtecteRoute><Home/></ProtecteRoute> 
      },
      {
        path: 'profile',
        element: <ProtecteRoute><Profile/></ProtecteRoute>
      },
      {
        path: 'tweet/:tweetId',
        element: <ProtecteRoute><TweetSelect /></ProtecteRoute>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },{
    path: '/create-account',
    element: <CreateAccount />
  }
]);

const GlobalStyle = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }

  body {
    background-color: #fff;
    color: #000;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

  }
`;

const Wrapper = styled.div`
    height: 100vh;
    width:100%;
    display: flex;
    justify-content: center;
    
    /*일단 오른쪽 사라지게 하는거*/
    #menu-right {
      @media (max-width: 1838px) {
        display: none;
      }
    }

    /* 왼쪽 메뉴 프로필 부분*/
    #left-profile {
      @media (max-height: 320px) {
        display:none;
      }

      @media (max-width: 1200px) {
        display:none;
      }
    }


  #menu-left .menu-span {
    @media (max-width: 1200px) {
      display: none;
    }
    
  }
    overflow: hidden;
`;

Modal.setAppElement("#root");

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // FireBase 로그인 진행 중 대기시간 벌기위한 화면
  const init = async () => {
    //wait for firebase auth to initialize
    //끝나면 로딩 false로 변경
    //현재는 firebase auth를 사용하지 않기 때문에 바로 false로 변경
    await auth.authStateReady();
    setIsLoading(false)
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyle />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
