import { ethers } from "ethers"

import abiJSON from "./tokenabi.json";

const tokenContract = (provider) => {
    return new ethers.Contract(
        "0xF42eBef0C9e2d235E9270288F20400fCD43008A1",
        abiJSON,
        provider
    );
};

export default tokenContract;