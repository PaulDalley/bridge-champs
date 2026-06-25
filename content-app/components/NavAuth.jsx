'use client';
import { useEffect, useState } from 'react';

// Auth-aware nav controls for the content-app header (homepage + /learn pages).
// Detects login the same way HomeAuth does — a Firebase auth key in localStorage.
// SSR/first paint shows the guest controls (Log in / Sign up) so they're always
// present for guests and crawlers; switches to "Account" once hydrated if a
// session is found. /login, /signup, /settings are CRA routes (full page load).
export default function NavAuth() {
  const [member, setMember] = useState(false);

  useEffect(() => {
    try {
      setMember(
        Object.keys(localStorage).some((k) => k.startsWith('firebase:authUser:'))
      );
    } catch (_) {}
  }, []);

  if (member) {
    return (
      <a href="/settings" className="bc-nav-account">Account</a>
    );
  }
  return (
    <>
      <a href="/login" className="bc-nav-login">Log in</a>
      <a href="/signup" className="bc-nav-signup">Sign up</a>
    </>
  );
}
