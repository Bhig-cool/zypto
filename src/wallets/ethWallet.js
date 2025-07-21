import { Wallet } from 'ethers';

function createEthereumWallet() {
  const wallet = Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

export default createEthereumWallet;