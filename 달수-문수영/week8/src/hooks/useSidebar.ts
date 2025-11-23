import { useCallback, useEffect, useState } from 'react';

interface UseSidebarOptions {
  lockBodyScroll?: boolean;
  enableHotkeys?: boolean;
}

export default function useSidebar(options: UseSidebarOptions = {}) {
  const { lockBodyScroll = true, enableHotkeys = true } = options;
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // Optional: lock body scroll when open
  useEffect(() => {
    if (!lockBodyScroll) return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, lockBodyScroll]);

  // Optional: keyboard shortcuts
  useEffect(() => {
    if (!enableHotkeys) return;
    const onKey = (e: KeyboardEvent) => {
      const isToggle = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b';
      if (isToggle) {
        e.preventDefault();
        toggle();
        return;
      }
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enableHotkeys, toggle, close]);

  return { isOpen, open, close, toggle };
}


