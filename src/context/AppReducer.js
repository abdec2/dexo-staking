
export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_TOKEN_BALANCE':
            return {
                ...state,
                blockChainData: {
                    ...state.blockChainData,
                    TokenBalance: action.payload
                }
            }
        case 'UPDATE_STAKED_BALANCE':
            return {
                ...state,
                blockChainData: {
                    ...state.blockChainData,
                    StakeBalance: action.payload,
                }
            }

        case 'UPDATE_REWARDS_BALANCE':
            return {
                ...state,
                blockChainData: {
                    ...state.blockChainData,
                    RewardBalance: action.payload,
                }
            }

        case 'UPDATE_TOKEN_PRICE':
            return {
                ...state,
                blockChainData: {
                    ...state.blockChainData,
                    TokenPrice: action.payload
                }
            }

        case 'UPDATE_TOTAL_REWARDS':
            return {
                ...state,
                blockChainData: {
                    ...state.blockChainData,
                    TotalRewards: action.payload
                }
            }

        case 'UPDATE_TOTAL_STAKED':
            return {
                ...state,
                blockChainData: {
                    ...state.blockChainData,
                    TotalStaked: action.payload
                }
            }

        case "UPDATE_APY": 
            return {
                ...state,
                blockChainData : {
                    ...state.blockChainData,
                    apy: action.payload
                }
            }
        case 'UPDATE_ACCOUNT':
            return {
                ...state,
                account: action.payload
            }

        case 'UPDATE_PROVIDER':
            return {
                ...state,
                web3Provider: action.payload
            }
        default:
            return state;
    };
}