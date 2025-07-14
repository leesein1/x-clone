import { ActionIcon, IconButton } from "../design/tweet-design";

export default function TweetReplyEdit({ onClick }: { onClick: () => void }) {
    return (
        <ActionIcon onClick={(e) => e.stopPropagation()}>
            <IconButton onClick={onClick}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.123 2.123 0 113.001 3.001L7.5 18.75H4.5v-3l12.362-12.263z" />
                </svg>
            </IconButton>
        </ActionIcon>
    );
}
