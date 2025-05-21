import {useLocation, useNavigate} from "react-router";
import {ListItemButton, ListItemText, Tooltip, Typography} from "@mui/material";
import {IMeetingListData} from "../interfaces/IMeetingListData.tsx";

interface MeetingListItemProps {
    meeting: IMeetingListData;
}

const MeetingListItem = ({ meeting }: MeetingListItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isSelected = location.pathname === `/meeting/${meeting.meetingId}`;

    const meetingDate = new Date(meeting.start_time * 1000);
    const formattedDate = meetingDate.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const formattedTime = meetingDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <Tooltip title={meeting.meetingTopic} arrow placement="right">
            <ListItemButton
                selected={isSelected}
                onClick={() => navigate(`/meeting/${meeting.meetingId}_${meeting.start_time}`)}
            >
                <ListItemText
                    primary={
                        <Typography
                            variant="body1"
                            noWrap
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minHeight: "24px",
                            }}
                        >
                            {meeting.meetingTopic}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" color="text.secondary">
                            {`${formattedDate} @ ${formattedTime}`}
                        </Typography>
                    }
                />
            </ListItemButton>
        </Tooltip>
    );
};

export default MeetingListItem;
