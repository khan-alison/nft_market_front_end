import { api } from 'services/api';

class ConfigServices {
  handleGetConfig = () => {
    return api.get('config');
  };
}

const configServices = new ConfigServices();

export default configServices;
