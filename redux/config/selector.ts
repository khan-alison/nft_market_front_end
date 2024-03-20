import { Config } from './slice';

const selectedConfig = {
  getConfig: (state: any) => state?.ConfigSlice as Config,
};

export default selectedConfig;
