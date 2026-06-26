'use client';
import { useEffect, useState } from 'react';
import { detectMember } from '../lib/detectMember';

// Auth-aware nav controls for the content-app header (homepage + /learn pages).
// Detects login via detectMember (checks both localStorage and the Firebase v9
// IndexedDB store). SSR/first paint shows the guest controls (Log in / Sign up)
// so they're always present for guests and crawlers; switches to "Account" once
// hydrated if a session is found. /login, /signup, /settings are CRA routes.
export default function NavAuth() {
  const [member, setMember] = useState(false);

  useEffect(() => {
    let alive = true;
    detectMember().then((m) => {
      if (alive) setMember(m);
    });
    return () => {
      alive = false;
    };
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
