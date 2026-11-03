import React, { useState } from 'react';
import { RiderId } from '../types/motogp';

interface RiderAvatarProps {
  riderId: RiderId;
  name: string;
  number: string;
  size?: 'sm' | 'md' | 'lg';
}

const RIDER_IMAGE_SOURCES: Record<RiderId, { src: string; color: string; numberColor: string }> = {
  marc: {
    src: '/assets/aistudio/Marc_M_rquez_112825ec.png',
    color: '#e20613',
    numberColor: '#ffffff',
  },
  martin: {
    src: '/assets/aistudio/Jorge_Mart_n_fe1dd5e0.png',
    color: '#6b21a8',
    numberColor: '#ffffff',
  },
  bez: {
    src: '/assets/aistudio/Marco_Bezzecchi_f3ef733c.png',
    color: '#4c1d95',
    numberColor: '#ffffff',
  },
};

export const RiderAvatar: React.FC<RiderAvatarProps> = ({
  riderId,
  name,
  number,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);
  const info = RIDER_IMAGE_SOURCES[riderId];

  const sizeClasses = {
    sm: 'w-12 h-14 sm:w-13 sm:h-16',
    md: 'w-14 h-16 sm:w-16 sm:h-20',
    lg: 'w-20 h-24',
  };

  if (imgError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg flex-shrink-0 flex items-center justify-center font-black text-white shadow-xs uppercase tracking-tighter`}
        style={{ backgroundColor: info.color }}
        title={`${name} #${number}`}
      >
        <span className="motogp-font font-black italic text-base">{number}</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white relative bg-white border border-gray-200 shadow-xs`}
    >
      <img
        src={info.src}
        alt={`${name} #${number}`}
        className="w-full h-full object-cover object-[50%_15%]"
        onError={() => setImgError(true)}
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-lg pointer-events-none" />
    </div>
  );
};
