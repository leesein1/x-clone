import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDKvHiq6aKUFb1VMhxx0eAz9vWJ428jxR4",
    authDomain: "x-clone-d17bb.firebaseapp.com",
    projectId: "x-clone-d17bb",
    storageBucket: "x-clone-d17bb.firebasestorage.app",
    messagingSenderId: "207195803952",
    appId: "1:207195803952:web:1d0dce473e2b37db1278f5"
};

// initialize Firebase cofig정보 받아오는 code
const app = initializeApp(firebaseConfig);
// app 정보 넘겨주고 getAuth로 auth 객체 받아오기
// getAuth는 Firebase Authentication을 사용하기 위한 함수
// auth 객체는 Firebase Authentication의 기능을 사용할 수 있게 해줌

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);


