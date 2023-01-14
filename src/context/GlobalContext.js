import { ethers } from "ethers";
import { createContext, useReducer } from "react";
import CONFIG from "../abi/config";
import { AppReducer } from './AppReducer'
import stakeABI from './../abi/staking.json'
import tokenABI from './../abi/token.json'

const initialState = {
    account: null,
    web3Provider: null,
    blockChainData: {
        TokenBalance: null,
        StakeBalance: {
            plan0: null,
            plan1: null,
            plan2: null,
            plan3: null,
            plan4: null
        },
        RewardBalance: {
            plan0: null,
            plan1: null,
            plan2: null,
            plan3: null,
            plan4: null
        },
        TokenPrice:null,
        TotalRewards:null,
        TotalStaked:null, 
        apy: {
            one_month_apy: null,
            three_month_apy: null,
            six_month_apy: null,
            nine_month_apy: null,
            one_year_apy: null
        }
    }
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)

    const updateTokenBalance = (balance) => {
        dispatch({
            type: 'UPDATE_TOKEN_BALANCE', 
            payload: balance
        })
    }

    const updateStakedBalance = (balance) => {
        dispatch({
            type: 'UPDATE_STAKED_BALANCE',
            payload: balance
        })
    }

    const updateRewardBalance = (rewards) => {
        dispatch({
            type: 'UPDATE_REWARDS_BALANCE',
            payload: rewards
        })
    }

    const updateTokenPrice = (price) => {
        dispatch({
            type: 'UPDATE_TOKEN_PRICE',
            payload: price
        })
    }

    const updateTotalRewards = (rewards) => {
        dispatch({
            type: 'UPDATE_TOTAL_REWARDS',
            payload: rewards
        })
    }

    const updateTotalStaked = (totalStacked) => {
        dispatch({
            type: 'UPDATE_TOTAL_STAKED',
            payload: totalStacked
        })
    }
    const updateAccount = (account) => {
        dispatch({
            type: 'UPDATE_ACCOUNT',
            payload: account
        })
    }

    const updateWeb3Provider = (provider) => {
        dispatch({
            type: 'UPDATE_PROVIDER',
            payload: provider
        })
    }

    const updateApy = (apy) => {
        dispatch({
            type: 'UPDATE_APY',
            payload: apy
        })
    }


    const fetchAccountData = async (provider) => {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(CONFIG.contractAddress, stakeABI, signer)
        const stakeBalance = await contract.stakeOf(address, 0)
        const stakeBalance1 = await contract.stakeOf(address, 1)
        const stakeBalance2 = await contract.stakeOf(address, 2)
        const stakeBalance3 = await contract.stakeOf(address, 3)
        const stakeBalance4 = await contract.stakeOf(address, 4)
        const rewardBalance = await contract.getDailyRewards(0)
        const rewardBalance1 = await contract.getDailyRewards(1)
        const RewardBalance2 = await contract.getDailyRewards(2)
        const rewardBalance3 = await contract.getDailyRewards(3)
        const RewardBalance4 = await contract.getDailyRewards(4)
        const totalStake = await contract.totalStake()
        const totalReward = await contract.totalRewards()
        updateTotalRewards(ethers.utils.formatUnits(totalReward, CONFIG.tokenDecimals))
        updateTotalStaked(ethers.utils.formatUnits(totalStake, CONFIG.tokenDecimals))
        updateStakedBalance({
            plan0: ethers.utils.formatUnits(stakeBalance, CONFIG.tokenDecimals),
            plan1: ethers.utils.formatUnits(stakeBalance1, CONFIG.tokenDecimals),
            plan2: ethers.utils.formatUnits(stakeBalance2, CONFIG.tokenDecimals),
            plan3: ethers.utils.formatUnits(stakeBalance3, CONFIG.tokenDecimals),
            plan4: ethers.utils.formatUnits(stakeBalance4, CONFIG.tokenDecimals)
        })
        updateRewardBalance({
            plan0: ethers.utils.formatUnits(rewardBalance, CONFIG.tokenDecimals),
            plan1: ethers.utils.formatUnits(rewardBalance1, CONFIG.tokenDecimals),
            plan2: ethers.utils.formatUnits(RewardBalance2, CONFIG.tokenDecimals),
            plan3: ethers.utils.formatUnits(rewardBalance3, CONFIG.tokenDecimals),
            plan4: ethers.utils.formatUnits(RewardBalance4, CONFIG.tokenDecimals)
        })

        const tokenContract = new ethers.Contract(CONFIG.tokenAddress, tokenABI, signer)
        const balanceOf = await tokenContract.balanceOf(address)
        updateTokenBalance(ethers.utils.formatUnits(balanceOf, CONFIG.tokenDecimals))
    } 


    return (
        <GlobalContext.Provider value={
            {
                ...state,
                updateAccount,
                updateWeb3Provider,
                updateTokenBalance,
                updateStakedBalance,
                updateRewardBalance,
                updateTokenPrice,
                updateTotalRewards,
                updateTotalStaked,
                updateApy,
                fetchAccountData
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}