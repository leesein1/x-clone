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
        path: 'profile/:selectUserId',
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

  const init = async () => {
    const start = Date.now();
    await auth.authStateReady(); // Firebase Auth 초기화
    const duration = Date.now() - start;
    const remain = Math.max(400 - duration, 0);

    setTimeout(() => {
      setIsLoading(false);
    }, remain);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyle />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}


export default App
