const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const articles = [
  {
    title: "Stayman Convention: Find a 4-4 Major Fit After 1NT",
    teaser: "Stayman is one of the most useful bidding tools. Use 2C after partner opens 1NT to check for a 4-card major fit.",
    metaDescription: "Learn Stayman in bridge bidding. Find 4-4 major fits after 1NT and avoid missing better major-suit contracts.",
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    bodyText: `Stayman is a simple convention with a huge payoff.

Before we start - At the top level, most pairs are using simple stayman, not extended stayman (which has a variety of other responses). Without going into a long debate about the advantages, suffice to say I recommend just using simple stayman.

After partner opens 1NT, you often want to know:
Do we have a 4-4 fit in hearts or spades?

Pro tip: It's almost always a good idea to find a major fit if you have one!

That is exactly what Stayman does.

How Stayman works
After 1NT from partner:
- 2C = Stayman (artificial, asks for a 4-card major)

Common opener replies:
- 2D = no 4-card major
- 2H = has 4 hearts (may also have 4 spades)
- 2S = has 4 spades (typically denies 4 hearts in basic methods)

Why this is useful
If you have an 8-card major fit, a major contract is often better than NT.
Stayman helps you find that fit quickly before you commit the contract.

Simple use case
Partner opens 1NT.
You hold:
S: QJ84
H: K73
D: 94
C: A1096

You have a 4-card major and enough values to care about game direction.
Start with 2C Stayman and learn more before deciding.

Final takeaway
Stayman is a fit-finding tool, not a random bid.
Use it to uncover 4-4 major fits after 1NT and improve contract accuracy.
Don't use it for fun, only use it if you have a 4 card major.

Where to next
Transfers: Let Opener Declare the Major (Bidding)
Stayman vs Transfers: Which Tool Should You Use? (Bidding)
Bidding Articles Hub: /bidding/advanced`,
  },
  {
    title: "Transfers: Let Opener Declare the Major",
    teaser: " transfers help responder show major-suit length after 1NT while keeping opener as declarer. It also saves \"space\".",
    metaDescription: "Learn  transfers after 1NT. Show 5-card majors clearly and let opener declare to protect strong notrump values.",
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    bodyText: `transfers are a core 1NT convention.
They make major-suit auctions cleaner and often protect your strong hand.

How transfers work
After partner opens 1NT:
- 2D = transfer to hearts
- 2H = transfer to spades

Opener accepts the transfer:
- 1NT - 2D - 2H
- 1NT - 2H - 2S

Key idea
Responder uses an artificial bid first, then opener declares the major if that becomes the final contract.
That keeps opener’s stronger NT hand hidden from the opening lead.

Also, it allows for more efficient auctions - first we transfer, then we continue to describe our hand.

When to use transfers
Use transfers when you hold 5+ cards in a major and want to show it.
This applies to weak, invitational, and stronger hands; strength is shown later by continuation.

Example
Partner opens 1NT.
You hold:
S: KJ984
H: 74
D: Q83
C: 1062

Bid 2H (transfer to spades), then decide whether to pass, invite, or push based on values.

IMPORTANT NOTE: Opener always "accepts" the transfer. Responder may bid on, just becuase opener accepts the transfer, it does not mean that it will be our final contract.
*some systems have super accepts, but we will look at that in another article.

Common mistakes

- Forgetting opener must accept transfer in standard methods
- Treating transfer bids as strength-showing by themselves (they just show 5+ cards in that suit, can have 0 points)

Final takeaway
Transfers are about efficient hand description and better contract placement.
Use them to show 5-card majors and keep opener declarer whenever practical.

Where to next
Stayman Convention: Find a 4-4 Major Fit After 1NT (Bidding)
Stayman vs Transfers: Which Tool Should You Use? (Bidding)
Bidding Articles Hub: /bidding/advanced`,
  },
  {
    title: "Stayman vs Transfers: Which Tool Should You Use?",
    teaser: "After 1NT, should responder use Stayman or transfer? Use this simple decision framework.",
    metaDescription: "Learn when to use Stayman vs transfers after 1NT. Make better responder choices and find the right strain faster.",
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    bodyText: `A common 1NT question is:
Do I start with Stayman, or do I transfer?

Simple decision rule
- Have a 5+ card major? Usually start with transfer.
- Have a 4-card major (and no 5-card major to show first)? Stayman is often right.
- Have both 4-card majors? Stayman is often right to explore 4-4 fit.
- Have no 4 card or longer major? Often just choose your NT level directly.

Why this works
Transfers always show 5+ cards in that major, its just a fact of bridge.
Stayman is best for checking 4-card major fits.

Thinking of them as “competitors” causes confusion.
They solve different hand-description problems.

Practical examples
A) 5 spades, no 4 hearts:
Use transfer to spades first.

B) 4 hearts, 4 spades, game values:
Use Stayman first.

C) Balanced hand, no major length:
Often no Stayman/transfer needed; choose NT level.

Common mistakes
- Using Stayman with clear 5-card major transfer hand
- Ignoring 4-4 fit chances by skipping Stayman
- Overcomplicating: It is simple - one tool shows 5+ cards in a suit, the other tool looks for 4-4 fits.

Final takeaway
Choose the tool based on your major-suit structure:
Transfers for 5+ majors, Stayman for 4-card fit exploration.

Clear tool choice leads to cleaner auctions.

(Ai also mention somewhere, we will look in future articles how strong you need to be to stayman, mention it is usually strong enough to invite so 9+ points, but sometimes you can do it with a weak hand, see "weak stayman" article).

Where to next
Puppet Stayman: How to Check for 5-Card Majors (Bidding)
Texas Transfers: Transfer Directly to Game (Bidding)
Bidding Articles Hub: /bidding/advanced`,
  },
  {
    title: "Puppet Stayman: How to Check for 5-Card Majors",
    teaser: "Puppet Stayman extends fit-finding after strong NT openings by checking for 5-card majors in opener’s hand.",
    metaDescription: "Learn Puppet Stayman in bridge bidding. Discover how it differs from basic Stayman and when to use it after strong NT ranges.",
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    bodyText: `Puppet Stayman is a more advanced extension of Stayman.
Its main job is to investigate if the NT opener has 5-card major suits. It also has the power to ask about 4 card majors aswell. If that sounds confusing, it isn't, lets see.

Core idea
Basic Stayman asks about 4-card majors.
Puppet Stayman focuses more on opener’s 5-card major possibility.

Recommended sequence

1NT - 2C is NORMAL stayman (ai - see article on stayman)
1NT - 3C is PUPPET stayman

After 2NT opening, many partnerships play puppet stayman. It is up to you, many top partnerships also just play simple stayman, you don't need to complicate things to get good results - simple stayman has upsides and is an effective tool!

Why players use it
Sometimes opener has a 5-card major and responder would like to know about it.

Practical warning
This is a convention where system memory matters.
If partnership agreements are fuzzy, mistakes multiply fast. If you don't feel confident with this, stick to simple stayman - you wil be fine.

So use Puppet Stayman only when:
- both players know exact responses/continuations,
- you’ve practiced follow-ups,
- and you can execute under time pressure.

Common mistakes
- Treating Puppet Stayman like normal Stayman
- Mixing response structures from different systems
- Trying to play it without written partnership notes

Lets see how it works

1NT - 3C: Responder has initiated puppet stayman - main question "do you have a 5 card major".

If the 1NT opener has a 5 card major they simply bid it. Great, thats the end of it.

However, if opener doesn't have a 5 card major, they bid 3D - I do not have a 5 card major
(*It is worth noting that some people play the 3D bid as also denying a 4 card major. I do not recommmend that but it is definitely fine, and it is more about being on the right page than worrying which is better.)

After opener has denied a 5 card major, responder can now ask about 4 card majors. Responder will show which major she has 4 cards of, by bidding it - well actually, not by bidding it, but by bidding the other major - that allows the NT opener to bid the actual major. Lets put that into an auction to make it simple.

1NT 3C:  Puppet stayman, do you have a 5 card major?
3D  3H:  3D = No I don't.  3H = I have a 4 card spade suit, I'm being a bit fancy and bidding the other major to show that, bridge is weird.

Opener can now just bid 3NT, or if she also has spades, can bid 3S!

Just note this auction

1NT 3C
3D 3S  - This auction can be sumarised as Puppet stayman - do you have a 5 card major? 3D, No I don't, 3S - I have 4 card hearts, what about you? If opener does also have 4 card hearts, they can simply bid 4H!

Final takeaway
Puppet Stayman is useful but definitely not essential. You can do fine without it.
Use it to uncover deeper major-fit detail once your basic Stayman/transfer foundation is solid.

Where to next
Texas Transfers: Transfer Directly to Game (Bidding)
Smolen Convention: Show 5-4 Majors After Stayman (Bidding)
Bidding Articles Hub: /bidding/advanced`,
  },
  {
    title: "Texas Transfers: Transfer Directly to Game",
    teaser: "Texas transfers let responder transfer to a major at the 4-level after NT openings when game in that major is clear. Responder will have 6+ cards in that major (and NT opener will always have 2+, so you have a fit!)",
    metaDescription: "Learn Texas transfers in bridge bidding. Understand when to transfer directly to 4H/4S and simplify game-forcing major auctions.",
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    bodyText: `Texas transfers are designed for game-level major decisions after NT openings.

Core concept
After a NT opening, responder can transfer directly to game in a major. I've seen two different versions of this commonly used, once again make sure you and partner are on the same page:

Version 1

-4C = transfers to 4H (two bids below 4H)
-4D = tranbsfers to 4S (two bids below 4S)

Verison 2
- 4D = transfer to 4H (one bid below)
- 4H = transfer to 4S (one bid below)

(Exact system context should match your partnership notes.)

Why use Texas
When game in a major is already clear, Texas can:
- simplify the auction,
- get to 4M quickly, and stop the opponents from bidding at lower levels (2 level etc)

It is an efficiency tool.

When Texas is usually right
Use it when:
- you know you want game in a major,
- and you do not need lower-level exploration first.

If you still need to investigate slam/shape details, another route may be better.

Common mistakes
- Using Texas too early when more information is still needed
- Forgetting partnership agreements about follow-up slam tries
- Confusing Texas with Jacoby transfers at lower levels
- You must have 6+ cards in the major to use it.

Final takeaway
Texas transfers are about fast, clear commitment to major-suit game.
Use them when the destination is already known and you want clean auction control.

Where to next
Jacoby Transfers: Let Opener Declare the Major (Bidding)
Smolen Convention: Show 5-4 Majors After Stayman (Bidding)
Bidding Articles Hub: /bidding/advanced`,
  },
  {
    title: "Smolen Convention: Show 5-4 Majors After Stayman",
    teaser: "Smolen helps responder show 5-4 major patterns after Stayman when opener denies a 4-card major.",
    metaDescription: "Learn the Smolen convention in bridge. Show 5-4 major hands efficiently after 1NT and basic Stayman responses.",
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    bodyText: `Smolen is a convention used after a Stayman start.
It solves a specific problem: responder has 5-4 in the majors and wants to show it efficiently.

Typical setup

Partner opens 1NT and you have 5-4 in the majors and enough points for game (or slam). Some people just transfer to the 5 card then bid the other one. There is a different way to do this, commonly used, called Smolen! (AI- make a note that if you have 5-4 in the majors but not enough for game, check out weak stayman article)

With 5-4 in the majors (can have 5 cards of either major, and 4 of the other), start by bidding stayman.

IF partner shows a major, great, you have a fit - end of story. Now bid game.

However, if partner bids 2D, denying a major, this is where smolen comes in - we want to show our 5 card major now.

A common Smolen context is:
- 1NT - 2C (Stayman)
- 2D (no 4-card major shown by opener)

Now responder Jumps in the major they DON'T have 5 cards in. (TRICKY PART - this is the main tricky part of smolen, it seems strange but you may quickly get used to it).

So, a typical sequence may be

1NT 2C
2D 3S - Responder bid 2C stayman, when opener said "I don't have a 5 card", responder jumped to 3S. That shows 5 cards in HEARTS (we jump in the other major). It's a bit like a transfer - we don't bid the actual suit we have, we bid the major suit next to it, that way the 1NT opener can declare the hand!

If agreements are unclear, it causes expensive misunderstandings.

Common mistakes
- Using Smolen without confirming partnership version
- Confusing Smolen jumps with natural jump bids
- Forgetting opener’s rebid implications after Smolen action

Final takeaway
Smolen is a precision tool for 5-4 major hands after Stayman.
Once your basic 1NT toolkit is stable, Smolen can improve accuracy significantly.

Where to next
Stayman Convention: Find a 4-4 Major Fit After 1NT (Bidding)
Puppet Stayman: How to Check for 5-Card Majors (Bidding)
Bidding Articles Hub: /bidding/advanced`,
  },
];

function toHtmlFromText(text) {
  const escaped = String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<pre style="white-space: pre-wrap; font-family: inherit;">${escaped}</pre>`;
}

async function main() {
  for (const article of articles) {
    const snap = await db.collection("bidding").where("title", "==", article.title).limit(1).get();
    if (snap.empty) {
      console.log(`Missing summary for title: ${article.title}`);
      continue;
    }
    const doc = snap.docs[0];
    const data = doc.data() || {};
    const bodyId = data.body;
    if (!bodyId) {
      console.log(`Missing body id for title: ${article.title}`);
      continue;
    }
    await doc.ref.set(
      {
        teaser: article.teaser,
        metaDescription: article.metaDescription,
        category: article.category,
        subcategory: article.subcategory,
        seoSubtopic: article.subcategory,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await db.collection("biddingBody").doc(bodyId).set(
      {
        text: toHtmlFromText(article.bodyText),
        body: { text: toHtmlFromText(article.bodyText) },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`Restored exact wording: ${article.title}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
