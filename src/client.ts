import {
  ColonyClient,
  getColonyNetworkClient,
  Network,
} from "@colony/colony-js";
import { Wallet } from "ethers";
import { InfuraProvider } from "ethers/providers";

const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

export const getColonyClient = async (): Promise<ColonyClient> => {
  // Get a new Infura provider (don't worry too much about this)
  const provider = new InfuraProvider();

  // Get a random wallet
  const wallet = Wallet.createRandom();
  // Connect your wallet to the provider
  const connectedWallet = wallet.connect(provider);

  // Get a network client instance
  const networkClient = getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    {
      networkAddress: MAINNET_NETWORK_ADDRESS,
    }
  );

  // Get the colony client instance for the betacolony
  return networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS);
};
