import { test, expect } from '@playwright/test';
import getSeriesObservations from '../src/apis/getSeriesObservationApi.ts';
import { getAverage } from '../src/utils/common.ts';

test.describe.parallel('Series Observations Tests', () => {
    test('Verify Series Observations API 200 Success response for valid input @series1', async ({ }) => {
        const seriesNames = 'FXUSDCAD'; // Mandatory parameter
        const format = 'json'; // Mandatory parameter
        const options = {}; // Optional parameters
        let observationsResponse = await getSeriesObservations(seriesNames, format, options);

        //Assertions for response status
        expect.soft(observationsResponse.responseStatus).toBe(200);

        // Assertions for first level keys
        expect.soft(observationsResponse.response).not.toBeNull();
        expect.soft(observationsResponse.response.terms).not.toBeNull();
        expect.soft(observationsResponse.response.seriesDetail).not.toBeNull();
        expect.soft(observationsResponse.response.observations).not.toBeNull();

        //Assertions for terms object
        expect.soft(observationsResponse.response.terms.url).toBe('https://www.bankofcanada.ca/terms/');

        //Assertions for seriesDetails object
        expect.soft(observationsResponse.response.seriesDetail[seriesNames].label).toBe('USD/CAD');
        expect.soft(observationsResponse.response.seriesDetail[seriesNames].description).toBe('US dollar to Canadian dollar daily exchange rate');

        // Assertions for Observations array
        expect.soft(Array.isArray(observationsResponse.response.observations)).toBeTruthy();
        observationsResponse.response.observations.forEach(element => {
            expect.soft(element).toHaveProperty(seriesNames);
            expect.soft(parseFloat(element[seriesNames].v)).toBeGreaterThan(0);
            expect.soft(parseFloat(element.d)).not.toBeNull();
        });
    });

    test('Verify Series Observations API for last 10 weeks and calculate average @series2', async ({ }) => {
        const seriesNames = 'FXUSDCAD'; // Mandatory parameter
        const format = 'json'; // Mandatory parameter
        const options = {
            "recent_weeks": 10
        };  // Optional parameters
        let observationsResponse = await getSeriesObservations(seriesNames, format, options);

        //Assertions for response status and response body
        expect.soft(observationsResponse.responseStatus).toBe(200);
        expect.soft(observationsResponse.response).not.toBeNull();
        expect.soft(observationsResponse.response.terms).not.toBeNull();
        expect.soft(observationsResponse.response.seriesDetail).not.toBeNull();
        expect.soft(observationsResponse.response.observations).not.toBeNull();

        // Assertions for Observations array
        let observations = observationsResponse.response.observations;
        expect.soft(Array.isArray(observations)).toBeTruthy();
        
        // Get today's date and 10 weeks ago date
        const today = new Date();
        const tenWeeksAgo = new Date();
        tenWeeksAgo.setDate(today.getDate() - 10 * 7); // Subtract 10 weeks

        // Assert each observation date is within the last 10 weeks
        observations.forEach(observation => {
            const observationDate = new Date(observation.d);
            expect.soft(observationDate.getTime()).toBeGreaterThan(tenWeeksAgo.getTime());
            expect.soft(parseFloat(observation[seriesNames].v)).toBeGreaterThan(0);
        });

        // Extract rates from observations
        let extractedRates = observations.map(observation => parseFloat(observation[seriesNames].v));

        // calculate average rate
        let averageRate = getAverage(extractedRates);

        // Assert average rate is greater than 0
        console.log("Average USD to CAD average exchange rate in last 10 weeks: ", averageRate);
        expect.soft(averageRate).toBeGreaterThan(0);
    });
});