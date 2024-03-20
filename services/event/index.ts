import { api } from 'services/api';

class EventServices {
  handleGetList = (params: any) => {
    return api.get('events', params);
  };

  handleGetEventDetail = (id: string) => {
    return api.get(`events/${id}`);
  };
}

const eventServices = new EventServices();

export default eventServices;
