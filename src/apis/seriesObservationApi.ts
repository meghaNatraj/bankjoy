import GET from '../core/get.ts';

//GET Series Observations API Call
export const getSeriesObservations = async (seriesNames: string, format: string, optionalParams: Record<string, string | number> = {}) => {
    let url = `/observations/${seriesNames}/${format}`;
    const searchParams = new URLSearchParams();
    if (optionalParams && Object.keys(optionalParams).length > 0) {
        for (const key in optionalParams) {
            searchParams.append(key, optionalParams[key].toString());
        }
        url += `?${searchParams.toString()}`;
    }
    let requestData = {
        url: url,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const response = await GET(requestData);
    return response;
};

export default getSeriesObservations;