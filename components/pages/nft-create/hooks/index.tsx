import showMessage from "@components//Message";
import { renderURLs, routeURLs } from "constants/routes";
import TYPE_CONSTANTS from "constants/type";
import { get } from "lodash";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { checkSuccessRequest, checkSusscessRequest } from "services/api";
import nftServices from "services/nft";
import transactionServices from "services/transaction";

export const useCreateNFT = () => {
  const router = useRouter();

    const handleCreateNFT = useMutation(
        async (params: any) => {
          try {
            const response = await nftServices.handleCreateNFT(params);
            const isSellOrder = params?.isSellOrder;
            return { response, isSellOrder };
          } catch (error) {
            throw error;
          }
        },
        {
          onSuccess: (res: any) => {
            if (checkSusscessRequest(res?.response)) {
              const idNft = get(res, 'response.data._id') || "";

              showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S9');
              router.push(renderURLs.NFT_DETAIL(idNft));
            }
          },
        },
      );

      const handleUploadImg = useMutation(
        async (param: any) => {
          const formData = new FormData();
          formData.append('file', param?.file);          
          try {
            const response = await nftServices.handleUploadImg(formData);
            const onTransaction = param.onTransaction
            return { response ,onTransaction};
          } catch (error) {
            throw error;
          }
        },
        {
          onSuccess: (res: any) => {
            if (checkSusscessRequest(res?.response)) {
              const dataRequest = get(res, 'response.data.image') || "";
              
              showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S8');
              res.onTransaction.onSuccess && res.onTransaction.onSuccess(dataRequest)
            }else {
              res.onTransaction.onError && res.onTransaction.onError();
            }
          },
          onError: (err: any) => {
            console.log(err);
            
            if (checkSusscessRequest(err?.response)) {
              showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, err ? 'message.S5' : 'message.S2');
            }
          },
        },
      );
  
    return {
      onCreateNFT: handleCreateNFT.mutate,
      onUploadImg: handleUploadImg.mutate
    };
  };