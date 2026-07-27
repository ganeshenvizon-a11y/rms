import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Toast from '../common/Toast';

const CustomerLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface overflow-x-hidden">
      <Toast />
      {/*
        NOTE: this transition intentionally animates opacity only. Animating a
        transform (x/y/scale) here would make Framer Motion apply an inline
        `transform` style that never fully clears, which turns this div into a
        CSS containing block for every `position: fixed` descendant rendered by
        the page (header, bottom nav, sticky cart bar, bottom sheets) — they'd
        be positioned relative to this scrolling content box instead of the
        viewport. Keep this opacity-only unless fixed-position chrome is moved
        out of the animated subtree.
      */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CustomerLayout;
