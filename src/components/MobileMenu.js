import classNames from "classnames"
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { GlobalContext } from "./../context/GlobalContext";
import { useContext, useEffect } from "react";
import { ethers } from "ethers";
import CONFIG from "./../abi/config";
import logo from './../assets/logo.webp'

const providerOptions = {
  network: 'rinkeby',
  cacheProvider: false,
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_PROJECT_ID

    }
  }
};


const MobileMenu = ({ isOpen, setIsOpen, setError, setErrMsg, loadAccountData }) => {
  const { account, updateAccount, updateStakedBalance, updateTokenBalance, updateWeb3Provider } = useContext(GlobalContext);


  const handleWalletConnect = async () => {
    const web3modal = new Web3Modal({
      providerOptions
    });
    const instance = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    updateWeb3Provider(provider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    updateAccount(address);
    const network = await provider.getNetwork();
    console.log(network)
    if(network.chainId !== CONFIG.chainId ) {
        setError(true) 
        setErrMsg(`Contract is not deployed on current network. please choose ${CONFIG.networkName}`)
    } else {
        setError(false) 
        setErrMsg('')
        loadAccountData(provider)
    }
  };

  const disconnectWallet = () => {
    updateAccount(null)
    updateStakedBalance({
      stake_Balance: null,
      stake_Balance1: null,
      stake_Balance2: null
  })
    updateTokenBalance(null)
    updateWeb3Provider(null)
  }

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
          updateAccount(accounts[0])
      })
      window.ethereum.on('chainChanged', chainId => {
          window.location.reload();
      })
  }
  }, [account]);


  return (
    <div className={classNames('fixed z-40 top-0 left-0 h-screen bg-grad container md:hidden', 
    { 'block animate-slideIn': isOpen, 'hidden ': !isOpen })}>
      <div className="w-full p-8 flex items-center justify-between" >
        <div className="w-40 truncate">
          <img
            src={logo}
            alt="dexo"
          />
        </div>
        <div className="cursor-pointer" onClick={() => setIsOpen(false)}>
          <svg className="fill-white w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" /></svg>
        </div>
      </div>
      <div className="">
        <ul className="flex flex-col items-center justify-between w-full space-y-11 pt-56">
          {/* <li className="p-2 truncate">
            <a href="/">Website</a>
          </li> */}
          {/* <li className="p-2 truncate">
            <a href="/">Audit</a>
          </li>
          <li className="p-2 truncate">
            <a href="/">Whitepaper</a>
          </li> */}
          <li className="">
            <a className="px-6 py-3 truncate text-white uppercase font-medium bg-gradient-to-l from-[#c561ff] to-[#53f] rounded-full" href="/">BUY CRNO</a>
          </li>
          <li className="">
            {account ? (
              <button
                className="px-6 py-3 truncate text-white uppercase font-medium bg-gradient-to-l from-[#c561ff] to-[#53f] rounded-full flex items-center justify-center space-x-2"
                onClick={() => disconnectWallet()}
              >
                <svg
                  className="w-8 fill-white "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M448 32C465.7 32 480 46.33 480 64C480 81.67 465.7 96 448 96H80C71.16 96 64 103.2 64 112C64 120.8 71.16 128 80 128H448C483.3 128 512 156.7 512 192V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM416 336C433.7 336 448 321.7 448 304C448 286.3 433.7 272 416 272C398.3 272 384 286.3 384 304C384 321.7 398.3 336 416 336z" />
                </svg>
                <span>
                  {account.slice(0, 5) + '...' + account.slice(37, 42)}
                </span>
              </button>
            ) : (
              <button
                className="px-6 py-3 truncate text-white uppercase font-medium bg-gradient-to-l from-[#c561ff] to-[#53f] rounded-full flex items-center justify-center space-x-2"
                onClick={() => handleWalletConnect()}
              >
                <svg
                  className="w-8 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M448 32C465.7 32 480 46.33 480 64C480 81.67 465.7 96 448 96H80C71.16 96 64 103.2 64 112C64 120.8 71.16 128 80 128H448C483.3 128 512 156.7 512 192V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM416 336C433.7 336 448 321.7 448 304C448 286.3 433.7 272 416 272C398.3 272 384 286.3 384 304C384 321.7 398.3 336 416 336z" />
                </svg>
                <span>
                  Connect Wallet
                </span>
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MobileMenu