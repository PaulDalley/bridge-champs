'use client';
import { useEffect, useState } from 'react';

// Renders its children only for logged-out visitors. Mirrors HomeAuth's
// localStorage detection so the guest-facing CTAs (e.g. "Start free trial")
// don't show to signed-in members. During SSR / first paint it renders the
// children (guest default, no layout shift); members get them removed on hydrate.
export default function GuestOnly({ children }) {
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    try {
      const loggedIn = Object.keys(localStorage).some((k) =>
        k.startsWith('firebase:authUser:')
      );
      setIsMember(loggedIn);
    } catch (_) {}
  }, []);

  if (isMember) return null;
  return children;
}
