import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

interface BookLoaderProps {
  message?: string;
  light?: boolean;
}

export const BookLoader: React.FC<BookLoaderProps> = ({ 
  message = "Carregando livros...", 
  light = false 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer glow/pulse */}
        <motion.div
          className={`absolute inset-0 rounded-full ${light ? 'bg-white/10' : 'bg-obs-light/20'}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Animated Book Icon */}
        <motion.div
          animate={{
            rotateY: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ perspective: 1000 }}
        >
          <BookOpen 
            size={48} 
            className={light ? 'text-white' : 'text-obs-light'} 
          />
        </motion.div>

        {/* Floating "pages" or particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-4 h-0.5 rounded-full ${light ? 'bg-white/40' : 'bg-obs-light/40'}`}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: [0, (i - 1) * 30, (i - 1) * 50],
              y: [0, -40, -60],
              rotate: [0, 45, 90],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      
      <motion.p 
        className={`mt-6 font-serif italic ${light ? 'text-white/60' : 'text-obs-dark/40'}`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
};
