import * as actions from '../actions';

const initialState = {
  petAddresses: {},
};

const lineReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CREATE_NEW_PET:
      return {
        ...state,
        petAddresses: action.petAddresses,
      };
    case actions.FEED_PET:
      return {
        ...state,
        petAddresses: action.petAddresses,
      };
    case actions.WITHDRAW:
      return {
        ...state,
        petAddresses: action.petAddresses,
      };
    default:
      return state;
  }
};

export default lineReducer;
