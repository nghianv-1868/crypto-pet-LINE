import * as actions from '../actions';

const initialState = {
  petAddresses: {
    '0xe4A464feb857a708546d0fc480039f31de3cd1d2': [
      {
        duration: 259200,
        growthTime: 0,
        initialTime: 1595317332770,
        isFreezing: false,
        lastTimeSavingMoney: 1595317332770,
        lastTimeWithdrawMoney: 0,
        nextTimeFreezing: 1595317591970,
        petId: 0,
        petOwner: '0xe4A464feb857a708546d0fc480039f31de3cd1d2',
        providentFund: 0,
        purpose: 'aaa',
        targetFund: 25,
      },
    ],
  },
};

const lineReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CREATE_NEW_PET:
      return {
        ...state,
        petAddresses: action.petAddresses,
      };
    default:
      return state;
  }
};

export default lineReducer;
