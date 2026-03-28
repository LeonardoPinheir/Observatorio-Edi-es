import React from 'react';
import { motion } from 'motion/react';
import { Megaphone } from 'lucide-react';

interface CallLoaderProps {
  message?: string;
  light?: boolean;
}

export const CallLoader: React.FC<CallLoaderProps> = ({ 
  message = "Carregando chamadas...", 
  light = false 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Pulsing background glow */}
        <motion.div
          className={`absolute inset-0 rounded-full ${light ? 'bg-white/10' : 'bg-obs-gold/20'}`}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Animated Megaphone Icon */}
        <motion.div
          animate={{
            rotate: [-10, 10, -10],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Megaphone 
            size={56} 
            className={light ? 'text-white' : 'text-obs-gold'} 
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Sound Waves (Animated particles) */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute border-2 rounded-full ${light ? 'border-white/40' : 'border-obs-gold/40'}`}
            initial={{ opacity: 0, width: 40, height: 40, x: 10 }}
            animate={{
              opacity: [0, 1, 0],
              width: [40, 100],
              height: [40, 100],
              x: [10, 40],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
            style={{ 
              borderRadius: '50% 50% 50% 50% / 100% 0% 0% 100%',
              borderLeft: 'none',
              borderTop: 'none',
              borderBottom: 'none'
            }}
          />
        ))}
      </div>
      
      {/* Loading message with breathing effect */}
      <motion.p 
        className={`mt-8 font-serif italic tracking-wide ${light ? 'text-white/70' : 'text-obs-dark/60'}`}
        animate={{ 
          opacity: [0.5, 1, 0.5],
          letterSpacing: ["0.025em", "0.05em", "0.025em"]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
};
