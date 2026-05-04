import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useUnsavedChangesWarning = (hasUnsavedChanges: boolean) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const nextRouteRef = useRef<string | null>(null);

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = ''; // For Chrome
    };

    window.addEventListener('beforeunload', handleWindowClose);
    return () => window.removeEventListener('beforeunload', handleWindowClose);
  }, [hasUnsavedChanges]);

  const confirmNavigation = () => {
    if (nextRouteRef.current) {
      router.push(nextRouteRef.current);
      nextRouteRef.current = null;
    }
    setShowModal(false);
  };

  const cancelNavigation = () => {
    nextRouteRef.current = null;
    setShowModal(false);
  };

  const handleNavigation = (nextRoute: string) => {
    if (hasUnsavedChanges) {
      nextRouteRef.current = nextRoute;
      setShowModal(true);
    } else {
      router.push(nextRoute);
    }
  };

  return {
    showModal,
    confirmNavigation,
    cancelNavigation,
    handleNavigation,
  };
};
