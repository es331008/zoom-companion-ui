import {CircularProgress, Container, Typography} from "@mui/material";
import {Navigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {IMeeting} from "../interfaces/IMeeting.tsx";
import MeetingContainer from "../components/MeetingContainer.tsx";
import axios from "axios";

const Meeting = () => {
    let { meetingKey } = useParams();
    const [loading, setLoading] = useState(true);
    const [meetingData, setMeetingData] = useState<IMeeting | null>(null);

    useEffect(() => {
        if (!meetingKey) return;

        const [meetingId, startTime] = meetingKey.split('_');

        axios.get(`/api/get-meeting-data`, {
                params: {
                    meetingId: meetingId,
                    startTime: startTime,
                },
            })
            .then(response => {
                setMeetingData(response.data);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [meetingKey]);

    if (!meetingKey) return <Navigate to="/" replace />;

    return (
        <Container style={{ height: '100vh', textAlign: "center" }}>
            {loading ? (
                <CircularProgress />
            ) : meetingData === null ? (
                <Typography>No meeting data found.</Typography>
            ) : (
                <MeetingContainer meeting={meetingData} />
            )}
        </Container>
    );
}

export default Meeting;
