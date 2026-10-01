import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployer } = await hre.getNamedAccounts();

  await hre.deployments.deploy("YourNFT", {
    from: deployer,
    args: [],
    log: true,
  });

  await hre.deployments.deploy("NFTStore", {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deploy;
deploy.tags = ["YourNFT", "NFTStore"];
