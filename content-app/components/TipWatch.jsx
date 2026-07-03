'use client';
import { useEffect, useReducer, useRef } from 'react';
import { QUICK_TIPS, FREE_LIMIT } from '../lib/quickTips';
import { detectMember } from '../lib/detectMember';
import MakeBoard from './MakeBoard';

// REVIEW flag: while Paul reviews the real videos on localhost, don't wall after
// FREE_LIMIT so he can watch all of them. Set false to restore the 2-free gate.
const REVIEW_UNGATED = true;

const GREEN = '#0f4c3a';
const GOLD = '#d4af37';

const Play = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>);
const Pause = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>);
const Lock = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>);
const Next = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5v14l9-7z" /><rect x="16" y="5" width="3" height="14" rx="1" /></svg>);
const Flame = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2c.6 3-1.4 4.6-2.8 6.3C9 10 8.6 11.5 9.4 13c-1.6-.4-2.4-2-2.4-3.5C4.9 11 4 13.5 4 15.2A8 8 0 0 0 20 15c0-4.4-3.2-7.2-4.8-9.2C14.1 4.3 13.4 3 13 2z" /></svg>);
const Bookmark = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z" /></svg>);
const Share = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="2.2" /><circle cx="18" cy="6" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M8 11l8-4M8 13l8 4" /></svg>);

const embedSrc = (id) => `https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`;

// Load the YouTube IFrame API once (singleton). Resolves with window.YT.
let ytApiPromise = null;
function loadYouTubeAPI() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { try { prev && prev(); } catch (e) {} resolve(window.YT); };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

export default function TipWatch({ startSlug }) {
  const [, force] = useReducer((x) => x + 1, 0);
  const startIndex = Math.max(0, QUICK_TIPS.findIndex((t) => t.slug === startSlug));
  const s = useRef({ cur: startIndex, watched: 0, walled: false, autoplay: true, realSub: false }).current;
  // The iframe src is server-rendered (SEO) and kept CONSTANT so React never resets
  // it; video changes go through the IFrame API (or a direct src fallback).
  const initialSrc = useRef(embedSrc(QUICK_TIPS[startIndex].videoId)).current;
  const playerRef = useRef(null);
  const toastRef = useRef(null);

  const isGuest = () => !s.realSub;
  const gated = () => !REVIEW_UNGATED && isGuest();

  function toast(msg) {
    const el = toastRef.current; if (!el) return;
    el.textContent = msg; el.style.opacity = '1';
    setTimeout(() => { if (toastRef.current) toastRef.current.style.opacity = '0'; }, 1100);
  }

  function loadVideo(i) {
    const id = QUICK_TIPS[i].videoId;
    const p = playerRef.current;
    if (p && p.loadVideoById) { try { p.loadVideoById(id); return; } catch (e) {} }
    const f = document.getElementById('tw-yt-frame');
    if (f) f.src = embedSrc(id) + '&autoplay=1';
  }

  function advance() {
    const next = s.cur + 1;
    if (gated() && next >= FREE_LIMIT) {
      s.watched = FREE_LIMIT; s.walled = true;
      const p = playerRef.current; try { p && p.pauseVideo(); } catch (e) {}
      force(); return;
    }
    s.watched += 1; s.cur = next % QUICK_TIPS.length; toast('Nice — tip complete'); loadVideo(s.cur); force();
  }

  function goTo(i) {
    if (gated() && i >= FREE_LIMIT) {
      s.watched = FREE_LIMIT; s.walled = true;
      const p = playerRef.current; try { p && p.pauseVideo(); } catch (e) {}
      force(); return;
    }
    s.cur = i; loadVideo(i); force();
  }

  function toggleAuto() { s.autoplay = !s.autoplay; force(); }

  useEffect(() => {
    let alive = true;
    detectMember().then((m) => { if (alive) { s.realSub = m; force(); } }).catch(() => {});
    loadYouTubeAPI().then((YT) => {
      if (!alive || !YT || !document.getElementById('tw-yt-frame')) return;
      const player = new YT.Player('tw-yt-frame', {
        events: {
          onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED && s.autoplay && !s.walled) advance(); },
        },
      });
      playerRef.current = player;
    }).catch(() => {});
    return () => { alive = false; try { playerRef.current && playerRef.current.destroy(); } catch (e) {} playerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tip = QUICK_TIPS[s.cur];

  return (
    <div className="tw-page">
      <div className="tw-head">
        <div className="tw-crumb">
          <a href="/tips">Quick tips</a> <span aria-hidden="true">/</span> <a href={`/tips?category=${encodeURIComponent(tip.cat)}`}>{tip.cat}</a>
        </div>
        {gated() && <a href="/membership" className="tw-subscribe">Subscribe</a>}
      </div>

      <div className="tw-grid">
        <div>
          <div className="tw-stage">
            <iframe
              id="tw-yt-frame"
              className="tw-yt"
              src={initialSrc}
              title="Bridge tip video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <span ref={toastRef} className="tw-toast">Nice</span>
            {s.walled && (
              <div className="tw-wall">
                <span className="tw-wall-lock"><Lock size={28} /></span>
                <p className="tw-wall-h">That&apos;s your {FREE_LIMIT} free tips today</p>
                <p className="tw-wall-p">Members watch every tip, with no daily cap.</p>
                <a href="/membership" className="tw-wall-cta">Become a member</a>
              </div>
            )}
          </div>

          <div className="tw-below">
            <a href={`/tips?category=${encodeURIComponent(tip.cat)}`} className="tw-cat-pill">{tip.cat}</a>
            <h1 className="tw-vid-title">{tip.title}</h1>
            <div className="tw-series">
              <span>Tip <b>{s.cur + 1}</b> of {QUICK_TIPS.length}</span>
              <span className="tw-dots">
                {QUICK_TIPS.map((_, i) => <span key={i} className="tw-dot" style={{ background: i <= s.cur ? GOLD : 'var(--bc-line)' }} />)}
              </span>
            </div>
            <div className="tw-actions">
              <button className="tw-btn"><Bookmark size={16} /> Save</button>
              <button className="tw-btn"><Share size={16} /> Share</button>
              <span className="tw-streak"><Flame size={15} /> {s.watched} watched</span>
              <button className="tw-next" onClick={advance}><Next size={16} /> Next tip</button>
            </div>
          </div>

          {(tip.hand || tip.note) && (
            <section className="tw-notes">
              {tip.hand && <div className="tw-notes-hand"><MakeBoard {...tip.hand} /></div>}
              {tip.note && <p className="tw-notes-text">{tip.note}</p>}
            </section>
          )}
        </div>

        <div>
          <div className="tw-queue-head">
            <span className="tw-queue-title">Up next</span>
            <span className="tw-auto" role="switch" aria-checked={s.autoplay} tabIndex={0} onClick={toggleAuto}>
              Autoplay
              <span className="tw-auto-track" style={{ background: s.autoplay ? '#1b6b52' : 'var(--bc-line)' }}>
                <span className="tw-auto-knob" style={{ left: s.autoplay ? '17px' : '2px' }} />
              </span>
            </span>
          </div>
          <div className="tw-queue">
            {QUICK_TIPS.map((q, i) => {
              const now = i === s.cur;
              const locked = gated() && i >= FREE_LIMIT;
              const label = now ? 'Now playing' : (locked ? 'Members only' : 'Up next');
              return (
                <div key={q.slug} className={'tw-q' + (now ? ' is-now' : '') + (locked ? ' is-locked' : '')} onClick={() => goTo(i)}>
                  <div className="tw-q-thumb" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${q.videoId}/hqdefault.jpg)` }}>
                    <span className="tw-q-ic">{locked ? <Lock size={16} /> : (now ? <Pause size={16} /> : <Play size={16} />)}</span>
                  </div>
                  <div className="tw-q-txt">
                    <p className="tw-q-title">{q.title}</p>
                    <p className="tw-q-meta" style={{ color: now ? GREEN : (locked ? '#9a6a00' : 'var(--bc-muted)') }}>{label}{q.dur ? ` · ${q.dur}` : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="tw-foot">
            {gated()
              ? <span>You have <b>{Math.max(0, FREE_LIMIT - s.watched)}</b> free left today</span>
              : <span>Autoplay on &mdash; enjoy the run</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
