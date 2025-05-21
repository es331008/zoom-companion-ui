import {useEffect, useState} from "react";
import {Navigate} from "react-router";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container, IconButton,
    Tooltip,
    Typography
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import zoomSdk from "@zoom/appssdk"
import {IGetMeetingContextResponse} from "../interfaces/zoomSdk/IGetMeetingContextResponse.ts";
import {IGetUserContextResponse} from "../interfaces/zoomSdk/IGetUserContextResponse.ts";
import {IGetMeetingJoinUrlResponse} from "../interfaces/zoomSdk/IGetMeetingJoinUrlResponse.ts";
import axios from 'axios';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [meetingContext, setMeetingContext] = useState<IGetMeetingContextResponse | null>(null);
    const [userContext, setUserContext] = useState<IGetUserContextResponse | null>(null);
    const [joinUrl, setJoinUrl] = useState<IGetMeetingJoinUrlResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const zoomCompanionReverseProxy = 'import.meta.env.VITE_ZOOM_COMPANION_REVERSE_PROXY';
    const zoomCompanionBotServiceContext = 'import.meta.env.VITE_ZOOM_COMPANION_BOT_SERVICE_CONTEXT';

    useEffect(() => {
        configureSdk()
            .then(async () => {
                try {
                    const [meeting, user, joinUrl] = await Promise.all([
                        zoomSdk.getMeetingContext(),
                        zoomSdk.getUserContext(),
                        zoomSdk.getMeetingJoinUrl(),
                    ]);

                    setMeetingContext(meeting);
                    setUserContext(user);
                    setJoinUrl(joinUrl);

                    setLoading(false);
                } catch (error) {
                    console.error("Zoom SDK calls failed:", error);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("SDK configuration failed:", err);
                setLoading(false);
            });
    }, [counter]);

    async function configureSdk() {
        const configTimer = setTimeout(() => {
            setCounter(counter + 1);
        }, 120 * 60 * 1000);

        try {
            const configResponse = await zoomSdk.config({
                capabilities: [
                    'getMeetingContext',
                    'getUserContext',
                    'getMeetingJoinUrl',
                ],
                version: "0.16.0",
            });
            console.log("App configured", configResponse);
        } catch (error) {
            console.log(error);
            setError("There was an error configuring the JS SDK (You're not running from within Zoom)");
            throw error;
        }
        return () => {
            clearTimeout(configTimer);
        };
    }

    const isUserHost = (): boolean => {
        return !(!userContext || !userContext.role.includes("host"));
    }

    const requestMeetingCompanion = async () => {
        try {
            const data = {
                "joinUrl": `${joinUrl?.joinUrl}`
            }
            await axios
                .post(`${zoomCompanionReverseProxy}${zoomCompanionBotServiceContext}/join-meeting`, data,)
                .then((response) => {
                    console.log(response.data)
                });
        } catch (error: any) {
            console.error('POST request failed:', error.response?.data || error.message);
            throw error;
        }
    }

    if (error) {
        return (
            <Container maxWidth="md" style={{ marginTop: "50px", textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!meetingContext && !loading) {
        return <Navigate to="/" replace />;
    }

    return (
        <Container maxWidth="md" style={{ marginTop: "75px", textAlign: "center" }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <Card sx={{ minWidth: 150 }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {meetingContext?.meetingTopic}
                        </Typography>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            mb={1.5}
                        >
                            <Typography sx={{ color: 'text.secondary' }} component="span">
                                {meetingContext?.meetingID}
                            </Typography>
                            <Tooltip title="Copy join link">
                                <IconButton
                                    size="small"
                                    sx={{ ml: 0.5 }}
                                    onClick={() =>
                                        navigator.clipboard.writeText(`${joinUrl?.joinUrl}`)
                                    }
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography variant="body2">
                            Meeting description goes here
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            disabled={!isUserHost()}
                            size="small"
                            onClick={requestMeetingCompanion}
                        >
                            Request Companion
                        </Button>
                    </CardActions>
                </Card>
            )}
        </Container>
    );
}

export default Home;
