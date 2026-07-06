'use client';
import { useEffect, useReducer, useRef } from 'react';
import { QUICK_TIPS } from '../lib/quickTips';
import { getAuthToken } from '../lib/detectMember';
import {
  getReelProgress,
  saveReelPosition,
  markReelWatched,
  setLastReel,
  isReelWatched,
  reelPercent,
} from '../lib/reelsProgress';
import MakeBoard from './MakeBoard';
import TipsNotice from './TipsNotice';

// Daily free-tip limits by effective tier (from /api/my-membership).
//   guest = not subscribed · basic = 5 · premium = unlimited.
// unknown/loading fail OPEN (Infinity) so a real member is never wrongly walled.
const LIMITS = { guest: 2, basic: 5, premium: Infinity, unknown: Infinity, loading: Infinity };
const limitFor = (tier) => (LIMITS[tier] != null ? LIMITS[tier] : Infinity);

// Daily meter — counts distinct tips watched per calendar day (local), browser-side.
const MKEY = 'bc_tips_meter';
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
function readMeter() {
  try { const m = JSON.parse(localStorage.getItem(MKEY) || '{}'); if (m && m.d === todayStr() && Array.isArray(m.s)) return m; } catch (_) {}
  return { d: todayStr(), s: [] };
}
const watchedToday = (slug) => readMeter().s.indexOf(slug) !== -1;
const watchedCount = () => readMeter().s.length;
function recordWatch(slug) { const m = readMeter(); if (m.s.indexOf(slug) === -1) { m.s.push(slug); try { localStorage.setItem(MKEY, JSON.stringify(m)); } catch (_) {} } }
const canWatch = (slug, limit) => limit === Infinity || watchedToday(slug) || watchedCount() < limit;

const GREEN = '#0f4c3a';
const GOLD = '#d4af37';

const Play = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>);
const Pause = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>);
const Lock = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>);
const Next = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5v14l9-7z" /><rect x="16" y="5" width="3" height="14" rx="1" /></svg>);
const Flame = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2c.6 3-1.4 4.6-2.8 6.3C9 10 8.6 11.5 9.4 13c-1.6-.4-2.4-2-2.4-3.5C4.9 11 4 13.5 4 15.2A8 8 0 0 0 20 15c0-4.4-3.2-7.2-4.8-9.2C14.1 4.3 13.4 3 13 2z" /></svg>);
const Bookmark = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z" /></svg>);
const Share = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="2.2" /><circle cx="18" cy="6" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M8 11l8-4M8 13l8 4" /></svg>);
const Check = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>);

const embedSrc = (id) => `https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`;

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
  const s = useRef({ cur: startIndex, walled: false, autoplay: true, tier: 'loading', mounted: false }).current;
  // Keep the SSR'd iframe src deterministic (no localStorage) to avoid a hydration
  // mismatch; the resume point is applied client-side in the mount effect below.
  const initialSrc = useRef(embedSrc(QUICK_TIPS[startIndex].videoId)).current;
  const playerRef = useRef(null);
  const toastRef = useRef(null);

  function toast(msg) {
    const el = toastRef.current; if (!el) return;
    el.textContent = msg; el.style.opacity = '1';
    setTimeout(() => { if (toastRef.current) toastRef.current.style.opacity = '0'; }, 1100);
  }

  // Persist the current reel's playback position (called while playing, on pause,
  // on switching reels, and on leave), so re-opening it resumes from the same spot.
  function savePos() {
    const p = playerRef.current;
    if (!p || !p.getCurrentTime) return;
    try { saveReelPosition(QUICK_TIPS[s.cur].slug, p.getCurrentTime() || 0, p.getDuration() || 0); } catch (e) {}
  }

  function loadVideo(i) {
    const q = QUICK_TIPS[i];
    const prog = getReelProgress(q.slug);
    const startS = prog.done ? 0 : Math.floor(prog.t || 0); // resume unless already finished
    setLastReel(q.slug);
    const p = playerRef.current;
    if (p && p.loadVideoById) { try { p.loadVideoById({ videoId: q.videoId, startSeconds: startS }); return; } catch (e) {} }
    const f = document.getElementById('tw-yt-frame');
    if (f) f.src = embedSrc(q.videoId) + (startS ? `&start=${startS}` : '') + '&autoplay=1';
  }

  // Gate-check tip i against the daily meter. load=true loads+plays it (advance/click);
  // load=false just checks the already-embedded start video.
  function gateOpen(i, load) {
    s.cur = i;
    const slug = QUICK_TIPS[i].slug;
    if (canWatch(slug, limitFor(s.tier))) {
      recordWatch(slug);
      s.walled = false;
      if (load) loadVideo(i);
    } else {
      s.walled = true;
      const p = playerRef.current; try { p && p.pauseVideo(); } catch (e) {}
    }
    force();
  }

  function advance() {
    savePos();
    const next = (s.cur + 1) % QUICK_TIPS.length;
    if (!s.walled) toast('Nice — reel complete');
    gateOpen(next, true);
  }
  function goTo(i) { if (i === s.cur) return; savePos(); gateOpen(i, true); }
  function toggleAuto() { s.autoplay = !s.autoplay; force(); }

  useEffect(() => {
    let alive = true;
    // Client-only: reveal watched ticks / resume bars (kept off during SSR + hydration).
    s.mounted = true;
    setLastReel(QUICK_TIPS[s.cur].slug);
    force();

    // Apply the opening reel's resume point to the iframe before the API wraps it
    // (client-only, so no hydration mismatch). Skip if the reel was already finished.
    const startProg = getReelProgress(QUICK_TIPS[s.cur].slug);
    if (!startProg.done && startProg.t > 0) {
      const f = document.getElementById('tw-yt-frame');
      if (f && f.src.indexOf('start=') === -1) f.src = embedSrc(QUICK_TIPS[s.cur].videoId) + `&start=${Math.floor(startProg.t)}`;
    }

    (async () => {
      try {
        const token = await getAuthToken();
        if (!token) { if (alive) { s.tier = 'guest'; gateOpen(s.cur, false); } return; }
        const r = await fetch('/api/my-membership', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }),
        });
        const d = r.ok ? await r.json() : { tier: 'unknown' };
        if (alive) { s.tier = (d && d.tier) || 'unknown'; gateOpen(s.cur, false); }
      } catch (_) { if (alive) { s.tier = 'unknown'; gateOpen(s.cur, false); } }
    })();

    loadYouTubeAPI().then((YT) => {
      if (!alive || !YT || !document.getElementById('tw-yt-frame')) return;
      const player = new YT.Player('tw-yt-frame', {
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              const q = QUICK_TIPS[s.cur];
              try { markReelWatched(q.slug, player.getDuration() || 0); } catch (_) { markReelWatched(q.slug); }
              if (s.autoplay && !s.walled) advance(); else force(); // update the watched tick
            } else if (e.data === YT.PlayerState.PAUSED) {
              savePos();
            }
          },
        },
      });
      playerRef.current = player;
    }).catch(() => {});

    // Persist position periodically while a reel is actually playing, and when the
    // tab is hidden (covers closing the tab / navigating away without a pause event).
    const poll = setInterval(() => {
      const p = playerRef.current;
      try { if (p && p.getPlayerState && p.getPlayerState() === 1) savePos(); } catch (e) {}
    }, 4000);
    const onHide = () => { if (document.visibilityState === 'hidden') savePos(); };
    document.addEventListener('visibilitychange', onHide);

    return () => {
      alive = false;
      clearInterval(poll);
      document.removeEventListener('visibilitychange', onHide);
      savePos();
      try { playerRef.current && playerRef.current.destroy(); } catch (e) {} playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tip = QUICK_TIPS[s.cur];
  const limit = limitFor(s.tier);
  const isBasic = s.tier === 'basic';

  return (
    <div className="tw-page">
      <div className="tw-head">
        <div className="tw-crumb">
          <a href="/tips">Reels</a> <span aria-hidden="true">/</span> <a href={`/tips?category=${encodeURIComponent(tip.cat)}`}>{tip.cat}</a>
        </div>
      </div>

      <TipsNotice />

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
                <p className="tw-wall-h">That&apos;s your {limit} {isBasic ? 'reels' : 'free reels'} for today</p>
                <p className="tw-wall-p">{isBasic ? 'Go premium for unlimited reels.' : 'Become a member to watch more.'}</p>
                <a href="/membership" className="tw-wall-cta">{isBasic ? 'Upgrade to premium' : 'Become a member'}</a>
              </div>
            )}
          </div>

          <div className="tw-below">
            <a href={`/tips?category=${encodeURIComponent(tip.cat)}`} className="tw-cat-pill">{tip.cat}</a>
            <h1 className="tw-vid-title">{tip.title}</h1>
            <div className="tw-series">
              <span>Reel <b>{s.cur + 1}</b> of {QUICK_TIPS.length}</span>
              <span className="tw-dots">
                {QUICK_TIPS.map((_, i) => <span key={i} className="tw-dot" style={{ background: i <= s.cur ? GOLD : 'var(--bc-line)' }} />)}
              </span>
            </div>
            <div className="tw-actions">
              <button className="tw-btn"><Bookmark size={16} /> Save</button>
              <button className="tw-btn"><Share size={16} /> Share</button>
              <span className="tw-streak"><Flame size={15} /> {s.mounted ? watchedCount() : 0} today</span>
              <button className="tw-next" onClick={advance}><Next size={16} /> Next reel</button>
            </div>
          </div>

          {!s.walled && (tip.hand || tip.note) && (
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
              // Watched ticks / resume bars are client-only (s.mounted) to avoid a
              // hydration mismatch — SSR renders the neutral "Up next" state.
              const watched = s.mounted && isReelWatched(q.slug);
              const pct = s.mounted && !now && !watched ? reelPercent(q.slug) : 0;
              const meta = now ? 'Now playing' : watched ? 'Watched' : pct > 0 ? 'Resume' : 'Up next';
              return (
                <div key={q.slug} className={'tw-q' + (now ? ' is-now' : '') + (watched ? ' is-watched' : '')} onClick={() => goTo(i)}>
                  <div className="tw-q-thumb" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${q.videoId}/hqdefault.jpg)` }}>
                    <span className="tw-q-ic">{now ? <Pause size={16} /> : <Play size={16} />}</span>
                    {watched && <span className="tw-q-tick"><Check size={13} /></span>}
                    {pct > 0 && <span className="tw-q-track" aria-hidden="true"><span className="tw-q-bar" style={{ width: pct + '%' }} /></span>}
                  </div>
                  <div className="tw-q-txt">
                    <p className="tw-q-title">{q.title}</p>
                    <p className="tw-q-meta" style={{ color: now ? GREEN : watched ? '#1b6b52' : 'var(--bc-muted)' }}>{watched && <Check size={12} />} {meta}{q.dur ? ` · ${q.dur}` : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
