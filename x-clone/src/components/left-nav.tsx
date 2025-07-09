import { HoverItem, Menu, MenuInnerBox, MenuItem, MenuLink, MenuSpan } from "./layout-menu-design";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function LeftNav({onLogOut}: {onLogOut: () => void;}) {
    const location = useLocation();
    const user = auth.currentUser;

    const [userHandle, setUserHandle] = useState<string | null>(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "users", user.uid);

        const unsubscribe = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setUserHandle(data.handle || null);
            }
        });

        return () => unsubscribe(); // cleanup
    }, []);
    
    return (
        <Menu id="menu-left">
            <MenuInnerBox>
                <MenuLink to="/">
                    <MenuItem>
                        <HoverItem id="hover-logo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                                <path d="M 2.3671875 3 L 9.4628906 13.140625 L 2.7402344 21 L 5.3808594 21 L 10.644531 14.830078 L 14.960938 21 L 21.871094 21 L 14.449219 10.375 L 20.740234 3 L 18.140625 3 L 13.271484 8.6875 L 9.2988281 3 L 2.3671875 3 z M 6.2070312 5 L 8.2558594 5 L 18.033203 19 L 16.001953 19 L 6.2070312 5 z"></path>
                            </svg>
                        </HoverItem>
                    </MenuItem>
                </MenuLink>

                <MenuLink to="/">
                    <MenuItem>
                        <HoverItem>
                            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                    d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" />
                            </svg>
                            <MenuSpan $active={location.pathname === "/"}>홈</MenuSpan>
                        </HoverItem>
                    </MenuItem>
                </MenuLink>

                <MenuLink to="/profile">
                    <MenuItem>
                        <HoverItem>
                            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                            </svg>
                            <MenuSpan $active={location.pathname === "/profile"}>프로필</MenuSpan>
                        </HoverItem>
                    </MenuItem>
                </MenuLink>

                <MenuItem onClick={onLogOut} className="log-out">
                    <HoverItem>
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" />
                            <path fillRule="evenodd" clipRule="evenodd"
                                d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" />
                        </svg>
                        <MenuSpan>로그아웃</MenuSpan>
                    </HoverItem>
                </MenuItem>
            </MenuInnerBox>

            <MenuInnerBox>
                {user && (
                    <MenuLink to="/profile">
                        <HoverItem>
                            <img
                                src={user.photoURL || "./public/UserCircle.svg"}
                                alt="프로필"
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />
                            <div style={{ display: "flex", flexDirection: "column", marginLeft: 10, justifyContent :"center" }}>
                                <strong>{user.displayName || "이름 없음"}</strong>
                                <span style={{ fontSize: "0.9rem", color: "gray" }}>
                                    {userHandle ? `@${userHandle}` : ""}
                                </span>
                            </div>
                        </HoverItem>
                    </MenuLink>
                )}
            </MenuInnerBox>
        </Menu>
    );
}
