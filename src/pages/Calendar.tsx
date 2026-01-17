import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';
import { MeetingModal } from '../components/calendar/MeetingModal';
import { initialEvents } from '../data/calendarEvents';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});



export const Calendar: React.FC = () => {
    const [events, setEvents] = useState(initialEvents);
    const [view, setView] = useState<View>('month');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        setSelectedSlot(slotInfo);
        setIsModalOpen(true);
    };

    const handleAddMeeting = (title: string, start: Date, end: Date) => {
        setEvents([
            ...events,
            {
                start,
                end,
                title,
                id: events.length + 1,
                desc: '',
            },
        ]);
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Schedule</h1>
                    <p className="text-secondary-500">Manage your meetings and availability.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => {
                        const now = new Date();
                        const end = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
                        handleSelectSlot({ start: now, end });
                    }}
                >
                    + New Meeting
                </button>
            </div>

            <div className="card h-[600px] bg-white p-4">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    view={view}
                    onView={setView}
                    views={['month', 'week', 'day', 'agenda']}
                    selectable
                    onSelectEvent={(event) => alert(event.title)}
                    onSelectSlot={handleSelectSlot}
                />
            </div>

            {selectedSlot && (
                <MeetingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddMeeting}
                    initialStart={selectedSlot.start}
                    initialEnd={selectedSlot.end}
                />
            )}
        </div>
    );
};
