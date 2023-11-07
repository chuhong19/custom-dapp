import { ethers } from "ethers"

import abiJSON from "./nftabi.json";

const nftContract = (provider) => {
    return new ethers.Contract(
        "0xA2Fbb10d178DD121D770330F5d0Ca64c8f9A2122",
        abiJSON,
        provider
    );
};

export default nftContract;