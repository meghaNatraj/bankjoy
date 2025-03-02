import { request } from '@playwright/test';

const GET = async (requestData: any) => {
    const apiContext = await request.newContext({});
    let url: string;    
    url = process.env.BASE_URL + requestData.url;

    // GET REQUEST
    const call = await apiContext.get(`${url}`, {
        headers: requestData.headers,
    });
    const response = await call.text();
    let parsedResponse : any;
    try{
    parsedResponse = JSON.parse(response);
    } catch (e) {
        console.log("Error parsing GET response: ", e);
    }
    return { response: parsedResponse, responseStatus: call.status() };
};

export default GET;
