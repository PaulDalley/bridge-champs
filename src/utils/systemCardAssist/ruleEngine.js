function matchNtRange(text) {
  const lower = text.toLowerCase();
  const patterns = [
    /1nt[^0-9]{0,20}(\d{2})\s*[-–]\s*(\d{2})/,
    /(\d{2})\s*[-–]\s*(\d{2})[^.]{0,30}1nt/,
  ];
  for (const re of patterns) {
    const m = lower.match(re);
    if (!m) continue;
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (Number.isNaN(a) || Number.isNaN(b)) continue;
    return `${Math.min(a, b)}-${Math.max(a, b)} balanced`;
  }
  return "";
}

function maybeAdd(list, condition, patch) {
  if (!condition) return;
  list.push(patch);
}

export function parseQuickFillText(rawText) {
  const text = String(rawText || "").trim();
  const lower = text.toLowerCase();
  const detections = [];

  const ntRange = matchNtRange(text);
  maybeAdd(detections, ntRange, {
    id: "det-1nt-range",
    title: "1NT range detected",
    text: ntRange,
    targetFields: ["Open1NT"],
    confidence: "high",
  });

  maybeAdd(detections, /\b(5[- ]?card majors?|five[- ]?card majors?)\b/.test(lower), {
    id: "det-5cm",
    title: "5-card majors",
    text: "5-card majors",
    targetFields: ["Open1H", "Open1S", "BasicSystem"],
    confidence: "high",
  });

  maybeAdd(detections, /\b(two over one|2\/1)\b/.test(lower), {
    id: "det-2over1",
    title: "2/1 style",
    text: "2/1 game-forcing style",
    targetFields: ["BasicSystem"],
    confidence: "medium",
  });

  maybeAdd(detections, /\b(stayman)\b/.test(lower), {
    id: "det-stayman",
    title: "Stayman",
    text: "2C Stayman",
    targetFields: ["Resp1NT2CStyle"],
    confidence: "high",
  });

  maybeAdd(detections, /\b(transfers?|jacoby transfers?)\b/.test(lower), {
    id: "det-transfers",
    title: "Transfers over 1NT",
    text: "Transfers over 1NT (2D/2H; style by partnership)",
    targetFields: ["Resp1NT2D", "Resp1NT2H", "Resp1NT2S"],
    confidence: "medium",
  });

  maybeAdd(detections, /\b(weak\s*2|weak twos?)\b/.test(lower), {
    id: "det-weak2",
    title: "Weak twos",
    text: "Weak 2 openings in majors (style by partnership)",
    targetFields: ["Open2H", "Open2S"],
    confidence: "medium",
  });

  maybeAdd(detections, /\b(jacoby)\b/.test(lower), {
    id: "det-jacoby",
    title: "Jacoby 2NT",
    text: "Jacoby 2NT in major suit raises",
    targetFields: ["JumpRaiseMajor"],
    confidence: "medium",
  });

  const negDbl = lower.match(/\bnegative double\b.*?\b(2h|2s|3h)\b/);
  if (negDbl && negDbl[1]) {
    detections.push({
      id: "det-negdbl",
      title: "Negative double level",
      text: `Negative double thru ${negDbl[1].toUpperCase()}`,
      targetFields: ["NegXLimit"],
      confidence: "high",
    });
  }

  maybeAdd(detections, /\b(rkcb|1430|blackwood)\b/.test(lower), {
    id: "det-slam",
    title: "Slam convention",
    text: "RKCB / Blackwood style by partnership",
    targetFields: ["RKCBStyle", "IsBlackwood"],
    confidence: "medium",
  });

  maybeAdd(detections, /\b(lebensohl)\b/.test(lower), {
    id: "det-lebensohl",
    title: "Lebensohl",
    text: "Lebensohl used in competitive auctions",
    targetFields: ["LebensohlOther"],
    confidence: "medium",
  });

  const followUps = [];
  if (!detections.some((d) => d.id === "det-1nt-range")) {
    followUps.push({
      id: "q-1nt",
      question: "What is your 1NT opening range?",
      options: ["12-14", "14-16", "15-17", "Other"],
      targetFields: ["Open1NT"],
      formatAnswer: (value) =>
        value === "Other" ? "1NT range: (please edit manually)" : `${value} balanced`,
    });
  }
  if (!detections.some((d) => d.id === "det-negdbl")) {
    followUps.push({
      id: "q-negdbl",
      question: "How high do you play negative doubles?",
      options: ["Thru 2H", "Thru 2S", "Thru 3H", "Not used"],
      targetFields: ["NegXLimit"],
      formatAnswer: (value) => value,
    });
  }
  if (!detections.some((d) => d.id === "det-weak2")) {
    followUps.push({
      id: "q-weak2",
      question: "Do you play weak two openings?",
      options: ["Yes, in majors", "Yes, including 2D", "No"],
      targetFields: ["Open2D", "Open2H", "Open2S"],
      formatAnswer: (value) => value,
    });
  }

  return { detections, followUps };
}

export function buildPatchFromDetections(items) {
  const out = {};
  items.forEach((item) => {
    if (!item || !item.enabled) return;
    const text = String(item.text || "").trim();
    if (!text) return;
    (item.targetFields || []).forEach((field) => {
      out[field] = text;
    });
  });
  return out;
}
