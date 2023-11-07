import { ethers } from "ethers"

import abiJSON from "./mintnftbytokenabi.json";

const mintNFTByTokenContract = (provider) => {
    return new ethers.Contract(
        "0x2B1DA360ecc2088D99f258fD0563b11103C7f5a2",
        abiJSON,
        provider
    );
};

export default mintNFTByTokenContract;