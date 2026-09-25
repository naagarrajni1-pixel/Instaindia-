import React from 'react';

interface InstaIndiaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const InstaIndiaLogo: React.FC<InstaIndiaLogoProps> = ({
  size = 'md',
  showText = true,
}) => {
  const iconSize =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const textSize =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-3xl'
      : 'text-2xl';

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Indian Flag Insta Camera Icon */}
      <div
        className={`relative ${iconSize} rounded-2xl p-[2px] shadow-lg group-hover:scale-105 transition-transform duration-200`}
        style={{
          background: 'linear-gradient(135deg, #FF671F 0%, #FFFFFF 48%, #046A38 100%)',
        }}
      >
        <div className="w-full h-full rounded-[14px] bg-[#0c0c12] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Tricolour Radial Glow in Background */}
          <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-[#046A38]/30 via-transparent to-[#FF671F]/40" />

          {/* Camera Outline */}
          <div className="relative w-[75%] h-[75%] rounded-[10px] border-2 border-white/90 flex items-center justify-center">
            {/* Flash sensor */}
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF671F] shadow-[0_0_6px_#FF671F]" />

            {/* Ashoka Chakra Camera Aperture */}
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#000080] bg-white flex items-center justify-center relative shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
              {/* Spoke marks */}
              <div className="absolute inset-0 rounded-full border border-[#000080]/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span
              className={`font-black tracking-tight ${textSize}`}
              style={{
                background: 'linear-gradient(90deg, #FF7A00 0%, #FF2E93 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Insta
            </span>
            <span
              className={`font-black tracking-tight ${textSize}`}
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #00D060 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              India
            </span>
            <span className="ml-1 text-sm">🇮🇳</span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/50 -mt-1">
            Bharat's Social App
          </span>
        </div>
      )}
    </div>
  );
};
