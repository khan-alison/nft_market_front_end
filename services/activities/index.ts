import { api } from 'services/api';

class ActivitiesServices {
  handleGetPurchaseHistory = (params?: any) => {
    return api.get('transactions/purchase-histories', params);
  };

  handleGetSaleHistory = (params?: any) => {
    return api.get('transactions/sale-histories', params);
  };
}

const activitiesServices = new ActivitiesServices();

export default activitiesServices;
