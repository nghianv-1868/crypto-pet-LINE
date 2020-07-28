import getWeb3 from '../utils/getWeb3';
import Factory from '../contracts/PetWalletFactory.json';

export const WEB3_CONNECT = 'WEB3_CONNECT';
export const web3Connect = () => async dispatch => {
  // const web3 = await getWeb3();
  // const accounts = await web3.eth.getAccounts();
  // if (web3.currentProvider.connection.networkVersion !== '89') {
  //   alert('Unknown network, please change network to TomoChain network');
  //   return;
  // }
  // if (accounts.length > 0) {
  //   const account = accounts[0];
  //   let balance = await web3.eth.getBalance(account);
  //   balance = parseFloat(web3.utils.fromWei(balance)).toFixed(2);
  //   dispatch({
  //     type: WEB3_CONNECT,
  //     web3,
  //     account,
  //     balance,
  //   });
  // } else {
  //   console.log('Account not found');
  // }
  // dispatch(instantiateContracts());
  // dispatch(getAllPets());
};

export const web3TomoWalletConnect = () => async dispatch => {
  var Web3 = require('web3');
  const web3 = new Web3(window.web3.currentProvider);
  window.web3.version.getNetwork((e, netId) => {
    if (netId !== '89') {
      alert('Unknown network, please change network to TomoChain network');
      return;
    }
  });
  await new Promise((resolve, reject) => {
    window.web3.eth.getAccounts(async (e, accounts) => {
      if (accounts.length > 0) {
        const account = accounts[0];
        let balance = await web3.eth.getBalance(account);
        balance = parseFloat(web3.utils.fromWei(balance)).toFixed(2);
        dispatch({
          type: WEB3_CONNECT,
          web3,
          account,
          balance,
        });
        dispatch(instantiateContracts());
        dispatch(getAllPets());
        resolve();
      } else {
        reject();
        console.log('Account not found');
      }
    });
  });
};

export const INSTANTIATE_CONTRACT = 'INSTANTIATE_CONTRACT';
export const instantiateContracts = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const networkId = process.env.REACT_APP_TOMO_ID;
  let factoryAddress = Factory.networks[networkId].address;
  let factory = new web3.eth.Contract(Factory.abi, factoryAddress, {
    transactionConfirmationBlocks: 1,
  });
  dispatch({
    type: INSTANTIATE_CONTRACT,
    factory,
  });
};

// export const GET_ALL_PETS = 'GET_ALL_PETS';
// export const getAllPets = () => async (dispatch, getState) => {
//   const state = getState();
//   let web3 = state.tomo.web3;
//   const factory = state.tomo.factory;
//   const account = state.tomo.account;
//   let petArray = await factory.methods
//     .getAllPetAddressOf(account)
//     .call({ from: account });
//   const pets = [];
//   for (let i = 0; i < petArray.length; i++) {
//     let pet = {
//       instance: null,
//       id: 0,
//       amount: 0,
//       time: 0,
//       targetFund: 0,
//       duration: 0,
//       purpose: '',
//     };
//     pet.instance = new web3.eth.Contract(petWallet.abi, petArray[i], {
//       transactionConfirmationBlocks: 1,
//     });
//     let petInfo = await pet.instance.methods.getInformation().call();
//     pet.id = petInfo[0].toNumber();
//     pet.amount = petInfo[1].toNumber();
//     pet.time = petInfo[2].toNumber();
//     pet.targetFund = petInfo[3].toNumber();
//     pet.duration = petInfo[4].toNumber();
//     pet.purpose = petInfo[5];
//     pets.push(pet);
//   }
//   dispatch({
//     type: GET_ALL_PETS,
//     pets,
//   });
// };

export const GET_ALL_PETS = 'GET_ALL_PETS';
export const getAllPets = () => async (dispatch, getState) => {
  const state = getState();
  const account = state.tomo.account;
  const pets = [];
  let petArray = state.line.petAddresses[account];
  if (petArray) {
    for (let i = 0; i < petArray.length; i++) {
      let pet = {
        instance: null,
        id: 0,
        amount: 0,
        time: 0,
        targetFund: 0,
        duration: 0,
        purpose: '',
      };
      let petInfo = petArray[i];
      pet.id = petInfo.petId;
      pet.amount = petInfo.providentFund;
      pet.time = petInfo.growthTime;
      pet.targetFund = petInfo.targetFund;
      pet.duration = petInfo.duration;
      pet.purpose = petInfo.purpose;
      pets.push(pet);
    }
  }

  dispatch({
    type: GET_ALL_PETS,
    pets,
  });
};

// export const GET_ALL_PETS_ADDRESS = 'GET_ALL_PETS_ADDRESS';
// export const getAllPetsAddress = () => async (dispatch, getState) => {
//   const state = getState();
//   const factory = state.tomo.factory;
//   const account = state.tomo.account;
//   let petsAddress = await factory.methods
//     .getAllPetAddressOf(account)
//     .call({ from: account });
//   dispatch({
//     type: GET_ALL_PETS_ADDRESS,
//     petsAddress,
//   });
// };

export const GET_ALL_PETS_ADDRESS = 'GET_ALL_PETS_ADDRESS';
export const getAllPetsAddress = () => async (dispatch, getState) => {
  const state = getState();
  const account = state.tomo.account;
  let petsAddress = state.line.petAddresses[account];
  dispatch({
    type: GET_ALL_PETS_ADDRESS,
    petsAddress,
  });
};

// export const CREATE_NEW_PET = 'CREATE_NEW_PET';
// export const createNewPet = (petId, targetFund, duration, purpose) => async (
//   dispatch,
//   getState
// ) => {
//   const state = getState();
//   const factory = state.tomo.factory;
//   const account = state.tomo.account;
//   const pets = state.tomo.pets;
//   await factory.methods
//     .create(petId, targetFund, duration, purpose)
//     .send({ from: account })
//     .then(() => {
//       window.location.href = `/pets/${pets.length}`;
//     })
//     .catch((e) => {
//       console.log('Create pet action error', e);
//     });
// };

export const CREATE_NEW_PET = 'CREATE_NEW_PET';
export const createNewPet = (petId, targetFund, duration, purpose, Router) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const account = state.tomo.account;
  let pets = state.tomo.pets;
  let petAddresses = state.line.petAddresses;
  let pet = {
    petOwner: account,
    petId: petId,
    targetFund: targetFund,
    duration: duration * 86400,
    purpose: purpose,
    initialTime: Date.now(),
    lastTimeSavingMoney: Date.now(),
    nextTimeFreezing: Date.now() + 3 * 86400,
    providentFund: 0,
    growthTime: 0,
    lastTimeWithdrawMoney: 0,
    isFreezing: false,
  };
  if (petAddresses && petAddresses[account]) {
    petAddresses[account].push(pet);
  } else {
    petAddresses[account] = [];
    petAddresses[account].push(pet);
  }
  dispatch({
    type: CREATE_NEW_PET,
    petAddresses,
  });
  dispatch(getAllPets());
  console.log(Router);
  // Router.push(`/pets/${pets.length}`);
};

export const FEED_PET = 'FEED_PET';
export const feedPet = (value, petId, pet) => async (dispatch, getState) => {
  const state = getState();
  const balance = state.tomo.balance;
  const account = state.tomo.account;
  if (parseFloat(balance) > parseFloat(value)) {
    // msg.sender.transfer(msg.value.sub(_sendValue * 1 ether));
  }
  pet.providentFund += value;

  if (pet.lastTimeSavingMoney > pet.lastTimeWithdrawMoney) {
    if (new Date().getTime() > pet.nextTimeFreezing) {
      pet.growthTime += 3 * 86400;
    } else {
      pet.growthTime += new Date().getTime() - pet.lastTimeSavingMoney;
    }
  }

  pet.isFreezing = false;
  pet.lastTimeSavingMoney = new Date().getTime();
  pet.nextTimeFreezing = new Date().getTime() + 3 * 86400;
  let petAddresses = state.line.petAddresses;
  petAddresses[account][petId] = pet;
  console.log(getState());
  dispatch({
    type: FEED_PET,
    petAddresses,
  });
};

export const WITHDRAW = 'WITHDRAW';
export const withdraw = (value, petId, pet) => async (dispatch, getState) => {
  const state = getState();
  const account = state.tomo.account;

  if (pet.providentFund >= parseFloat(value) && parseFloat(value) > 0) {
    if (pet.lastTimeWithdrawMoney <= pet.lastTimeSavingMoney) {
      pet.growthTime += new Date().getTime() - pet.lastTimeSavingMoney;
    }
    pet.providentFund -= value;
    pet.lastTimeWithdrawMoney = new Date().getTime();

    if (!pet.isFreezing) {
      pet.isFreezing = true;
    }
    let petAddresses = state.line.petAddresses;
    petAddresses[account][petId] = pet;
    dispatch({
      type: WITHDRAW,
      petAddresses,
    });
  }
};
