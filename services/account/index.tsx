import { api } from 'services/api';

class AccountServices {
  getUserProfile = () => {
    return api.get('users/profile');
  };

  checkReferrer = (referrer: string) => {
    return api.get(`users/${referrer}`);
  };
  requestKyc = (param: any) => {
    return api.post('users/upload', param);
  };
  verifyKyc = (param: any) => {
    return api.post('users/verify-kyc', param);
  }
}

const accountServices = new AccountServices();

export default accountServices;
