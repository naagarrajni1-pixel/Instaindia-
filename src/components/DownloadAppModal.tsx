import React, { useState } from 'react';
import { X, Download, Star, Smartphone, QrCode, CheckCircle2, Shield, Zap } from 'lucide-react';
import { InstaIndiaLogo } from './InstaIndiaLogo';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [downloadingPlayStore, setDownloadingPlayStore] = useState(false);
  const [downloadingAppStore, setDownloadingAppStore] = useState(false);

  if (!isOpen) return null;

  const handlePlayStoreClick = () => {
    setDownloadingPlayStore(true);
    setTimeout(() => {
      setDownloadingPlayStore(false);
      onSuccessToast('Redirecting to Google Play Store: InstaIndia App (v4.2) 🇮🇳');
    }, 800);
  };

  const handleAppStoreClick = () => {
    setDownloadingAppStore(true);
    setTimeout(() => {
      setDownloadingAppStore(false);
      onSuccessToast('Redirecting to Apple App Store: InstaIndia for iOS ✨');
    }, 800);
  };

  const handleInstallPWA = () => {
    onSuccessToast('InstaIndia web app installed to your home screen! 🚀');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 select-none animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#0e0e14] border-2 border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Colorful Gradient Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38]" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <InstaIndiaLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Fast Net Engine · 1000x Smoother Graphics</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Get InstaIndia On Your Phone
          </h2>
          <p className="text-xs text-white/70 max-w-sm mx-auto mt-1 leading-relaxed">
            Experience ultra-fast reels, colorful stories, creator earnings, and Indian flag aesthetics on iOS & Android.
          </p>

          {/* Social Proof Stats */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9 / 5.0</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="text-white/80 font-medium">50M+ Downloads</div>
            <span className="text-white/30">·</span>
            <div className="text-emerald-400 font-semibold">#1 Social in India</div>
          </div>
        </div>

        {/* PlayStore & AppStore Direct Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Google Play Store Badge */}
          <button
            onClick={handlePlayStoreClick}
            disabled={downloadingPlayStore}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 transition-all shadow-lg active:scale-95 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-black/60 flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M3.6 1.9L13.8 12 3.6 22.1c-.4-.4-.6-1-.6-1.7V3.6c0-.7.2-1.3.6-1.7z"
                />
                <path
                  fill="#4285F4"
                  d="M17.1 8.7L13.8 12l3.3 3.3 3.9-2.2c1.1-.6 1.1-1.6 0-2.2l-3.9-2.2z"
                />
                <path fill="#FBBC04" d="M3.6 1.9l10.2 10.1 3.3-3.3L6.3.7C5.4.2 4.4.6 3.6 1.9z" />
                <path
                  fill="#34A853"
                  d="M17.1 15.3L13.8 12 3.6 22.1c.8 1.3 1.8 1.7 2.7 1.2l10.8-8z"
                />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-white/50 uppercase block font-semibold">
                Get it on
              </span>
              <span className="text-sm font-bold text-white block">
                Google Play Store
              </span>
            </div>
          </button>

          {/* Apple App Store Badge */}
          <button
            onClick={handleAppStoreClick}
            disabled={downloadingAppStore}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 transition-all shadow-lg active:scale-95 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-black/60 flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-.98 1.72-.85 2.74 1.01.08 2.03-.52 2.55-1.24z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-white/50 uppercase block font-semibold">
                Download on the
              </span>
              <span className="text-sm font-bold text-white block">
                Apple App Store
              </span>
            </div>
          </button>
        </div>

        {/* 1-Click Install PWA Web Button */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-[#FF7A00]" />
            <div>
              <p className="text-xs font-semibold text-white">Direct Web App (PWA)</p>
              <p className="text-[10px] text-white/50">Instant install without app store delay</p>
            </div>
          </div>

          <button
            onClick={handleInstallPWA}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#046A38] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all"
          >
            Add to Phone
          </button>
        </div>

        {/* Security & Indian Guarantee */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/40">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Safe, Made in Bharat, End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};
