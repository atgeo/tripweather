declare module 'weather-js' {
    export interface ForecastItem {
        low: string;
        high: string;
        skycodeday: string;
        skytextday: string;
        date: string;
        day: string;
        shortday: string;
        precip: string;
    }

    export interface ResultObject {
        location: {
            name: string;
            lat: string;
            long: string;
            timezone: string;
            alert: string;
            degreetype: string;
            imagerelativeurl: string;
        };
        current: {
            temperature: string;
            skycode: string;
            skytext: string;
            date: string;
            observationtime: string;
            observationpoint: string;
            feelslike: string;
            humidity: string;
            winddisplay: string;
            day: string;
            shortday: string;
            windspeed: string;
            imageUrl: string;
        };
        forecast: ForecastItem[];
    }

    export function find(options: { search: string; degreeType?: string }, callback: (err: any, result: ResultObject[]) => void): void;
}