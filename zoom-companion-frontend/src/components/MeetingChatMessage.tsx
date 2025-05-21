import {Box, Paper, Typography} from "@mui/material";
import {IMeetingChatMessage} from "../interfaces/IMeetingChatMessage.tsx";

interface MeetingChatMessageProps {
    chatMessage: IMeetingChatMessage;
}

const MeetingChatMessage = ({ chatMessage }: MeetingChatMessageProps) => {
    const messageDate = new Date(Number(chatMessage.timestamp) * 1000);
    const messageTime = messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    // Quick hack to pick a user to identify as "me"
    const MY_USER_ID = 16778240;
    const isMe = chatMessage.senderId === MY_USER_ID;
    const bgColor = isMe ? '#61a7ed' : '#c3c3c3';
    const alignStyle = isMe ? 'flex-end' : 'flex-start';
    const borderRadius = isMe ? '16px 0 16px 16px' : '0 16px 16px 16px';

    return (
        <Box sx={{ display: 'flex', justifyContent: alignStyle, mb: 2 }}>
            <Paper
                sx={{
                    backgroundColor: bgColor,
                    padding: 2,
                    width: '75%',
                    borderRadius: borderRadius,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2">
                        {isMe ? 'You' : chatMessage.senderName}
                    </Typography>
                    <Typography variant="caption">
                        {messageTime}
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{ textAlign: 'left', wordWrap: 'break-word' }}>
                    {chatMessage.message}
                </Typography>
            </Paper>
        </Box>
    );
}

export default MeetingChatMessage;