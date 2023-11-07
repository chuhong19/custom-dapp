import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Import ABI Code to interact with smart contract
import tokenContract from "./abi/TokenAbi";
import nftContract from "./abi/NFTAbi";
import mintNFTByTokenContract from "./abi/MintNFTByTokenAbi";

function App() {
  // Property Variables

  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [numberContract, setNumberContract] = useState(0);
  const [currentContract, setCurrentContract] = useState();
  const [transactionData, setTransactionData] = useState("");

  const [from, setFrom] = useState("");
  const [to, setReceiver] = useState("");
  const [amount, setAmount] = useState();
  const [URI, setURI] = useState("");
  const [NFTId, setNFTId] = useState();
  const [targetAddress, setTargetAddress] = useState("");

  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const MY_MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    console.log("Connecting wallet...");
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setSigner(provider.getSigner());
        setCurrentContract(tokenContract(provider));
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };
  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setSigner(provider.getSigner());
          setCurrentContract(tokenContract(provider));
          console.log("Current name contract: Token Contract")
          setWalletAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };
  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };
  async function changeContract() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newNumberContract = numberContract + 1;
      let newContract = null;
      let displayName = "not found";
      if (newNumberContract % 3 === 1) {
        newContract = nftContract(provider);
        displayName = "NFT Contract";
      } else if (newNumberContract % 3 === 2) {
        newContract = mintNFTByTokenContract(provider);
        displayName = "MintNFTByToken Contract";
      } else if (newNumberContract % 3 === 0) {
        newContract = tokenContract(provider);
        displayName = "Token Contract";
      }

      console.log("Current name contract: " + displayName);

      setNumberContract(newNumberContract);
      setCurrentContract(newContract);

    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myGetBalanceToken() {
    try {
      const fGetBalance = currentContract.connect(signer);
      console.log(currentContract);
      const signerAddress = await signer.getAddress();
      console.log("Get balance token of " + signerAddress + " ..............");
      const resp = await fGetBalance.balanceOf(signerAddress);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myApprove() {
    try {
      const fApprove = currentContract.connect(signer);
      console.log("Approve: " + to + " " + amount + " tokens");
      const resp = await fApprove.approve(to, amount);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myCheckAllowance() {
    try {
      const fCheckAllowance = currentContract.connect(signer);
      console.log("Allowance from " + from + " to " + to + " :");
      const resp = await fCheckAllowance.allowance(from, to);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myTransfer() {
    try {
      const fTransfer = currentContract.connect(signer);
      const signerAddress = await signer.getAddress();
      console.log("Transfer " + amount + " tokens to: " + to + " ................");
      const resp = await fTransfer.transferFrom(signerAddress, to, amount);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myTransferFrom() {
    try {
      const fTransferFrom = currentContract.connect(signer);
      console.log("Transfer " + amount + " tokens from " + from + " to " + to + " ................");
      const resp = await fTransferFrom.transferFrom(from, to, amount);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myHasRoleAdmin() {
    try {
      const fHasRoleAdmin = currentContract.connect(signer);
      console.log("Check admin role of " + from + " ...............");
      const resp = await fHasRoleAdmin.hasRole(DEFAULT_ADMIN_ROLE, from);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myHasRoleMinter() {
    try {
      const fHasRoleMinter = currentContract.connect(signer);
      console.log("Check admin role of " + from + " ...............");
      const resp = await fHasRoleMinter.hasRole(MY_MINTER_ROLE, from);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myGrantMinterRole() {
    try {
      const fGrantMinterRole = currentContract.connect(signer);
      console.log("Grant minter role for " + to + " ...............");
      const resp = await fGrantMinterRole.grantMinterRole(to);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myMintNFT() {
    try {
      const fMintNFT = currentContract.connect(signer);
      console.log("Mint NFT for " + to + " ...............");
      const resp = await fMintNFT.mintNFT(to, URI);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myCheckOwner() {
    try {
      const fOwnerOf = currentContract.connect(signer);
      console.log("Check owner of NFT with id " + NFTId + " ...............");
      const resp = await fOwnerOf.ownerOf(NFTId);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myCheckPaymentToken() {
    try {
      const fCheckPaymentToken = currentContract.connect(signer);
      console.log("Check payment token ...............");
      const resp = await fCheckPaymentToken.paymentToken();
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myCheckNFTAddress() {
    try {
      const fCheckNFTAddress = currentContract.connect(signer);
      console.log("Check NFT address ...............");
      const resp = await fCheckNFTAddress.nftAddress();
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function mySetPaymentToken() {
    try {
      const fSetPaymentToken = currentContract.connect(signer);
      console.log("Set payment token to " + targetAddress);
      const resp = await fSetPaymentToken.setPaymentToken(targetAddress);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function mySetNFTAddress() {
    try {
      const fSetNFTAddress = currentContract.connect(signer);
      console.log("Set NFT address to " + targetAddress);
      const resp = await fSetNFTAddress.setNftToken(targetAddress);
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  async function myBuyNFT() {
    try {
      const fBuyNFT = currentContract.connect(signer);
      console.log("Buy NFT..................");
      const resp = await fBuyNFT.buyNFT();
      setTransactionData(resp);
      console.log("Response: " + resp);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  // Return
  return (
    <div className="App">
      <div className="App-header">

        {/* DESCRIPTION  */}
        <div className="description">
          <h1>CBH.sol</h1>
          <h3>CBH DApp </h3>
          <h4>Main wallet: 0xdb742b89c15722238c267dae744E0842FaEb0Bb7</h4>
          <h4>Sub wallet: 0x21889aab22b7004913C71eDDdaf25814dd4f7E01</h4>
          <h4>Token address: 0xF42eBef0C9e2d235E9270288F20400fCD43008A1</h4>
          <h4>NFT address: 0xA2Fbb10d178DD121D770330F5d0Ca64c8f9A2122</h4>
          <h4>MintNFTByToken address: 0x2B1DA360ecc2088D99f258fD0563b11103C7f5a2</h4>
        </div>

        {/* BUTTONS - Change contract */}
        <div className="custom-buttons">
          <button onClick={changeContract} style={{ backgroundColor: "white" }}>
            Change Contract
          </button>
        </div>

        {/* BUTTONS - Get balance */}
        <div className="custom-buttons">
          <button onClick={myGetBalanceToken} style={{ backgroundColor: "green" }}>
            Get Balance
          </button>
        </div>

        {/* BUTTONS - Approve */}
        <div className="custom-buttons">
          <button onClick={myApprove} style={{ backgroundColor: "green" }}>
            Approve (to, amount)
          </button>
        </div>

        {/* BUTTONS - Check Allowance */}
        <div className="custom-buttons">
          <button onClick={myCheckAllowance} style={{ backgroundColor: "green" }}>
            Check allowance (from, to)
          </button>
        </div>

        {/* BUTTONS - Transfer */}
        <div className="custom-buttons">
          <button onClick={myTransfer} style={{ backgroundColor: "green" }}>
            Transfer (to, amount)
          </button>
        </div>

        {/* BUTTONS - Transfer from */}
        <div className="custom-buttons">
          <button onClick={myTransferFrom} style={{ backgroundColor: "green" }}>
            Transfer from (from, to, amount)
          </button>
        </div>

        {/* BUTTONS - Check admin */}
        <div className="custom-buttons">
          <button onClick={myHasRoleAdmin} style={{ backgroundColor: "red" }}>
            Check admin (from)
          </button>
        </div>

        {/* BUTTONS - Check minter */}
        <div className="custom-buttons">
          <button onClick={myHasRoleMinter} style={{ backgroundColor: "red" }}>
            Check minter (from)
          </button>
        </div>

        {/* BUTTONS - Grant minter role */}
        <div className="custom-buttons">
          <button onClick={myGrantMinterRole} style={{ backgroundColor: "red" }}>
            Grant minter role (to)
          </button>
        </div>

        {/* BUTTONS - Mint NFT */}
        <div className="custom-buttons">
          <button onClick={myMintNFT} style={{ backgroundColor: "red" }}>
            Mint NFT (to, URI)
          </button>
        </div>

        {/* BUTTONS - Check NFT Id */}
        <div className="custom-buttons">
          <button onClick={myCheckOwner} style={{ backgroundColor: "red" }}>
            Check Owner NFT (id)
          </button>
        </div>

        {/* BUTTONS - Check Payment Token */}
        <div className="custom-buttons">
          <button onClick={myCheckPaymentToken} style={{ backgroundColor: "yellow" }}>
            Check Payment Token
          </button>
        </div>

        {/* BUTTONS - Check NFT Token */}
        <div className="custom-buttons">
          <button onClick={myCheckNFTAddress} style={{ backgroundColor: "yellow" }}>
            Check NFT Token
          </button>
        </div>

        {/* BUTTONS - Set Payment Token */}
        <div className="custom-buttons">
          <button onClick={mySetPaymentToken} style={{ backgroundColor: "yellow" }}>
            Set Payment Token (address)
          </button>
        </div>

        {/* BUTTONS - Set NFT Token */}
        <div className="custom-buttons">
          <button onClick={mySetNFTAddress} style={{ backgroundColor: "yellow" }}>
            Set NFT Token (address)
          </button>
        </div>

        {/* BUTTONS - Buy NFT */}
        <div className="custom-buttons">
          <button onClick={myBuyNFT} style={{ backgroundColor: "yellow" }}>
            Buy NFT
          </button>
        </div>

        {/* BUTTONS - Connect wallet */}
        <div className="navbar-end is-align-items-center">
          <button
            className="button is-white connect-wallet"
            onClick={connectWallet}
          >
            <span className="is-link has-text-weight-bold">
              {walletAddress && walletAddress.length > 0
                ? `Connected: ${walletAddress.substring(
                  0,
                  6
                )}...${walletAddress.substring(38)}`
                : "Connect Wallet"}
            </span>
          </button>
        </div>

        {/* INPUT TEXT - String - From */}
        <input
          type="string"
          onChange={(e) => setFrom(e.target.value)}
          value={from}
          placeholder="from"
        />

        {/* INPUT TEXT - String - Receiver */}
        <input
          type="string"
          onChange={(e) => setReceiver(e.target.value)}
          value={to}
          placeholder="to"
        />

        {/* INPUT TEXT - Number - Amount */}
        <input
          type="number"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          placeholder="amount"
        />

        {/* INPUT TEXT - Number - NFT Id */}
        <input
          type="number"
          onChange={(e) => setNFTId(e.target.value)}
          value={NFTId}
          placeholder="NFT Id"
        />

        {/* INPUT TEXT - String - URI */}
        <input
          type="string"
          onChange={(e) => setURI(e.target.value)}
          value={URI}
          placeholder="URI"
        />

        {/* INPUT TEXT - String - Address */}
        <input
          type="string"
          onChange={(e) => setTargetAddress(e.target.value)}
          value={targetAddress}
          placeholder="address"
        />

      </div>
    </div>
  );
}

export default App;