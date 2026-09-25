import React, { useState } from 'react';
import {
  X,
  Coins,
  ArrowUpRight,
  TrendingUp,
  Gift,
  Award,
  Wallet,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MonetizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const MonetizeModal: React.FC<MonetizeModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [balance, setBalance] = useState(84250);
  const [upiId, setUpiId] = useState('naagarrajni@upi');
  const [withdrawAmount, setWithdrawAmount] = useState('15000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tip' | 'withdraw'>('dashboard');

  if (!isOpen) return null;

  const handleWithdrawUPI = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0 || amount > balance) {
      onSuccessToast('Invalid amount entered!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setBalance((prev) => prev - amount);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF671F', '#00B050', '#FFFFFF', '#FFD700'],
        });
      } catch {
        // safe
      }
      onSuccessToast(`₹${amount.toLocaleString()} successfully transferred to ${upiId} via UPI! 🇮🇳💰`);
      setActiveTab('dashboard');
    }, 1200);
  };

  const handleSendTip = (amount: number, creator: string) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FF4500'],
      });
    } catch {
      // safe
    }
    onSuccessToast(`Sent ₹${amount} Creator SuperGift to @${creator}! 🪙✨`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 select-none animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-[#0c0c14] border-2 border-amber-500/20 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-[#FF671F] to-emerald-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#FF671F] flex items-center justify-center shadow-lg text-black font-black text-xl">
              ₹
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide flex items-center gap-1.5">
                <span>InstaIndia Creator Monetization</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  ACTIVE
                </span>
              </h2>
              <p className="text-[11px] text-white/50">
                Earn money from Reels, brand campaigns & gifts in Bharat 🇮🇳
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/[0.04] rounded-2xl mb-5 border border-white/10">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-amber-500 to-[#FF671F] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Earnings Dashboard
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'withdraw'
                ? 'bg-gradient-to-r from-amber-500 to-[#FF671F] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Instant UPI Payout
          </button>
          <button
            onClick={() => setActiveTab('tip')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'tip'
                ? 'bg-gradient-to-r from-amber-500 to-[#FF671F] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Tip Creators
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto luxury-scrollbar space-y-4">
          {activeTab === 'dashboard' && (
            <>
              {/* Big Balance Box */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-[#FF671F]/10 to-emerald-500/10 border border-amber-500/30 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
                  <span>Available Creator Wallet</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +₹3,420 Today
                  </span>
                </div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  ₹{balance.toLocaleString()}
                </div>
                <p className="text-[11px] text-white/50 mt-1">
                  Ready to withdraw directly to your Indian bank account via UPI.
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-[#FF671F] text-black text-xs font-extrabold shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div>
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Revenue Streams
                </h3>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-white/50 text-[11px]">Reels Play Bonus</div>
                    <div className="text-base font-bold text-white mt-0.5">₹45,000</div>
                    <div className="text-[10px] text-emerald-400 mt-1">1.8M Views Eligible</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-white/50 text-[11px]">Virtual SuperGifts</div>
                    <div className="text-base font-bold text-white mt-0.5">₹18,500</div>
                    <div className="text-[10px] text-amber-400 mt-1">370 Gifts Received</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-white/50 text-[11px]">Brand Deals</div>
                    <div className="text-base font-bold text-white mt-0.5">₹15,000</div>
                    <div className="text-[10px] text-purple-400 mt-1">Jaipur Heritage & Zari</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-white/50 text-[11px]">Fan Club Subscriptions</div>
                    <div className="text-base font-bold text-white mt-0.5">₹5,750</div>
                    <div className="text-[10px] text-blue-400 mt-1">115 Active VIP Fans</div>
                  </div>
                </div>
              </div>

              {/* Fast Net Creator Acceleration Feature */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF671F]/15 via-white/5 to-[#046A38]/15 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-[#FF7A00]" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Fast Net 4K Streaming</h4>
                    <p className="text-[10px] text-white/60">
                      Auto-boosts your reels reach by 4x using India CDN nodes.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-bold">
                  TURBO ON
                </span>
              </div>
            </>
          )}

          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdrawUPI} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-xs text-white/60">Current Balance</div>
                <div className="text-2xl font-black text-white">₹{balance.toLocaleString()}</div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                  Enter UPI ID (Google Pay / PhonePe / Paytm / BHIM)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or name@okaxis"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={balance}
                  min={500}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="flex gap-2">
                {[5000, 10000, 25000, balance].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWithdrawAmount(String(amt))}
                    className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-white/80"
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-[#FF671F] to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all mt-4"
              >
                {isProcessing ? 'Processing UPI Transfer...' : `Transfer ₹${Number(withdrawAmount || 0).toLocaleString()} to UPI`}
              </button>
            </form>
          )}

          {activeTab === 'tip' && (
            <div className="space-y-4">
              <p className="text-xs text-white/70">
                Support your favorite Indian creators directly with virtual coin gifts:
              </p>

              <div className="space-y-3">
                {[
                  { name: 'priya.couture', desc: 'Haute Couture Designer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
                  { name: 'aarav.singh', desc: 'Udaipur Royal Architecture', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
                  { name: 'ananya.kathak', desc: 'Classical Kathak Soloist', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
                ].map((creator) => (
                  <div
                    key={creator.name}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-10 h-10 rounded-full object-cover border border-amber-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">@{creator.name}</div>
                        <div className="text-[10px] text-white/50">{creator.desc}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSendTip(100, creator.name)}
                        className="px-2.5 py-1 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400 text-xs font-bold border border-amber-400/30 hover:text-black transition-colors"
                      >
                        🪙 ₹100
                      </button>
                      <button
                        onClick={() => handleSendTip(500, creator.name)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-400/20 text-emerald-300 hover:bg-emerald-400 text-xs font-bold border border-emerald-400/30 hover:text-black transition-colors"
                      >
                        🎁 ₹500
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
