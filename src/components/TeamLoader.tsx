import React from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';

interface TeamLoaderProps {
  message?: string;
  light?: boolean;
}

export const TeamLoader: React.FC<TeamLoaderProps> = ({ 
  message = "Carregando equipe editorial...", 
  light = false 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Pulsing background glow */}
        <motion.div
          className={`absolute inset-0 rounded-full ${light ? 'bg-white/10' : 'bg-obs-teal/20'}`}
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
        
        {/* Animated Users Icon */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Users 
            size={56} 
            className={light ? 'text-white' : 'text-obs-teal'} 
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Floating particles (Animated dots) */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${light ? 'bg-white/40' : 'bg-obs-teal/40'}`}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: [Math.cos(i * Math.PI / 2) * 20, Math.cos(i * Math.PI / 2) * 50],
              y: [Math.sin(i * Math.PI / 2) * 20, Math.sin(i * Math.PI / 2) * 50],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
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
