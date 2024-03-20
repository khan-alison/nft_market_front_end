import { Action } from './slice';

const selectedAction = {
  getAction: (state: any) => state?.ActionSlice as Action,
};

export default selectedAction;
