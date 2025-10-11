'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LeafProps {
  src: string;
  className?: string;
}

export default function Leaf({ src, className }: LeafProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`transition-transform duration-300 ease-in-out ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-10px) rotate(10deg)' : 'translateY(0)',
      }}
    >
      <Image src={src} alt="Leaf" width={40} height={40} />
    </div>
  );
}
