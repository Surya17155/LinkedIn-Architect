import React from 'react';

export const LinkedInLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.5 : 1;

  return (
    <div className="flex flex-col items-center justify-center select-none" style={{ transform: `scale(${scale})` }}>
      <div className="flex items-center">
        <span className="font-sans font-bold text-[34px] tracking-tight text-black mr-[2px]">Linked</span>
        <div className="bg-black rounded-[4px] h-[34px] w-[34px] flex items-center justify-center relative">
          <span className="font-sans font-bold text-[28px] text-white leading-none pb-[5px]">in</span>
        </div>
      </div>
      <span className="font-sans text-[12px] tracking-[0.3em] text-black uppercase mt-1 font-light opacity-80">
        Architect
      </span>
    </div>
  );
};