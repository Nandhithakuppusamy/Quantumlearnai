import { useEffect, useState } from 'react';

/**
 * Runtime WebXR feature detection. Never assumes a device supports VR: the
 * status stays 'checking' until navigator.xr answers isSessionSupported.
 */
export const useWebXRSupport = () => {
  const [status, setStatus] = useState('checking');
  const [reason, setReason] = useState('');

  useEffect(() => {
    let cancelled = false;

    const resolve = (nextStatus, nextReason = '') => {
      if (cancelled) return;
      setStatus(nextStatus);
      setReason(nextReason);
    };

    if (typeof navigator === 'undefined' || !navigator.xr) {
      resolve(
        'unsupported',
        typeof window !== 'undefined' && !window.isSecureContext
          ? 'WebXR requires a secure context. Open this page over HTTPS (or localhost) to use a headset.'
          : 'This browser does not expose the WebXR Device API.'
      );
      return undefined;
    }

    navigator.xr
      .isSessionSupported('immersive-vr')
      .then((supported) => {
        resolve(
          supported ? 'supported' : 'unsupported',
          supported ? '' : 'No immersive-vr device is available to this browser.'
        );
      })
      .catch((error) => {
        resolve('unsupported', error?.message || 'WebXR device query failed.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { status, reason, isSupported: status === 'supported' };
};

export default useWebXRSupport;
