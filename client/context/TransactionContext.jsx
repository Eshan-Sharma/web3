import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

// eslint-disable-next-line no-unused-vars
const getEthereumContract = ()=>{
    const provider = new ethers.provider.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log({provider,
    signer, transactionContract});
}

// eslint-disable-next-line react/prop-types
export const TransactionProvider = ({children})=>{
 
    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");
    
            const accounts = await ethereum.request({method: 'eth_accounts'});
            console.log(accounts);
            if(accounts.length){
                setCurrentAccount(accounts[0]);
            }
            
        } catch (error) {
            console.log(error);
            throw new error("No ethereum object");
        }
    }

    // eslint-disable-next-line no-unused-vars
    const connectWallet = async ()=>{
        try {
            if(!ethereum) return alert("Please install metamask");
            const accounts = await ethereum.request({method:'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new error("No ethereum object");
        }
    }
    useEffect(()=>{
        checkIfWalletIsConnected();
    },[]);

    return (<TransactionContext.Provider value={{connectWallet, currentAccount}}>{children}</TransactionContext.Provider>)
}