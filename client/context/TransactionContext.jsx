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
    // eslint-disable-next-line no-unused-vars
    const [formData, setFormData] = useState({addressTo:'', amount:'',keyword:'', message:''});
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e,name)=>{
        setFormData((prevState)=>({...prevState, [name]:e.target.value}));
    }
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

    const sendTransaction = async ()=>{
        try {
            if(!ethereum) return alert("Please install metamask");
            const {addressTo, amount, keyword, message} = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method:'eth_sendTransaction',
                params:[{
                    from:currentAccount,
                    to:addressTo,
                    gas:0x5208,
                    value:parsedAmount._hex,
                }]
            })
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);
            throw new error("No ethereum object");
        }
    }


    useEffect(()=>{
        checkIfWalletIsConnected();
    },[]);

    return (<TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange,sendTransaction}}>{children}</TransactionContext.Provider>)
}