
interface SearchResultItemProps {
    name: string;
    handle: string;
    photoURL?: string;
}

export default function SearchResultItem({ name, handle, photoURL }: SearchResultItemProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                gap: "10px",
            }}
        >
        <img
            src={photoURL || "/UserCircle.svg"}
            alt="프로필"
            onError={(e) => {
            e.currentTarget.src = "/UserCircle.svg";
            }}
            style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            objectFit: "cover",
            backgroundColor: "#eee",
            }}
        />
            <div style={{ display: "flex", flexDirection: "column" }}>
                <strong>{name}</strong>
                <span style={{ fontSize: "0.9rem", color: "gray" }}>@{handle}</span>
            </div>
        </div>
    );
}
