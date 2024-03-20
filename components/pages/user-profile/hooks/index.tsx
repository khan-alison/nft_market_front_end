import showMessage from '@components//Message';
import { renderURLs, routeURLs } from 'constants/routes';
import TYPE_CONSTANTS from 'constants/type';
import { useAppSelector } from 'hooks/useStore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { storeGlobal } from 'redux/configStore';
import { handleGetProfile } from 'redux/page/slice';
import accountServices from 'services/account';
import { checkSuccessRequest, getToken } from 'services/api';

export const useGetUserProfile = (token: string) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleGetUserProfile = async () => {
    getToken(token);

    return token !== '' ? await accountServices.getUserProfile() : null;
  };

  const getUserProfile = useQuery(['getProfile', token], handleGetUserProfile, {
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      storeGlobal?.dispatch(handleGetProfile(res?.data));
      setUserProfile(res?.data);
    },
    onError: (error: any) => console.log(error, 'error'),
  });

  return {
    userProfile,
    onGetUserProfile: getUserProfile,
  };
};

export const useReferrerUser = (referrer: string) => {
  const [checkIsSuccess, setCheckIsSuccess] = useState(true);
  const handleCheckReferrer = async () => {
    return await accountServices.checkReferrer(referrer);
  };

  const checkReferrerUser = useQuery(['checkReferrer', referrer], handleCheckReferrer, {
    refetchOnWindowFocus: false,
    enabled: !!referrer,

    onSuccess: (res: any) => {
      setCheckIsSuccess(checkSuccessRequest(res));
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
  return {
    checkIsSuccess,
    checkReferrerUser: checkReferrerUser,
  };
};

export const useKYC = () => {
  const [infoKyc, setInfoKyc] = useState<any>({});
  const [checkKyc, setCheckKyc] = useState(false);

  const handleKyc = useMutation(
    async (params: any) => {
      try {
        const response = await accountServices.requestKyc(params);
        return { response };
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (res: any) => {
        const info = res.response.data.document.inference.prediction || '';
        if (info !== '') {
          let fullName = ''
          info?.given_names?.map((name: any) => {
            fullName += name.value + " ";
          })
          setCheckKyc(true);

          setInfoKyc({
            birth_date: info.birth_date.value || '',
            birth_place: info.birth_place.value || '',
            country: info.country.value || '',
            expiry_date: info.expiry_date.value || '',
            id_number: info.id_number.value || '',
            issuance_date: info.issuance_date.value || '',
            issuance_place: info.issuance_place.value || '',
            given_names: fullName || ''
          })
        }
      },
    },
  );

  return {
    infoKyc,
    checkKyc,
    setCheckKyc,
    onKyc: handleKyc.mutate,
  };
};

export const useSubmitKYC = () => {
  const router = useRouter();

  const handleSubmitKyc = useMutation(
    async (params: any) => {
      try {
        const response = await accountServices.verifyKyc(params);
        return { response };
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (res: any) => {
        router.push(routeURLs.HOME);
        showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S12');
      },
    },
  );

  return {
    onSubmitKyc: handleSubmitKyc.mutate,
  };
};