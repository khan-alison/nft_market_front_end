import { api } from 'services/api';

class HomepageServices {
  handleGetOverview = () => {
    return api.get('/overview');
  };
}

const homepageServices = new HomepageServices();

export default homepageServices;
