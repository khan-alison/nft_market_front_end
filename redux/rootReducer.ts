import AddressReducer, { namespace as AddressNamespace } from './address/slice';
import ConnectionReducer, { namespace as ConnectionNamespace } from './connection/slice';
import AuthenticationReducer, { namespace as AuthenticationNameSpace } from './authentication/slice';
import KycReducer, { namespace as KycNameSpace } from './kyc/slice';
import ConfigReducer, { namespace as ConfigNamespace } from './config/slice';
import ActionReducer, { namespace as ActionNamespace } from './action/slice';
import PageReducer, { namespace as PageNamespace } from './page/slice';
import EventReducer, { namespace as EventNamespace } from './event/slice';
import NFTSlice, { namespace as NFTNamespace } from './nft/slice';

const rootReducer = {
  [AddressNamespace]: AddressReducer,
  [ConnectionNamespace]: ConnectionReducer,
  [AuthenticationNameSpace]: AuthenticationReducer,
  [ConfigNamespace]: ConfigReducer,
  [ActionNamespace]: ActionReducer,
  [PageNamespace]: PageReducer,
  [KycNameSpace]: KycReducer,
  [EventNamespace]: EventReducer,
  [NFTNamespace]: NFTSlice,
};

export default rootReducer;
