import { test, expect } from '@playwright/test';
import getSeriesObservations from '../src/apis/seriesObservationApi.ts';

test.describe('Series Observations Tests', () => {
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
        expect.soft(observationsResponse.response.seriesDetail[`${seriesNames}`].label).toBe('USD/CAD');
        expect.soft(observationsResponse.response.seriesDetail[`${seriesNames}`].description).toBe('US dollar to Canadian dollar daily exchange rate');

        // Assertions for Observations array
        expect.soft(Array.isArray(observationsResponse.response.observations)).toBeTruthy();
        observationsResponse.response.observations.forEach(element => {
            expect.soft(element).toHaveProperty(seriesNames);
            expect.soft(parseFloat(element[`${seriesNames}`].v)).toBeGreaterThan(0);
            expect.soft(parseFloat(element[`d`])).not.toBeNull();
        });
    });
});