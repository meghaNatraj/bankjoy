import { test, expect } from '@playwright/test';
import getSeriesObservations from '../src/apis/getSeriesObservationApi.ts';
import { getAverage } from '../src/utils/common.ts';
import inputData from '../test-data/input.json';

let seriesData = inputData.seriesData; // Get series data from input.json file
test.describe('Series Observations Tests', () => {
    seriesData.forEach(({ seriesName, label, description }) => { // Loop through series data
        test(`Verify Series Observations API 200 Success response for valid input | Series name : ${seriesName} [@series1]`, async ({ }) => {
            const seriesNames = seriesName; // Mandatory parameter
            const format = 'json'; // Mandatory parameter
            const options = {}; // Optional parameters
            let observationsResponse = await getSeriesObservations(seriesName, format, options);

            await test.step("Assertions for response status", async () => {
                expect.soft(observationsResponse.responseStatus).toBe(200);
            });

            await test.step("Assertions for first level keys", async () => {
                expect.soft(observationsResponse.response).not.toBeNull();
                expect.soft(observationsResponse.response.terms).not.toBeNull();
                expect.soft(observationsResponse.response.seriesDetail).not.toBeNull();
                expect.soft(observationsResponse.response.observations).not.toBeNull();
            });

            await test.step("Assertions for terms object", async () => {
                expect.soft(observationsResponse.response.terms.url).toBe('https://www.bankofcanada.ca/terms/');
            });

            await test.step("Assertions for seriesDetails object", async () => {
                expect.soft(observationsResponse.response.seriesDetail[seriesNames].label).toBe(label);
                expect.soft(observationsResponse.response.seriesDetail[seriesNames].description).toBe(description);
            });

            await test.step("Assertions for Observations array", async () => {
                expect.soft(Array.isArray(observationsResponse.response.observations)).toBeTruthy();
                observationsResponse.response.observations.forEach(element => {
                    expect.soft(element).toHaveProperty(seriesNames);
                    expect.soft(parseFloat(element[seriesNames].v)).toBeGreaterThan(0);
                    expect.soft(parseFloat(element.d)).not.toBeNull();
                });
            });
        });
    });

    test('Verify Series Observations API for last 10 weeks and calculate average [@series2]', async ({ }) => {
        const seriesNames = 'FXUSDCAD'; // Mandatory parameter
        const format = 'json'; // Mandatory parameter
        const options = {
            "recent_weeks": 10
        };  // Optional parameters
        let observationsResponse = await getSeriesObservations(seriesNames, format, options);

        //Assertions for response status and response body
        await test.step("Assertions for response status and response body", async () => {
            expect.soft(observationsResponse.responseStatus).toBe(200);
            expect.soft(observationsResponse.response).not.toBeNull();
            expect.soft(observationsResponse.response.terms).not.toBeNull();
            expect.soft(observationsResponse.response.seriesDetail).not.toBeNull();
            expect.soft(observationsResponse.response.observations).not.toBeNull();
        });

        let observations = observationsResponse.response.observations;
        await test.step("Assertions for Observations array", async () => {
            expect.soft(Array.isArray(observations)).toBeTruthy();

            // Get today's date and 10 weeks ago date
            const today = new Date();
            const tenWeeksAgo = new Date();
            tenWeeksAgo.setDate(today.getDate() - 10 * 7 - 1); // Subtract 10 weeks
            
            // Assert each observation date is within the last 10 weeks
            observations.forEach(observation => {
                const observationDate = new Date(observation.d);
                expect.soft(observationDate.getTime()).toBeGreaterThan(tenWeeksAgo.getTime());
                expect.soft(parseFloat(observation[seriesNames].v)).toBeGreaterThan(0);
            });
        });

        await test.step("Calculate average exchange rate", async () => {
            // Extract rates from observations
            let extractedRates = observations.map(observation => parseFloat(observation[seriesNames].v));

            // calculate average rate
            let averageRate = getAverage(extractedRates);

            // Assert average rate is greater than 0
            console.log("Average USD to CAD average exchange rate in last 10 weeks: ", averageRate);
            expect.soft(averageRate).toBeGreaterThan(0);
        });
    });

    // Negative test case
    test('Verify Series Observations API 404 response for invalid series name [@series3]', async ({ }) => {
        const seriesName = 'invalidSeriesName'; // Invalid series name
        const format = 'json'; // Mandatory parameter
        const options = {}; // Optional parameters
        let observationsResponse = await getSeriesObservations(seriesName, format, options);

        //Assertions for response status
        expect.soft(observationsResponse.responseStatus).toBe(404);
        expect.soft(observationsResponse.response.message).toBe(`Series ${seriesName} not found.`);
    });

    test('Verify Series Observations API 404 response for missing series name [@series4]', async ({ }) => {
        const format = 'json'; // Mandatory parameter
        const options = {}; // Optional parameters
        let observationsResponse = await getSeriesObservations('', format, options);

        //Assertions for response status
        expect.soft(observationsResponse.responseStatus).toBe(404);
        expect.soft(observationsResponse.response.message).toBe('Series json not found.');
    });

    test('Verify Series Observations API 400 response for invalid format [@series5]', async ({ }) => {
        const seriesName = 'FXUSDCAD'; // Mandatory parameter
        const format = 'invalidFormat'; // Invalid format
        const options = {}; // Optional parameters
        let observationsResponse = await getSeriesObservations(seriesName, format, options);

        //Assertions for response status
        expect.soft(observationsResponse.responseStatus).toBe(400);
        expect.soft(observationsResponse.response.message).toBe('Bad output format (invalidformat) requested.');
    });

    test('Verify Series Observations API 400 response for invalid optional parameter [@series6]', async ({ }) => {
        const seriesName = 'FXUSDCAD'; // Mandatory parameter
        const format = 'json'; // Mandatory parameter
        const options = {
            "invalidParam": 10
        }; // Invalid optional parameter
        let observationsResponse = await getSeriesObservations(seriesName, format, options);

        //Assertions for response status
        expect.soft(observationsResponse.responseStatus).toBe(400);
        expect.soft(observationsResponse.response.message).toBe('The following query parameters are invalid: invalidParam');
    });

    test('Verify Series Observations API 400 response for invalid optional parameter value [@series7]', async ({ }) => {
        const seriesName = 'FXUSDCAD'; // Mandatory parameter
        const format = 'json'; // Mandatory parameter
        const options = {
            "recent_weeks": -10
        }; // Invalid optional parameter value
        let observationsResponse = await getSeriesObservations(seriesName, format, options);

        //Assertions for response status
        expect.soft(observationsResponse.responseStatus).toBe(400);
        expect.soft(observationsResponse.response.message).toBe('Bad recent observations request parameters, you cannot have a recent value less than one');
    });
});