import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';
import { DEFAULT_RPC721, MAX_ALLOWANCE } from 'connectors/constants';
import Erc1155ABI from 'constants/abi/erc1155abi.json';
import Erc20ABI from 'constants/abi/erc20abi.json';
import Erc721ABI from 'constants/abi/erc721abi.json';
import ExchangeABI from 'constants/abi/exchange.json';
import ProxyABI from 'constants/abi/proxy.json';
import NFTMarketplace from 'constants/abi/NFTMarketplace.json';

import { WALLET_STATUS } from 'constants/common';
import { NFT_STANDARD, NFT_TRANSACTION_STATUS } from 'constants/nft';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { sleep } from 'utils';
import { checkEnoughBalance, convertEToNumber } from 'utils/contract';
import showMessage from '@components//Message';
import TYPE_CONSTANTS from 'constants/type';

const { SUCCESS, FAILED } = NFT_TRANSACTION_STATUS;

export function isAddress(address: string) {
  try {
    return getAddress(address);
  } catch {
    return false;
  }
}

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library?.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || isNativeToken(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

export function isNativeToken(address: string) {
  return address === AddressZero;
}

export default class BaseWalletService {
  address: string | null;
  needTobeInitiated: any;
  initUnit256: any;

  constructor(props: any) {
    this.address = props?.address;
  }

  checkBuyerBalance = async ({
    library,
    address,
    tokenAddress,
    price,
    quantity,
  }: {
    library: any;
    address: string;
    tokenAddress: string;
    price: any;
    quantity: number;
  }) => {
    const balances = await this.getBalance({ library, address, tokenAddress });
    const balance = balances.balance;
    return checkEnoughBalance(price, quantity, balance);
  };

  getBalance = async ({
    library,
    tokenAddress,
    address,
    currencyDecimal,
  }: {
    library: any;
    tokenAddress: string;
    address: string;
    currencyDecimal?: number;
  }) => {
    try {
      if (address) {
        let tokenInst, balance, balanceFlat, decimals;

        if (isNativeToken(tokenAddress)) {
          balance = await library?.getBalance(address);
          balanceFlat = formatUnits(balance, 'wei');
          decimals = currencyDecimal;
        } else {
          tokenInst = getContract(tokenAddress || '', Erc20ABI.output.abi, library, address);
          balance = await tokenInst.balanceOf(address);
          balanceFlat = formatUnits(balance, 'wei');

          decimals = await tokenInst.decimals();
        }

        return {
          balance: convertEToNumber(balanceFlat, decimals),
        };
      }

      return {
        balance: 0,
      };
    } catch (e) {
      return {
        balance: 0,
      };
    }
  };

  isAdmin = async (library: any, account: string) => {
    try {
      const contract = getContract(
        process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '',
        ExchangeABI.output.abi,
        library,
        account,
      );
      const response = await contract.isAdmin(account);

      return response;
    } catch (error) {
      return false;
    }
  };

  verifyLoginSignature = async ({
    library,
    creator,
    cancelMetamask,
  }: {
    library: any;
    creator: string;
    cancelMetamask: () => void;
  }) => {
    let signVerify: any = null;
    let hasnVerify = null;

    try {
      hasnVerify = ethers.utils.solidityKeccak256(['address'], [creator]);

      const signHashBytes = ethers.utils.arrayify(hasnVerify);

      if (library?.provider?.wc) {
        const wcMessage = ethers.utils.hexlify(signHashBytes);
        signVerify = await library.provider.wc.signPersonalMessage([wcMessage, creator]);
      } else {
        const signer = await library.getSigner(creator);
        signVerify = await signer.signMessage(signHashBytes);
      }
      return signVerify;
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        cancelMetamask && cancelMetamask();
      } else {
      }
    }
  };

  getAllowanceERC20 = async ({ account, library }: { account?: string; library?: any }) => {
    try {
      const contract = getContract(
        process.env.NEXT_PUBLIC_APP_CONTRACT_TOKEN || '',
        Erc20ABI.output.abi,
        library,
        account,
      );

      const response = await contract.allowance(account, process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '');
      return new BigNumber(response.toString());
    } catch (e) {
      return 0;
    }
  };

  setAllowanceERC20 = async ({
    account,
    library,
    onSuccess,
    onError,
    onCancelMetamask,
  }: {
    account?: string;
    library?: any;
    onCancelMetamask?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    try {
      const contract = getContract(
        process.env.NEXT_PUBLIC_APP_CONTRACT_TOKEN || '',
        Erc20ABI.output.abi,
        library,
        account,
      );

      const response = await contract.increaseAllowance(process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '', MAX_ALLOWANCE);

      if (response?.hash) {
        const receipt = await response.wait();
        if (receipt?.status) {
          await sleep(1000);
          onSuccess && onSuccess();
        } else {
          return;
        }
      }
    } catch (error: any) {
      console.log(error, 'code');
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };

  buyNFT = async ({
    account,
    library,
    data,
    isSecondary,
    onCancelMetamask,
    onCallback,
    onServerError,
    onContractError,
    onUpdateTransactionHash,
  }: {
    account?: string;
    library?: any;
    data?: Array<any> | any;
    isSecondary?: boolean;
    onCancelMetamask?: () => void;
    onCallback?: (data?: any) => void;
    onServerError?: () => void;
    onContractError?: (data: any) => void;
    onUpdateTransactionHash?: (hash: string) => void;
  }) => {
    const contract = getContract(process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '', NFTMarketplace.abi, library, account);
    let response;
    console.log(data);

    try {
      response = await contract.buy(data.orderId, data.buyAmount, { value: data.price });

      if (response?.hash) {
        const receipt = await response.wait();
        if (receipt?.status) {
          onCallback && onCallback({ hash: response.hash });
        } else {
          showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E22');
        }
      }
    } catch (error: any) {
      console.log(error);

      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onContractError && onContractError({ hash: response?.hash, status: FAILED, message: JSON.stringify(error) });
        onServerError && onServerError();
      }
    }
  };

  // MINT NFT TODO
  mintNFT = async ({
    account,
    library,
    data,
    onCancelMetamask,
    onCallback,
    onError,
  }: {
    account?: string;
    library?: any;
    data?: Array<any> | any;
    onCancelMetamask?: () => void;
    onCallback?: (hash: any) => void;
    onError?: () => void;
  }) => {
    console.log('process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS',process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS);
    
    const contract = getContract(process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '', NFTMarketplace.abi, library, account);

    console.log('(data.collection, data.id, data.amount, data.uri)',data);
    
    try {
      const response = await contract.mint(data.collection, data.id, data.amount, data.uri);
      console.log('response', response);

      if (response?.hash) {
        const receipt = await response.wait();
        if (receipt?.status) {
          onCallback && onCallback({ hash: response.hash });
        } else {
          showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E22');
        }
      }
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        console.log(error);
        onError && onError();
      }
    }
  };

  // PUT ON SALE NFT TODO
  putOnSaleNFT = async ({
    account,
    library,
    data,
    onCancelMetamask,
    onCallback,
    onError,
  }: {
    account?: string;
    library?: any;
    data?: Array<any> | any;
    onCancelMetamask?: () => void;
    onCallback?: (hash?: any) => void;
    onError?: () => void;
  }) => {
    const contract = getContract(process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '', NFTMarketplace.abi, library, account);
    try {
      const response = await contract.createOrder(
        data.collection,
        data.tokenId,
        data.amount,
        data.paymentToken,
        data.price,
      );
      console.log(response);
      console.log("sucess")

      if (response?.hash) {
        const receipt = await response.wait();
        if (receipt?.status) {
          onCallback && onCallback({ hash: response.hash });
        } else {
          showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E22');
        }
      }
    } catch (error: any) {
      console.log(error);
      console.log("errr")
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };

  setApprovalForAllNft = async ({
    account,
    library,
    approved,
    onCancelMetamask,
    onError,
  }: {
    account?: string;
    library?: any;
    onCancelMetamask?: () => void;
    onError?: () => void;
    approved?: boolean;
  }) => {
    const contract = getContract(DEFAULT_RPC721 || '', Erc721ABI.output.abi, library, account);

    try {
      await contract.setApprovalForAll(process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS, approved);
    } catch (error: any) {
      console.log(error);

      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };

  isApprovedForAll = async ({
    account,
    library,
    onCancelMetamask,
    onCallback,
    onError,
  }: {
    account?: string;
    library?: any;
    onCancelMetamask?: () => void;
    onCallback?: (hash?: any) => void;
    onError?: () => void;
  }) => {
    const contract = getContract(DEFAULT_RPC721 || '', Erc721ABI.output.abi, library, account);

    try {
      console.log('process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS', process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS);

      const response = await contract.isApprovedForAll(account, process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS);

      console.log('NEXT_PUBLIC_APP_PROXY_ADDRESS',response);
      
      return response;
    } catch (error: any) {
      console.log('error',error);
      
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };

  // CANCEL SALE ORDER
  cancelSaleOrder = async ({
    account,
    library,
    data,
    onCancelMetamask,
    onCallback,
    onError,
  }: {
    account?: string;
    library?: any;
    data?: Array<any> | any;
    onCancelMetamask?: () => void;
    onCallback?: (hash?: any) => void;
    onError?: () => void;
  }) => {
    const contract = getContract(process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '', NFTMarketplace.abi, library, account);

    try {
      const response = await contract.cancelOrder(data.id);
      console.log('cancelOrder: ', response);
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };

  // Todo: Remove
  cancelSellOrder = async ({
    account,
    library,
    data,
    onCallback,
    onCancelMetamask,
    onServerError,
    onContractError,
  }: {
    account?: string;
    library?: any;
    data?: Array<any> | any;
    onCancelMetamask?: () => void;
    onCallback?: (hash?: any) => void;
    onServerError?: () => void;
    onContractError?: (data: any) => void;
  }) => {
    const contract = getContract(
      process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '',
      ExchangeABI.output.abi,
      library,
      account,
    );
    let response;
    try {
      response = await contract.handleCancelOrder(...data);

      if (response?.hash) {
        const receipt = await response.wait();

        if (receipt?.status) {
          onCallback && onCallback({ hash: receipt?.transactionHash, status: SUCCESS });
        } else {
          onContractError && onContractError({ hash: receipt?.transactionHash, status: FAILED });
        }
      }
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onContractError && onContractError({ hash: response?.hash, status: FAILED, message: JSON.stringify(error) });
        onServerError && onServerError();
      }
    }
  };

  checkListForSaleNftApproved = async ({ account, library, contractAddress, standard }: any) => {
    try {
      const contract = getContract(
        contractAddress,
        standard === NFT_STANDARD[0].value ? Erc721ABI.output.abi : Erc1155ABI.output.abi,
        library,
        account,
      );

      const response = await contract.isApprovedForAll(account, process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '');

      return response;
    } catch (e) {
      console.log(e, 'eee');
      console.error(e);
    }
  };

  setListForSaleNftApproved = async ({
    account,
    library,
    contractAddress,
    approved,
    standard,
    onSuccess,
    onCancelMetamask,
    onError,
  }: {
    account?: string;
    library?: any;
    onCancelMetamask?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    contractAddress: string;
    approved?: boolean;
    standard?: string | number;
  }) => {
    try {
      const contract = getContract(
        contractAddress,
        standard === NFT_STANDARD[0].value ? Erc721ABI.output.abi : Erc1155ABI.output.abi,
        library,
        account,
      );
      const response = await contract.setApprovalForAll(process.env.NEXT_PUBLIC_APP_PROXY_ADDRESS || '', approved);
      if (response?.hash) {
        const receipt = await response.wait();
        if (receipt?.status) {
          onSuccess && onSuccess();
        } else {
          return;
        }
      }
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };
}
