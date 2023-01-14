import classNames from "classnames"
import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../context/GlobalContext"

const StakeDetails = ({plan, plans, setPlan}) => {
    const { blockChainData } = useContext(GlobalContext)
    

    useEffect(()=>{
        setPlan(plans[0])
    }, [blockChainData.apy.one_month_apy, blockChainData.apy.three_month_apy, blockChainData.apy.six_month_apy, blockChainData.apy.nine_month_apy, blockChainData.apy.one_year_apy])
    
    return (
        <>
            <div className="p-6 flex items-center justify-center space-x-2 md:space-x-8 text-white">
                <button className={classNames('uppercase min-w-[90px] bg-white font-bold truncate text-sm px-4 py-2 rounded-full bg-gradient-to-r from-[#53f] to-[#c561ff]', {'scale-110': plan.plan === 0})} onClick={()=> setPlan(plans[0])}>15 Days</button>

                <button className={classNames('uppercase min-w-[90px] bg-white font-bold truncate text-sm px-4 py-2 rounded-full bg-gradient-to-r from-[#53f] to-[#c561ff]', {'scale-110': plan.plan === 1})} onClick={()=> setPlan(plans[1])}>30 Days</button>

                <button className={classNames('uppercase min-w-[90px] bg-white font-bold truncate text-sm px-4 py-2 rounded-full bg-gradient-to-r from-[#53f] to-[#c561ff]', {'scale-110': plan.plan === 2})} onClick={()=> setPlan(plans[2])}>90 Days</button>
            </div>
            <div className="p-6 pt-1 flex items-center justify-center space-x-2 md:space-x-8 text-white">
                <button className={classNames('uppercase min-w-[90px] bg-white font-bold truncate text-sm px-4 py-2 rounded-full bg-gradient-to-r from-[#53f] to-[#c561ff]', {'scale-110': plan.plan === 3})} onClick={()=> setPlan(plans[3])}>120 Days</button>

                <button className={classNames('uppercase min-w-[90px] bg-white font-bold truncate text-sm px-4 py-2 rounded-full bg-gradient-to-r from-[#53f] to-[#c561ff]', {'scale-110': plan.plan === 4})} onClick={()=> setPlan(plans[4])}>12 Months</button>
            </div>
            <div className="mt-4 flex items-start justify-between">
                <div className="space-y-4 text-sm mr-4">
                    <p className="text-left">Lock period: {plan.duration}</p>
                    <p className="text-left">Re-locks on registration: Yes</p>
                    <p className="text-left">Status: Locked</p>
                </div>
                <div className="text-center md:mr-6">
                    <h3 className="uppercase text-2xl font-bold">APY</h3>
                    <h1 className="font-bold text-4xl text-[#c561ff]" >{plan.apy && parseFloat(plan.apy.toString())/100}%</h1>
                </div>
            </div>
        </>
    )
}

export default StakeDetails