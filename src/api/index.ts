import { requester } from "../lib";

export async function welcomeMailRequest(data: { [x: string]: unknown }) {
    const response = await requester.post("/invitation", data);
    return response.data;
}

export async function getTopicRequest(data: { [x: string]: unknown }) {
    const response = await requester.post("/invitation/topic", data);
    return response.data;
}

export async function checkRequest(data: { [x: string]: unknown }) {
    const response = await requester.post("/invitation/check", data);
    return response.data;
}
