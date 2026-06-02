'use client';

import { useTheme } from '@/lib/theme';
import { motion, AnimatePresence } from 'motion/react';

export default function ThemeToggle() {
  const { isColorTheme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center h-10 w-10 rounded-lg border cursor-pointer"
      style={{
        backgroundColor: 'var(--toggle-bg)',
        borderColor: 'var(--toggle-border)',
        color: 'var(--toggle-icon-color)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      aria-label={
        isColorTheme
          ? 'Switch to Black & White theme'
          : 'Switch to Color theme'
      }
      title={
        isColorTheme
          ? 'Switch to Black & White'
          : 'Switch to Color'
      }
    >
      <AnimatePresence mode="wait">
        {isColorTheme ? (
          <motion.div
            key="bw-icon"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.18 }}
            className="w-4 h-4 flex-shrink-0"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 1.5C8 1.5 8 14.5 8 14.5C4.41 14.5 1.5 11.59 1.5 8C1.5 4.41 4.41 1.5 8 1.5Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="color-icon"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.18 }}
            className="w-4 h-4 flex-shrink-0"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                <linearGradient
                  id="rv-color-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="var(--accent-primary)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
              <circle cx="8" cy="8" r="7" fill="url(#rv-color-grad)" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>


    </motion.button>
  );
}
