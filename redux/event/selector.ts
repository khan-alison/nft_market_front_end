import { Event } from './slice';

const selectedEvent = {
  getEvent: (state: any) => state?.EventSlice as Event,
};

export default selectedEvent;
