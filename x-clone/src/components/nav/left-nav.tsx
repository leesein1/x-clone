import { HoverItem, Menu, MenuInnerBox, MenuItem, MenuLink, MenuSpan } from "../design/layout-menu-design";
import { useLocation } from "react-router-dom";
import { auth } from "../../firebase";
import useUserInfo from "../user-info"; 

export default function LeftNav({onLogOut}: {onLogOut: () => void;}) {
    const location = useLocation();
    const user = auth.currentUser;
    const uid = auth.currentUser?.uid || null;
    const userInfo = useUserInfo(uid);

    return (
        <Menu id="menu-left">
            <MenuInnerBox id="left-menu-aNav">
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
                        {location.pathname === "/" ? (
                            <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clipRule="evenodd" fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"></path>
                            </svg>
                        ) : (
                            <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
                            </svg>
                        )}
                        <MenuSpan className="menu-span" $active={location.pathname === "/"}>홈</MenuSpan>
                        </HoverItem>
                    </MenuItem>
                </MenuLink>

                <MenuLink to={`/profile/${uid}`}>
                    <MenuItem>
                        <HoverItem>
                                {location.pathname.startsWith("/profile") ? (
                                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                                    </svg>
                                ) : (
                                    <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path>
                                    </svg>
                                )}
                            <MenuSpan className="menu-span" $active={location.pathname.startsWith("/profile")}>프로필</MenuSpan>
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
                        <MenuSpan className="menu-span">로그아웃</MenuSpan>
                    </HoverItem>
                </MenuItem>
            </MenuInnerBox>

            <MenuInnerBox id="left-profile">
                {user && (
                    <MenuLink to="/profile">
                        <HoverItem>
                            <img
                                src={userInfo?.photoURL || "./public/UserCircle.svg"}
                                alt="프로필"
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />
                            <div style={{ display: "flex", flexDirection: "column", marginLeft: 10, justifyContent :"center" }}>
                                <strong>{userInfo?.name || "이름 없음"}</strong>
                                <span style={{ fontSize: "0.9rem", color: "gray" }}>
                                    {userInfo?.handle ? `@${userInfo?.handle}` : ""}
                                </span>
                            </div>
                        </HoverItem>
                    </MenuLink>
                )}
            </MenuInnerBox>
        </Menu>
    );
}
