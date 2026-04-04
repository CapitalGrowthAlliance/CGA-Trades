import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, Copy, ExternalLink, TrendingUp, Activity, Droplets, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Replace with actual contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder
const BSC_CHAIN_ID = 56; // 0x38 in hex

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

export default function CGATokenPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [cgaBalance, setCgaBalance] = useState<string>("0");
  const [bnbBalance, setBnbBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    document.body.classList.add('cga-token-theme-active');
    return () => {
      document.body.classList.remove('cga-token-theme-active');
    };
  }, []);

  const checkNetwork = async (provider: ethers.BrowserProvider) => {
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== BSC_CHAIN_ID) {
      setWrongNetwork(true);
      return false;
    }
    setWrongNetwork(false);
    return true;
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }], // BSC Mainnet
      });
      setWrongNetwork(false);
      if (account) {
        fetchBalances(account);
      }
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'BNB Smart Chain Mainnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/']
              }
            ],
          });
          setWrongNetwork(false);
          if (account) {
            fetchBalances(account);
          }
        } catch (addError) {
          setError("Failed to add BSC network to your wallet.");
        }
      } else {
        setError("Failed to switch to BSC network.");
      }
    }
  };

  const fetchBalances = async (address: string) => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const isCorrectNetwork = await checkNetwork(provider);
      
      if (!isCorrectNetwork) return;

      // Get BNB Balance
      const balance = await provider.getBalance(address);
      setBnbBalance(Number(ethers.formatEther(balance)).toFixed(4));

      // Get CGA Token Balance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);
      try {
        const tokenBalance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        setCgaBalance(Number(ethers.formatUnits(tokenBalance, decimals)).toFixed(2));
      } catch (err) {
        console.error("Error fetching token balance:", err);
        // Fallback if contract is not deployed yet or address is wrong
        setCgaBalance("0.00");
      }
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask or Trust Wallet to connect.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setAccount(address);
        
        // Check network and fetch balances
        await fetchBalances(address);

        // TODO: Firebase Integration
        // If you have a firebase setup, you can save the wallet address here
        // e.g., saveWalletToFirestore(address);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("User rejected the connection request.");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          fetchBalances(accounts[0].address);
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            fetchBalances(accounts[0]);
          } else {
            setAccount(null);
            setBnbBalance("0");
            setCgaBalance("0");
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      }
    };

    checkConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="flex flex-col flex-1 bg-bg-primary min-h-screen relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base Radial Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/10 via-bg-primary to-bg-primary opacity-70"></div>
        
        {/* Purple Hint Glow */}
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[#B48EFC]/5 blur-[120px] rounded-full mix-blend-screen"></div>
        
        {/* Lemon Yellow Hint Glow */}
        <div className="absolute top-[30%] left-[10%] w-[500px] h-[500px] bg-[#F7F57C]/5 blur-[100px] rounded-full mix-blend-screen"></div>
        
        {/* Gold Hint Glow */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 blur-[150px] rounded-full mix-blend-screen"></div>

        {/* Diagonal Streaks */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1C1C1C 0px, #1C1C1C 1px, transparent 1px, transparent 40px)' }}></div>
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #D4AF37 0px, #D4AF37 2px, transparent 2px, transparent 80px)' }}></div>
        
        {/* Coffee Stripe Pattern */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #4A3B2C 0px, #4A3B2C 1px, transparent 1px, transparent 20px)' }}></div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-12 flex flex-col items-center text-center max-w-5xl mx-auto justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center w-full"
        >
          {/* Token Logo Container */}
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37] via-[#F7F57C] to-[#B48EFC] rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="relative w-full h-full bg-bg-card border-2 border-[#D4AF37]/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.2)] backdrop-blur-sm overflow-hidden">
              <img 
                src="https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/ad/83/5c/ad835c66-801d-9220-8ec7-d0fe7293e065/Placeholder.mill/1200x630wa.jpg" 
                alt="CGA Token Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-card/80 backdrop-blur-sm text-text-primary text-sm font-medium mb-6 border border-[#D4AF37]/30 shadow-[0_4px_12px_rgba(212,175,55,0.1)]">
            <Activity className="w-4 h-4 text-[#D4AF37]" />
            <span>Live on BNB Smart Chain</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="notranslate">CGA</span> Token <span className="bg-gradient-to-r from-[#D4AF37] to-[#B48EFC] bg-clip-text text-transparent">Portal</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed mx-auto">
            Powering the Future of Capital Growth. Connect your wallet to manage your CGA tokens, view live analytics, and access exclusive features.
          </p>

          {!account ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="relative group overflow-hidden bg-bg-card text-text-primary border border-[#D4AF37]/30 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 mx-auto shadow-[0_8px_32px_rgba(212,175,55,0.1)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.2)] hover:-translate-y-1 disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {isConnecting ? <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" /> : <Wallet className="w-5 h-5 text-[#D4AF37]" />}
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : wrongNetwork ? (
            <button
              onClick={switchNetwork}
              className="bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-500/20 transition-all flex items-center gap-3 mx-auto"
            >
              <AlertCircle className="w-5 h-5" />
              Switch to BSC Network
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium shadow-[0_4px_12px_rgba(16,185,129,0.1)]">
              <CheckCircle2 className="w-5 h-5" />
              Wallet Connected
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-400 text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-24 space-y-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Wallet Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 bg-bg-card/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-[#D4AF37]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#F7F57C] to-[#B48EFC] opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#D4AF37]" />
              Your Wallet
            </h2>
            
            {account && !wrongNetwork ? (
              <div className="space-y-6">
                <div className="p-4 bg-bg-primary/50 rounded-xl border border-border-light">
                  <div className="text-sm text-text-secondary mb-1">Connected Address</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium">{formatAddress(account)}</span>
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-bg-hover rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                      title="Copy Address"
                    >
                      {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-primary/50 rounded-xl border border-border-light relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#D4AF37]/10 rounded-full blur-xl"></div>
                    <div className="text-sm text-text-secondary mb-1 relative z-10">CGA Balance</div>
                    <div className="text-xl font-bold text-[#D4AF37] relative z-10">{cgaBalance}</div>
                  </div>
                  <div className="p-4 bg-bg-primary/50 rounded-xl border border-border-light">
                    <div className="text-sm text-text-secondary mb-1">BNB Balance</div>
                    <div className="text-xl font-bold">{bnbBalance}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#D4AF37]/30 rounded-xl bg-bg-primary/30">
                <Wallet className="w-8 h-8 text-[#D4AF37]/50 mb-3" />
                <p className="text-text-secondary text-sm">
                  {wrongNetwork ? "Please switch to BSC network to view balances." : "Connect your wallet to view your token balances."}
                </p>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <a 
                href={`https://pancakeswap.finance/swap?outputCurrency=${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full relative group overflow-hidden bg-bg-card text-text-primary border border-[#D4AF37]/30 px-4 py-3 rounded-xl font-bold hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(212,175,55,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                Buy CGA Token
                <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
              </a>
              <a 
                href={`https://dexscreener.com/bsc/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-bg-primary/50 text-text-primary border border-border-light px-4 py-3 rounded-xl font-medium hover:bg-bg-hover transition-colors flex items-center justify-center gap-2"
              >
                View Live Chart
                <TrendingUp className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Analytics Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-bg-card/80 backdrop-blur-md p-6 rounded-2xl border border-[#D4AF37]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-text-secondary font-medium">Token Price</span>
                </div>
                <div className="text-2xl font-bold relative z-10">$0.00000</div>
                <div className="text-sm text-emerald-500 mt-1 flex items-center gap-1 relative z-10">
                  <TrendingUp className="w-3 h-3" /> +0.00% (24h)
                </div>
              </div>

              <div className="bg-bg-card/80 backdrop-blur-md p-6 rounded-2xl border border-[#D4AF37]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#B48EFC]/5 rounded-full blur-2xl group-hover:bg-[#B48EFC]/10 transition-colors"></div>
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-[#B48EFC]/10 border border-[#B48EFC]/20 text-[#B48EFC] flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-text-secondary font-medium">Liquidity</span>
                </div>
                <div className="text-2xl font-bold relative z-10">$0.00</div>
                <div className="text-sm text-text-muted mt-1 relative z-10">PancakeSwap V2</div>
              </div>

              <div className="bg-bg-card/80 backdrop-blur-md p-6 rounded-2xl border border-[#D4AF37]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#F7F57C]/5 rounded-full blur-2xl group-hover:bg-[#F7F57C]/10 transition-colors"></div>
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F57C]/10 border border-[#F7F57C]/20 text-[#C5A028] flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-text-secondary font-medium">Volume (24h)</span>
                </div>
                <div className="text-2xl font-bold relative z-10">$0.00</div>
                <div className="text-sm text-text-muted mt-1 relative z-10">Total Trading Volume</div>
              </div>
            </div>

            {/* Future Features */}
            <div className="bg-bg-card/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-[#D4AF37]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B48EFC] via-[#F7F57C] to-[#D4AF37] opacity-30"></div>
              <h3 className="text-xl font-bold mb-6">Future Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-bg-primary/50 rounded-xl border border-border-light relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-[#D4AF37] to-[#C5A028] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
                    COMING SOON
                  </div>
                  <h4 className="font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">Token Staking</h4>
                  <p className="text-sm text-text-secondary">Stake your CGA tokens to earn passive rewards and exclusive platform benefits.</p>
                </div>
                <div className="p-5 bg-bg-primary/50 rounded-xl border border-border-light relative overflow-hidden group hover:border-[#B48EFC]/30 transition-colors">
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-[#B48EFC] to-[#9D70F9] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
                    COMING SOON
                  </div>
                  <h4 className="font-bold mb-2 group-hover:text-[#B48EFC] transition-colors">Referral Rewards</h4>
                  <p className="text-sm text-text-secondary">Earn CGA tokens by inviting friends to join the Capital Growth Alliance platform.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
