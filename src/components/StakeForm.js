import classNames from 'classnames'
import { useContext, useState } from 'react'
import * as yup from 'yup'
import CONFIG from '../abi/config'
import { GlobalContext } from '../context/GlobalContext'
import tokenABI from './../abi/token.json'
import contractABI from './../abi/staking.json'
import { ethers } from "ethers";
import LoadingSpinner from './LoadingSpinner'

const schema = yup.object().shape({
    amount: yup.number().required()
})

const StakeForm = ({ setError, setErrMsg, plan }) => {
    const [approve, setApprove] = useState(false)
    const [amount, setAmount] = useState('')
    const [balance, setBalance] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [Withdraw, setWithdraw] = useState(false)
    const { account, blockChainData, web3Provider, fetchAccountData } = useContext(GlobalContext)

    const handleApprove = () => {
        schema.isValid({
            amount
        }).then(async value => {
            if (value) {
                if (account) {
                    if (parseFloat(amount) <= parseFloat(blockChainData.TokenBalance)) {
                        try {
                            setLoading(true)
                            // const web3modal = new Web3Modal();
                            // const instance = await web3modal.connect();
                            // const provider = new ethers.providers.Web3Provider(instance);
                            const signer = web3Provider.getSigner();
                            const address = await signer.getAddress();
                            const tokenContract = new ethers.Contract(CONFIG.tokenAddress, tokenABI, signer)
                            const estimateGas = await tokenContract.estimateGas.approve(CONFIG.contractAddress, ethers.utils.parseUnits(amount.toString(), CONFIG.tokenDecimals))
                            console.log(estimateGas.toString())
                            const tx = {
                                gasLimit: estimateGas.toString()
                            }
                            const approveTx = await tokenContract.approve(CONFIG.contractAddress, ethers.utils.parseUnits(amount.toString(), CONFIG.tokenDecimals), tx)
                            await approveTx.wait()
                            setApprove(true)
                            console.log(approveTx)
                            setLoading(false)
                        } catch (e) {
                            setLoading(false)
                        }
                    } else {
                        setError(true)
                        setErrMsg('Unsufficient Amount')
                    }


                } else {
                    setError(true)
                    setErrMsg('Please connect your wallet')
                }
            }
        })
        setLoading(false)
    }

    const handleStake = () => {
        schema.isValid({
            amount
        }).then(async value => {
            if (value) {
                if (account) {
                    if (parseFloat(amount) <= parseFloat(blockChainData.TokenBalance)) {
                        try {
                            setLoading(true)
                            // const web3modal = new Web3Modal();
                            // const instance = await web3modal.connect();
                            // const provider = new ethers.providers.Web3Provider(instance);
                            const signer = web3Provider.getSigner();
                            const address = await signer.getAddress();
                            const contract = new ethers.Contract(CONFIG.contractAddress, contractABI, signer)
                            const estimateGas = await contract.estimateGas.createStake(ethers.utils.parseUnits(amount.toString(), CONFIG.tokenDecimals), plan.plan)
                            console.log(estimateGas.toString())
                            const tx = {
                                gasLimit: estimateGas.toString()
                            }
                            const stakeTx = await contract.createStake(ethers.utils.parseUnits(amount.toString(), CONFIG.tokenDecimals), plan.plan, tx)
                            await stakeTx.wait()
                            setApprove(false)
                            console.log(stakeTx)
                            fetchAccountData(web3Provider)
                            setLoading(false)
                        } catch (e) {
                            setLoading(false)
                        }

                    } else {
                        setError(true)
                        setErrMsg('Unsufficient Amount')
                    }

                } else {
                    setError(true)
                    setErrMsg('Please connect your wallet')
                }
            }
        })
        setLoading(false)
    }

    const handleWithdraw = () => {
        schema.isValid({
            amount: balance
        }).then(async value => {
            if (value) {
                if (account) {
                    const _staking_Balance = (plan.plan == 0) ? blockChainData.StakeBalance.plan0 : (plan.plan == 1) ? blockChainData.StakeBalance.plan1 : (plan.plan == 2) ? blockChainData.StakeBalance.plan2 : (plan.plan == 3) ? blockChainData.StakeBalance.plan3 : (plan.plan == 4) ? blockChainData.StakeBalance.plan4 : 0
                    if (parseFloat(balance) <= parseFloat(_staking_Balance)) {
                        try {
                            setLoading(true)
                            setWithdraw(true)
                            // const web3modal = new Web3Modal();
                            // const instance = await web3modal.connect();
                            // const provider = new ethers.providers.Web3Provider(instance);
                            const signer = web3Provider.getSigner();
                            const address = await signer.getAddress();
                            const contract = new ethers.Contract(CONFIG.contractAddress, contractABI, signer)
                            const estimateGas = await contract.estimateGas.unStake(ethers.utils.parseUnits(balance.toString(), CONFIG.tokenDecimals), plan.plan)
                            console.log(estimateGas.toString())
                            const tx = {
                                gasLimit: estimateGas.toString()
                            }
                            const removeStakeTx = await contract.unStake(ethers.utils.parseUnits(balance.toString(), CONFIG.tokenDecimals), plan.plan, tx)
                            await removeStakeTx.wait()
                            setApprove(false)
                            console.log(removeStakeTx)
                            fetchAccountData(web3Provider)
                            setLoading(false)
                            setWithdraw(false)
                        } catch (e) {
                            setLoading(false)
                            setWithdraw(false)
                        }
                    } else {
                        setError(true)
                        setErrMsg('Unsufficient Amount')
                    }

                } else {
                    setError(true)
                    setErrMsg('Please connect your wallet')
                }
            }
        })
        setLoading(false)
        setWithdraw(false)
    }

    return (
        <div className=" mt-2 mb-4">
            <div>
                <p className="text-xs font-bold uppercase text-[color:var(--font-color)] text-left ">Balance: {(blockChainData.TokenBalance) ? parseFloat(blockChainData.TokenBalance).toFixed(2) : '0.0'} {CONFIG.tokenSymbol}</p>
                <div className="w-full flex items-center justify-between">
                    <div className='w-3/4 relative'>
                        <input type="text" name="amount" className="w-full bg-transparent border-2 border-[color:var(--border-color)] text-md focus:outline-none px-2 py-1" value={amount} onChange={e => setAmount(e.target.value)} />
                        <span className='absolute top-0 right-0 mr-3 mt-1 cursor-pointer hover:text-[#c561ff]' onClick={() => setAmount(blockChainData.TokenBalance)}>Max</span>
                    </div>

                    {(isLoading && !Withdraw) ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <button className={classNames('bg-gradient-to-r from-[#53f] to-[#c561ff] rounded-full text-white uppercase px-4 py-2 ml-4 text-sm font-bold  min-w-[125px]', { 'hidden': approve })} onClick={handleApprove}>Approve</button>

                            <button className={classNames('bg-gradient-to-r from-[#53f] to-[#c561ff] rounded-full text-white uppercase px-4 py-2 ml-4 text-sm font-bold min-w-[125px]', { 'hidden': !approve })} onClick={handleStake}>Stake</button>
                        </>
                    )}


                </div>
            </div>
            <div className="mt-2">

                <p className="text-xs font-bold uppercase text-[color:var(--font-color)] text-left">Stake Balance: {(plan.plan == 0) ? parseFloat(blockChainData.StakeBalance.plan0).toFixed(2) : (plan.plan == 1) ? parseFloat(blockChainData.StakeBalance.plan1).toFixed(2) : (plan.plan == 2) ? parseFloat(blockChainData.StakeBalance.plan2).toFixed(2) : (plan.plan == 3) ? parseFloat(blockChainData.StakeBalance.plan3).toFixed(2) : (plan.plan == 4) ? parseFloat(blockChainData.StakeBalance.plan4).toFixed(2) : '0.00'} {CONFIG.tokenSymbol}</p>

                <div className="w-full flex items-center justify-between">
                    <div className='w-3/4 relative'>
                        <input type="text" name="amount" className="w-full bg-transparent border-2 border-[color:var(--border-color)] text-md focus:outline-none px-2 py-1 " value={balance} onChange={e => setBalance(e.target.value)} />
                        <span className='absolute top-0 right-0 mr-3 mt-1 cursor-pointer hover:text-[#c561ff]' onClick={() => setBalance((plan.plan == 0) ? blockChainData.StakeBalance.plan0 : (plan.plan == 1) ? blockChainData.StakeBalance.plan1 : (plan.plan == 2) ? blockChainData.StakeBalance.plan2 : (plan.plan == 3) ? blockChainData.StakeBalance.plan3 : (plan.plan == 4) ? blockChainData.StakeBalance.plan4 : 0)}>Max</span>
                    </div>

                    {(isLoading && Withdraw) ? (
                        <LoadingSpinner />
                    ) : (
                        <button className="bg-gradient-to-r from-[#53f] to-[#c561ff] rounded-full text-white uppercase px-4 py-2 ml-4 text-sm font-bold min-w-[125px]" onClick={handleWithdraw}>Withdraw</button>
                    )}
                </div>

            </div>
        </div>
    )
}

export default StakeForm