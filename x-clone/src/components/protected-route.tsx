import React from 'react';
import { auth } from '../firebase';
import { Navigate } from "react-router-dom";

export default function ProtecteRoute({children}: {children: React.ReactNode}) {
    // 있으면 user 반환, 없으면 null을 반환
    const user = auth.currentUser;
    console.log(user);
    
    if(user === null) {
        return <Navigate to="/login" />;
    }
    // 로그인 루트에서 받아온 <루트>로 반환
    return children;
}