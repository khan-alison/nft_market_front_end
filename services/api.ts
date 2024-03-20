import { i18n } from 'next-i18next';
import { throttle } from 'lodash';
import axios from 'axios';

import showMessage from 'components/Message';

import { storeGlobal } from 'redux/configStore';
import { handleRemoveAddressNetwork, handleSetAddressNetwork } from 'redux/address/slice';
import { handleSetAuthenticationToken } from 'redux/authentication/slice';

import validate from 'utils/validate';

import TYPE_CONSTANTS from 'constants/type';
import HTTP_STATUS_CONTSTANTS from 'constants/httpStatus';

const typeOfMessage = TYPE_CONSTANTS.MESSAGE;

const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
} as any;

const HEADERS_MULTIPLE_PART = {
  ...HEADERS,
  'Content-Type': 'multipart/form-data; boundary=something',
  Accept: 'application/json',
};

export const getToken = (token: any) => {
  HEADERS['Authorization'] = `Bearer ${token}`;
  HEADERS_MULTIPLE_PART['Authorization'] = `Bearer ${token}`;
};

const getFullUrl = (url: string) => {
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  return `${process.env.NEXT_PUBLIC_APP_API}` + url;
};

const resetToLogin = () => {
  const address = storeGlobal?.getState()?.AddressSlice?.address;

  storeGlobal?.dispatch(handleSetAddressNetwork({}));
  storeGlobal?.dispatch(handleSetAuthenticationToken(''));
  storeGlobal?.dispatch(handleRemoveAddressNetwork({ address }));
};

const throttledResetToLogin = throttle(resetToLogin, 500, {
  leading: false,
  trailing: true,
}) as any;

const checkErrorNetwork = (err: any) => {
  if (err?.toJSON() && err.toJSON().message === 'Network Error') {
    return showMessage(typeOfMessage.ERROR, i18n?.t(`message.E3`));
  }
  return err;
};

export const excludeResponse = ['empty_response'];

export const checkSusscessRequest = (response: any) => {
  return response?.status < HTTP_STATUS_CONTSTANTS.ERROR;
};

const checkErrorStatus = (
  response: any,
  options?: {
    isHideErrorMessage?: any;
  },
) => {
  if (response?.status >= HTTP_STATUS_CONTSTANTS.ERROR && !excludeResponse.includes(response?.data?.code)) {
    if (HTTP_STATUS_CONTSTANTS.SERVER_ERROR !== response?.data?.code) {
      !options?.isHideErrorMessage &&
        showMessage(
          typeOfMessage.ERROR,
          response?.data?.code ? `message.${response?.data?.code}` : `message.${response?.code}`,
          response?.meta?.extraInfo,
        );
    } else {
      !options?.isHideErrorMessage && showMessage(typeOfMessage.ERROR, response?.meta?.msg);
    }
  }
  return response;
};

const checkErrorStatusImg = (
  response: any,
  options?: {
    isHideErrorMessage?: any;
  },
) => {
  if (response?.status >= HTTP_STATUS_CONTSTANTS.ERROR && !excludeResponse.includes(response?.data?.code)) {
    if (HTTP_STATUS_CONTSTANTS.SERVER_ERROR !== response?.data?.code) {
      !options?.isHideErrorMessage &&
      showMessage(typeOfMessage.ERROR, "Image is Error !")
    } else {
      !options?.isHideErrorMessage && showMessage(typeOfMessage.ERROR, response?.meta?.msg);
    }
  }
  return response;
};

export const checkSuccessRequest = (response: any) => {
  return response?.status < HTTP_STATUS_CONTSTANTS.ERROR;
};

const checkExpiredOrAuthorization = (response: any) => {
  return HTTP_STATUS_CONTSTANTS.ERROR_CODE_401 === response?.status;
};

const api = {
  postImg: (endpoint: string, params?: any, options?: any) => {
    return axios
      .post(getFullUrl(endpoint), params, {
        headers: HEADERS_MULTIPLE_PART,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return response?.data;
          }
         
          return checkErrorStatusImg(response, options);
        },
        (err: any) => {
          // return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
          throw err;
        },
      )
      .catch((response: any) => {        
        return response.data;
      });
  },
  post: (endpoint: string, params?: any, options?: any) => {
    return axios
      .post(getFullUrl(endpoint), params, {
        headers: HEADERS,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return response?.data;
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
        },
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  postMultiplePart: (endpoint: string, params?: any, options?: any) => {
    return axios
      .post(getFullUrl(endpoint), params, {
        headers: HEADERS_MULTIPLE_PART,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return response?.data;
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
        },
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  get: (endpoint: string, params: any = {}, options?: any) => {
    return axios
      .get(getFullUrl(endpoint), {
        params: params,
        headers: HEADERS,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
        },
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  put: (endpoint: string, params?: any, options?: any) => {
    return axios
      .put(getFullUrl(endpoint), params, {
        headers: HEADERS,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
        },
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  patch: (endpoint: string, params?: any, options?: any) => {
    return axios
      .patch(getFullUrl(endpoint), params, {
        headers: HEADERS,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
        },
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  patchMultipart: (endpoint: string, params?: any, options?: any) => {
    return axios
      .patch(getFullUrl(endpoint), params, {
        headers: HEADERS_MULTIPLE_PART,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
        },
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  delete: (endpoint: string, params?: any, options?: any) => {
    return axios
      .delete(getFullUrl(endpoint), {
        params: params,
        headers: HEADERS,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return response?.data;
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
        },
      )
      .catch((response: any) => {
        return response.data;
      });
  },
};

const apiCustom = {
  get: (endpoint: string, params: any = {}, options?: any) => {
    return axios
      .get(endpoint, {
        params: params,
        headers: HEADERS,
        validateStatus: (status: any) => validate.validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response?.data, options);
        },
        (err: any) => {
          return (err?.response?.data && checkErrorStatus(err.response.data, options)) || checkErrorNetwork(err);
        },
      )
      .catch((response: any) => {
        return response.data;
      });
  },
};

export { api, apiCustom };
