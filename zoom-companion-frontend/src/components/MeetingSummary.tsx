import {Box, Button, Divider, ListItem, Paper, Typography} from "@mui/material";

interface MeetingSummaryProps {
    meetingSummary: string;
}

const MeetingSummary = ({ meetingSummary }: MeetingSummaryProps) => {
    const cleaned = meetingSummary.replace(/\\n/g, '\n');
    const [summaryText, actionSection = ''] = cleaned.split(/Action Items:\s*/);

    // Extract bullet points from action items
    const actionItems = actionSection
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('*'))
        .map(line => line.replace(/^\*+\s+/, ''));


    const renderSmartActions = () => {
        const smartActions = actionItems.filter(item => /\bschedule\b/i.test(item));
        if (smartActions.length > 0) {
            return (
                <>
                    <Divider sx={{ marginY: 2 }}/>
                    <Typography variant="h6" gutterBottom>
                        Smart Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                        {smartActions.map((index) => (
                            <Button sx={{margin: 1}} key={index} variant='contained'>Schedule follow-up meeting</Button>
                        ))}
                    </Box>
                </>
            );
        }
    }

    return (
        <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
                Meeting Summary
            </Typography>
            <Typography variant="body1" sx={{ overflowY: 'auto', textAlign: 'left' }}>
                {summaryText.trim()}
            </Typography>

            <Divider sx={{ marginY: 2 }}/>
            <Typography variant="h6" gutterBottom>
                Action Items
            </Typography>
            {actionItems.length > 0 ? (
                <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                    {actionItems.map((item, index) => (
                        <ListItem
                            key={index}
                            component="li"
                            disableGutters
                            sx={{ display: 'list-item', pl: 0 }}
                        >
                            <Typography variant="body2">{item}</Typography>
                        </ListItem>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    None.
                </Typography>
            )}


            {renderSmartActions()}
        </Paper>
    );
}

export default MeetingSummary;