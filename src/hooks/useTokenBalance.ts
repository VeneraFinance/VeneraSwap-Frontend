import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import cakeABI from 'config/abi/cake.json'
import { getContract } from 'utils/web3'
import { getTokenBalance } from 'utils/erc20'
import { getCakeAddress, getMasterChefAddress } from 'utils/addressHelpers'
import masterABI from 'config/abi/masterchef.json'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getContract(cakeABI, getCakeAddress())
      const supply = await cakeContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const cakeContract = getContract(cakeABI, getCakeAddress())
      const bal = await cakeContract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setBalance(new BigNumber(bal))
    }

    fetchBalance()
  }, [tokenAddress, slowRefresh])

  return balance
}
export const useTotalCommisions = (userAddress: string) => {
  const [refTotalCommision, setTotalCommision] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    const fetchTotalCommision = async () => {
      let passAddress = "";
      if(userAddress === null){
        passAddress = '0x000000000000000000000000000000000000dEaD'
      }else{
        passAddress = userAddress
      }
      const masterContract = getContract(masterABI, getMasterChefAddress())
      console.log(passAddress,"masterContract---")
      const bal = await masterContract.methods.totalReferralCommissions(passAddress).call()
      setTotalCommision(new BigNumber(bal))
    }
      fetchTotalCommision()
  }, [userAddress, slowRefresh])

  return refTotalCommision
}

export const useTotalReferral = (userAddress: string) => {
  const [refTotalReferral, setTotalReferral] = useState(0)
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    console.log("asdasdasdasdad");
    const fetchTotalReferral = async () => {
      let passAddress = "";
      if(userAddress === null){
        passAddress = '0x000000000000000000000000000000000000dEaD'
      }else{
        passAddress = userAddress
      }
      const masterContract = getContract(masterABI, getMasterChefAddress())
      console.log(passAddress,"masterContract---")
      const bal = await masterContract.methods.referralsCount(passAddress).call()
      setTotalReferral(bal)
    }
      fetchTotalReferral()
  }, [userAddress, slowRefresh])

  return refTotalReferral
}

export const useReferrals = (userAddress: string) => {
  const [parentReferral, setparentReferral] = useState(0)
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    console.log("asdasdasdasdad");
    const fetchReferral = async () => {
      let passAddress = "";
      if(userAddress === null){
        passAddress = '0x000000000000000000000000000000000000dEaD'
      }else{
        passAddress = userAddress
      }
      const masterContract = getContract(masterABI, getMasterChefAddress())
      console.log(passAddress,"masterContract---")
      const addre = await masterContract.methods.referrers(passAddress).call()
      setparentReferral(addre)
    }
      fetchReferral()
  }, [userAddress, slowRefresh])

  return parentReferral
}

export default useTokenBalance