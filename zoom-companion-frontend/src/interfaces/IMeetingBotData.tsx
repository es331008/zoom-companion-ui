import {IMeetingChatMessage} from "./IMeetingChatMessage.tsx";

export interface IMeetingBotData {
    chatHistory: IMeetingChatMessage[];
    meetingSummary: string;
}
