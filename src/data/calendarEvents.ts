export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    desc: string;
}

export const initialEvents: CalendarEvent[] = [
    {
        id: 1,
        title: 'Initial Meeting with Investor A',
        start: new Date(2025, 0, 15, 10, 0), // Jan 15, 2025, 10:00 AM
        end: new Date(2025, 0, 15, 11, 0),
        desc: 'Discussing initial seeds funding round.',
    },
    {
        id: 2,
        title: 'Product Demo',
        start: new Date(2025, 0, 16, 14, 0),
        end: new Date(2025, 0, 16, 15, 0),
        desc: 'Showing the MVP.',
    },
];
