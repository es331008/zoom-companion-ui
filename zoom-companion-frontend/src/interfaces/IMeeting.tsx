import {IMeetingChatMessage} from "./IMeetingChatMessage.tsx";

export interface IMeeting {
    meetingTopic: string;
    meetingNumber: string;
    chatHistory: IMeetingChatMessage[];
    meetingSummary: string;
}
