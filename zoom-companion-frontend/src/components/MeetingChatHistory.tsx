import {Box, Paper, Typography} from "@mui/material";
import MeetingChatMessage from "./MeetingChatMessage.tsx";
import {IMeetingChatMessage} from "../interfaces/IMeetingChatMessage.tsx";

interface MeetingChatHistoryProps {
    chatHistory: IMeetingChatMessage[];
}

const MeetingChatHistory = ({ chatHistory }: MeetingChatHistoryProps) => {
    return (
        <Paper sx={{ padding: 2, height: "100%", overflowY: "auto"}} variant="outlined">
            <Typography variant="h6">Chat History</Typography>
            <Box sx={{ marginTop: 2, height: "100%"}}>
                {chatHistory.map((chatMessage, index) => (
                    <MeetingChatMessage key={index} chatMessage={chatMessage} />
                ))}
            </Box>
        </Paper>
    );
}

export default MeetingChatHistory;