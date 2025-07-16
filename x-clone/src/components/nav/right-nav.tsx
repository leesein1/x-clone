import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { MenuInnerBox, Menu, SearchWrapper, SearchIcon, SearchInput, SearchResult, SearchBox} from "../design/layout-menu-design";
import SearchResultItem from "../serach-result-item";
import RightSuggestComp from "./right-nav-suggest";

export default function RightNav() {
    const [focused, setFocused] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);


    const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();

            if (!value) {
                setSearchResults([]);
            return;
        }

        let q;

        if (value.includes("@")) {
            const handlePrefix = value.replace("@", "");
            q = query(
                collection(db, "users"),
                where("handle", ">=", handlePrefix),
                where("handle", "<", handlePrefix + "\uf8ff")
            );
        } else {
            q = query(
                collection(db, "users"),
                where("name", ">=", value),
                where("name", "<", value + "\uf8ff")
            );
        }

        try {
            const snapshot = await getDocs(q);
            const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSearchResults(results);
        } catch (err) {
            console.error("검색 중 오류 발생:", err);
            setSearchResults([]);
        }
    };

    return (
        <Menu id="menu-right">
            <MenuInnerBox id="menu-right-inner">
                <SearchWrapper>
                    <SearchBox $focused={focused}>
                        <SearchIcon>
                        <svg
                            data-slot="icon"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                            ></path>
                        </svg>
                        </SearchIcon>
                        <SearchInput
                        onChange={onSearch}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 200)}
                        placeholder="검색"
                        />
                    </SearchBox>

                    <SearchResult $focused={focused}>
                        {searchResults.length === 0 ? (
                            <div style={{ padding: "10px", color: "gray" }}>검색 결과 없음</div>
                        ) : (
                            searchResults.map((user) => (
                            <SearchResultItem
                                key={user.id}
                                name={user.name}
                                handle={user.handle}
                                photoURL={user.photoURL}
                                uid={user.uid}
                            />
                            ))
                        )}
                    </SearchResult>
                </SearchWrapper>

                <RightSuggestComp >

                </RightSuggestComp>
            </MenuInnerBox>
        </Menu>
    );
}