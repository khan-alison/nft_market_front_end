import { api } from 'services/api';

class LoginServices {
  handleLogin = (data: { signature: string; address: string; referrer?: string }) => {
    return api.post('auth/login', data);
  };
}

const loginServices = new LoginServices();

export default loginServices;
