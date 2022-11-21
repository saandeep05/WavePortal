import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [tweet, setTweet] = useState("");
  const [allTweets, setAllTweets] = useState([]);
  const [display, setDisplay] = useState(false);
  const [username, setUsername] = useState("");
  const [currName, setCurrName] = useState("");
  const [allUserNames, setAllUserNames] = useState({});
  const [award, setAward] = useState(0);
  // const [waveContract, setWaveContract] = useState("");
  const contractAddress = "0x5b7E64091eF8f9495A493EADD3736350C111478b";
  const ABI = abi.abi;
  
  const checkIfWalletIsConnected = async() => {
    try {
      const { ethereum } = window;
  
      if(ethereum) {
        console.log("Ethereum Connected");
      } else {
        console.log("Make sure you have a wallet");
      }
  
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
  
      if(accounts.length !== 0) {
        console.log("Found an authorized account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No authorized account found!");
      }
    } catch(error) {
      console.log(error);
    }
  }

  const connectWallet = async() => {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        console.log("Get metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      console.log("Wallet connected with address ", accounts[0]);
      // console.log("Alias: ", await getUname(accounts[0]));
      setCurrentAccount(accounts[0]);
    } catch(error) {
      console.log(error);
    }
  }

  const wave = async() => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, ABI, signer);
        // setWaveContract(wavePortalContract);

        let w = await wavePortalContract.wave(tweet);
        await w.wait();
        // console.log("Transaction complete, hash: ", w.hash());
        let totalWaves = await wavePortalContract.getTotalWaves();
        console.log("Total waves: ", totalWaves.toNumber());
        await iterateTweets();
      } else {
        console.log("Ethereum object not found");
      }
    } catch(error) {
      console.log(currentAccount);
      setCurrentAccount("");
      console.log(error);
      alert("Make sure your wallet is connected");
    }
  }

  const getTweet = async(val) => {
    // console.warn(val.target.value);
    setTweet(val.target.value);
  }

  const iterateTweets = async() => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, ABI, signer);
        
        let n = await wavePortalContract.getTotalWaves();
        console.log("Tweets retrieved from contract: ", n.toNumber());

        if(n.toNumber() == allTweets.length) {
          console.log(allUserNames);
          console.log("No New Tweets");
        }
        console.log("Number of tweets currently: ", allTweets.length);
        for(let i=allTweets.length;i<n;i++) {
          let waveInfo = await wavePortalContract.getWaveInfo(i);
          allTweets[i] = waveInfo;
          setAllTweets(allTweets);
          console.log(allTweets[i].tweet.toUpperCase());

          let _uname = await wavePortalContract.getUsername(waveInfo.account);
          let temp = allUserNames;
          console.log(temp);
          temp[waveInfo.account.toString()] = _uname.toString();
          setAllUserNames(temp);
        }
        setDisplay(false);
        setDisplay(true);

      } else {
        console.log("Wallet not connected");
      }
    } catch(error) {
      console.log(error);
    }
  }

  const getName = async(val) => {
    setUsername(val.target.value);
  }

  const modifyUsername = async() => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortal = new ethers.Contract(contractAddress, ABI, signer);
        // console.log(signer);

        const Txn = await wavePortal.setUsername(username);
        await Txn.wait();

          let temp = allUserNames;
          console.log(temp);
          temp[signer] = username;
          setAllUserNames(temp);
      } else {
        console.log("Wallet not connected");
      }
    } catch(error) {
      console.log(error);
    }
  }

  // const getUname = async(tempAddress) => {
  //   try {
  //     const { ethereum } = window;
  //     if(ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortal = new ethers.Contract(contractAddress, ABI, signer);

  //       let Txn = await wavePortal.getUsername(tempAddress);
  //       setCurrName(Txn.toString());
  //       return Txn.toString();
  //     } else {
  //       console.log("Wallet not connected");
  //     }
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }

  const getAward = async(val) => {
    setAward(val.target.value);
  }

  const sendAward = async() => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContract = new ethers.Contract(contractAddress, ABI, signer);
        // console.log(signer);

        let waveTxn = await waveContract.award("0x0Dffc612a4Faf7FC3144B61c66E756EFB4784d8B", {value:ethers.utils.parseEther(award).toString()});
        // ownerBalance = await owner.getBalance();
        // console.log("After award:", ownerBalance.toString());
        await waveTxn.wait();
      } else {
        console.log("Wallet not connected");
      }
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    iterateTweets();
  }, []);
  
  return (
    <div className="mainContainer container justify-content-center">


      <div className="dataContainer col">
        <div className="header">
        Meet the world
          <br/><br/>
        </div>

       


        {!currentAccount && 
          <div className="container justify-content-center">
            <h5 className="col">Connect your wallet to access features</h5>
          </div>}

        {!currentAccount && 
          <button className="connectWallet" onClick={connectWallet}>
            Connect Metamask Wallet
          </button>}

        {currentAccount && 
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Write here..." onChange={getTweet}></input>
            <button className="waveButton" onClick={wave}>Wave to the world</button>
          </div>}

        {currentAccount && 
          <div className="form-group">
            <br/>
            <input type="text" className="form-control" placeholder="Set Username" onChange={getName}></input>
            <button className="submitUsername" onClick={modifyUsername}>Confirm</button>
          </div>}


        
      </div>

      {currentAccount && display && <div className="Feed col container justify-content-center">
        <div className="tweetSection col">
          {allTweets.map((Tweet, id) => (
            <div className="singleCard" key={id}>
              <div className="card">
                <div className="card-body">
                  
                  <h5 className="card-title lead">{allUserNames[Tweet.account.toString()]}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {Tweet.account.toString()}
                  </h6>
                  <p className="card-text"><b>{Tweet.tweet}</b></p>
                  <a href="#" className="card-link">Like</a>
                  <a href="#" className="card-link">Comment</a>
                  <div className="form-group">
                    <br/>
                    <input type="text" className="form-control" onChange={getAward} placeholder="Enter eth..."></input>
                    <button className="card-link" onClick={sendAward}>Award</button>
                  </div>
                </div>
              </div>
              <br/>
            </div>
          ))}
          
        </div>

        {currentAccount && <button className="tweetButton col" onClick={iterateTweets}>
          Load Tweets
        </button>}
        
      </div>}

    </div>
  );
}

