import {List, Typography} from "@mui/material";
import MeetingListItem from "./MeetingListItem";
import {IMeetingListData} from "../interfaces/IMeetingListData.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

const MeetingList = () => {
    const [meetings, setMeetings] = useState<IMeetingListData[] | null>(null);
    const [loading, setLoading] = useState(true);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfLast7Days = new Date(startOfToday);
    startOfLast7Days.setDate(startOfLast7Days.getDate() - 7);

    const today: IMeetingListData[] = [];
    const yesterday: IMeetingListData[] = [];
    const last7Days: IMeetingListData[] = [];
    const older: IMeetingListData[] = [];

    useEffect(() => {
        axios.get(`/api/get-meeting-list`)
            .then(response => {
                console.log(response.data)
                setMeetings(response.data);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    meetings?.forEach((meeting) => {
        const meetingDate = new Date(meeting.start_time * 1000);

        console.log(meetingDate)
        if (meetingDate >= startOfToday) {
            today.push(meeting);
        } else if (meetingDate >= startOfYesterday) {
            yesterday.push(meeting);
        } else if (meetingDate >= startOfLast7Days) {
            last7Days.push(meeting);
        } else {
            older.push(meeting)
        }
    });

    today.sort((a, b) => b.start_time - a.start_time);
    yesterday.sort((a, b) => b.start_time - a.start_time);
    last7Days.sort((a, b) => b.start_time - a.start_time);
    older.sort((a, b) => b.start_time - a.start_time);

    const renderSection = (title: string, items: IMeetingListData[]) => {
        if (items.length === 0) return null;
        return (
            <>
                <Typography variant="subtitle2" className="drawer-date-header">
                    {title}
                </Typography>
                <List>
                    {items.map((meeting, index) => (
                        <MeetingListItem key={index} meeting={meeting} />
                    ))}
                </List>
            </>
        );
    };

    if (loading) return <div>Loading...</div>;

    if (!meetings || meetings.length === 0) {
        return <div>No meetings found.</div>;
    }

    return (
        <div className="drawer-date-container">
            {renderSection("Today", today)}
            {renderSection("Yesterday", yesterday)}
            {renderSection("Last 7 Days", last7Days)}
            {renderSection("Older", older)}
        </div>
    );
};

export default MeetingList;
