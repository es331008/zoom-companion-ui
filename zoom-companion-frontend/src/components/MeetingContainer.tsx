import {IMeeting} from "../interfaces/IMeeting.tsx";
import {Box, Paper, Typography} from "@mui/material";
import MeetingSummary from "./MeetingSummary.tsx";
import MeetingChatHistory from "./MeetingChatHistory.tsx";

interface MeetingContainerProps {
    meeting: IMeeting;
}

const MeetingContainer = ({ meeting }: MeetingContainerProps) => {
    return (
        <Box sx={{
            height: "100vh",
            padding: 3,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 3,
        }}>
            <Paper sx={{ padding: 2, width: "100%" }}>
                <Typography variant="h5">{meeting.meetingTopic}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    {meeting.meetingNumber}
                </Typography>
            </Paper>

            <Box sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 2,
                width: "100%",
                flexGrow: 1,
                overflow: "hidden",
            }}>
                <MeetingSummary meetingSummary={meeting.meetingSummary} />
                <MeetingChatHistory chatHistory={meeting.chatHistory} />
            </Box>
        </Box>
    );
};

export default MeetingContainer;