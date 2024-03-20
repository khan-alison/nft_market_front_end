import { api } from 'services/api';

class TransactionServices {
  handleGetTransactionOverview = () => {
    return api.get('transactions/overview');
  };

  handleCreateTransaction = (data: any) => {
    return api.post('transactions', data);
  };

  handleUpdateTransaction = (id: string, data: any) => {
    return api.patch(`transactions/${id}`, data);
  };

  handleUpdateTransactionHash = (id: string, data: any) => {
    return api.patch(`transactions/${id}/hash`, data, { isHideErrorMessage: true });
  };

  handleGetListPurchaseHistory = (params: any) => {
    return api.get('transactions/purchase-histories', params);
  };
}

const transactionServices = new TransactionServices();

export default transactionServices;
