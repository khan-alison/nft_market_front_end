import { Connection } from './slice';

const selectedConnection = {
  getConnection: (state: any) => state?.ConnectionSlice as Connection,
};

export default selectedConnection;
