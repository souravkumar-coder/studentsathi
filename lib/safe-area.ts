// lib/safe-area.ts
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

// Default safe area values
const defaultInsets: SafeAreaInsets = {
  top: 20,
  bottom: 20,
  left: 10,
  right: 10,
};

// For web, use window.innerHeight
const getWebSafeArea = (): SafeAreaInsets => {
  if (Platform.OS !== 'web') return defaultInsets;
  
  // Check if we're on iOS Safari with notch
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isIPhoneX = isIOS && window.innerHeight >= 812;
  
  return {
    top: isIPhoneX ? 44 : 20,
    bottom: isIPhoneX ? 34 : 20,
    left: 10,
    right: 10,
  };
};

// Subscribe to safe area updates (web only)
export const subscribeSafeAreaUpdate = () => {
  if (Platform.OS !== 'web') {
    return () => {};
  }

  const handleResize = () => {
    // Trigger re-render on resize
    window.dispatchEvent(new Event('safe-area-update'));
  };

  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

// React Hook for safe area
export const useSafeArea = () => {
  const [insets, setInsets] = useState<SafeAreaInsets>(getWebSafeArea());

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleUpdate = () => {
      setInsets(getWebSafeArea());
    };

    window.addEventListener('safe-area-update', handleUpdate);
    
    return () => {
      window.removeEventListener('safe-area-update', handleUpdate);
    };
  }, []);

  return insets;
};

// Export for backward compatibility
export const subscribeSafeAreaInsets = subscribeSafeAreaUpdate;