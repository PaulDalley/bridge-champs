import React from "react";
import CountingTrumpsTrainer, { PracticeAuctionMiniTable, TextWithColoredSuits } from "../Counting/CountingTrumpsTrainer";

function Bid209IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          The double is an excellent tool, but it is also something that can be misused quite badly. Let&apos;s talk
          about some simple rules that will give you confidence in the bidding.
        </p>
      </section>
    </div>
  );
}

function Bid209Rule1Rich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Rule #1</h4>
        <p className="ct-revealRichBody">
          <span className="ct-revealGold">&quot;Do not double with distributional hands&quot;</span>.
        </p>
        <p className="ct-revealRichBody">
          This is my favourite rule, and I see people get it wrong so often, leading to poor results.
        </p>
        <p className="ct-revealRichBody">
          Instead of doubling, it is almost always a good idea to simply bid your suits — your longest suit.
        </p>
      </section>
    </div>
  );
}

function Bid209ExampleRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">Let&apos;s take a look at an example from recent play where an experienced player went wrong.</p>
      </section>
    </div>
  );
}

function Bid209RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">A clear no</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          <span className="ct-revealGold">&quot;Do not double with distributional hands&quot;</span>
          <span> — a hand with a six-card suit is almost never suitable for a takeout double; it&apos;s too distributional.</span>
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">What a takeout double looks like</h4>
        <p className="ct-revealRichBody">
          When you think of takeout doubles, think <strong>4441</strong>, <strong>4432</strong>, and sometimes appropriate{" "}
          <strong>5431</strong> shapes (we will look at when it is right and wrong to double on those).
        </p>
        <p className="ct-revealRichFooter">
          But overall, you should not be picturing hands with six-card suits — and nor will partner.
        </p>
      </section>
    </div>
  );
}

function Bid209WrapRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          If we double, we lose the fact that we have six clubs, and we lose it forever.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Unsurprisingly, <TextWithColoredSuits text="3♣" /> was our best spot — but you can never get there if you begin
          (and end) with a double.
        </p>
      </section>
    </div>
  );
}

function Bid210RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="1♠" />
        </span>
        <span> is the correct bid.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">Let&apos;s add to our double rules:</p>
        <p className="ct-revealRichBody" style={{ marginTop: 8 }}>
          <span className="ct-revealGold">&quot;Don&apos;t double with a good five-card major&quot;</span>
        </p>
      </section>
    </div>
  );
}

function Bid210ContinueRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Why doubling costs you</h4>
        <p className="ct-revealRichBody">
          The problem with doubling is that it no longer becomes possible to show your five-card major. Very often you
          will belong in a 5–3 major fit — which you lose when you double.
        </p>
        <p className="ct-revealRichBody">
          Put simply — you lose your most likely contract when you double instead of bidding your major.
        </p>
      </section>
    </div>
  );
}

function Bid210SummaryRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">So far</h4>
        <p className="ct-revealRichBody">It&apos;s a good idea to bid our suits rather than double when:</p>
        <ul className="ct-revealRichPoints">
          <li>
            <span className="ct-revealRichPointTitle">We&apos;re distributional</span>
            <span> — especially with a six-card suit.</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">We have a good five-card major</span>
            <span> — it usually deserves to be bid.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid211RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <TextWithColoredSuits text="1♠ is the right call." />
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Don&apos;t double with a good five-card major</h4>
        <p className="ct-revealRichBody">That rule still applies — and it&apos;s a reliable one.</p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Takeout doubles want balanced shape, not distribution</h4>
        <p className="ct-revealRichBody">
          Picture a typical takeout double: 4441, 4432, or sometimes 5431 (but not when you already hold a good
          five-card major worth bidding). By contrast, something like 5521 is distributional — it wants suit bids, not a
          double that promises balanced takeout.
        </p>
        <p className="ct-revealRichFooter">This hand doesn&apos;t fit that double picture.</p>
      </section>
    </div>
  );
}

function Bid211ContinueRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Some people play conventions to show 5+ in both unbid suits; that can work okay here, but otherwise{" "}
          <TextWithColoredSuits text="1♠" /> is fine.
        </p>
      </section>
    </div>
  );
}

function Bid212RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge">Double</span>
        <span> is the right call — three things point that way:</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <ul className="ct-revealRichPoints">
          <li>
            <span className="ct-revealRichPointTitle">Spades are shabby</span>
            <span>
              {" "}
              — When your five-card suit has bad suit quality, a takeout double is often more plausible. Treat the suit
              almost like a four-card holding you would not rush to bid on its own.
            </span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">The suit quality of the other suits is very good</span>
            <span>, so double paints a more accurate picture in this context than </span>
            <TextWithColoredSuits text="3♠" />
            <span>.</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">Level pushes you toward double</span>
            <span>
              {" "}
              — At one level, bidding a five-card major is standard. By four or five, double is normal. Three sits in
              between — and here, double is the winner (in light of both level and suit quality).
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid212ContinueRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Revising the guideline</h4>
        <p className="ct-revealRichBody">
          We have been stressing <em className="ct-revealRichKey">Bid a good five-card major</em> instead of doubling.
          On this hand you do not have a <em className="ct-revealRichKey">good</em> five-card major — so{" "}
          <em className="ct-revealRichKey">double</em> is the right fix.
        </p>
      </section>
    </div>
  );
}

function Bid213RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge">Double</span>
        <span> is the right call.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Minor vs major</h4>
        <p className="ct-revealRichBody">
          The style of many top pairs has been to double with this kind of shape when the quality five-card suit is a{" "}
          <strong>minor</strong> — not a major. With a five-card <em className="ct-revealRichKey">major</em>, you would
          usually bid it.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Why it matters</h4>
        <p className="ct-revealRichBody">
          Modern auctions lean hard toward finding major fits. If partner has five or even six spades, a takeout double
          can be a huge winner.
        </p>
      </section>
    </div>
  );
}

function Bid213ContinueRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">5431 - times when it is correct to double with that shape</h4>
        <ol className="ct-revealRichSteps">
          <li>The five-card suit is a minor.</li>
          <li>The five-card suit is a major, but the suit quality is very poor (so you are not really &quot;bidding a good five-card major&quot;).</li>
        </ol>
      </section>
    </div>
  );
}

function Bid214RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="3♣" />
        </span>
        <span> is the correct bid.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          We need a stopper to bid notrump, so let&apos;s rule that out.
        </p>
        <p className="ct-revealRichBody">
          The main point of this example: <em className="ct-revealRichKey">jumps after a double show strength</em>, but
          they are <strong>not forcing</strong> — the more you jump, the more strength you show.
        </p>
        <p className="ct-revealRichFooter">
          This is a very commonly misunderstood bidding concept.
        </p>
      </section>
    </div>
  );
}

function Bid214Continue1Rich() {
  return (
    <p className="ct-revealRichBody">
      People often get confused, thinking jumps are game force, or even preemptive, or something else.
    </p>
  );
}

function Bid214Continue2Rich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          The idea is: partner&apos;s double has wide-ranging strength, starting from an opening hand. If we have
          around 9–11 points, we need to let partner know we have something.
        </p>
        <p className="ct-revealRichBody">
          Of course, simply bidding does not show anything by itself — partner&apos;s double forced us to bid
          something, and we could have 0 points.
        </p>
      </section>
    </div>
  );
}

function Bid214Continue3Rich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">In summary: responding to a double</h4>
        <p className="ct-revealRichBody">A jump to the 3 level shows about 9-11 points.</p>
        <p className="ct-revealRichBody">
          <strong>Things to think about:</strong>
        </p>
        <ul className="ct-revealRichPoints">
          <li>What do we do when we are game-forcing?</li>
          <li>What does a double jump show?</li>
        </ul>
      </section>
    </div>
  );
}

function Bid215RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="4♠" />
        </span>
        <span> is the right bid.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Keep it simple</h4>
        <p className="ct-revealRichBody">
          In bridge we should always strive to keep it simple — and bidding opposite a double is an excellent example of
          that.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Why it works here</h4>
        <ul className="ct-revealRichPoints">
          <li>
            <span className="ct-revealRichPointTitle">Partner&apos;s double</span>
            <span>
              {" "}
              — Shows at least three cards in each major, and often four.
            </span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">We have a fit</span>
            <span> — and enough points for game.</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">So</span>
            <span>
              {" "}
              — A simple <TextWithColoredSuits text="4♠" /> is a perfect idea.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid215ContinueRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          I hope that is simple and logical so far — the next problem will build on it.
        </p>
      </section>
    </div>
  );
}

function Bid216RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="3♠" />
        </span>
        <span> is the correct bid.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Invitational</h4>
        <p className="ct-revealRichBody">
          A jump just below game shows almost enough for game - <em className="ct-revealRichKey">invitational</em>.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Three things to notice</h4>
        <ul className="ct-revealRichPoints">
          <li>
            <span className="ct-revealRichPointTitle">Jumps show values</span>
            <span>
              {" "}
              — We have seen a jump to game when we have enough for game, and a jump to just below game when we have
              almost enough — very intuitive.
            </span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">No preemptive jumps</span>
            <span> — Opposite a takeout double, jumps are not preemptive.</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">A single jump is limited</span>
            <span>
              {" "}
              — Not game forcing, or even forcing at all. That is a big thing to discuss with partner; misunderstandings
              often crop up here.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid217RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="2♥" />
        </span>
        <span> is the correct bid.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">What the jump shows</h4>
        <ul className="ct-revealRichPoints">
          <li>
            <span className="ct-revealRichPointTitle">
              <TextWithColoredSuits text="3♥" />
            </span>
            <span> — Almost enough for game (we have seen that already).</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">
              <TextWithColoredSuits text="2♥" />
            </span>
            <span>
              {" "}
              — A five-card heart suit and <em className="ct-revealRichKey">competitive</em> values — about 6–9-ish.
            </span>
          </li>
        </ul>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Context</h4>
        <p className="ct-revealRichBody">
          When you are responding to your partner&apos;s double, you could have <strong>0 points</strong>. When you
          actually have a bit of stuff, it&apos;s worth showing partner.
        </p>
      </section>
    </div>
  );
}

function Bid218RecapRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Where we&apos;ve been</h4>
        <p className="ct-revealRichBody">
          In the previous problems we looked at bidding our suit, and jumping to the appropriate level to reflect our
          strength.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Quick recap</h4>
        <p className="ct-revealRichBody">
          Jumps show varying strength levels — they are <strong>not</strong> preemptive or forcing.
        </p>
        <ol className="ct-revealRichSteps">
          <li>
            <strong>One jump</strong> — shows something.
          </li>
          <li>
            <strong>Two jumps</strong> — show more.
          </li>
          <li>
            <strong>Three jumps (to game)</strong> — show enough for game.
          </li>
        </ol>
        <p className="ct-revealRichFooter">It&apos;s that simple.</p>
      </section>
    </div>
  );
}

function Bid218QuestionRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">No guaranteed fit</h4>
        <p className="ct-revealRichBody">
          When we only have a 4-card major, we can&apos;t be sure we have a fit - partner can have 3.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">The question</h4>
        <p className="ct-revealRichBody">
          So what do we do with enough points for game, but no five-card suit? Should we just gamble and bid{" "}
          <TextWithColoredSuits text="4♠" />?
        </p>
      </section>
    </div>
  );
}

function Bid218RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="2♣" />
        </span>
        <span> — cue bidding their suit — is a very important bid.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">A simple agreement</h4>
        <p className="ct-revealRichBody">
          A simple and memorable way to play a{" "}
          <strong className="ct-revealRichKey">cue bid of their suit</strong>
          {": "}
          <em className="ct-revealRichKey">game forcing</em>, but without a five-card major (or else I would have just bid
          it at the appropriate level!).
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">What happens next</h4>
        <ul className="ct-revealRichPoints">
          <li>
            <span className="ct-revealRichPointTitle">Four-card major</span>
            <span> — Very often the cue-bidder has one and is hoping to find a fit.</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">
              <TextWithColoredSuits text="3NT" />
            </span>
            <span> — Often in the picture.</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">After the cue</span>
            <span>
              {" "}
              — We bid our hands naturally; after <TextWithColoredSuits text="2♣" />, we show four-card suits and find a
              fit.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid219PrincipleRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          An important principle - if partner knows the approximate nature of your hand, then you should pass. The
          exception of course is if partner has made a forcing bid, then you cannot pass.
        </p>
      </section>
    </div>
  );
}

function Bid219ApproximateNatureRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Lets look at what &quot;approximate nature&quot; means with the most frequently occuring example.
        </p>
      </section>
      <PracticeAuctionMiniTable auctionText="1♣ 2♥ P P ?" dealerCompass="S" auctionAllWhite />
      <section className="ct-revealRichCard ct-revealRichCard--amber" style={{ marginTop: 12 }}>
        <p className="ct-revealRichBody">
          <TextWithColoredSuits text="1♣" /> - I&apos;m 11-14 balanced. Partner can assume a lot of the time I&apos;m
          11-14 with some sort of balanced hand, say 2 or 3+ clubs, depending on your system.
        </p>
        <p className="ct-revealRichBody">
          I&apos;ve already shown that, so unless prompted to bid again, I have said everything I have to say.
        </p>
      </section>
    </div>
  );
}

function Bid219PassRevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Pass</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Pass. Partner can expect 11-14, that&apos;s what you&apos;ve got, approximately balanced.
        </p>
        <p className="ct-revealRichBody">
          There are some exceptions which I will cover in future weeks on competing - when you are short in the
          opponent&apos;s suit (1-2 cards in their suit).
        </p>
      </section>
    </div>
  );
}

function Bid219SecondHandRich() {
  return (
    <div className="ct-revealRich">
      <PracticeAuctionMiniTable auctionText="1♣ 2♥ P P ?" dealerCompass="S" auctionAllWhite />
      <section className="ct-revealRichCard ct-revealRichCard--amber" style={{ marginTop: 12 }}>
        <p className="ct-revealRichBody">Look at your newly dealt hand, what would you bid in the same auction?</p>
      </section>
    </div>
  );
}

function Bid219SecondHandRevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="3♣" />
        </span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          It&apos;s reasonable to balance here with <TextWithColoredSuits text="3♣" />. You have something more to show
          - you aren&apos;t balanced, and you have a respectable 7-card suit that partner has no idea about.
        </p>
      </section>
    </div>
  );
}

function Bid219RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Pass</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">The Power of Pass</h4>
        <p className="ct-revealRichBody">
          Pass is the correct bid. You opened <TextWithColoredSuits text="1♦" />, so partner expects about 11-14 points
          and 4-5 diamonds. Bidding again here would be &quot;bidding your hand twice&quot; which means to make a second
          bid, even though your first bid fully captured your hand.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          A common question is &quot;Shouldn&apos;t I show my stopper?&quot; Not yet. You are allowed to pass with a
          stopper.
        </p>
        <p className="ct-revealRichBody">
          If partner wants to push on and ask for a stopper, you can show it then.
        </p>
      </section>
    </div>
  );
}

function Bid219ContinuationRich() {
  return (
    <div className="ct-revealRich">
      <PracticeAuctionMiniTable auctionText="1♦ P 1♠ 2♥ P P X P 2NT" dealerCompass="S" />
      <section className="ct-revealRichCard ct-revealRichCard--slate" style={{ marginTop: 12 }}>
        <p className="ct-revealRichBody">
          So you now have a chance to show your stopper by bidding 2NT.
        </p>
        <p className="ct-revealRichBody">
          Partner can now expect 11-14 points, 4-5 diamonds, and a heart stopper, which is exactly what you have.
        </p>
      </section>
    </div>
  );
}

function Bid220RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Pass</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Pass is correct. You&apos;ve shown 15-18 by overcalling <TextWithColoredSuits text="1NT" />. You still have
          that same hand. There is nothing special or unusual about your hand that warrants another bid.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Pass is also a bid that respects the partnership - it defers to partner.
        </p>
        <p className="ct-revealRichBody">
          It&apos;s like saying, &quot;I&apos;ve just got some ordinary 1NT bid, as you know, do you want to do
          anything further or is that it?&quot;
        </p>
        <p className="ct-revealRichBody">
          Partner is in an excellent position to decide if anything further needs to be done, your hand has already
          been shown.
        </p>
      </section>
    </div>
  );
}

function Bid220Revisit2NTRich() {
  return (
    <div className="ct-revealRich">
      <PracticeAuctionMiniTable auctionText="1♦ P 1♠ 2♥ 2NT" dealerCompass="S" auctionAllWhite />
      <section className="ct-revealRichCard ct-revealRichCard--slate" style={{ marginTop: 12 }}>
        <p className="ct-revealRichBody">
          So let&apos;s say we had this auction, on a different day. We bid <TextWithColoredSuits text="2NT" /> instead
          of passed, what would it show?
        </p>
      </section>
    </div>
  );
}

function Bid220Revisit2NTRevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">18-19 balanced</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          18-19 balanced. As mentioned with 11-14 we pass, that is already what partner is expecting from us, we have
          no business bidding more unless forced.
        </p>
        <p className="ct-revealRichBody">
          With 15-17 we open <TextWithColoredSuits text="1NT" />. That is why this auction shows 18-19 balanced.
        </p>
      </section>
    </div>
  );
}

function Bid221IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          This is a bid that I think 90% or more of people get wrong. Hopefully by the end of this problem it will make
          sense.
        </p>
        <p className="ct-revealRichBody">Now with that introduction - what do you bid?</p>
      </section>
    </div>
  );
}

function Bid221RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="2♠" />
        </span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">The correct answer is 2♠, lets look at why.</p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Firstly, we have already &quot;bid our hand&quot;. Partner is expecting 11-14 points, with at least 4
          diamonds. We just have a basic, standard version of that, something partner would more or less expect,
          nothing special. So, are we allowed to pass?
        </p>
        <p className="ct-revealRichBody">
          We cannot pass, because partner&apos;s bid is forcing, if they had bid on our right, and partner was
          guaranteed to get another bid, we could gladly pass, which would convey the message that &quot;we have bid
          our hand already&quot;.
        </p>
        <p className="ct-revealRichBody">
          Passing here is a problem because it may end the auction, and while it may convey the message &quot;I have
          bid my hand already&quot;, it&apos;s unreasonable to end the auction if partner&apos;s bid is forcing and
          unlimited in strength.
        </p>
      </section>
    </div>
  );
}

function Bid221ContinueOneRich() {
  return (
    <div className="ct-revealRich">
      <PracticeAuctionMiniTable auctionText="1♦ 1♠ 2♥ P 2♠" dealerCompass="S" auctionAllWhite />
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          So what do we do when we are forced to bid but have nothing to say? The expert treatment - which most people
          get wrong but is very easy to learn - is to cue bid the opponent&apos;s suit to mean &quot;I have nothing
          interesting about my hand to show you&quot;.
        </p>
        <p className="ct-revealRichBody">
          If for example you had 6 diamonds, you could rebid diamonds. If you had a distributional hand with diamonds
          and clubs, say 5-5 shape, you could bid <TextWithColoredSuits text="3♣" />.
        </p>
        <p className="ct-revealRichBody">
          You would be delighted to show your hand if you could, but with a balanced 4432 hand, any bid showing extra
          distribution would be misleading.
        </p>
      </section>
    </div>
  );
}

function Bid221ContinueTwoRich() {
  return (
    <div className="ct-revealRich">
      <PracticeAuctionMiniTable auctionText="1♦ 1♠ 2♥ P 2♠" dealerCompass="S" auctionAllWhite />
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          In summary - when you are forced to bid, but have nothing to say, bidding the opponents suit just says
          &quot;I have nothing to say but you&apos;ve forced me to keep the bidding alive&quot;.
        </p>
        <p className="ct-revealRichBody">
          It&apos;s one of the few situations where cue bidding the opponent&apos;s suit shows nothing.
        </p>
      </section>
    </div>
  );
}

function Bid222IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">For this pair, 2♦ was game forcing. Showing at least opening strength.</p>
      </section>
    </div>
  );
}

function Bid222RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">X</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">The correct bid is to double.</p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          However, in light of the previous few examples, I would argue that you have already shown your hand with a{" "}
          <TextWithColoredSuits text="1♠" /> opening, and according to the principles just discussed, if we&apos;ve
          shown our hand it&apos;s a good idea to pass if we can. However, this situation is different - why?
        </p>
        <p className="ct-revealRichBody">
          The opponents have made a preemptive bid, so it&apos;s up to us to decide if we should bid on or double
          them. Double by us in this situation conveys &quot;I do not have a hand suitable for bidding on&quot;,
          whereas pass says &quot;I am not keen to double them, I would rather bid on&quot;.
        </p>
      </section>
    </div>
  );
}

function Bid222ContinueRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Your hand is balanced, and has values in the opponent&apos;s suit. You should be delighted to defend on this
          hand, and would be quite nervous if partner decided to keep bidding, as your hand is not suitable.
        </p>
      </section>
    </div>
  );
}

function Bid224IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          You decided to open <TextWithColoredSuits text="1♥" /> which is the style of your partnership (you are
          reluctant to open <TextWithColoredSuits text="2♣" />
          , it&apos;s best to avoid that bid if possible).
        </p>
        <p className="ct-revealRichBody">
          Partner bids <TextWithColoredSuits text="2♥" />.
        </p>
      </section>
    </div>
  );
}

function Bid224PassOrSlamQuestionRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Since you have a lot of points, you decide to make a slam try. You bid <TextWithColoredSuits text="3♠" />,
          which for your partnership shows a shortage in spades, and a very good hand, interested in slam.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate" style={{ marginTop: 12 }}>
        <p className="ct-revealRichHeading" style={{ marginBottom: 0 }}>
          What do you think now?
        </p>
      </section>
    </div>
  );
}

function Bid224PassRevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Pass</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">Pass.</p>
        <p className="ct-revealRichBody">
          Let&apos;s look at why pass is a good idea, focusing on the ingredients for slam.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Ingredients for slam</h4>
        <ul className="ct-revealRichFactorsList" aria-label="Ingredients for slam">
          <li>
            <span className="ct-revealRichFactorsList-title">Ingredient #1: Good trumps</span>
            <p className="ct-revealRichFactorsList-body">
              For slam you need very good trumps, AKQJ when you have an 8 card fit. You can&apos;t afford a trump loser
              most of the time. When the hand is otherwise perfect, you can afford 1 trump loser (in slam, of course we
              are allowed 1 loser only)!
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">Ingredient #2</span>
            <p className="ct-revealRichFactorsList-body">
              On regular hands, we need a lot of points (33 or so points for slam).
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">Ingredient #3</span>
            <p className="ct-revealRichFactorsList-body">
              On the occasions where we don&apos;t have 33 points, we need a big source of tricks — 5 card side suits are
              great; 6+ side suits are magic.
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">Ingredient #4</span>
            <p className="ct-revealRichFactorsList-body">
              We need sharp cards — aces and kings — and shortages, singletons or voids.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid224HandDetailRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          On this hand we do not meet the 33 point mark. We can&apos;t be confident about a very robust trump suit (AKQJ)
          — it would be asking too much to expect partner to have the king and jack.
        </p>
        <p className="ct-revealRichBody">
          Also, we have a normal type distribution — we do not have a 5 or 6 card side suit, and no reason to expect
          dummy to either.
        </p>
      </section>
    </div>
  );
}

function Bid224PartnerRevealRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Slam is far too much of a stretch. On this hand, the trumps broke 4-1, you had a trump loser and a club loser
          off the top. Game is not even a certainty!
        </p>
        <aside className="ct-revealRichFactorsSummary" role="note">
          Remember for slam we need very good trumps including the J if we only have an 8 card fit — we can&apos;t afford
          trump losers.
        </aside>
      </section>
    </div>
  );
}

function Bid225IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          This was a hand, where the players had an artificial auction, not worth repeating here.
        </p>
        <p className="ct-revealRichBody">But you are in the driver&apos;s seat.</p>
        <h4 className="ct-revealRichHeading">Summary of the auction</h4>
        <p className="ct-revealRichBody">
          You have found out that your partner has 11–13 points with 3 hearts.
        </p>
        <p className="ct-revealRichBody">
          You have made a slam try, and your partner has signed off — communicating to you &quot;I have a very bad hand
          for you&quot;.
        </p>
      </section>
    </div>
  );
}

function Bid225SlamCorrectRevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Continue investigating slam</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          It was correct to continue investigating slam — on this deal, bidding slam is excellent. Let&apos;s look at the
          ingredients that this hand has, which make slam excellent:
        </p>
        <p className="ct-revealRichBody">
          Firstly, it does not have the required 33 points. We have 18 opposite 11 or so, giving 29. So what are the
          factors that made this one work?
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">What made slam work</h4>
        <ul className="ct-revealRichFactorsList" aria-label="Factors that made slam work on this deal">
          <li>
            <span className="ct-revealRichFactorsList-title">1. Trump quality</span>
            <p className="ct-revealRichFactorsList-body">
              Very good trumps — we do not have a trump loser here, as we have the AKQJ — the Jack is an important card
              when we are thinking of slam!
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">2. A long side suit</span>
            <p className="ct-revealRichFactorsList-body">
              A 5 card side suit is a great asset as it is a lovely source of tricks.
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">3. Shortness</span>
            <p className="ct-revealRichFactorsList-body">Shortage in clubs.</p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">4. Sharp cards</span>
            <p className="ct-revealRichFactorsList-body">
              Sharp cards — the hand is full of Aces and Kings.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid225ClosingRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Partner, quite understandably, thought he had a terrible hand. But slam was easy, just losing the Ace of
          diamonds. This is on account of your excellent trump suit, sharp cards, and 5 card side suit.
        </p>
      </section>
    </div>
  );
}

function Bid226IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          This hand came up in a national selection trial. Partner&apos;s preempt is somewhat standard, although when
          vulnerable the agreement is that a preempt shows a &quot;good suit&quot;, and about 6–10 points.
        </p>
      </section>
    </div>
  );
}

function Bid226SlamRevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Bid slam</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Slam and even grand slam, is actually excellent here, despite not being even close to the 33 point mark. Why is
          that?
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <ul className="ct-revealRichFactorsList" aria-label="Why slam is excellent on this deal">
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span aria-hidden="true">✓ </span>
              Absolutely magical 6 card heart suit (the better quality the suit, the more magical it is).
            </p>
          </li>
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span aria-hidden="true">✓ </span>
              Shortage - voids are amazing things.
            </p>
          </li>
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span aria-hidden="true">✓ </span>
              Sharp side suit cards (<TextWithColoredSuits text="A♣" />).
            </p>
          </li>
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span aria-hidden="true">✓ </span>
              Big trump fit - 9 card trump fit.
            </p>
          </li>
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span aria-hidden="true">✓ </span>
              Excellent trumps, expecting a minimum of <span className="ct-revealRichMono">AQxxxx</span> from partner.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid226ClosingRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Declarer was able to draw trumps and make 6 heart tricks, along with 6 trump tricks, and the <TextWithColoredSuits text="A♣" />, for
          13!
        </p>
        <p className="ct-revealRichBody">
          6 card side suits are magic; they don&apos;t need to be as good as this. When the 6 card suit has 2–3 of the
          top honours, there can be huge potential.
        </p>
      </section>
    </div>
  );
}

function Bid227IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          This was a hand from the most recent US National selection, where the winning team showed great judgment on
          this hand.
        </p>
      </section>
    </div>
  );
}

function Bid227SlamVsGameRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          You have shown diamonds and clubs game forcing. Your bid of <TextWithColoredSuits text="3♠" /> in this
          partnership showed spades and very likely showed your shape.
        </p>
        <p className="ct-revealRichBody">
          How do you feel about this hand — do you think slam is likely, or are you happy to just sign off in{" "}
          <TextWithColoredSuits text="5♦" />?
        </p>
      </section>
    </div>
  );
}

function Bid227FiveDRevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="5♦" />
        </span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          On this hand, the multiple time world champion just bid <TextWithColoredSuits text="5♦" />. This might be
          surprising, as the hand has many of the features we said were useful for slam. Let&apos;s weigh up the
          features.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Features that look good</h4>
        <ul className="ct-revealRichFactorsList" aria-label="Positive features">
          <li>
            <span className="ct-revealRichFactorsList-title">1. Excellent trumps</span>
            <p className="ct-revealRichFactorsList-body">Absolutely no trump losers.</p>
          </li>
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span className="ct-revealRichFactorsList-title">2.</span> A very decent 5 card side suit.
            </p>
          </li>
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span className="ct-revealRichFactorsList-title">3.</span> Shortage (voids).
            </p>
          </li>
        </ul>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Why slam is still a bad idea</h4>
        <ul className="ct-revealRichFactorsList" aria-label="Why slam is a bad idea">
          <li>
            <span className="ct-revealRichFactorsList-title">1.</span>
            <p className="ct-revealRichFactorsList-body">
              You have already shown your partner that you have a 6-5 — partner knows about your 5 card side suit. It is
              not an unexpected asset.
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">2.</span>
            <p className="ct-revealRichFactorsList-body">
              Partner already knows that you are game forcing / strong — at least say 17+ points. You have 18 — not
              really anything extra to spare.
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">3.</span>
            <p className="ct-revealRichFactorsList-body">
              Your void is not very useful: it is opposite partner&apos;s long / strong suit — that is a bad fit. The
              less points opposite your shortage, the better.
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">4.</span>
            <p className="ct-revealRichFactorsList-body">
              Your spades aren&apos;t sharp — <TextWithColoredSuits text="Kx" /> or <TextWithColoredSuits text="Ax" />{" "}
              would be much better than <TextWithColoredSuits text="Qx" /> in a doubleton.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid227ClosingRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Game is not even easy to make.
        </p>
        <p className="ct-revealRichBody">Slam should be out of the picture.</p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Two main takeaways</h4>
        <ul className="ct-revealRichFactorsList" aria-label="Takeaways">
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span className="ct-revealRichFactorsList-title">1.</span> You have already shown your hand to your partner
              — in the context of what you have shown, your hand is not anything special.
            </p>
          </li>
          <li>
            <p className="ct-revealRichFactorsList-body">
              <span className="ct-revealRichFactorsList-title">2.</span> Shortage opposite strength / length is not good;
              it signals misfit.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bid228IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Partner has opened a 15-17 No trump and you have 15 points, what will you do?
        </p>
      </section>
    </div>
  );
}

function Bid228RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Settle for game</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          It was best on this hand to settle for game. With balanced hands, we should be very reluctant to bid games
          that don&apos;t have the full 33 points.
        </p>
        <p className="ct-revealRichBody">
          Furthermore, 4333 shape is not something that will help your side make extra tricks beyond the point count of
          the hand.
        </p>
        <p className="ct-revealRichBody">
          Even 4432 has greater chances of succeeding because you have those nice 4 card suits that can produce extra
          tricks.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Be careful, with ordinary hands stay out of the ones that aren&apos;t 33 points.
        </p>
      </section>
    </div>
  );
}

function Bid31SplintersIntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Its great to understand splinters, how to use them and how to respond to them.
        </p>
        <p className="ct-revealRichBody">
          Its even better to understand why, as that will impact every area of bidding judgment. We&apos;ll get you
          there over the next few problems.
        </p>
      </section>
    </div>
  );
}

function Bid31SplintersLessonRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">What a splinter is</h4>
        <p className="ct-revealRichBody">
          Let&apos;s start of with what a splinter is — after partner opens <TextWithColoredSuits text="1♠" /> or{" "}
          <TextWithColoredSuits text="1♥" />, it is a jump to the 4 level in a different suit.
        </p>
        <p className="ct-revealRichBody">
          So lets keep it simple and discuss which hands qualify as splinters and which don&apos;t.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Requirements</h4>
        <p className="ct-revealRichBody ct-revealRichBody--muted">short and simple version.</p>
        <p className="ct-revealRichBody">
          <span className="ct-revealGold">It shows a singleton, and 4 trumps, 2-3 sharp cards!</span>
        </p>
        <p className="ct-revealRichBody">To be more exact, or scientific, if you are so inclined.</p>
        <ol className="ct-revealRichListAlpha">
          <li>
            Generally less than 12 points, however must be good cards! approximately 3 sharp cards. By sharp I mean,
            Aces and Kings.
          </li>
          <li>a singleton or void in the suit you are splintering.</li>
          <li>4 card trump fit, never splinter with 3.</li>
          <li>generally no 5 card side suit. (unless its very poor).</li>
        </ol>
      </section>
    </div>
  );
}

function Bid31RevealRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
          <TextWithColoredSuits text="4♣" /> is an excellent bid, its a jump to the 4 level after partner has opened{" "}
          <TextWithColoredSuits text="1♠" />.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">What it shows</h4>
        <ul className="ct-revealRichTriple" aria-label="What this bid shows">
          <li>Short clubs</li>
          <li>4 trumps</li>
          <li>2-3 sharp cards!</li>
        </ul>
      </section>
    </div>
  );
}

function Bid32PrincipleInfoRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">Lets start off with an important principle.</p>
      </section>
    </div>
  );
}

function Bid32HandGottenQuestionRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        Opposite partner&apos;s splinter, has your hand gotten..?
      </p>
    </div>
  );
}

function Bid32RevealAfterBetterRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Better</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
          The hand has gotten a lot better, slam makes comfortably with the combined 22 points. Let&apos;s look at why.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Evaluation Principle</h4>
        <p className="ct-revealRichBody">
          Two hands combine well when we have no points opposite a shortage. The less we have opposite shortage the
          better.
        </p>
      </section>
    </div>
  );
}

function Bid33RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">No</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
          No this is not suitable for a splinter - has too many Queens and Jacks, it needs at least 2-3 sharp cards,
          A&apos;s and Kings.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Discipline</h4>
        <p className="ct-revealRichBody">
          The splinter bid is a very specific bid that requires discipline, don&apos;t overuse it for the sake of it.
          Partner needs to be able to visualise a narrowly defined hand. Often this allows partnerships to bid low
          point count slams, knowing that partner will have just the right cards.
        </p>
        <p className="ct-revealRichBody">
          If you relax your standards, the whole thing loses its meaning, and the partnership will be guessing.
        </p>
      </section>
    </div>
  );
}

function Bid34IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">Let&apos;s check some common auctions.</p>
      </section>
    </div>
  );
}

function Bid34Q1AuctionRich() {
  return (
    <div className="ct-revealRich">
      <PracticeAuctionMiniTable auctionText="1♠ P 4♥" dealerCompass="S" auctionAllWhite />
      <p className="ct-revealRichBody" style={{ marginTop: 12 }}>
        Is <TextWithColoredSuits text="4♥" /> a splinter or a natural bid?
      </p>
    </div>
  );
}

function Bid34Reveal1Rich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Depends</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
          I&apos;ve put this in here because it is a point of controversy and something that should be discussed with
          your regular partner.
        </p>
        <p className="ct-revealRichBody">
          My recommendation is to play it as a splinter, but whatever you play it as, that is not so important - its
          more important to know what it means.
        </p>
      </section>
    </div>
  );
}

function Bid34CompetitionThinkRich() {
  return (
    <div className="ct-revealRich">
      <PracticeAuctionMiniTable auctionText="1♠ 2♣ 4♥" dealerCompass="S" auctionAllWhite />
      <section className="ct-revealRichCard ct-revealRichCard--slate" style={{ marginTop: 12 }}>
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
          What about this auction, where now there is interference. With the <TextWithColoredSuits text="2♣" />{" "}
          overcall, what does <TextWithColoredSuits text="4♥" /> mean to you? When you are ready, continue and we will
          talk through a practical guideline.
        </p>
      </section>
    </div>
  );
}

function Bid34CompetitionGuidanceRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">No single &quot;correct&quot; answer</h4>
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
          There is no one answer everyone plays the same way — that is why it is worth chatting with your regular
          partner. Here is what I recommend, and how I like to think about it.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">In competition</h4>
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
          A great rule that most top partnerships follow - &quot;In competition all bids are natural&quot;.
        </p>
        <p className="ct-revealRichBody">
          If you apply that rule, <TextWithColoredSuits text="4♥" /> is natural.
        </p>
        <p className="ct-revealRichBody">One great thing about the rule, it removes all ambiguity.</p>
      </section>
    </div>
  );
}

function Bid35QuestionRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        There is no auction given for this problem, just imagine you know your partner&apos;s exact shape (Look at partner&apos;s hand which is face up)
      </p>
      <p className="ct-revealRichBody">
        Imagine you know your partner&apos;s exact shape. You have agreed spades, how do you feel about your hand?
      </p>
      <p className="ct-revealRichBody ct-revealRichBody--muted">
        (Your partner&apos;s shape is as shown, 3 spades, 5 hearts, 1 diamond, 4 clubs)
      </p>
    </div>
  );
}

function Bid35Reveal1Rich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Bad</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
          Bridge is a simple game - you have 8 of your points opposite partner&apos;s shortage - that is bad.
        </p>
        <p className="ct-revealRichBody">
          The less points you have opposite your partner&apos;s shortage, the better.
        </p>
      </section>
    </div>
  );
}

function Bid35BeyondSplintersRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Understanding that points opposite a shortage is bad, will give you benefits that extend well beyond splinter
          auctions.
        </p>
      </section>
    </div>
  );
}

/** West 1♥ — North 1NT — East 2♥ — South to bid (no filler passes). */
const BID36_OPENING_AUCTION = "1♥ 1NT 2♥ ?";
const BID36_FULL_AUCTION = "1♥ 1NT 2♥ 2NT P 3♣ P 3♦ P P P";
/** South (bid3-6): concrete low cards 2–9; T = 10 in the long diamond suit per app hand notation. */
const BID36_SOUTH_SHOWN_HANDS = { S: "943", H: "98", D: "KJT6542", C: "7" };
const BID37_OPENING_AUCTION = "2♥ X P ?";
const BID38_RECAP1_AUCTION = "P 1NT 2♠ ?";
const BID38_RECAP2_AUCTION = "2♥ X P ?";
const BID39_OPENING_AUCTION = "1♠ 1NT 2♠ ?";
const BID310_OPENING_AUCTION = "1NT 2♠ ?";
const BID310_FOLLOW_AUCTION = "1NT 2♥ ?";

function Bid36IntroRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Topic: Lebensohl</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody ct-revealRichBody--muted">
          Let&apos;s look at Lebensohl, very popular at the top level of bridge, for good reason! And it&apos;s super easy
          to learn and play.
        </p>
      </section>
    </div>
  );
}

function Bid36LebensohlAndPartscoreRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Lebensohl</h4>
        <p className="ct-revealRichBody">
          Partscore battles are actually considered to be the most important part of bridge bidding.
        </p>
      </section>
    </div>
  );
}

function Bid36CompeteFactorsRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Competing for the partscore</h4>
        <p className="ct-revealRichBody ct-revealRichBody--belowHeadingTight">Let&apos;s look at the main factors for competing:</p>
        <ul className="ct-revealRichFactorsList" aria-label="Main factors for competing">
          <li>
            <span className="ct-revealRichFactorsList-title">They have a fit</span>
            <p className="ct-revealRichFactorsList-body">
              Letting the opponents play in a fit on the two level is typically a bad idea — around 90% of the time it is
              a bad idea.
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">Shape</span>
            <p className="ct-revealRichFactorsList-body">
              The more unbalanced we are, the more attractive it is to compete.
            </p>
          </li>
          <li>
            <span className="ct-revealRichFactorsList-title">Suit quality</span>
            <p className="ct-revealRichFactorsList-body">
              Good suit quality (for our long suits) makes competing more attractive.
            </p>
          </li>
        </ul>
        <div className="ct-revealRichFactorsSummary" role="note">
          <span className="ct-revealGold">In summary:</span> Don&apos;t let the opponents play in a fit on the two level,
          especially when we are unbalanced with a good suit.
        </div>
      </section>
    </div>
  );
}

function Bid36TwoNTRelayRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">How to use Lebensohl</h4>
        <ol className="ct-revealRichLebensohlSteps">
          <li>
            Partner opens or overcalls <TextWithColoredSuits text="1NT" />
          </li>
          <li>They bid on the 2 level</li>
          <li>
            You bid <span className="ct-revealGold">2NT</span>, saying &quot;I have a suit I want to bid, just to
            compete&quot;
          </li>
        </ol>
      </section>
    </div>
  );
}

function Bid36QuestionLeadRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        What would you bid here? Use the bidding box (Pass, 2NT, 3<span className="ct-suitSym ct-suitSym--red">♦</span>,
        etc.).
      </p>
    </div>
  );
}

function Bid36RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">2NT</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          We are not strong enough to bid 3<span className="ct-suitSym ct-suitSym--red">♦</span> and force partner to continue
          bidding, but we cannot afford to pass. 2NT is the perfect bid, letting partner know we have a suit we want to
          compete in.
        </p>
      </section>
    </div>
  );
}

function Bid36AuctionFollowRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Continue the auction</h4>
        <PracticeAuctionMiniTable auctionText={BID36_FULL_AUCTION} dealerCompass="W" />
        <p className="ct-revealRichBody ct-revealRichBody--belowMiniTable">
          One more critical detail: partner should always bid 3<span className="ct-suitSym">♣</span> after Lebensohl, giving
          you the full room of the three level to bid your suit, or to pass 3<span className="ct-suitSym">♣</span> if clubs
          is your suit.
        </p>
        <p className="ct-revealRichBody">
          As shown, this auction can work out well for your side: you are declaring <TextWithColoredSuits text="3♦" /> with a
          good suit, rather than letting the opponents play in <TextWithColoredSuits text="2♥" />.
        </p>
      </section>
    </div>
  );
}

function Bid37MessageToUserRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Partner has made a takeout double. Does the simple <TextWithColoredSuits text="3♣" /> seem like a sensible bid?
        </p>
      </section>
    </div>
  );
}

function Bid37Continue1Rich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Think of it from Partner&apos;s point of view, you could have 0 points, partner has forced you to bid!
        </p>
        <p className="ct-revealRichBody">
          Let&apos;s say partner has a nice 16 or so points, and you bid <TextWithColoredSuits text="3♣" />. How does
          partner know whether you have 0 points or whether you have this quite respectable hand?
        </p>
      </section>
    </div>
  );
}

function Bid37Continue2Rich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          This is the second scenario where we use Lebensohl. This time, <TextWithColoredSuits text="2NT" /> says &quot;I
          have a terrible hand&quot;.
        </p>
        <p className="ct-revealRichBody">
          Hint: in both cases, <TextWithColoredSuits text="2NT" /> shows the weakest hand. Think of{" "}
          <TextWithColoredSuits text="2NT" /> as a STOP sign.
        </p>
        <p className="ct-revealRichBody">
          Whereas, on decent hands like this, you can bid the direct <TextWithColoredSuits text="3♣" /> and convey that
          you have a decent hand.
        </p>
      </section>
    </div>
  );
}

function Bid37RecapRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Lets recap the features</h4>
        <ol className="ct-revealRichLebensohlSteps">
          <li>The opponents open a weak 2.</li>
          <li>Partner makes a takeout double.</li>
          <li>
            Bidding <TextWithColoredSuits text="2NT" /> says - I have a terrible hand (0-7 points), otherwise you show
            &quot;something&quot; about 8-11.
          </li>
        </ol>
      </section>
    </div>
  );
}

function Bid37GameForceRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">What about if you have enough points for game?</h4>
        <p className="ct-revealRichBody">
          Simply just bid game, or if you don&apos;t have a clear bid, cue bid the opponent&apos;s suit.
        </p>
        <p className="ct-revealRichBody">
          So what do you bid here?
        </p>
      </section>
    </div>
  );
}

function Bid37QuestionRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">Use the bidding box.</p>
    </div>
  );
}

function Bid37RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">3♣</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          <TextWithColoredSuits text="3♣" /> conveys that you have a decent hand, partner can keep the bidding moving if
          they have extras, or simply pass if they have a basic takeout double.
        </p>
      </section>
    </div>
  );
}

function Bid38RecapQuestion1Rich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Lets do a quick recap</h4>
        <p className="ct-revealRichBody">Take a look at the example auction.</p>
        <PracticeAuctionMiniTable auctionText={BID38_RECAP1_AUCTION} dealerCompass="W" />
        <p className="ct-revealRichBody">In such a situation, our <TextWithColoredSuits text="2NT" /> shows?</p>
      </section>
    </div>
  );
}

function Bid38RecapReveal1Rich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">A weak hand</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Correct. We use <TextWithColoredSuits text="2NT" /> when we are not interested in game, but just want to
          compete.
        </p>
      </section>
    </div>
  );
}

function Bid38RecapQuestion2Rich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          The shown auction is a typical example of the second situation that we play lebensohl.
        </p>
        <PracticeAuctionMiniTable auctionText={BID38_RECAP2_AUCTION} dealerCompass="W" />
        <p className="ct-revealRichBody">In this context <TextWithColoredSuits text="2NT" /> shows:</p>
      </section>
    </div>
  );
}

function Bid38RecapReveal2Rich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">A bad hand</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          It&apos;s fairly easy to remember, <TextWithColoredSuits text="2NT" /> always shows the bad hand. Partner
          usually takes it very easy after they see <TextWithColoredSuits text="2NT" /> - it&apos;s like a stop sign{" "}
          <span aria-label="stop sign">🛑</span>.
        </p>
      </section>
    </div>
  );
}

function Bid38AuctionMeaningRevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Intermediate, 8-11, not forcing</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          This is the context where partner can tell us they have some points, in case we have extra. It&apos;s natural,
          and not forcing, but shows about 8-11 points.
        </p>
      </section>
    </div>
  );
}

function Bid38Question3Rich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <PracticeAuctionMiniTable auctionText={BID38_RECAP2_AUCTION} dealerCompass="W" />
      </section>
      <p className="ct-revealRichBody ct-revealRichBody--belowMiniTable">
        What would a bid of <TextWithColoredSuits text="3♣" /> mean here?
      </p>
    </div>
  );
}

function Bid39QuestionRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        What do you bid here? (A bit of a trick question!)
      </p>
      <p className="ct-revealRichBody">Use the bidding box.</p>
    </div>
  );
}

function Bid39RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">X</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          The simple takeout double is great here. Just because we have Lebensohl available does not mean we want to
          over-use it.
        </p>
        <ol className="ct-revealRichLebensohlSteps">
          <li>We don&apos;t let them play on the two level in a fit.</li>
          <li>
            Remember partner has 15-18, our side has our fair share of points, we are strong enough to compete for the
            partscore.
          </li>
          <li>
            The takeout double is a great tool when we have this type of shape (5431, 4441, 4432).
          </li>
        </ol>
      </section>
    </div>
  );
}

function Bid310Question1Rich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">What do you bid here?</p>
    </div>
  );
}

function Bid310Reveal1Rich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Pass</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">Pass is a great bid here.</p>
        <p className="ct-revealRichBody">
          On the one hand we are fiercely determined to compete when we can. Tools like Lebensohl and the takeout double
          are great for that.
        </p>
        <p className="ct-revealRichBody">
          However, when we have 3+ cards in the opponent&apos;s suit, it typically indicates a time to pass. Why?
        </p>
        <p className="ct-revealRichBody">
          Perhaps partner with shortage can make a takeout double if it seems appropriate. Or, alternatively, partner has
          length in spades, in which case - it seems like a great idea to defend, they do not have a fit.
        </p>
        <p className="ct-revealRichBody">
          &quot;We are fiercely determined to compete, except when they are in a bad contract!&quot;
        </p>
      </section>
    </div>
  );
}

function Bid310ContinueRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Lets just get grounded and make sure we haven&apos;t lost track of how simple bridge is, what do you bid here?
        </p>
        <PracticeAuctionMiniTable auctionText={BID310_FOLLOW_AUCTION} dealerCompass="N" />
        <p className="ct-revealRichBody ct-revealRichBody--belowMiniTable">
          South hand for this follow-up: <TextWithColoredSuits text="♠AJ984 ♥102 ♦876 ♣1074" />.
        </p>
      </section>
    </div>
  );
}

function Bid310Question2Rich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">Use the bidding box.</p>
    </div>
  );
}

function Bid310Reveal2Rich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">2♠</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          A simple bid on the two level is natural and not forcing in this situation - we don&apos;t need anything fancy
          here, just bid your suit.
        </p>
        <p className="ct-revealRichBody">
          Why isn&apos;t it forcing? Because, it&apos;s so important for us to be able to compete for the part score.
        </p>
      </section>
    </div>
  );
}

function Bid127IntroRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Preempt style has evolved. Here is what the best pairs do today — in plain terms, with reasons you can use
          right away.
        </p>
      </section>
    </div>
  );
}

function Bid127PartnerWarnRich() {
  return (
    <div className="ct-revealRich">
      <section
        className="ct-revealRichCard ct-revealRichCard--amber"
        style={{
          borderLeft: "4px solid #dc2626",
        }}
      >
        <div className="ct-revealRichLead" style={{ marginBottom: 10 }}>
          <span className="ct-revealRichBadge ct-revealRichBadge--violet">Before you play</span>
        </div>
        <h4 className="ct-revealRichHeading">You must discuss preempts with partner</h4>
        <p className="ct-revealRichBody">
          None of this works if partner is on a different page. Agree what your bids show, at which level, and how
          disciplined you will be.
        </p>
        <p className="ct-revealRichBody">
          Best case: your partner also works through the same material on Bridge Champions. If not, have a clear
          sit-down about preempts before you lean on them in competition.
        </p>
      </section>
    </div>
  );
}

function Bid127RulesRich() {
  return (
    <div className="ct-revealRich">
      <h4 className="ct-revealRichHeading" style={{ marginTop: 0, marginBottom: 14 }}>
        Simple rules — vulnerability
      </h4>

      <section
        className="ct-revealRichCard ct-revealRichCard--slate"
        style={{
          marginBottom: 14,
          borderLeft: "4px solid rgba(185, 28, 28, 0.55)",
        }}
      >
        <p className="ct-revealRichLead" style={{ marginBottom: 10 }}>
          <span className="ct-revealRichBadge ct-revealRichBadge--violet">Vulnerable</span>
        </p>
        <p className="ct-revealRichBody">
          Vulnerable preempts must have a good suit.
        </p>
        <p className="ct-revealRichBody">
          The idea behind it: when vulnerable, partner is looking for game and needs to be able to rely on you having a
          good suit.
        </p>
        <p className="ct-revealRichBody">
          People think it&apos;s because of the possibility of getting penalty doubled vulnerable — that&apos;s a small
          part of the story, not the main story.
        </p>
      </section>

      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichLead" style={{ marginBottom: 10 }}>
          <span className="ct-revealRichBadge">Not vulnerable</span>
        </p>
        <p className="ct-revealRichBody">
          Standards drop a lot. Our goal here is to be disruptive — make an aggressive preempt with a very weak hand,
          and make it difficult for our opponents.
        </p>
      </section>
    </div>
  );
}

function Bid127PreemptBidRevealRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          In a world championship, the good pairs were opening <TextWithColoredSuits text="3♥" /> or even{" "}
          <TextWithColoredSuits text="4♥" />. The idea is: we aren&apos;t vulnerable — it&apos;s time to be disruptive;
          standards go out the window.
        </p>
        <p className="ct-revealRichBody">
          Furthermore, we bump up our aggression a bit more when, on top of being not vulnerable, the opponents{" "}
          <em className="ct-revealRichKey">are</em> vulnerable — that is the most appropriate time to go{" "}
          <span className="ct-revealRichKey">&quot;completely crazy&quot;</span>.
        </p>
      </section>
    </div>
  );
}

function Bid127CalibrateRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          However, if you open <TextWithColoredSuits text="3♥" /> and your partner is upset that you &quot;only have 2
          points&quot;, I urge you to go back to step 1 and discuss and calibrate your preempts — the best methods are
          methods that don&apos;t upset partner.
        </p>
      </section>
    </div>
  );
}

function Bid128OpeningRevealRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichLead">
          <TextWithColoredSuits text="1♠" /> is the correct bid.
        </p>
        <p className="ct-revealRichBody" style={{ marginTop: 12 }}>
          If we are going to open <TextWithColoredSuits text="3♥" /> on the previous hand, with 2 points, we can&apos;t
          treat a nice 10-point hand as a preempt when we aren&apos;t vulnerable.
        </p>
        <p className="ct-revealRichBody">
          Passing, however, is not an option with a nice 7-card suit like this.
        </p>
        <div className="ct-revealRichRuleBox">
          <h4 className="ct-revealRichHeading" style={{ marginTop: 0, marginBottom: 10 }}>
            You must decide
          </h4>
          <ul className="ct-revealRichPoints">
            <li>
              Either I squeeze it into a 3-level preempt, <em>or</em>
            </li>
            <li>I squeeze it into a 1-level opening.</li>
          </ul>
        </div>
        <p className="ct-revealRichBody" style={{ marginTop: 16 }}>
          When we aren&apos;t vulnerable, we lower the standards of our preempts — and, as a flow-on effect, we lower the
          standards (certainly the point-count standard) of our opening bid.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichLead" style={{ marginBottom: "0.5rem" }}>
          &ldquo;It&apos;s a bidder&apos;s game&rdquo;
        </p>
        <p className="ct-revealRichBody">
          You have to be comfortable bidding more, passing less (when you aren&apos;t vulnerable) if you want to get
          ahead.
        </p>
      </section>
    </div>
  );
}

function Bid129MuddyWatersRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichLead">I want to muddy the waters slightly.</p>
        <p className="ct-revealRichBody" style={{ marginTop: 12 }}>
          I&apos;ve said &ldquo;it&apos;s a bidder&apos;s game&rdquo; and to bid more when we aren&apos;t vulnerable.
          However, when I look at this hand I notice:
        </p>
        <h4 className="ct-revealRichHeading" style={{ marginTop: 16, marginBottom: 10 }}>
          1. A bad long suit
        </h4>
        <p className="ct-revealRichBody">
          A bad long suit, that in itself is not fatal to making a bid as we&apos;ve seen; we throw our standards{' '}
          &ldquo;out the window&rdquo; when we aren&apos;t vulnerable.
        </p>
        <h4 className="ct-revealRichHeading" style={{ marginTop: 16, marginBottom: 10 }}>
          2. Lots of stuff in the outside suits
        </h4>
        <p className="ct-revealRichBody">
          Lots of stuff in the outside suits — this is actually a big negative for making a preempt, surprisingly. The
          reason is: the stronger we are in our short suits, the less likely the opponents are to be making contracts.
        </p>
        <p className="ct-revealRichBody" style={{ marginTop: 16 }}>
          Take a look at this hand — do you think it&apos;s likely that the opponents are making a slam? Probably they
          aren&apos;t. Compare that with problem 27 when you had only 2 points — there&apos;s no reason to doubt the
          opponents have game or slam on.
        </p>
      </section>
    </div>
  );
}

function Bid129PassRevealRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichLead">I love bidding a lot, but this hand I am fine to pass.</p>
        <p className="ct-revealRichBody" style={{ marginTop: 14 }}>
          So let&apos;s summarise reasons to bid, and reasons not to bid:
        </p>
        <table className="ct-revealRichPlusMinusTable">
          <thead>
            <tr>
              <th scope="col" className="ct-revealRichPlusMinusTable-plus">
                For
              </th>
              <th scope="col" className="ct-revealRichPlusMinusTable-minus">
                Against
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ct-revealRichPlusMinusTable-plusCell">Very weak hands — surprisingly.</td>
              <td>
                Lots of points in the side suits — less chance the opponents are making slam or game.
              </td>
            </tr>
            <tr>
              <td className="ct-revealRichPlusMinusTable-plusCell">Quality long suit.</td>
              <td>
                Bad long suit (though this isn&apos;t fatal when we aren&apos;t vulnerable).
              </td>
            </tr>
            <tr>
              <td className="ct-revealRichPlusMinusTable-plusCell">Distributional is good — singletons.</td>
              <td>7222 or 6322 is bad (very bad).</td>
            </tr>
            <tr>
              <td className="ct-revealRichPlusMinusTable-plusCell">
                We aren&apos;t vulnerable — and even better when the opponents are vulnerable.
              </td>
              <td>
                When we are vulnerable we want to make sure we have a good suit. It&apos;s not really an
                &ldquo;against&rdquo; factor — but it&apos;s a time to be strict and disciplined.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Bid130RevealRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <PracticeAuctionMiniTable
          auctionText="4♠ X P P P"
          dealerCompass="S"
          vulnerability="EW Vul"
          className="ct-revealRichBody--belowMiniTable"
        />
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          The final contract was <TextWithColoredSuits text="4♠X" />, going 2 off for 300.
        </p>
        <p className="ct-revealRichBody">
          However, the opponents can make a grand slam comfortably, a huge result.
        </p>
        <h4 className="ct-revealRichHeading" style={{ marginTop: 16, marginBottom: 10 }}>
          Why this preempt works
        </h4>
        <ul className="ct-revealRichPoints">
          <li>Vulnerability is in your favour.</li>
          <li>Weak hand with a good suit.</li>
          <li>Distributional shape (singleton).</li>
        </ul>
      </section>
    </div>
  );
}

function Bid131RevealRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <PracticeAuctionMiniTable
          auctionText="3♥ P 4♥ P P P"
          dealerCompass="N"
          vulnerability="NS Vul"
          className="ct-revealRichBody--belowMiniTable"
        />
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          <TextWithColoredSuits text="4♥" /> is the correct bid, knowing that partner has a solid heart suit for this
          bid (a vulnerable preempt). We have no hesitation or fear in bidding our vulnerable game here, even though
          our combined point count is below 20 points.
        </p>
        <p className="ct-revealRichBody">
          On this hand there are 9 top tricks (7 hearts and 2 spades). Declarer was able to get a diamond ruff for the
          10th trick, but otherwise worst-case scenario, a spade finesse would be the 10th trick (if the opponents
          managed to draw all the trumps).
        </p>
        <p className="ct-revealRichBody">
          Rule: making game opposite a vulnerable preempt is not about points, it is about useful features.
        </p>
        <table className="ct-revealRichPlusMinusTable">
          <thead>
            <tr>
              <th scope="col" className="ct-revealRichPlusMinusTable-plus">
                Useful feature
              </th>
              <th scope="col" className="ct-revealRichPlusMinusTable-minus">
                Why it matters
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ct-revealRichPlusMinusTable-plusCell">Trumps.</td>
              <td>A long, robust fit turns preemptive pressure into tricks.</td>
            </tr>
            <tr>
              <td className="ct-revealRichPlusMinusTable-plusCell">Shortage (even a doubleton is useful).</td>
              <td>Ruffing potential creates extra winners.</td>
            </tr>
            <tr>
              <td className="ct-revealRichPlusMinusTable-plusCell">
                <strong className="ct-revealRichKey">Source of tricks (biggest one).</strong>
              </td>
              <td>
                <TextWithColoredSuits text="AKQ" /> or, on this hand, <TextWithColoredSuits text="AKJ" /> can be 2 or 3
                tricks.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Bid132IntroRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Is this forcing?</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          When the auction gets competitive, a lot of the time there is confusion around whether a bid is forcing or
          not.
        </p>
        <p className="ct-revealRichBody">
          The other question that comes up: <strong>how do you force if you want to?</strong>
        </p>
      </section>
    </div>
  );
}

function Bid132RuleRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Simple rule</h4>
        <p className="ct-revealRichBody">
          The best way to resolve everything is to remember this rule:{" "}
          <span className="ct-revealRichKey">&quot;Responder&apos;s first bid is forcing.&quot;</span>
        </p>
        <p className="ct-revealRichBody">Any other normal bids are not forcing.</p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          So forget the rule &quot;change of suit is forcing.&quot; It is much more important to be able to compete and bid
          suits, without having to worry about pushing the auction too high.
        </p>
      </section>
    </div>
  );
}

function Bid132RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="3♦" />
        </span>
        <span> is right.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          In modern bridge it is important for us to be able to bid good quality distributional hands.
        </p>
        <p className="ct-revealRichBody">
          It feels natural to be able to bid <TextWithColoredSuits text="3♦" /> — you have a decent distributional hand
          and a short heart.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          It would be a problem if <TextWithColoredSuits text="3♦" /> showed a very strong hand. It would mean we
          can&apos;t bid our normal/mediocre hands, which are the hands we are dealt most of the time.
        </p>
      </section>
    </div>
  );
}

function Bid132WrapRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          So how do we know this bid isn&apos;t forcing?
          <br />
          <span className="ct-revealRichKey">&quot;Responder&apos;s first bid is forcing&quot;</span> — every other normal bid
          is not.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          If opener wants to force here, a jump or cue of the opponent&apos;s suit, or perhaps beginning with a double,
          can do that. (We&apos;ll look at this more later.)
        </p>
        <p className="ct-revealRichBody">
          But the main point is that opener can feel free to bid 5-5 hands naturally like this without worrying that
          it&apos;s &quot;forcing.&quot;
        </p>
      </section>
    </div>
  );
}

function Bid133RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="3♣" />
        </span>
        <span> is correct.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">The correct bid is <TextWithColoredSuits text="3♣" />.</p>
        <p className="ct-revealRichBody">
          We should be keen to bid our reasonable 5-5 hands like this. In the previous example we saw opener do it,
          and similarly in this example responder can enjoy the same liberties.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          The important thing to remember is: <span className="ct-revealRichKey">&quot;Responder&apos;s first bid is forcing,&quot;</span>{" "}
          but second bid is not.
        </p>
      </section>
    </div>
  );
}

function Bid133WrapRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          All in all, we can see that both responder and opener can freely bid their 5-5 hands, which is very important
          since bridge is won or lost in the competitive bidding.
        </p>
      </section>
    </div>
  );
}

function Bid134RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">X</span>
        <span> is correct.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Why not 2♠?</h4>
        <p className="ct-revealRichBody">
          <span className="ct-revealRichKey">Responder&apos;s first bid is forcing.</span> If we bid{" "}
          <TextWithColoredSuits text="2♠" /> here, we force the auction up with only 7 points.
        </p>
        <p className="ct-revealRichBody">
          That can easily get us too high. If <TextWithColoredSuits text="2♠" /> were non-forcing it would be great —
          but in this position, it is responder&apos;s first bid.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">How we handle this</h4>
        <p className="ct-revealRichBody">
          I hate doubling with a distributional hand or long suit, but this is one of those situations where we do it.
        </p>
        <p className="ct-revealRichBody">
          Method: when responder&apos;s first bid would be forcing, responder can <strong>double first</strong> and then
          bid a suit to show a weaker hand — not strong enough to force.
        </p>
      </section>
    </div>
  );
}

function Bid134WrapRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Summary method</h4>
        <ul className="ct-revealRichPoints">
          <li>With strong hands: bid naturally and force.</li>
          <li>
            Not strong enough but still want to compete: start with <strong>X</strong>, then bid your suit.
          </li>
        </ul>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          That tells partner: &quot;I have a single-suited hand, but I was not good enough to make a forcing responder
          first bid.&quot;
        </p>
      </section>
    </div>
  );
}

function Bid135RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="3♦" />
        </span>
        <span> is correct.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          The correct bid is <TextWithColoredSuits text="3♦" />.
        </p>
        <p className="ct-revealRichBody">
          Unfortunately we can&apos;t just bid <TextWithColoredSuits text="3♣" />, because that is not forcing. Only{" "}
          <span className="ct-revealRichKey">&quot;responder&apos;s first bid is forcing&quot;</span>; any other change of suit in
          competition is not forcing.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Since this is not responder&apos;s first bid, it isn&apos;t forcing. So the natural option of{" "}
          <TextWithColoredSuits text="3♣" /> is risky, because partner will often pass it.
        </p>
      </section>
    </div>
  );
}

function Bid135ContinueRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Bidding <TextWithColoredSuits text="3♦" /> (the opponent&apos;s suit) shows strength: &quot;I have a big hand and
          didn&apos;t have a better bid available.&quot;
        </p>
        <p className="ct-revealRichBody">
          Responder&apos;s typical action opposite this is to bid <TextWithColoredSuits text="3NT" /> with a stopper in
          diamonds.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Rule: when opener cue-bids the opponent suit, it says: &quot;I&apos;m strong and want to game-force. I may have a
          distributional hand, but I can&apos;t bid it naturally because that would not be forcing.&quot;
        </p>
      </section>
    </div>
  );
}

function Bid135WrapRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          This is a slightly quirky situation. But rest assured, the majority of the time (90%+) you are just competing
          for the partscore and bidding your hand naturally, with the knowledge that partner won&apos;t expect too much.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          You are allowed to bid your suits naturally in competition with low-point-count hands, because only{" "}
          <span className="ct-revealRichKey">&quot;responder&apos;s first bid&quot;</span> is forcing.
        </p>
      </section>
    </div>
  );
}

function Bid136Q1RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">No</span>
        <span> — that is not correct.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          As we have seen, it is important to be able to compete and bid your suits naturally when you have a minimal
          amount of points.
        </p>
        <p className="ct-revealRichBody">
          If all changes of suit were forcing, your hands would too frequently be tied. Most of the time you are not
          strong enough to make a forcing bid.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Sadly we are usually dealt minimum-range hands, not 17+ point hands.
        </p>
      </section>
    </div>
  );
}

function Bid136Q2RevealRich() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          <span className="ct-revealRichKey">Responder&apos;s first bid</span> is always forcing.
        </p>
        <p className="ct-revealRichBody">
          I think I have repeated that enough times for it to stick!
        </p>
      </section>
    </div>
  );
}

function Bid136Q3RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Double first, then bid</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          In a situation where a bid is natural and forcing, double then bidding a suit shows a different type of hand
          — a hand that was not strong enough to force.
        </p>
      </section>
    </div>
  );
}

function Bid136Q4RevealRich() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">No</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Definitely not. We still have our normal takeout doubles, as always, and we use them commonly.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          But we also use double in competition to show a weak single-suiter with the manoeuvre:
          <strong> double first, then bid a suit</strong>.
        </p>
        <p className="ct-revealRichBody">
          With a normal takeout double, we typically leave partner in the suit they bid. We do not usually double then
          bid our own suit, because takeout doubles are based on tolerance for the other suits, not just one.
        </p>
      </section>
    </div>
  );
}

/**
 * Bidding practice: opening (1–5) and responding (6–10). Uses CountingTrumpsTrainer with question-only flow (no tricks).
 */
const BIDDING_PUZZLES = [
  // --- Opening: Do you open the bidding? (1–5) ---
  {
    id: "bid1-1",
    difficulty: 1,
    title: "Opening (1): Do you open?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      themeLabel: "Theme: Opening hand evaluation",
      promptThemeTint: "points",
      videoUrlBeforeStart: "https://www.youtube.com/embed/0vLi6n5efks",
      customPrompts: [
        {
          id: "bid1-1-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This series is about training your eye to recognise what a \"good\" and \"bad\" hand look like. Even at a glance, it will start to stick out to you.\n\nWith minimal effort you want to know whether to open the hand or not.",
          videoUrl: "",
        },
        {
          id: "bid1-1-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: true,
          revealText:
            "No. This hand has 11 points. We typically open most 12-point hands, but when we have less than that we need to use judgment.\n\nThis is what I would call a \"bad\" 11. The hand has several flaws:\n\n✗ There are no 10s and 9s.\n\n✗ The hand is very balanced, 4333.\n\n✗ The honours are scattered everywhere — you don't have a collection of honours/strength in any suit.\n\nWithout doubt this is a pass.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "QJ2", H: "K32", D: "Q432", C: "K32" },
    },
    rounds: [],
  },
  {
    id: "bid1-2",
    difficulty: 1,
    title: "Opening (2): Do you open?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      themeLabel: "Theme: Opening hand evaluation",
      promptThemeTint: "points",
      videoUrlBeforeStart: "https://www.youtube.com/embed/fYNlZS3KLa0",
      customPrompts: [
        {
          id: "bid1-2-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes. In contrast to the previous hand, this one has:\n\n✓ More shape — 4432 rather than 4333.\n\n✓ Honour cards nicely clustered in two suits; concentrated strength works better than scattered. \"They work better together.\"\n\n✓ Length and/or strength in the majors is a good thing; here you have both.\n\n✓ Quality cards — an Ace and two Kings.\n\n✓ Excellent intermediate cards (10s and 9s) to complement your long, strong suits.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AKT2", H: "KJT2", D: "65", C: "432" },
    },
    rounds: [],
  },
  {
    id: "bid1-3",
    difficulty: 1,
    title: "Opening (3): Do you open?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      themeLabel: "Theme: Opening hand evaluation",
      promptThemeTint: "points",
      videoUrlBeforeStart: "https://www.youtube.com/embed/8NFCsnOk_mc",
      customPrompts: [
        {
          id: "bid1-3-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes. We have to draw the line somewhere, but it might have to be at 9 points. This hand has excellent shape; the 6-card suit is robust. It is unbalanced, 6313, which gives it even better prospects of succeeding in a suit contract.\n\nYou could open a weak 2 if you play that, but you could argue that this hand fits the bill of an opening hand — the Aces and Kings, and the overall \"purity\" (cards in the right places/suits) is so good.\n\nContrast this hand with, say, ♠Q9xxxx ♥xxx ♦A ♣KJx — both hands are 10 points, yet our actual hand is leagues better.\n\nEven though spades is the likely contract if your side is to win the bidding, believe it or not this hand could even be an excellent dummy if partner has hearts or even clubs. More on this to come.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AKT982", H: "KT2", D: "6", C: "432" },
    },
    rounds: [],
  },
  {
    id: "bid1-4",
    difficulty: 1,
    title: "Opening (4): Should you open?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      themeLabel: "Theme: Opening hand evaluation",
      promptThemeTint: "points",
      videoUrlBeforeStart: "https://www.youtube.com/embed/6wUceGvMFZA",
      customPrompts: [
        {
          id: "bid1-4-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Should you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: true,
          revealText:
            "No. There has to be a cutoff. At the end of the day it is a 10-point hand that is balanced and not exceptional. It is not a bad hand — in fact it's very close to opening quality.\n\nPlus points include:\n\n✓ A strong 5-card suit with intermediate card(s).\n✓ Kings are good — better than Queens and Jacks typically.\n✓ No points in the shortage (doubleton) is often a good thing.\n\nNegatives include:\n\n✗ No Aces.\n✗ Simply not enough points — draw the line at 10 usually.\n✗ Somewhat balanced, 5332 — 5431 or 5521 becomes more attractive to open.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KJT98", H: "K32", D: "KT2", C: "65" },
    },
    rounds: [],
  },
  {
    id: "bid1-5",
    difficulty: 1,
    title: "Opening (5): Do you open? (Bobby's hand)",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      themeLabel: "Theme: Opening hand evaluation",
      promptThemeTint: "points",
      videoUrlBeforeStart: "https://www.youtube.com/embed/siYxTzj7eCo",
      customPrompts: [
        {
          id: "bid1-5-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: ["yes", "no"],
          noContinue: true,
          revealText:
            "This is a famous hand, a bit of a trick question. Yes and No are both good answers. In general I would suggest against opening 8-point hands, but it is worth understanding the rationale at least.\n\nBob Richman, one of Australia's best ever players (although he wasn't born in Australia), once opened this exact hand. Bobby was later asked by someone why or how he opened that and he responded something like \"Don't tell your mother.\"\n\nWhat was Bobby's reason to open such a low HCP (high card point) hand?\n\n✓ Shapely 5521 is a big asset if you end up declaring the hand in a suit.\n✓ Both majors — the hand has both majors, giving you good prospects of finding a major suit part-score or game.\n✓ Aces are the boss card (and best card); also the 10s and 9s pad the suits up a lot, to make up for the lack of HCP.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AT982", H: "AT832", D: "65", C: "2" },
    },
    rounds: [],
  },
  // --- Responding (6–10) ---
  {
    id: "bid1-6",
    difficulty: 1,
    title: "Responding (6): Partner opens 1♥",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    revealFullHandsAtEnd: ["DUMMY"],
    auction: "1♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      themeLabel: "Theme: Responding to partner",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/LrGvzkV9WMI",
      customPrompts: [
        {
          id: "bid1-6-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "Partner has opened; your only job here is to describe your hand.",
          videoUrl: "",
        },
        {
          id: "bid1-6-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Your bid?",
          options: [
            { id: "1s", label: "1♠" },
            { id: "2h", label: "2♥" },
            { id: "pass", label: "Pass" },
            { id: "other", label: "Something else" },
          ],
          expectedChoice: "2h",
          noContinue: true,
          revealText:
            "I like to bid 2♥. There is a golden rule of bridge: \"Always support partner\". Without that rule, we are lost.\n\nIf I see my opponents break this rule, I smile and know it will be an easy game.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT982", H: "QJ7", D: "6", C: "8752" },
    },
    rounds: [],
  },
  {
    id: "bid1-7",
    difficulty: 1,
    title: "Responding (7): West 1♥, North 1♠ — your bid (East)",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "E",
    viewerCompass: "E",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ 1♠ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-29-q2--reveal": "1♠ X 4♠ X P Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      themeLabel: "Theme: Responding to partner",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/H4HYh8L9ZWg",
      customPrompts: [
        {
          id: "bid1-7-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you do?",
          options: [
            { id: "bid", label: "Bid something" },
            { id: "pass", label: "Pass" },
          ],
          expectedChoice: "bid",
          noContinue: false,
          revealText:
            "Bid something. Partner has overcalled; we have enough to respond (6 or 7+ points). We must always try to \"bid our hand\".",
          videoUrl: "",
        },
        {
          id: "bid1-7-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do we bid?",
          options: [
            { id: "support", label: "Support partner" },
            { id: "1nt", label: "1NT" },
            { id: "other", label: "Something else" },
          ],
          expectedChoice: "other",
          noContinue: false,
          revealText:
            "Something else. We need 3 cards to support partner. \"Always support partner WHEN you have support.\" As for 1NT — that should show a spade stopper.",
          videoUrl: "",
        },
        {
          id: "bid1-7-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "So what should we bid?",
          options: [
            { id: "suit", label: "One of our suits" },
            { id: "dbl", label: "Double (×)" },
          ],
          expectedChoice: "dbl",
          noContinue: true,
          revealText:
            "It is correct to double here. It conveys:\n\n(a) I have some points, say 6+.\n\n(b) I typically have the other two suits (takeout shape).",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "762", H: "K8", D: "KJT8", C: "QT92" },
    },
    rounds: [],
  },
  {
    id: "bid1-8",
    difficulty: 1,
    title: "Responding (8): 1♠ 3♦",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ 3♦ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-30-q1--reveal": "4♥ Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      themeLabel: "Theme: Responding to partner",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/APpEVzvkdkU",
      customPrompts: [
        {
          id: "bid1-8-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "You are considering making a bid. Firstly — does it matter what the opponent's 3♦ bid means?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: false,
          revealText:
            "No. Basically it doesn't matter at all. Our goal is to bid our hand; often there is noise or chaos going on around us, but if possible we ignore the opponents and simply bid our hand.\n\nThis sounds strange, but as we do more and more problems, this idea will be clear.",
          videoUrl: "",
        },
        {
          id: "bid1-8-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Let's say we did bid. What would we bid?",
          options: [
            { id: "support", label: "Support partner" },
            { id: "other", label: "Something else" },
          ],
          expectedChoice: "support",
          noContinue: false,
          revealText: "Support partner. Remember the golden rule — \"Always support partner.\"",
          videoUrl: "",
        },
        {
          id: "bid1-8-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "So, finally, can we bid 3♠?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes we can. As a general rule, if we were able to raise partner to 2♠, we will typically take the push to 3♠ if needed.\n\nIt is a bit pushy, but it is better than the alternative of passing and pretending like you have nothing useful at all.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT8", H: "AT7", D: "65", C: "87652" },
    },
    rounds: [],
  },
  {
    id: "bid1-9",
    difficulty: 1,
    title: "Responding (9): 1♠ 4♦",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ 4♦ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-32-q1--reveal": "5♦ X P Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      themeLabel: "Theme: Responding to partner",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/DA7UluniZLo",
      customPrompts: [
        {
          id: "bid1-9-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "The opponents have made this difficult. Can we still follow the golden rule and support partner?",
          options: [
            { id: "4s", label: "Yes, bid 4♠" },
            { id: "pass", label: "No, pass" },
          ],
          expectedChoice: "pass",
          noContinue: true,
          revealText:
            "Pass — we have to stop somewhere unfortunately.\n\nLet's take a reality check. We have 7 points, partner may have say 12 points. That gives us a combined 19 points and an 8-card fit; we could be far too high bidding 4♠ with so little to spare.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT8", H: "AT7", D: "65", C: "87652" },
    },
    rounds: [],
  },
  {
    id: "bid1-10",
    difficulty: 1,
    title: "Responding (10): 1♣ 1♥",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ 1♥ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-29-q2--reveal": "1♠ X 4♠ X P Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      themeLabel: "Theme: Responding to partner",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/PukSNA8mqGo",
      customPrompts: [
        {
          id: "bid1-10-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do we bid?",
          options: [
            { id: "support", label: "Support partner" },
            { id: "spades", label: "Bid our spade suit" },
          ],
          expectedChoice: "spades",
          noContinue: true,
          revealText:
            "We should bid our spade suit. So why are we breaking the golden rule? There are two reasons:\n\n1. The main reason is — Majors are very important, especially spades. (More on this to come.) It's a good idea to try to find a major fit (hearts or spades).\n\n2. A 1♣ opening can often be 2 or 3 depending on your system. So raising clubs should really show 5 or even 6.\n\nEvery good bridge rule has a few exceptions here and there; that's what makes the game great!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT982", H: "76", D: "65", C: "AQ97" },
    },
    rounds: [],
  },
  // --- The modern 1NT opening (11–14) ---
  {
    id: "bid1-11",
    difficulty: 1,
    title: "1NT (11): 5242 with 5 spades",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-33-q2--reveal": "1♠ 3♣ 4♠ 5♣ 6♠ X",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "The modern 1NT opening",
      themeLabel: "Theme: The modern 1NT opening",
      promptThemeTint: "1nt",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/X1wCFm0sPx0",
      customPrompts: [
        {
          id: "bid1-11-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "There are details about your hand that you may have never noticed before. These details change everything.\n\nThe 1NT opening is a good place to learn some of these \"details\" that I'm talking about.\n\nLet's turn you into an expert bidder.",
          videoUrl: "",
        },
        {
          id: "bid1-11-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "You play a 15–17 No Trump. The shape of this hand is 5242, with a 5-card spade suit. Is that suitable for a 1NT opening?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: false,
          revealText:
            "Yes it can be suitable — however that does not mean we open all such shapes 1NT, even when they fit the correct point count. (As you will see in the upcoming examples.)\n\nThe hand shapes we often open 1NT are:\n\n• of course 4333\n• 4432\n• and the most normal 5-card suit shape: 5332\n• and finally we use our judgement (which we are now learning) with 5422",
          videoUrl: "",
        },
        {
          id: "bid1-11-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Should we open this hand 1NT?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes, it is suitable. These are the reasons:\n\n1. Points in the short suits — This is one of your main reasons. On this hand 10 of 15 points are in your short suits. That strongly points towards No Trump.\n\n2. Your major suit quality is poor — Kxxxx is a very bad suit: only 1 honour card and no intermediate cards.\n\nReasons against:\n\n1. Always think twice with a 5-card major.\n\nA further comment: With a 5-card minor, we are more likely to open 1NT, although we still look at our points in the short suits.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "K9842", H: "AQ", D: "QT43", C: "AT" },
    },
    rounds: [],
  },
  {
    id: "bid1-12",
    difficulty: 1,
    title: "1NT (12): Stacked in the minors",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "The modern 1NT opening",
      themeLabel: "Theme: The modern 1NT opening",
      promptThemeTint: "1nt",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/8kDxMREow_A",
      customPrompts: [
        {
          id: "bid1-12-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "The modern way is to open 1NT a lot more than we did in the past. It has a lot of advantages — one big one is to \"get your hand off your chest\" in a single bid. In general that is a VERY good principle, but it is not the end of the story.",
          videoUrl: "",
        },
        {
          id: "bid1-12-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is this hand suitable for a 1NT opening?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: true,
          revealText:
            "No. This is not suitable. The main giveaway is that your short suits do not have any points in them, and your minor suits are excellent.\n\nThe hand is very stacked in the minors; it is appropriate to open 1♦ and rebid 2♣, giving partner an accurate picture of your assets.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "43", H: "32", D: "AKT82", C: "AKJ2" },
    },
    rounds: [],
  },
  {
    id: "bid1-13",
    difficulty: 1,
    title: "1NT (13): 5332 with nice spades",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "The modern 1NT opening",
      themeLabel: "Theme: The modern 1NT opening",
      promptThemeTint: "1nt",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/GedUP68ZQ8I",
      customPrompts: [
        {
          id: "bid1-13-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is this hand suitable for 1NT?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes, it is — despite having a very nice spade suit and a small doubleton. When it comes to 5332 hands, we basically always open 1NT if we are in the correct point range. The advantage of opening 1NT and getting your hand \"off your chest\" is too big to talk yourself out of.\n\nWe only look at the doubletons when we are 5422.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AKT92", H: "43", D: "AK2", C: "JT2" },
    },
    rounds: [],
  },
  {
    id: "bid1-14",
    difficulty: 1,
    title: "1NT (14): 14 points and a 5-card suit",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "The modern 1NT opening",
      themeLabel: "Theme: The modern 1NT opening",
      promptThemeTint: "1nt",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/OJd8b--QDBo",
      customPrompts: [
        {
          id: "bid1-14-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "What about 14-point hands?",
          videoUrl: "",
        },
        {
          id: "bid1-14-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "This hand only has 14 points. Does that disqualify it from opening 1NT?",
          options: [
            { id: "suitable", label: "Suitable for 1NT" },
            { id: "not", label: "Not suitable" },
          ],
          expectedChoice: "suitable",
          noContinue: true,
          revealText:
            "It is suitable for 1NT. Despite only having 14 high card points, this hand to me looks a lot stronger. The reasons are:\n\n1. It has a 5-card suit. We typically can add 1 point for a 5-card suit.\n\n2. It has very good intermediate cards (10s and 9s).\n\nIf I'm being honest, to me this hand looks closer to 16 points than it does 14 points.\n\nPoint count is a very good start, but it is only a start.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT", H: "AQT92", D: "AJ9", C: "T42" },
    },
    rounds: [],
  },
  {
    id: "bid1-15",
    difficulty: 1,
    title: "1NT (15): 14 points — upgrade to 15?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "The modern 1NT opening",
      themeLabel: "Theme: The modern 1NT opening",
      promptThemeTint: "1nt",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/VSm58Q0IU14",
      customPrompts: [
        {
          id: "bid1-15-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "This hand has the right shape for 1NT, with only 14 high card points. Can you upgrade this one to 15?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: true,
          revealText:
            "No, I would not upgrade this one. The 5-card suit is bare, making it an unlikely source of extra tricks.\n\nIn general, good hands have \"clusters of points\", particularly in the long suits. This hand does not have much at all in its long suits. It has 2 points in its long suit, and 5 points in its shortest suit.\n\nThis is not a good hand — don't upgrade it.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "Q9842", H: "KQ", D: "Q32", C: "AJ2" },
    },
    rounds: [],
  },
  {
    id: "bid1-16",
    difficulty: 1,
    title: "1NT (16): Singleton in 1NT?",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "The modern 1NT opening",
      themeLabel: "Theme: The modern 1NT opening",
      promptThemeTint: "1nt",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "https://youtube.com/shorts/Jrz2zRRlP5g",
      customPrompts: [
        {
          id: "bid1-16-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "This hand has a singleton. Would this ever qualify as a modern 1NT?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes, it qualifies as 1NT. The top players in the world are doing something that 20–30 years ago would have been unthinkable — opening 1NT with a singleton.\n\nDon't get carried away with this concept: they are only doing it with a singleton King. A singleton Ace is a completely different story, and I strongly advise against that.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "K32", H: "K", D: "AQT2", C: "AT842" },
    },
    rounds: [],
  },
  {
    id: "bid1-17",
    difficulty: 1,
    title: "1-level overcalls (17): A good suit at the one level",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ ?",
    vulnerability: "None Vul",
    shownHands: {
      DECLARER: { S: "AK1092", H: "3", D: "T987", C: "432" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-30-q1--reveal": "4♥ Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "1-level overcalls",
      promptThemeTint: "active",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllWhite: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/F4HW3pNwKoo",
      customPrompts: [
        {
          id: "bid1-17-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##The old shorthand##\n\nOvercalls were often taught as 10+ points and a 5+ card suit. That still has its place — but exceptions are common.\n\n##What we'll do##\n\nBy example: a few ideas for 1-level overcalls.",
          videoUrl: "",
        },
        {
          id: "bid1-17-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you do with this hand?",
          options: [
            { id: "pass", label: "Pass" },
            { id: "1s", label: "Overcall 1♠" },
          ],
          expectedChoice: "1s",
          noContinue: false,
          revealText:
            "[[ALERT]]\nBid 1♠ — a one-level overcall.\n[[/ALERT]]\n\nYou have only 7 HCP, but suit quality and shape carry the hand.\n\n##The useful rule##\n\n##At the 1 level, always consider overcalling a good suit.##\n\n• Outside singleton (♥3) → competing is more attractive.\n• Real spade suit (♠AK1092) → you want a voice in the auction.",
          videoUrl: "",
        },
        {
          id: "bid1-17-minimum",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Rough minimum##\n\n• A suit like ♠AQ1092 is a sensible floor for many pairs.\n• Below ~6 HCP can be pushing — agree with partner what you'll tolerate.\n\nExperts sometimes stretch lower; that's a topic for later.",
          videoUrl: "",
        },
        {
          id: "bid1-17-partnership",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Why this matters##\n\nImportant implications follow from light overcalls.\n\n[[ALERT]]\n##You need to have a discussion with your partner.##\n[[/ALERT]]\n\n##Partnership expectations##\n\nBridge runs on shared agreements. If partner knows you may hold only ~7 HCP on a bad day, they should be careful with thin 12–13 counts — often invite, don't blast.",
          videoUrl: "",
        },
        {
          id: "bid1-17-wrap",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Big picture##\n\nIt can sound risky — yet the best pairs find that the downsides of overcalling are usually smaller than the upsides. It tends to work.\n\n##At the table##\n\n• Listen to the whole auction: when opponents show a lot and you have values, remember partner might only have that light 7-point overcall.\n• Stay sensible — not every strong-looking spot is a slam try.\n\nGive it a try!",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-18",
    difficulty: 1,
    title: "1-level overcalls (18): Bad suit — pass the balanced misfit",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ ?",
    vulnerability: "None Vul",
    shownHands: {
      DECLARER: { S: "Q2", H: "Q76", D: "J7532", C: "KQ3" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-32-q1--reveal": "5♦ X P Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "1-level overcalls",
      promptThemeTint: "active",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllWhite: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/OAX93O9g3qQ",
      customPrompts: [
        {
          id: "bid1-18-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "How do you handle this hand?",
          options: [
            { id: "pass", label: "Pass" },
            { id: "1d", label: "1♦" },
          ],
          expectedChoice: "pass",
          noContinue: false,
          revealText:
            "[[ALERT]]\nPass is correct.\n[[/ALERT]]\n\n##Two reasons##\n\n• Suit quality — think twice with bad suits. Diamonds is your worst suit!\n• Balanced is bad — any balanced hand without a singleton is not an exciting overcalling prospect.",
          videoUrl: "",
        },
        {
          id: "bid1-18-follow",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Points vs texture##\n\nThis hand has 10 HCP, but the values are poor — scattered, not concentrated in the long suit.\n\n• No Aces\n• No 10s or 9s (intermediates matter a lot)\n\nThat's a lot to digest — with repetition you'll build the skill of recognising bad hands vs good hands.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-19",
    difficulty: 1,
    title: "1-level overcalls (19): J10xxx — when the suit plays bigger",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ ?",
    vulnerability: "None Vul",
    shownHands: {
      DECLARER: { S: "J10987", H: "A54", D: "K102", C: "32" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "1-level overcalls",
      promptThemeTint: "active",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllWhite: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/eMqvRa3H8PQ",
      customPrompts: [
        {
          id: "bid1-19-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do we make a bid here? Is it similar to the previous hand?",
          options: [
            { id: "pass", label: "Pass" },
            { id: "1s", label: "1♠" },
          ],
          expectedChoice: "1s",
          noContinue: false,
          revealText:
            "[[ALERT]]\nBid 1♠.\n[[/ALERT]]\n\nTo me 1♠ is an easy choice here, even though it is weaker in points than the previous hand, and even though it is balanced — which I have called bad (and I meant it!). So why does this one still qualify?\n\n##The short version##\n\nThe spade suit plays bigger than it looks, your values sit well, and one-level is cheap.",
          videoUrl: "",
        },
        {
          id: "bid1-19-why",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Why this one is different##\n\n• Rule: 10s and 9s carry a lot of weight in long suits. J10xxx is a lot better than Jxxxx — the suit is not as bad as it looks.\n\n• The outside cards are nice: Aces and Kings in the short suits.\n\n✓ No points in our short suits — this is a very big positive.\n\n• Balanced is bad, and I meant it — but it is not fatal. We do not want to talk ourselves out of bidding too often.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-20",
    difficulty: 1,
    title: "1-level overcalls (20): 7 points, all vul — still compete?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ ?",
    vulnerability: "All Vul",
    shownHands: {
      DECLARER: { S: "K10987", H: "2", D: "A10982", C: "32" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "1-level overcalls",
      promptThemeTint: "active",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllRed: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/ayQv94xbDyY",
      customPrompts: [
        {
          id: "bid1-20-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Only 7 points and you are vulnerable — would you bid here?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: false,
          revealText:
            "[[ALERT]]\nYes — competing is still right.\n[[/ALERT]]\n\nDespite only 7 points and being vulnerable, the shape and suit quality make this hand worth a bid.",
          videoUrl: "",
        },
        {
          id: "bid1-20-why",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Reasons why##\n\n• I've tried to make those 10s and 9s stand out — they change everything. Seriously.\n\n• Your points are limited, but they are in Aces and Kings.\n\n• More important than how many points you have is where they sit: nicely placed in your long suits.\n\n• 5–5 shape is quite distributional — it is a long way from 5332.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-21",
    difficulty: 1,
    title: "1-level overcalls (21): Quick check — three questions",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      hideBiddingHand: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Quick check",
      promptThemeTint: "active",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      hidePlayDecisionHeading: true,
      customPrompts: [
        {
          id: "bid1-21-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Quick summary##\n\nThis is a short wrap-up — we'll ask you three questions.\n\nTake your best guess, then read the notes — same style as the rest of this series.",
          videoUrl: "",
        },
        {
          id: "bid1-21-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is the minimum high-card points you would aim for on a 1-level overcall?",
          options: [
            { id: "10plus", label: "10+" },
            { id: "6plus", label: "6+" },
            { id: "3plus", label: "3+" },
          ],
          expectedChoice: "6plus",
          noContinue: false,
          revealText:
            "[[ALERT]]\nAbout 6+ HCP is a sensible floor to aim for.\n[[/ALERT]]",
          videoUrl: "",
        },
        {
          id: "bid1-21-bridge1",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Point count##\n\nWhile some top pairs are increasingly ignoring point count, I would say it is a good idea to limit your minimum to about 6+.\n\n(In later series we will look at times when you throw all standards out the window and ignore point count.)",
          videoUrl: "",
        },
        {
          id: "bid1-21-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is it better for us to have most of our points in the suit we overcall, or in the outside suits?",
          options: [
            { id: "scattered", label: "Better if points are scattered around" },
            { id: "concentrated", label: "Better if points are concentrated in the long suit" },
          ],
          expectedChoice: "concentrated",
          noContinue: false,
          revealText:
            "[[ALERT]]\nConcentrated in the long suit.\n[[/ALERT]]\n\nYou want your honours working in your long suit.",
          videoUrl: "",
        },
        {
          id: "bid1-21-after2",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Suit quality##\n\nThe main takeaway from today should be — look at your suit quality, it matters.\n\nSo you want the points in your long suit.",
          videoUrl: "",
        },
        {
          id: "bid1-21-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Does it matter if my hand has a singleton or not?",
          options: [
            { id: "m1", label: "It doesn't matter much" },
            { id: "m2", label: "It matters a little — singletons are okay" },
            { id: "m3", label: "It matters a lot — singletons are excellent" },
          ],
          expectedChoice: "m3",
          noContinue: false,
          revealText:
            "[[ALERT]]\nIt matters a lot — singletons are excellent.\n[[/ALERT]]",
          videoUrl: "",
        },
        {
          id: "bid1-21-wrap",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Shape##\n\nSingletons matter a lot.\n\n##Balanced is bad## — repeat that once or twice, every day! You can afford to do less with balanced hands.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-22",
    difficulty: 1,
    title: "2-level overcalls (22): 5332 at the two level",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ ?",
    vulnerability: "All Vul",
    shownHands: {
      DECLARER: { S: "K102", H: "32", D: "AK1098", C: "Q76" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "2-level overcalls",
      promptThemeTint: "twoLevel",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllRed: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/zap0W7SAEBk",
      customPrompts: [
        {
          id: "bid1-22-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Two-level overcalls##\n\nLet's look at a few examples — the rules build off the 1-level rules. If you understood those, a lot of these will make sense. However, there are some key differences.",
          videoUrl: "",
        },
        {
          id: "bid1-22-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "This hand definitely has some good features — a nice full diamond suit, several Aces and Kings — should we overcall or not?",
          options: [
            { id: "pass", label: "Pass" },
            { id: "twoDiamonds", label: "2♦" },
          ],
          expectedChoice: "pass",
          noContinue: false,
          revealText:
            "[[ALERT]]\nPass!\n[[/ALERT]]\n\nAs a pretty good general rule — do not overcall 5332 shape on the 2 level!\n\nI think this often comes as a very big surprise to players.",
          videoUrl: "",
        },
        {
          id: "bid1-22-flavour",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "I hate to \"sit on my hands\" and not make a bid with 12+ points, but unfortunately this hand just does not fit the flavour of a two-level overcall.\n\nWe need a more shapely hand, and/or a six-card suit.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-24",
    difficulty: 1,
    title: "2-level overcalls (24): 10 points — enough for 2♦?",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ ?",
    vulnerability: "All Vul",
    shownHands: {
      DECLARER: { S: "32", H: "97", D: "A10832", C: "AQ32" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "2-level overcalls",
      promptThemeTint: "twoLevel",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllRed: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/ZbzfkJ8sR3k",
      customPrompts: [
        {
          id: "bid1-24-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Does this hand qualify for a 2-level overcall?",
          options: [
            { id: "yes2d", label: "Yes — bid 2♦" },
            { id: "pass", label: "No — Pass" },
          ],
          expectedChoice: "pass",
          noContinue: false,
          revealText:
            "[[ALERT]]\nNo.\n[[/ALERT]]\n\nDespite being unbalanced and having nice suits, this does not qualify.\n\nAs you can see, these standards might feel somewhat conservative. (Bridge at the highest level can look conservative in some situations and aggressive in others.)",
          videoUrl: "",
        },
        {
          id: "bid1-24-guide",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "When we overcall a 5-card suit at the 2 level, we generally need:\n\n✓ Good opening hand or better\n\n✓ Distribution\n\nThis hand is only 2254 shape — doubletons in the majors — and it lacks values. Also the diamond suit is a bit bare.",
          videoUrl: "",
        },
        {
          id: "bid1-24-double",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "I like to apply this test after a 2-level overcall:\n\nIf I got penalty doubled on the 2 level, how would I feel? Personally I wouldn't feel too good with that diamond suit — I may only make 1 or 2 diamond tricks.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-25",
    difficulty: 1,
    title: "2-level overcalls (25): Six hearts — bid 2♥?",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ ?",
    vulnerability: "None Vul",
    shownHands: {
      DECLARER: { S: "2", H: "AJ9742", D: "A103", C: "863" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "2-level overcalls",
      promptThemeTint: "twoLevel",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllWhite: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/BXFYnIV2rKY",
      customPrompts: [
        {
          id: "bid1-25-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is this enough to bid 2♥?",
          options: [
            { id: "bid2h", label: "I would bid 2♥" },
            { id: "pass", label: "I would Pass." },
          ],
          expectedChoice: "bid2h",
          noContinue: false,
          revealText:
            "[[ALERT]]\nYes — bid 2♥.\n[[/ALERT]]\n\nWhen it comes to 6-card suits, things shift — a lot. The rules move, and everything we thought we knew can be challenged.\n\nRule: With a good 6-card suit, typically bid it!",
          videoUrl: "",
        },
        {
          id: "bid1-25-suit",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "The suit is good: it has two honours, and it is reinforced with the 9 — that often makes all the difference.\n\nThe 6-card suit is the central factor. But still, in the context of 6-card suits we look at the same factors: good suits, well-placed cards, 10s and 9s, distribution, and so on.",
          videoUrl: "",
        },
        {
          id: "bid1-25-list",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "✓ It is distributional (it has a singleton).\n\n✓ It has Aces.\n\n✓ The side suit of ♦A103 is made better by the 10.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-26",
    difficulty: 1,
    title: "2-level overcalls (26): Bare clubs — still bid 2♣?",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ ?",
    vulnerability: "None Vul",
    shownHands: {
      DECLARER: { S: "32", H: "K2", D: "AK32", C: "A9876" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "2-level overcalls",
      promptThemeTint: "twoLevel",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllWhite: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/eyx0Eztx6Wg",
      customPrompts: [
        {
          id: "bid1-26-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "Would you bid 2♣ on this hand? The suit is very bare.",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: false,
          revealText:
            "[[ALERT]]\nYes.\n[[/ALERT]]\n\nYes — you have to bid: you have too much \"stuff\" to pass.",
          videoUrl: "",
        },
        {
          id: "bid1-26-a",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Despite a bad suit, and not much distribution (no singleton), you cannot talk yourself out of bidding when you have so many points.",
          videoUrl: "",
        },
        {
          id: "bid1-26-b",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "However, this hand is not completely balanced — it is 2245. With 5332 I would consider passing, but even then I would consider mustering up a bid with 14 — it is just too much to pass if there is a sensible alternative.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-27",
    difficulty: 1,
    title: "2-level overcalls (27): Weak hearts — double instead?",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ ?",
    vulnerability: "None Vul",
    shownHands: {
      DECLARER: { S: "32", H: "J8532", D: "AKQ", C: "A32" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "2-level overcalls",
      promptThemeTint: "twoLevel",
      contractLabel: "Modern Overcalls",
      contractLabelBeforeStartOnly: true,
      auctionAllWhite: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/moyEnVBNlEs",
      customPrompts: [
        {
          id: "bid1-27-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is there a bid for this?",
          options: [
            { id: "pass", label: "Pass" },
            { id: "twoHearts", label: "2♥" },
            { id: "double", label: "Double" },
          ],
          expectedChoice: "double",
          noContinue: false,
          revealText:
            "[[ALERT]]\nDouble.\n[[/ALERT]]\n\nFirstly, once again we have too much \"stuff\" to pass if we have a sensible alternative.\n\nIn general it is better to bid a 5-card major than to double, but when it is so badly lacking texture, we can \"pretend\" it is a 4-card suit and just double.",
          videoUrl: "",
        },
        {
          id: "bid1-27-b",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This is consistent with the idea that typically we do not overcall a 5332 on the 2 level — though often that shape may be a double instead.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-29",
    difficulty: 1,
    title: "Preempts (27): Partner agreement & vulnerable suits",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "?",
    vulnerability: "EW Vul",
    shownHands: {
      DECLARER: { S: "762", H: "Q1087542", D: "42", C: "8" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Preempts",
      promptThemeTint: "preempt",
      contractLabel: "Modern Preempts",
      contractLabelBeforeStartOnly: true,
      auctionOpponentsRed: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/P1UZ8eaeNqs?si=71U3F4RUo8llUQJO",
      customPrompts: [
        {
          id: "bid1-29-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid127IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid1-29-partner",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid127PartnerWarnRich />,
          videoUrl: "",
        },
        {
          id: "bid1-29-rules",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid127RulesRich />,
          videoUrl: "",
        },
        {
          id: "bid1-29-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Would you make a bid with this hand?",
          playDecisionInput: "biddingBox",
          expectedChoice: ["3h", "4h"],
          expectedChoiceDisplay: "3♥ or 4♥",
          wrongTryText: "Not quite — think world-class preempt aggression when you are not vulnerable.",
          noContinue: false,
          revealText: <Bid127PreemptBidRevealRich />,
          videoUrl: "",
        },
        {
          id: "bid1-29-calibrate",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid127CalibrateRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-30",
    difficulty: 1,
    title: "Preempts (28): Seven spades — what do you bid?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "?",
    vulnerability: "EW Vul",
    shownHands: {
      DECLARER: { S: "AKT8643", H: "KT4", D: "73", C: "4" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Preempts",
      promptThemeTint: "preempt",
      contractLabel: "Modern Preempts",
      contractLabelBeforeStartOnly: true,
      auctionOpponentsRed: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/I7HOlXN5LlY?si=hvGbArSo2XTQlDo3",
      customPrompts: [
        {
          id: "bid1-30-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What are your thoughts on this one?",
          playDecisionInput: "biddingBox",
          expectedChoice: "1s",
          expectedChoiceDisplay: "1♠",
          wrongTryText: "Think again — with this shape when you aren't vulnerable, you still need a plan.",
          noContinue: false,
          revealText: <Bid128OpeningRevealRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-31",
    difficulty: 1,
    title: "Preempts (29): Muddying the waters",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "?",
    vulnerability: "EW Vul",
    shownHands: {
      DECLARER: { S: "T76432", H: "KT3", D: "JT", C: "A9" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Preempts",
      promptThemeTint: "preempt",
      contractLabel: "Modern Preempts",
      contractLabelBeforeStartOnly: true,
      auctionOpponentsRed: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/hd8yt1QodnM?si=WZ2En-XXJ-U6N1fG",
      customPrompts: [
        {
          id: "bid1-31-muddy",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid129MuddyWatersRich />,
          videoUrl: "",
        },
        {
          id: "bid1-31-choice",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is your choice?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "This is a hand to pass — try again.",
          noContinue: false,
          revealText: <Bid129PassRevealRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-32",
    difficulty: 1,
    title: "Preempts (30): Consolidate and calibrate",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "?",
    vulnerability: "EW Vul",
    shownHands: {
      DECLARER: { S: "QJT8432", H: "2", D: "JT84", C: "2" },
      DUMMY: { S: "K97", H: "J97", D: "Q75", C: "T976" },
      RHO: { S: "5", H: "AKQ4", D: "K963", C: "AQ85" },
      LHO: { S: "A6", H: "T8653", D: "A2", C: "KJ43" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Preempts",
      promptThemeTint: "preempt",
      contractLabel: "Modern Preempts",
      contractLabelBeforeStartOnly: true,
      auctionOpponentsRed: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/eVA9UnD1HK4?si=rLewZHqw7o7eUU_7",
      customPrompts: [
        {
          id: "bid1-32-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Okay, so lets consolidate and calibrate. What do we bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "4s",
          expectedChoiceDisplay: "4♠",
          wrongTryText: "Try again — this is the hand where we put maximum pressure on right now.",
          noContinue: false,
          revealText: <Bid130RevealRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-33",
    difficulty: 1,
    title: "Preempts (31): Final calibration",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "3♥ P ?",
    vulnerability: "NS Vul",
    shownHands: {
      DECLARER: { S: "AKJ7", H: "K4", D: "74", C: "97543" },
      DUMMY: { S: "T8", H: "AQJ9763", D: "953", C: "2" },
      RHO: { S: "9653", H: "T5", D: "AKQ6", C: "AJ6" },
      LHO: { S: "Q42", H: "82", D: "JT82", C: "KQT8" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Preempts",
      promptThemeTint: "preempt",
      contractLabel: "Modern Preempts",
      contractLabelBeforeStartOnly: true,
      auctionPartnersRed: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/MyghAMTgE64?si=eRizWAdB-F-khi7C",
      customPrompts: [
        {
          id: "bid1-33-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Okay, so lets consolidate and calibrate. What do we bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "4h",
          expectedChoiceDisplay: "4♥",
          wrongTryText: "Not quite — trust partner's vulnerable preempt quality and push to game.",
          noContinue: false,
          revealFullHandSeats: ["DUMMY", "RHO", "LHO"],
          revealText: <Bid131RevealRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-34",
    difficulty: 1,
    title: "Is this forcing? (32): Competitive auction",
    newUntil: "2026-05-14",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P 1NT 2♥ ?",
    vulnerability: "None Vul",
    shownHands: {
      DECLARER: { S: "AQ1084", H: "7", D: "KQJ73", C: "82" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Is this forcing?",
      promptThemeTint: "newColour",
      contractLabel: "Is this forcing?",
      contractLabelBeforeStartOnly: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/ucvI5UTVFGA?si=TcQ4dMRmdqD7BkB-",
      customPrompts: [
        {
          id: "bid1-34-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid132IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid1-34-rule",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid132RuleRich />,
          videoUrl: "",
        },
        {
          id: "bid1-34-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "In this auction, what do you do?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3d",
          expectedChoiceDisplay: "3♦",
          noContinue: false,
          revealText: <Bid132RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid1-34-wrap",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid132WrapRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-35",
    difficulty: 1,
    title: "Is this forcing? (33): Responder's second bid",
    newUntil: "2026-05-14",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ P 1♠ 2♦ P P ?",
    vulnerability: "Nil Vul",
    shownHands: {
      DECLARER: { S: "J10842", H: "3", D: "94", C: "AQ1098" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Is this forcing?",
      promptThemeTint: "newColour",
      contractLabel: "Is this forcing?",
      contractLabelBeforeStartOnly: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/0fuGBRlVJg8?si=v-KR3bJCwGSjV7Xg",
      customPrompts: [
        {
          id: "bid1-35-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3c",
          expectedChoiceDisplay: "3♣",
          noContinue: false,
          revealText: <Bid133RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid1-35-wrap",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid133WrapRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-36",
    difficulty: 1,
    title: "Is this forcing? (34): First-response hand type",
    newUntil: "2026-05-14",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ 2♣ ?",
    vulnerability: "Nil Vul",
    shownHands: {
      DECLARER: { S: "KQ10932", H: "87", D: "Q108", C: "76" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Is this forcing?",
      promptThemeTint: "newColour",
      contractLabel: "Is this forcing?",
      contractLabelBeforeStartOnly: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/JYtx5gcUMAQ?si=SeWsdPfqCffWhaOl",
      customPrompts: [
        {
          id: "bid1-36-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "It's really nice to bid your six-card suits. Is it right to do so here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "double",
          expectedChoiceDisplay: "X",
          noContinue: false,
          revealText: <Bid134RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid1-36-wrap",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid134WrapRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-37",
    difficulty: 1,
    title: "Is this forcing? (35): Cue-bid for strength",
    newUntil: "2026-05-14",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P 1NT 2♦ ?",
    vulnerability: "Nil Vul",
    shownHands: {
      DECLARER: { S: "AKQ87", H: "A", D: "54", C: "AJ1083" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Is this forcing?",
      promptThemeTint: "newColour",
      contractLabel: "Is this forcing?",
      contractLabelBeforeStartOnly: true,
      hidePlayDecisionHeading: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/UVvU4yaQecw?si=RDwlAvlVVW-fL2e2",
      customPrompts: [
        {
          id: "bid1-37-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do we have a simple option here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3d",
          expectedChoiceDisplay: "3♦",
          noContinue: false,
          revealText: <Bid135RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid1-37-continue",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid135ContinueRich />,
          videoUrl: "",
        },
        {
          id: "bid1-37-wrap",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid135WrapRich />,
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-38",
    difficulty: 1,
    title: "Is this forcing? (36): Recap",
    newUntil: "2026-05-14",
    trumpSuit: "NT",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "Recap",
    vulnerability: "None Vul",
    shownHands: {
      DECLARER: { S: "", H: "", D: "", C: "" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Is this forcing?",
      promptThemeTint: "newColour",
      contractLabel: "Is this forcing?",
      contractLabelBeforeStartOnly: true,
      hidePlayDecisionHeading: true,
      customPrompts: [
        {
          id: "bid1-38-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "A lot of people were/are taught, \"change of suit is forcing\". Is that correct?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: false,
          revealText: <Bid136Q1RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid1-38-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Which change of suit is always forcing?",
          options: [
            { id: "responderFirstBid", label: "Responder's first bid" },
            { id: "openerFirstBid", label: "Opener's first bid" },
            { id: "doubleThenBid", label: "Any double then bid" },
          ],
          expectedChoice: "responderFirstBid",
          noContinue: false,
          revealText: <Bid136Q2RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid1-38-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "If you are responder, the bidding is competitive and already on the two level. You are ready to make your first bid, but are not strong enough to force the bidding up. What is the common way to handle this?",
          options: [
            { id: "passThenBid", label: "Pass first then bid" },
            { id: "doubleThenBid", label: "Double first then bid" },
            { id: "bidThenRebid", label: "Just bid then rebid your suit" },
            { id: "cueBid", label: "Cue bid the opponent's suit" },
          ],
          expectedChoice: "doubleThenBid",
          noContinue: false,
          revealText: <Bid136Q3RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid1-38-q4",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "In competition all doubles mean a single suit that isn't strong enough to bid.",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: false,
          revealText: <Bid136Q4RevealRich />,
          videoUrl: "",
        },
      ],
    },
  },
  // Parked (hidden for now): former bid1-17 & bid1-18, and bid1-23 — see src/data/biddingDifficulty1Parked.js
  // --- Difficulty 2: Matchpoints (Club Duplicates) ---
  {
    id: "bid2-1",
    difficulty: 2,
    title: "Matchpoints (1): Invite or pass over 1NT?",
    newUntil: "2026-04-15",
    trumpSuit: "NT",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1NT P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Let's look at how to score better at matchpoint scoring (Club Duplicates).",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Duplicate bidding",
      promptThemeTint: "matchpoints",
      videoUrlBeforeStart: "https://www.youtube.com/embed/QiJjOLyc1Fc",
      customPrompts: [
        {
          id: "bid2-1-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "You pick up this hand and are deciding whether to invite by bidding 2NT or pass?",
          options: [
            { id: "2nt", label: "Invite, 2NT" },
            { id: "pass", label: "Pass" },
          ],
          expectedChoice: "pass",
          noContinue: true,
          revealText:
            "Pass is best.\n\n1. The most powerful idea in matchpoints is to \"go positive\". You get good matchpoints results by getting positive scores. We should always ask ourselves the question — what bidding decision will give me the best chance of coming out with a positive score?\n\n2. In general, I don't like inviting with 8 points opposite a 1NT, but especially in matchpoints. For me a balanced 8 points is typically a pass (Not always! there are some exceptions covered in other practice hands).",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "Q7", H: "KT4", D: "K953", C: "T842" },
    },
    rounds: [],
  },
  {
    id: "bid2-2",
    difficulty: 2,
    title: "Matchpoints (2): Invite 2NT or bid 3NT?",
    newUntil: "2026-04-15",
    trumpSuit: "NT",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1NT P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Let's look at how to score better at matchpoint scoring (Club Duplicates).",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Duplicate bidding",
      promptThemeTint: "matchpoints",
      videoUrlBeforeStart: "https://www.youtube.com/embed/PG8gsCnIpgw",
      customPrompts: [
        {
          id: "bid2-2-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Does it make sense to invite with 2NT on this hand or is it correct to just bid 3NT?",
          options: [
            { id: "3nt", label: "Bid 3NT" },
            { id: "2nt", label: "Bid 2NT" },
          ],
          expectedChoice: "2nt",
          noContinue: true,
          revealText:
            "2NT. Just invite with 2NT.\n\nFirstly, this is a very bad hand, 4333 and bad suits, honours spread everywhere, no intermediate cards. This hand is not good for taking tricks.\n\nSecondly, In duplicate pairs (matchpoint scoring) we want to be particularly careful — When we have the majority of the points we do not want to get too high and end up with a negative score.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "952", H: "K63", D: "Q874", C: "AJ5" },
    },
    rounds: [],
  },
  {
    id: "bid2-3",
    difficulty: 2,
    title: "Matchpoints (3): Compete over 2♠?",
    newUntil: "2026-04-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P 2♠ P P ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Let's look at how to score better at matchpoint scoring (Club Duplicates).",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Duplicate bidding",
      promptThemeTint: "matchpoints",
      auctionOpponentsRed: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/nAL-aloVfm0",
      customPrompts: [
        {
          id: "bid2-3-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "I've been emphasising the importance of going positive.\n\nIf you knew for sure that you would get a minus score by entering the bidding (say for example ending up on the three level down 1), would that deter you?",
          options: [
            { id: "yes", label: "Yes that would deter me" },
            { id: "no", label: "No that wouldn't deter me" },
          ],
          expectedChoice: "no",
          noContinue: false,
          revealText:
            "We should be eager to bid, even expecting to go down in our contract. This feels like I am contradicting myself but I want to explain this simply.\n\nI mentioned before ##when we have the majority of the points##, it is important that we do not squander that — we need to get a positive score.\n\nHOWEVER, things are very different when the points are divided evenly, or if the opponents have the slight majority. In that context, we want to compete for the part score, we are okay with going -1 or even -2 — that can be an excellent score if we aren't vulnerable.\n\nOne other main concept here — When the opponents have a fit, we want to fiercely compete for the part score. It is very wise to \"not let the opponents play on the two level with a fit\".",
          videoUrl: "",
        },
        {
          id: "bid2-3-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "So would you bid on this rather bad looking hand?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes, very clear yes. We want to fiercely compete when they have a fit. We actually have an excellent hand for that — nothing wasted in spades (their suit).\n\nWe have great shape for a takeout double. Remember we are balancing — we can expect partner to hold some stuff, the opponents stopped on the two level for a reason — our side has points.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "83", H: "KT72", D: "K954", C: "Q63" },
    },
    rounds: [],
  },
  {
    id: "bid2-4",
    difficulty: 2,
    title: "Matchpoints (4): Open light when not vulnerable?",
    newUntil: "2026-04-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Let's look at how to score better at matchpoint scoring (Club Duplicates).",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Duplicate bidding",
      promptThemeTint: "matchpoints",
      auctionOpponentsRed: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/ebS-vAVOHjg",
      customPrompts: [
        {
          id: "bid2-4-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "This 10 point hand is probably not enough to open in most systems. Does duplicate/matchpoint scoring make a difference?",
          options: [
            { id: "less", label: "I am less likely to open this in duplicate scoring" },
            { id: "more", label: "I am more likely to open it." },
          ],
          expectedChoice: "more",
          noContinue: true,
          revealText:
            "More likely — but importantly, did you notice that our side is not vulnerable? When we are not vulnerable, the narrative should go like this:\n\n\"We want to enter the auction aggressively, both opening and overcalling, find a fit if we can, compete. We are okay with going 1 or 2 off in a partscore, its often a good score.\"\n\nHOWEVER, this mentality of get in there, be aggressive and compete when not vulnerable, has implications.\n\nIf we are going to bid 1 or even 2 points lighter than normal, Partner needs to know and:\n\n✓ Be on the same page\n✓ Not punish us for it.\n\nWhat does it mean to punish us? Check out the next training question.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AKT73", H: "842", D: "KT6", C: "95" },
    },
    rounds: [],
  },
  {
    id: "bid2-5",
    difficulty: 2,
    title: "Matchpoints (5): Respond to 1♠ — invite or game?",
    newUntil: "2026-04-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Let's look at how to score better at matchpoint scoring (Club Duplicates).",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Duplicate bidding",
      promptThemeTint: "matchpoints",
      auctionOpponentsRed: true,
      auctionPartnersGreen: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/whAQpZT7DLk",
      customPrompts: [
        {
          id: "bid2-5-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "North opens 1♠, pass by East. Do you bid 2♠, invite, or game force?",
          options: [
            { id: "2s", label: "2♠" },
            { id: "invite", label: "Invite" },
            { id: "game", label: "Game force" },
          ],
          expectedChoice: ["2s", "invite"],
          noContinue: true,
          revealText:
            "I would just bid 2♠. Inviting is acceptable but will score lower in the long run.\n\nThere are three reasons for that.\n\n1. This is a very bad 11 point hand — the next 5 problems are on hand evaluation and will revisit this hand.\n\n2. Matchpoints is about staying low and making your contracts. Getting too high and going down is a matchpoint sin.\n\n3. I don't want to punish partner for opening NV — I know we get in there aggressively.\n\nTo be a good matchpoint player, you need to learn to do less with your 11's and even bad 12's when partner opens NV.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "Q74", H: "J92", D: "A73", C: "KJ85" },
    },
    rounds: [],
  },
  {
    id: "bid2-6",
    difficulty: 2,
    title: "Hand evaluation (6): Feelings about this hand",
    newUntil: "2026-04-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Advanced hand evaluation",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Advanced hand evaluation",
      promptThemeTint: "handEval",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/IhA64-MOjAk",
      customPrompts: [
        {
          id: "bid2-6-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "North opens 1♠, Pass by East, your hand as South. Firstly, what are your feelings about this hand?",
          options: [
            { id: "bad", label: "Bad hand" },
            { id: "average", label: "Average, nothing special" },
            { id: "pretty", label: "Pretty good hand" },
          ],
          expectedChoice: "pretty",
          noContinue: false,
          revealText:
            "I like this hand for a few reasons.\n\n1. In diamonds the honours and intermediates are clustered, and the suit has length (4+ cards). That could easily become 3 or 4 tricks. I see a lot of potential in those diamonds!\n\n2. Outside of diamonds we have Aces which are excellent cards. More specifically, if you have a bare suit with just an Ace, it is perfectly fine as that Ace will certainly come in useful. Bare suits such as Qxxx can frequently be completely useless.\n\n3. In the trump suit we have Quacks — Queens and Jacks. Quacks are considered bad things typically, but in the trump suit they are typically excellent.",
          videoUrl: "",
        },
        {
          id: "bid2-6-summary",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "In summary\n\n✓ \"Clustered\" honours are good things, like the diamond suit.\n✓ Queens and Jacks are excellent in the trump suit, not as good outside.\n✓ Aces are good everywhere. But unlike other cards, they work fine on their own — for example Axx is an asset whereas Qxx in a side suit can be worth very little.",
          videoUrl: "",
        },
        {
          id: "bid2-6-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "So would you game force or invite?",
          options: [
            { id: "game", label: "Game force" },
            { id: "invite", label: "Invite" },
          ],
          expectedChoice: "game",
          noContinue: true,
          revealText:
            "I would game force for sure. The only time I would consider just inviting is in duplicate scoring, but even then I think game forcing is probably a better idea.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "QJ5", H: "A84", D: "KQT6", C: "932" },
    },
    rounds: [],
  },
  {
    id: "bid2-7",
    difficulty: 2,
    title: "Hand evaluation (7): 1NT opening?",
    newUntil: "2026-04-15",
    trumpSuit: "NT",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Advanced hand evaluation",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Advanced hand evaluation",
      promptThemeTint: "handEval",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/VwKRIT9XML8",
      customPrompts: [
        {
          id: "bid2-7-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "You play 15–17 1NT. Is this a simple 1NT opening?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: true,
          revealText:
            "No. To me this is very clearly not good enough to open 1NT. If I had to put a point count on that hand, I would say it's worth about 13 at most.\n\nWhy is it such a downgrade?\n\n1. 4333 is not great shape.\n\n2. Honours are dense in the short suits, and long suits are bare — this is bad. Good hands have the opposite: strong long suits, and less or nothing in the short suits. \"We want our honours to be working hard in our long suits.\"\n\n3. No intermediate cards — these are very important! 10's and 9's make all the difference for trick taking.\n\n4. No Aces, lots of \"Quacks\" — Queens and Jacks.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KQ4", H: "KQJ", D: "K752", C: "J93" },
    },
    rounds: [],
  },
  {
    id: "bid2-8",
    difficulty: 2,
    title: "Hand evaluation (8): Bid 5♣ over 4♠?",
    newUntil: "2026-04-15",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ 1♠ P 2♠ 4♣ 4♠ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Advanced hand evaluation",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Advanced hand evaluation",
      promptThemeTint: "handEval",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/qw3n2tiYTq0",
      customPrompts: [
        {
          id: "bid2-8-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Would you make a bid to the 5 level?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "I would confidently bid 5♣. Why?\n\nFirstly I want to address the fact that I'm 4333, and I've been talking down these shapes. Everything is contextual in bridge. When partner is highly unbalanced, it becomes much less relevant whether you are balanced or not. In other words:\n\n##We want to slow down when both hands are balanced.##\n\nHowever\n\n##We don't want to be deterred by being balanced when partner is highly unbalanced.##\n\nLet's move on.\n\n##Our golden rule: always support partner!## We have probably a 10 or 11 card fit — let partner know, follow the golden rule.\n\nFinally, our points are excellent. The Queen in the trump suit is good, and an outside Ace is perfect. You have an excellent hand and should be confident to bid.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "9732", H: "842", D: "A65", C: "Q94" },
    },
    rounds: [],
  },
  {
    id: "bid2-9",
    difficulty: 2,
    title: "Doubles judgment (9): Distributional — not takeout",
    newUntil: "2026-05-15",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ P 1♠ ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Judgment around doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Doubles",
      promptThemeTint: "doubles",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/JXU77vavbYE",
      customPrompts: [
        {
          id: "bid2-9-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid209IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid2-9-rule1",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid209Rule1Rich />,
          videoUrl: "",
        },
        {
          id: "bid2-9-example",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid209ExampleRich />,
          videoUrl: "",
        },
        {
          id: "bid2-9-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "Is it appropriate to make a takeout double here, showing the other two suits?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
            { id: "fifty", label: "50/50 — an okay option" },
          ],
          expectedChoice: "no",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid209RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-9-wrap",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid209WrapRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "3", H: "86", D: "AQT9", C: "AK9642" },
    },
    rounds: [],
  },
  {
    id: "bid2-10",
    difficulty: 2,
    title: "Doubles judgment (10): Good 5-card major — bid, don't double",
    newUntil: "2026-06-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Judgment around doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Doubles",
      promptThemeTint: "doubles",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/Tcyrv4SkeAw",
      customPrompts: [
        {
          id: "bid2-10-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What would you bid here?",
          options: [
            { id: "double", label: "Double" },
            { id: "1s", label: "1♠" },
          ],
          expectedChoice: "1s",
          expectedChoiceDisplay: "1♠",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid210RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-10-continue",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid210ContinueRich />,
          videoUrl: "",
        },
        {
          id: "bid2-10-summary",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid210SummaryRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KQ1073", H: "AQ43", D: "5", C: "Q103" },
    },
    rounds: [],
  },
  {
    id: "bid2-11",
    difficulty: 2,
    title: "Doubles judgment (11): Equal unbid suits — 1♠ vs X",
    newUntil: "2026-07-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ P 1♥ ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Judgment around doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Doubles",
      promptThemeTint: "doubles",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/iJmSSCVv5Mg",
      customPrompts: [
        {
          id: "bid2-11-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "With equal length in both unbid suits, is double a suitable bid or is 1♠ better?",
          options: [
            { id: "1s", label: "1♠" },
            { id: "x", label: "X" },
          ],
          expectedChoice: "1s",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid211RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-11-continue",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid211ContinueRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: {
        S: "AJ982",
        H: "98",
        D: "T",
        C: "KQ1042",
      },
    },
    rounds: [],
  },
  {
    id: "bid2-12",
    difficulty: 2,
    title: "Doubles judgment (12): After 3♦ — when double beats 3♠",
    newUntil: "2026-08-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "3♦ ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Judgment around doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Doubles",
      promptThemeTint: "doubles",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/YUQ_kxV7bN8",
      customPrompts: [
        {
          id: "bid2-12-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid here?",
          options: [
            { id: "3s", label: "3♠" },
            { id: "x", label: "X" },
            { id: "pass", label: "Pass" },
          ],
          expectedChoice: "x",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid212RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-12-continue",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid212ContinueRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: {
        S: "J7432",
        H: "AK109",
        D: "2",
        C: "KQ5",
      },
    },
    rounds: [],
  },
  {
    id: "bid2-13",
    difficulty: 2,
    title: "Doubles judgment (13): After 1♥ — five-card minor, takeout double",
    newUntil: "2026-09-15",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Judgment around doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Doubles",
      promptThemeTint: "doubles",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/GqnCtezS-Ps",
      customPrompts: [
        {
          id: "bid2-13-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is the appropriate bid here?",
          options: [
            { id: "x", label: "X" },
            { id: "2c", label: "2♣" },
          ],
          expectedChoice: "x",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid213RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-13-continue",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid213ContinueRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: {
        S: "1084",
        H: "2",
        D: "AJ103",
        C: "AK1083",
      },
    },
    rounds: [],
  },
  {
    id: "bid2-14",
    difficulty: 2,
    title: "Responding to a double (1): Jump shows strength — 3♣",
    newUntil: "2026-10-15",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ X P ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Responding to a double",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Responding to a double",
      promptThemeTint: "respondToDouble",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/ggAHx_OM_G8",
      customPrompts: [
        {
          id: "bid2-14-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What would you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3c",
          expectedChoiceDisplay: "3♣",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid214RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-14-c1",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid214Continue1Rich />,
          videoUrl: "",
        },
        {
          id: "bid2-14-c2",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid214Continue2Rich />,
          videoUrl: "",
        },
        {
          id: "bid2-14-c3",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid214Continue3Rich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: {
        S: "1084",
        H: "52",
        D: "K43",
        C: "AQ1042",
      },
    },
    rounds: [],
  },
  {
    id: "bid2-15",
    difficulty: 2,
    title: "Responding to a double (2): Fit and values — 4♠",
    newUntil: "2026-11-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ X P ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Responding to a double",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Responding to a double",
      promptThemeTint: "respondToDouble",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/tvd_RD4yfmU",
      customPrompts: [
        {
          id: "bid2-15-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "4s",
          expectedChoiceDisplay: "4♠",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid215RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-15-continue",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid215ContinueRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: {
        S: "AK1084",
        H: "65",
        D: "KQ9",
        C: "1082",
      },
    },
    rounds: [],
  },
  {
    id: "bid2-16",
    difficulty: 2,
    title: "Responding to a double (3): Almost game — 3♠",
    newUntil: "2026-11-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ X P ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Responding to a double",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Responding to a double",
      promptThemeTint: "respondToDouble",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/hyIsryDLqOU",
      customPrompts: [
        {
          id: "bid2-16-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "This is a nice hand, perhaps not quite enough to bid game, but close. What is the appropriate bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3s",
          expectedChoiceDisplay: "3♠",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid216RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: {
        S: "KJ953",
        H: "3",
        D: "KJ3",
        C: "10982",
      },
    },
    rounds: [],
  },
  {
    id: "bid2-17",
    difficulty: 2,
    title: "Responding to a double (4): Constructive — 2♥",
    newUntil: "2026-11-15",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ X P ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Responding to a double",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Responding to a double",
      promptThemeTint: "respondToDouble",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/i9vncsP5hKY",
      customPrompts: [
        {
          id: "bid2-17-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What will you bid this time?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2h",
          expectedChoiceDisplay: "2♥",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid217RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: {
        S: "65",
        H: "KQ1083",
        D: "Q1043",
        C: "32",
      },
    },
    rounds: [],
  },
  {
    id: "bid2-18",
    difficulty: 2,
    title: "Responding to a double (5): No five-card major — 2♣ cue",
    newUntil: "2026-11-20",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ X P ?",
    vulnerability: "Nil Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Responding to a double",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Responding to a double",
      promptThemeTint: "respondToDouble",
      auctionAllWhite: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/FPYBCdQvsRo",
      customPrompts: [
        {
          id: "bid2-18-recap",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid218RecapRich />,
          videoUrl: "",
        },
        {
          id: "bid2-18-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid218QuestionRich />,
          playDecisionInput: "biddingBox",
          expectedChoice: "2c",
          expectedChoiceDisplay: "2♣",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid218RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: {
        S: "KQ104",
        H: "K5",
        D: "AJ108",
        C: "542",
      },
    },
    rounds: [],
  },
  {
    id: "bid2-19",
    difficulty: 2,
    title: "The Power of Pass (1)",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ 2♥ P P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Approximate nature of your hand",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: The Power of Pass",
      videoUrlBeforeStart: "https://www.youtube.com/shorts/mMbfba-TzfM?si=_4mbnmdTy_obCDeV",
      promptThemeTint: "showHand",
      auctionAllWhite: true,
      customPrompts: [
        {
          id: "bid2-19-principle",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid219PrincipleRich />,
          videoUrl: "",
        },
        {
          id: "bid2-19-approx",
          type: "INFO",
          atRoundIdx: -1,
          hideAuction: true,
          promptText: <Bid219ApproximateNatureRich />,
          videoUrl: "",
        },
        {
          id: "bid2-19-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What should South bid now?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid219PassRevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-19-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hideAuction: true,
          shownHandsOverride: {
            DECLARER: { S: "KQ8", H: "AT", D: "8", C: "KJT7542" },
          },
          promptText: <Bid219SecondHandRich />,
          playDecisionInput: "biddingBox",
          expectedChoice: "3c",
          expectedChoiceDisplay: "3♣",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid219SecondHandRevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KQ8", H: "AJ3", D: "86", C: "KT752" },
    },
    rounds: [],
  },
  {
    id: "bid2-20",
    difficulty: 2,
    title: "The Power of Pass (2)",
    trumpSuit: "NT",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ P 1♠ 2♥ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Responding after interference",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: The Power of Pass",
      videoUrlBeforeStart: "https://www.youtube.com/shorts/jbJUGwzvZro",
      promptThemeTint: "showHand",
      auctionAllWhite: true,
      customPrompts: [
        {
          id: "bid2-20-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What should South bid now?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Lets look at a possible continuation",
          revealText: <Bid219RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-20-continue",
          type: "INFO",
          atRoundIdx: -1,
          hideAuction: true,
          continueButtonLabel: "Let's look at the same auction again, but if we bid 2NT instead of pass",
          promptText: <Bid219ContinuationRich />,
          videoUrl: "",
        },
        {
          id: "bid2-20-2nt-meaning",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hideAuction: true,
          hideBiddingHand: true,
          promptText: <Bid220Revisit2NTRich />,
          options: [
            { id: "11to14", label: "11-14 balanced with a good double stopper" },
            { id: "15to17", label: "15-17 balanced" },
            { id: "18to19", label: "18-19 balanced" },
          ],
          expectedChoice: "18to19",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid220Revisit2NTRevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "75", H: "AQT", D: "AQ943", C: "J82" },
    },
    rounds: [],
  },
  {
    id: "bid2-21",
    difficulty: 2,
    title: "The Power of Pass (3)",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ 1NT P 2♣ 3♣ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Responding after Stayman",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: The Power of Pass",
      videoUrlBeforeStart: "https://www.youtube.com/shorts/U7ufmQhcCX4",
      promptThemeTint: "showHand",
      auctionAllWhite: true,
      auctionHighlightCall: { row: 0, seat: "N" },
      auctionHighlightTint: "alert",
      auctionHighlightNote: "simple stayman",
      customPrompts: [
        {
          id: "bid2-21-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What should South bid now?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid220RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "Q97", H: "AK4", D: "KQ32", C: "Q42" },
    },
    rounds: [],
  },
  {
    id: "bid2-22",
    difficulty: 2,
    title: "The Power of Pass (4)",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ 1♠ 2♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Forced rebid after partner's forcing call",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: The Power of Pass",
      videoUrlBeforeStart: "https://www.youtube.com/shorts/LiZo5dh1eZ0",
      promptThemeTint: "showHand",
      auctionAllWhite: true,
      customPrompts: [
        {
          id: "bid2-22-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid221IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid2-22-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2s",
          expectedChoiceDisplay: "2♠",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid221RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-22-continue-1",
          type: "INFO",
          atRoundIdx: -1,
          hideAuction: true,
          promptText: <Bid221ContinueOneRich />,
          videoUrl: "",
        },
        {
          id: "bid2-22-continue-2",
          type: "INFO",
          atRoundIdx: -1,
          hideAuction: true,
          promptText: <Bid221ContinueTwoRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "754", H: "T2", D: "AKQ8", C: "K943" },
    },
    rounds: [],
  },
  {
    id: "bid2-23",
    difficulty: 2,
    title: "The Power of Pass (5)",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P 2♦ 4♥ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "After game forcing 2♦",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: The Power of Pass",
      videoUrlBeforeStart: "https://www.youtube.com/shorts/pGoakHt-2Nk",
      promptThemeTint: "showHand",
      auctionPartnersRed: true,
      customPrompts: [
        {
          id: "bid2-23-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid222IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid2-23-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Now with that introduction - what do you bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "double",
          expectedChoiceDisplay: "X",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid222RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-23-continue",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid222ContinueRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AT943", H: "KT3", D: "82", C: "AJ4" },
    },
    rounds: [],
  },
  {
    id: "bid2-24",
    difficulty: 2,
    title: "Slam judgment",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ P 2♥ P 3♠ P 4♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Slam judgment",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Slam judgment",
      promptThemeTint: "slamJudgment",
      videoUrlBeforeStart: "https://youtube.com/shorts/J05pbztmizo?si=XZU2GbNC6YkQ0ez7",
      customPrompts: [
        {
          id: "bid2-24-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid224IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid2-24-q-pass",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hidePlayDecisionHeading: true,
          promptText: <Bid224PassOrSlamQuestionRich />,
          options: [
            {
              id: "slam",
              label: "I will bid slam, it's probably going to be at least a good chance.",
            },
            {
              id: "pass",
              label: "I will just pass",
            },
          ],
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: <Bid224PassRevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-24-hand-detail",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid224HandDetailRich />,
          videoUrl: "",
        },
        {
          id: "bid2-24-unveil",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hidePlayDecisionHeading: true,
          promptText: "Reveal partner's hand when you're ready.",
          options: [{ id: "reveal", label: "Reveal partner's hand" }],
          expectedChoice: "reveal",
          expectedChoiceDisplay: "Reveal",
          wrongTryText: "Use the button to reveal.",
          noContinue: false,
          revealFullHandSeats: ["DUMMY"],
          revealText: <Bid224PartnerRevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "A", H: "AQ974", D: "AKJ4", C: "KT3" },
      DUMMY: { S: "KJ104", H: "K82", D: "765", C: "432" },
    },
    rounds: [],
  },
  {
    id: "bid2-25",
    difficulty: 2,
    title: "Slam judgment",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      showAuctionDuringPlayDecisionReveal: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Slam judgment",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Slam judgment",
      promptThemeTint: "slamJudgment",
      videoUrlBeforeStart: "https://youtube.com/shorts/n2qIUGdvHzk?si=7zjlgtxrSC1Y24Os",
      customPrompts: [
        {
          id: "bid2-25-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid225IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid2-25-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hidePlayDecisionHeading: true,
          promptText: "What do you do?",
          options: [
            {
              id: "bidGame",
              label: "Just bid game, I've already made a slam try and partner has said no.",
            },
            { id: "continueSlam", label: "Continue investigating slam" },
          ],
          expectedChoice: "continueSlam",
          expectedChoiceDisplay: "Continue investigating slam",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealFullHandSeats: ["DUMMY"],
          revealFullHandSeatsOnContinue: true,
          playCardRevealHideSuccessBanner: true,
          revealText: <Bid225SlamCorrectRevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-25-closing",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid225ClosingRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "74", H: "AKQJ6", D: "KJT84", C: "A" },
      DUMMY: { S: "AK93", H: "982", D: "Q76", C: "Q98" },
    },
    rounds: [],
  },
  {
    id: "bid2-26",
    difficulty: 2,
    title: "Slam judgment",
    trumpSuit: "S",
    contract: "—",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    dealerCompass: "N",
    auction: "2♠ 5♦ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Slam judgment",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Slam judgment",
      promptThemeTint: "slamJudgment",
      auctionPartnersRed: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/Bic527UvNys?si=Y3XYwgjCRQnuleSQ",
      customPrompts: [
        {
          id: "bid2-26-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid226IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid2-26-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hidePlayDecisionHeading: true,
          promptText: "What would you do?",
          options: [
            { id: "pass", label: "Pass" },
            { id: "compete5s", label: "Compete to 5♠" },
            { id: "bidSlam", label: "Bid slam!" },
          ],
          expectedChoice: "bidSlam",
          expectedChoiceDisplay: "Bid slam",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealFullHandSeats: ["DUMMY"],
          revealFullHandSeatsOnContinue: true,
          playCardRevealHideSuccessBanner: true,
          revealText: <Bid226SlamRevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-26-closing",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid226ClosingRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "K93", H: "AKQT84", D: "", C: "A764" },
      DUMMY: { S: "AQ10852", H: "76", D: "543", C: "32" },
    },
    rounds: [],
  },
  {
    id: "bid2-27",
    difficulty: 2,
    title: "Slam judgment",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ P 1♥ P 3♣ P 3♥ P 3♠ P 4♦ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Slam judgment",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Slam judgment",
      promptThemeTint: "slamJudgment",
      videoUrlBeforeStart: "https://youtube.com/shorts/fRAcidsIH2s?si=m4I716kNl2NSYjs2",
      customPrompts: [
        {
          id: "bid2-27-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid227IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid2-27-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hidePlayDecisionHeading: true,
          promptText: <Bid227SlamVsGameRich />,
          options: [
            { id: "bid5d", label: "Just bid 5♦" },
            { id: "slamTry", label: "Look more for slam" },
          ],
          expectedChoice: "bid5d",
          expectedChoiceDisplay: "Just bid 5♦",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Reveal full hand",
          revealFullHandSeats: ["DUMMY"],
          revealFullHandSeatsOnContinue: true,
          playCardRevealHideSuccessBanner: true,
          revealText: <Bid227FiveDRevealRich />,
          videoUrl: "",
        },
        {
          id: "bid2-27-closing",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid227ClosingRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "Q4", H: "", D: "AKQJT9", C: "AQ982" },
      DUMMY: { S: "A10987", H: "QJ8765", D: "65", C: "" },
    },
    rounds: [],
  },
  {
    id: "bid2-28",
    difficulty: 2,
    title: "Slam judgment",
    trumpSuit: null,
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1NT P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Slam judgment",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Slam judgment",
      promptThemeTint: "slamJudgment",
      videoUrlBeforeStart: "https://youtube.com/shorts/k03nMDK3DT0?si=vUrcs1OJNav46dZV",
      customPrompts: [
        {
          id: "bid2-28-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid228IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid2-28-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hidePlayDecisionHeading: true,
          promptText: "What will you do?",
          options: [
            { id: "inviteSlam", label: "I'll invite to slam" },
            { id: "settleGame", label: "I'll just settle for game" },
          ],
          expectedChoice: "settleGame",
          expectedChoiceDisplay: "Settle for game",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: <Bid228RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "K93", H: "AQ74", D: "QJ8", C: "K73" },
    },
    rounds: [],
  },
  {
    id: "bid3-1",
    difficulty: 3,
    title: "Splinters (1): Jump after 1♠",
    newUntil: "2026-06-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Understanding splinters",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Splinters",
      promptThemeTint: "splinters",
      videoUrlBeforeStart: "https://youtube.com/shorts/SaAaHddiMa0?si=J9C4o8ubhW4CiDNT",
      customPrompts: [
        {
          id: "bid3-1-info-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid31SplintersIntroRich />,
          videoUrl: "",
        },
        {
          id: "bid3-1-info-lesson",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid31SplintersLessonRich />,
          videoUrl: "",
        },
        {
          id: "bid3-1-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What would you bid on this hand?",
          playDecisionInput: "biddingBox",
          expectedChoice: "4c",
          expectedChoiceDisplay: "4♣",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid31RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "Q1084", H: "A984", D: "A432", C: "2" },
    },
    rounds: [],
  },
  {
    id: "bid3-2",
    difficulty: 3,
    title: "Splinters (2): After partner's splinter",
    newUntil: "2026-08-01",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P 4♦ P ?",
    revealFullHandsAtEnd: ["DUMMY"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Opposite a splinter",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Splinters",
      promptThemeTint: "splinters",
      videoUrlBeforeStart: "https://youtube.com/shorts/ECn6a4jNB_o?si=6dl2xVJp8fndJ4kR",
      customPrompts: [
        {
          id: "bid3-2-info",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid32PrincipleInfoRich />,
          videoUrl: "",
        },
        {
          id: "bid3-2-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid32HandGottenQuestionRich />,
          options: [
            { id: "better", label: "Better" },
            { id: "worse", label: "Worse" },
            { id: "same", label: "Not much change" },
          ],
          expectedChoice: "better",
          expectedChoiceDisplay: "Better",
          wrongTryText: "Not quite — try again.",
          noContinue: true,
          revealFullHandSeats: ["DUMMY"],
          revealText: <Bid32RevealAfterBetterRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AJ10987", H: "K5", D: "9876", C: "A" },
      DUMMY: { S: "K643", H: "A98", D: "2", C: "K7543" },
    },
    rounds: [],
  },
  {
    id: "bid3-3",
    difficulty: 3,
    title: "Splinters (3): Is this a splinter?",
    newUntil: "2026-09-01",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Splinter discipline",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Splinters",
      promptThemeTint: "splinters",
      videoUrlBeforeStart: "https://youtube.com/shorts/8xF8nvk_Ny0?si=aQ3uSKtR0inF0NdX",
      customPrompts: [
        {
          id: "bid3-3-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is this hand suitable for a splinter?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          expectedChoiceDisplay: "No",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid33RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "QJ109", H: "AJ109", D: "QJ109", C: "2" },
    },
    rounds: [],
  },
  {
    id: "bid3-4",
    difficulty: 3,
    title: "Splinters (4): Same auction?",
    newUntil: "2026-09-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ P 4♥",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Common auctions",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Splinters",
      promptThemeTint: "splinters",
      videoUrlBeforeStart: "https://youtube.com/shorts/W4u9PsZkt3o?si=xO68iZKFMkgrfzjN",
      customPrompts: [
        {
          id: "bid3-4-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid34IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid3-4-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid34Q1AuctionRich />,
          options: [
            { id: "splinter", label: "Splinter" },
            { id: "natural", label: "Natural" },
            { id: "depends", label: "Depends" },
          ],
          expectedChoice: "depends",
          expectedChoiceDisplay: "Depends",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid34Reveal1Rich />,
          videoUrl: "",
        },
        {
          id: "bid3-4-think-competition",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid34CompetitionThinkRich />,
          videoUrl: "",
        },
        {
          id: "bid3-4-competition-guidance",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid34CompetitionGuidanceRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AK1092", H: "Q2", D: "K10987", C: "3" },
    },
    rounds: [],
  },
  {
    id: "bid3-5",
    difficulty: 3,
    title: "Splinters (5): Points opposite shortage",
    newUntil: "2026-10-01",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER", "DUMMY"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Shape and wastage",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Splinters",
      promptThemeTint: "splinters",
      videoUrlBeforeStart: "https://youtube.com/shorts/G0P5V4r0Abs?si=MQUAyitd5AzxTMqZ",
      customPrompts: [
        {
          id: "bid3-5-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid35QuestionRich />,
          options: [
            { id: "good", label: "Good" },
            { id: "bad", label: "Bad" },
          ],
          expectedChoice: "bad",
          expectedChoiceDisplay: "Bad",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid35Reveal1Rich />,
          videoUrl: "",
        },
        {
          id: "bid3-5-beyond",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid35BeyondSplintersRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AK1098", H: "98", D: "AKJ9", C: "32" },
      DUMMY: { S: "???", H: "?????", D: "?", C: "????" },
    },
    rounds: [],
  },
  {
    id: "bid3-6",
    difficulty: 3,
    title: "Lebensohl (1): After 1NT and a two-level raise",
    newUntil: "2026-12-01",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: BID36_OPENING_AUCTION,
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Competing after interference",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Lebensohl",
      promptThemeTint: "1nt",
      videoUrlBeforeStart: "https://youtube.com/shorts/V1nXOrfBWHQ?si=4ylR9pYE6iMeU9H5",
      customPrompts: [
        {
          id: "bid3-6-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid36IntroRich />,
          videoUrl: "",
        },
        {
          id: "bid3-6-partscore",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid36LebensohlAndPartscoreRich />,
          videoUrl: "",
        },
        {
          id: "bid3-6-factors",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid36CompeteFactorsRich />,
          videoUrl: "",
        },
        {
          id: "bid3-6-tool",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid36TwoNTRelayRich />,
          videoUrl: "",
        },
        {
          id: "bid3-6-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid36QuestionLeadRich />,
          playDecisionInput: "biddingBox",
          expectedChoice: "2nt",
          expectedChoiceDisplay: "2NT",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid36RevealRich />,
          videoUrl: "",
        },
        {
          id: "bid3-6-auction-follow",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid36AuctionFollowRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { ...BID36_SOUTH_SHOWN_HANDS },
    },
    rounds: [],
  },
  {
    id: "bid3-7",
    difficulty: 3,
    title: "Lebensohl (2): After weak two and takeout double",
    newUntil: "2026-12-01",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: BID37_OPENING_AUCTION,
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Lebensohl after a takeout double",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Lebensohl",
      promptThemeTint: "1nt",
      videoUrlBeforeStart: "https://youtube.com/shorts/G1XObM6bg1I?si=pYDwZ4Da0OEtVtX1",
      customPrompts: [
        {
          id: "bid3-7-msg",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid37MessageToUserRich />,
          videoUrl: "",
        },
        {
          id: "bid3-7-cont-1",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid37Continue1Rich />,
          videoUrl: "",
        },
        {
          id: "bid3-7-cont-2",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid37Continue2Rich />,
          videoUrl: "",
        },
        {
          id: "bid3-7-recap",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid37RecapRich />,
          videoUrl: "",
        },
        {
          id: "bid3-7-game",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid37GameForceRich />,
          videoUrl: "",
        },
        {
          id: "bid3-7-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid37QuestionRich />,
          playDecisionInput: "biddingBox",
          expectedChoice: "3c",
          expectedChoiceDisplay: "3♣",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid37RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "T8", H: "QJ9", D: "T76", C: "AQT84" },
    },
    rounds: [],
  },
  {
    id: "bid3-8",
    difficulty: 3,
    title: "Lebensohl (3): Quick recap and intermediate direct bids",
    newUntil: "2026-12-01",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "Recap",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Lebensohl recap",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Lebensohl",
      promptThemeTint: "1nt",
      customPrompts: [
        {
          id: "bid3-8-recap-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid38RecapQuestion1Rich />,
          options: [
            { id: "good", label: "A good hand" },
            { id: "weak", label: "A weak hand" },
          ],
          expectedChoice: "weak",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid38RecapReveal1Rich />,
          videoUrl: "",
        },
        {
          id: "bid3-8-recap-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid38RecapQuestion2Rich />,
          options: [
            { id: "badAgain", label: "A bad hand again" },
            { id: "decent", label: "A decent hand" },
            { id: "natural", label: "Is natural" },
          ],
          expectedChoice: "badAgain",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid38RecapReveal2Rich />,
          videoUrl: "",
        },
        {
          id: "bid3-8-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid38Question3Rich />,
          options: [
            { id: "gameForce", label: "Game forcing" },
            { id: "intermediate", label: "Intermediate, 8-11, not forcing" },
            { id: "weakCompete", label: "Weak, just competing" },
          ],
          expectedChoice: "intermediate",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid38AuctionMeaningRevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "T8", H: "QJ9", D: "T76", C: "AQT84" },
    },
    rounds: [],
  },
  {
    id: "bid3-9",
    difficulty: 3,
    title: "Lebensohl (4): Keep doubles in your toolkit",
    newUntil: "2026-12-01",
    trumpSuit: "D",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: BID39_OPENING_AUCTION,
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Lebensohl and direct doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Lebensohl",
      promptThemeTint: "1nt",
      videoUrlBeforeStart: "https://youtube.com/shorts/_tgmhmbG1wQ?si=FBnhrFpGODIbSA86",
      customPrompts: [
        {
          id: "bid3-9-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid39QuestionRich />,
          playDecisionInput: "biddingBox",
          expectedChoice: "double",
          expectedChoiceDisplay: "X",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid39RevealRich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "2", H: "QJ94", D: "J6432", C: "1083" },
    },
    rounds: [],
  },
  {
    id: "bid3-10",
    difficulty: 3,
    title: "Lebensohl (5): Compete hard, but pass in the right spots",
    newUntil: "2026-12-01",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: BID310_OPENING_AUCTION,
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Lebensohl judgment",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Lebensohl",
      promptThemeTint: "1nt",
      videoUrlBeforeStart: "https://youtube.com/shorts/Nj2quWMKYWQ?si=UBaAxb-7UOZaSti0",
      customPrompts: [
        {
          id: "bid3-10-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid310Question1Rich />,
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid310Reveal1Rich />,
          videoUrl: "",
        },
        {
          id: "bid3-10-continue",
          type: "INFO",
          atRoundIdx: -1,
          promptText: <Bid310ContinueRich />,
          videoUrl: "",
        },
        {
          id: "bid3-10-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: <Bid310Question2Rich />,
          playDecisionInput: "biddingBox",
          expectedChoice: "2s",
          expectedChoiceDisplay: "2♠",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: <Bid310Reveal2Rich />,
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "K109", H: "QJ84", D: "102", C: "8762" },
    },
    rounds: [],
  },
  {
    id: "bid3-11",
    difficulty: 3,
    title: "Reverses (1): identifying a reverse",
    newUntil: "2026-12-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ P 1♠ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/N5L1XNzvojU?si=6n1hr_GbTBNqQ_32",
      questionNumbers: [],
      contractLabel: "What is a reverse?",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Reverses",
      promptThemeTint: "reverses",
      customPrompts: [
        {
          id: "bid3-11-intro",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    In this series I will look at everything to do with reverses, from how to identify one through to
                    how to respond to one, and everything in between.
                  </p>
                  <p className="ct-revealRichBody">
                    These bids are often misunderstood and vaguely defined, they are an important bid and players
                    should be confident using them.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-11-requirements",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading">Requirements for a reverse</p>
                  <ol className="ct-revealRichPoints">
                    <li>
                      <strong>16+ points.</strong> In some areas bridge is about discipline, consistency and
                      reliability. Bidding is often like that. A reverse shows high-card point strength, and partner
                      should be able to rely on that when trying to best judge the auction.
                    </li>
                    <li>
                      <strong>An unbalanced hand.</strong> You would never reverse on a balanced hand.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-11-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What would you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2h",
          expectedChoiceDisplay: "2♥",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">
                    2<span className="ct-suitSym ct-suitSym--red">♥</span>
                  </p>
                  <p className="ct-revealRichBody">
                    2<span className="ct-suitSym ct-suitSym--red">♥</span> is the correct bid. It is a reverse. How can we
                    clearly identify when a bid is a reverse? The best way is this: if partner wants to just take you
                    back to your first suit, it requires going to the 3rd level.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">Let's think on that for a moment. Take the auction, for example:</p>
                  <table className="ct-deadlyDuckPlanTable" aria-label="Example auction">
                    <tbody>
                      <tr>
                        <th scope="col">S</th>
                        <th scope="col">W</th>
                        <th scope="col">N</th>
                        <th scope="col">E</th>
                      </tr>
                      <tr>
                        <td>
                          1<span className="ct-suitSym ct-suitSym--red">♥</span>
                        </td>
                        <td>P</td>
                        <td>1♠</td>
                        <td>P</td>
                      </tr>
                      <tr>
                        <td>2♣</td>
                        <td />
                        <td />
                        <td />
                      </tr>
                    </tbody>
                  </table>
                  <p className="ct-revealRichBody">
                    Why is 2♣ not a reverse? Because if partner wants to take you back to your first suit, they can do
                    so on the 2 level, by bidding 2
                    <span className="ct-suitSym ct-suitSym--red">♥</span>.
                  </p>
                  <p className="ct-revealRichBody">
                    A reverse forces us higher, to the 3 level at least, which is a starting reason for why we need
                    extra strength for the bid.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "4", H: "KQ109", D: "AK7", C: "AJ1085" },
    },
    rounds: [],
  },
  {
    id: "bid3-12",
    difficulty: 3,
    title: "Reverses (2): opening bid discipline",
    newUntil: "2026-12-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/DFuFw-0KS1s?si=D3aB1F5nkUELD4qG",
      questionNumbers: [],
      contractLabel: "What is your opening bid?",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Reverses",
      promptThemeTint: "reverses",
      customPrompts: [
        {
          id: "bid3-12-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading">Opening bid decision</p>
                  <p className="ct-revealRichBody">What is your opening bid?</p>
                </div>
              </div>
            </div>
          ),
          playDecisionInput: "biddingBox",
          expectedChoice: "1nt",
          expectedChoiceDisplay: "1NT",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">1NT</p>
                  <p className="ct-revealRichBody">
                    Aha moment: this is a 1NT opening, not a 1♣ opening with the intention to reverse.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading">Why 1NT?</p>
                  <ol className="ct-revealRichPoints">
                    <li>
                      Balanced-ish 2-4-2-5 and similar shapes (especially without a 5-card major) are often
                      considered balanced-ish and suitable for 1NT.
                    </li>
                    <li>
                      Let's focus on our short suits. I've talked about this in the series "the modern 1NT". It's very
                      appropriate to open 1NT when you have points stacked in your short suits. On this hand, you have
                      9/16 points in your short suits, more than half of your points are in your short suits. That is a
                      strong indication that 1NT is correct.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-12-reverse-flavour",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading">The flavour of a reverse</p>
                  <p className="ct-revealRichBody">
                    The flavour of a reverse is that the suits are quality. Partner can expect quality suits, and
                    points in your advertised suits.
                  </p>
                  <p className="ct-revealRichBody">
                    Very often you will play in those suits, and possibly even in slam (if partner ever picks up a
                    decent hand!), so you want to make sure, if you reverse, you really mean it:
                  </p>
                  <p className="ct-revealRichBody">
                    "Partner, I have quality suits and a quality hand".
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AQ", H: "KQ109", D: "K10", C: "Q10872" },
    },
    rounds: [],
  },
  {
    id: "bid3-13",
    difficulty: 3,
    title: "Reverses (3): responder with a weak hand",
    newUntil: "2026-12-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ P 1♠ P 2♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid3-13-q1--reveal": "1♦ P 1♠ P 2♥ P 2NT",
        "bid3-13-q2": "1♦ P 1♠ P 2♥ P 2NT P 3♦ P ?",
        "bid3-13-q2--reveal": "1♦ P 1♠ P 2♥ P 2NT P 3♦ P P",
      },
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/r6k6MOwBukk?si=zCPCk65ecKBmGsLw",
      questionNumbers: [],
      contractLabel: "Responding to a reverse",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Reverses",
      promptThemeTint: "reverses",
      customPrompts: [
        {
          id: "bid3-13-intro",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    Partner has reversed - remember the telling sign: if we want to get back to partner's first suit,
                    we need to go to the 3 level.
                  </p>
                  <p className="ct-revealRichBody">
                    Most modern partnerships, after a reverse, have a bid to show a bad hand. To say to partner, with
                    your 16+ points, we do not have enough for game, I've got a maximum of about 7-ish points.
                  </p>
                  <p className="ct-revealRichBody">
                    IMPORTANT: this is a subject for partnership agreement. I will present you with a recommendation
                    but ultimately you have to agree with your partner and be on the same page.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-13-method",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">
                    I recommend a simple approach - make the bid of 2NT show a bad hand. It is the single and only bid
                    after a reverse that is not game forcing - it says to partner "I don't think we have enough for
                    game, unless you have extra".
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-13-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What would you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2nt",
          expectedChoiceDisplay: "2NT",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">2NT</p>
                  <p className="ct-revealRichBody">
                    2NT - tell partner despite her 16+ points, we may not have enough for game.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-13-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What now?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading">Pass</p>
                  <p className="ct-revealRichBody">
                    Opener is just retreating back to their first 5+ card suit. That communicates to you: okay, let's
                    just play in part-score.
                  </p>
                  <p className="ct-revealRichBody">
                    Very often you will pass that. If for example you had a 6+ quality spade suit, and short diamonds,
                    you could correct to spades. Partner already knows however that your hand is limited, and has told
                    you that game is no longer on the menu.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AQ107", H: "84", D: "863", C: "9754" },
    },
    rounds: [],
  },
  {
    id: "bid3-14",
    difficulty: 3,
    title: "Reverses (4): not enough to reverse",
    newUntil: "2026-12-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ P 1♠ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionShowResolvedDuringInfoPromptId: "bid3-14-q",
      auctionResolvedText: "1♣ P 1♠ P 2♣",
      auctionShowResolvedOnlyAfterPromptAsked: true,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/BpLiRzOaQ6w?si=2ABdsSyO6fzNCq0i",
      questionNumbers: [],
      contractLabel: "Reverse discipline",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Reverses",
      promptThemeTint: "reverses",
      customPrompts: [
        {
          id: "bid3-14-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2c",
          expectedChoiceDisplay: "2♣",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">2♣</p>
                  <p className="ct-revealRichBody">
                    We don't have enough to reverse; unfortunately we can't bid 2
                    <span className="ct-suitSym ct-suitSym--red">♦</span>. We have to be content just bidding 2♣.
                  </p>
                  <p className="ct-revealRichBody">
                    This shows 5+ clubs, and an unbalanced hand. Some people rebid 1NT in such situations, but it is
                    not the expert choice for a couple reasons:
                  </p>
                  <ol className="ct-revealRichPoints">
                    <li>
                      The hand is not balanced. A 1NT rebid generally communicates a balanced hand: 4-4-3-2, 4-3-3-3
                      type shapes (and 4-4-4-1 is balanced enough for most good partnerships).
                    </li>
                    <li>
                      The range of the hand isn't appropriate for an 11-14 rebid. This hand has 15 high-card points.
                      Partner is alert to the possibility that this bid can have up to 15 points, whereas a 1NT rebid
                      cannot.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-14-final-note",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText:
            "Would you just fudge it slightly and make this a reverse? I strongly recommend against it, this hand simply doesn't qualify. It's better to be accountable with it. A reverse is a bid that shows high-card points, and partner should be able to rely on that.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "4", H: "K107", D: "KJ94", C: "AKJ107" },
    },
    rounds: [],
  },
  {
    id: "bid3-15",
    difficulty: 3,
    title: "Reverses (5): competition changes requirements",
    newUntil: "2026-12-15",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ P 1♥ 1♠ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionShowResolvedDuringInfoPromptId: "bid3-15-q",
      auctionResolvedText: "1♣ P 1♥ 1♠ 2♦",
      auctionShowResolvedOnlyAfterPromptAsked: true,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/BI08xTPfQy4?si=AVLyqAp-X_oPx4Xj",
      questionNumbers: [],
      contractLabel: "Reverses in competition",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Reverses",
      promptThemeTint: "reverses",
      customPrompts: [
        {
          id: "bid3-15-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "The auction has gotten competitive, are the rules still the same?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2d",
          expectedChoiceDisplay: "2♦",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">
                    2<span className="ct-suitSym ct-suitSym--red">♦</span>
                  </p>
                  <p className="ct-revealRichBody">
                    2<span className="ct-suitSym ct-suitSym--red">♦</span> is the correct bid in competition. When we
                    are competing, we don't have the luxury of "standards" that we have in ordinary non-competitive
                    auctions.
                  </p>
                  <p className="ct-revealRichBody">
                    Things are fast-paced in competitive auctions; you can't afford to just sit back. For that reason,
                    the point requirement is no longer there.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-15-final-note",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText:
            "In 2026 auctions have become hypercompetitive. If you have a distributional hand with good suits, you have to get into the auction, otherwise it will pass you by.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "874", H: "4", D: "AK109", C: "KQJ98" },
    },
    rounds: [],
  },
  {
    id: "bid3-16",
    difficulty: 3,
    title: "4th suit forcing (1): choose the forcing call",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ P 1♠ P 2♣ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/cifXUA8T9QI?si=hadeyD5q4dddPk-Z",
      questionNumbers: [],
      contractLabel: "You are responder",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: 4th suit forcing",
      promptThemeTint: "preempt",
      customPrompts: [
        {
          id: "bid3-16-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is your best call?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2h",
          expectedChoiceDisplay: "2♥",
          wrongTryText: "Not quite - try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">
                    The correct answer is to bid 4th suit forcing, <TextWithColoredSuits text="2♥" />.
                  </p>
                  <p className="ct-revealRichBody">Firstly what does 4th suit forcing mean.</p>
                  <p className="ct-revealRichBody">
                    - My recommendation is to play it as game forcing. It is clear and simple, and very effective -
                    neither player is allowed to pass before game. So the real name of the convention should be - 4th
                    suit game forcing!
                  </p>
                  <p className="ct-revealRichBody">
                    -It is an artificial bid that asks partner to describe their hand. Partner has already shown
                    diamonds and clubs, which is a good start - we know at least 9 of partners cards. The rest of
                    partner&apos;s hand makes a very big difference as to what the most appropriate contract would be.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-16-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          hideAuction: true,
          promptText:
            "If partner's shape is 1354 (so has a singelton spade and 3 hearts along with 5 diamonds and 4 clubs), what is the most likely suitable contract?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3nt",
          expectedChoiceDisplay: "3NT",
          wrongTryText: "Not quite - try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">
                    3NT would very likely be the best contract if your partner had a singleton spade. Why? The reason
                    is because your KQ of spades is opposite a singleton which means you are misfitting.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    <strong>Misfitting happens when your points are opposite partner&apos;s shortage.</strong>
                  </p>
                  <p className="ct-revealRichBody">
                    <span className="ct-revealGold">
                      <strong>Rule: When you are misfitting, firstly keep the contract low, your hands are not working well together. 3 No trump is likely to be the best game, and slam is very unlikely.</strong>
                    </span>
                  </p>
                  <p className="ct-revealRichBody">
                    You might say, we have a club fit. But with misfitting points, 3NT is likely better than 5 of a
                    minor.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-16-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "What if partner's shape is 3154, so has 3 spades and a singleton heart - now where is your likely best spot?",
          options: [
            { id: "3nt", label: "3NT" },
            { id: "suit", label: "Suit contract" },
          ],
          expectedChoice: "suit",
          expectedChoiceDisplay: "Suit contract",
          wrongTryText: "Not quite - try again.",
          noContinue: true,
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">
                    If your partner has a singelton heart, Your Ax of hearts oppossite a singleton points toward
                    avoiding 3NT and suggests playing in a suit. Just a bare ace opposite a singleton is not great for
                    No Trump if you have better options (here you have a club and diamond fit). If one hand has a
                    singleton, the other hand should generally have at least 2 honors in the suit for No trump to be
                    sensible.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    <span className="ct-revealGold">
                      <strong>
                        Rule: You are &quot;fitting&quot; with partner if you have no points opposite their singleton,
                        but an Ace opposite a singleton is still fine and still a fit.
                      </strong>
                    </span>
                  </p>
                  <p className="ct-revealRichBody">
                    We saw before, if you have lots of points (other than an Ace) opposite a singleton, you are
                    misfitting and typically belong in 3NT.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KQ84", H: "A5", D: "QJ4", C: "A742" },
    },
    rounds: [],
  },
  {
    id: "bid3-17",
    difficulty: 3,
    title: "4th suit forcing (2): choose the forcing call",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ P 1♠ P 2♣ P 2♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      auctionResolvedTextByPromptId: {
        "bid3-17-msg-2nt": "1♦ P 1♠ P 2♣ P 2♥ P 2NT",
        "bid3-17-q-spades": "1♦ P 1♠ P 2♣ P 2♥ P 2♠",
        "bid3-17-q-spades--reveal": "1♦ P 1♠ P 2♣ P 2♥ P 2♠",
        "bid3-17-q-3s--reveal": "1♦ P 1♠ P 2♣ P 2♥ P 3♠",
      },
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/5t8oehDvneo?si=8Vd8WojibLDKKPRh",
      questionNumbers: [],
      contractLabel: "You are responder",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: 4th suit forcing",
      promptThemeTint: "preempt",
      customPrompts: [
        {
          id: "bid3-17-intro",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: (
            <>
              You have just bid <TextWithColoredSuits text="2♥" />, 4th suit game forcing. It is your partner&apos;s
              turn to bid. Let&apos;s look at partner&apos;s responses to 4th suit forcing, and what they all mean.
            </>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-17-msg-2nt",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText:
            "This is a very common response, partner bids 2NT, lots of us are familiar with it. It shows a heart stopper.\n\nBut the other responses are less clear to most people.",
          videoUrl: "",
        },
        {
          id: "bid3-17-q-spades",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: (
            <>
              Have another look at the auction because its changed, partner has bid{" "}
              <TextWithColoredSuits text="2♠" />. I find this is a bid that the vast majority of players get wrong -
              how many spades should <TextWithColoredSuits text="2♠" /> show?
            </>
          ),
          options: [
            { id: "1", label: "1" },
            { id: "2", label: "2" },
            { id: "3", label: "3" },
          ],
          expectedChoice: "2",
          expectedChoiceDisplay: "2",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText:
            "The correct answer is 2, but usually an honor. With two low spades and two good hearts, opener could've chosen to bid 2NT to more accurately describe her hand. A lot of players think 2♠ shows 3 cards, which is wrong.",
          videoUrl: "",
        },
        {
          id: "bid3-17-q-3s",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "So what does opener do in the same auction (shown above, its partner's turn to bid) if opener/partner has a 3 card spade suit?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3s",
          expectedChoiceDisplay: "3♠",
          noContinue: true,
          revealText:
            "Spot on!\n\nThe bid to show 3 card spade suit is 3♠. This is worth remembering because it comes up frequently.\n\nRule: If opener simply bids responder's suit after 4th suit forcing, it should show 2 cards. However, a Jump in responder's suit shows 3 cards.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KQ84", H: "A5", D: "QJ4", C: "A742" },
    },
    rounds: [],
  },
  {
    id: "bid3-18",
    difficulty: 3,
    title: "4th suit forcing (3): when 3NT is more descriptive",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ P 1♠ P 2♣ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/04GU4Dsz4Jg?si=ECvcJOH64czW7L1_",
      questionNumbers: [],
      contractLabel: "You are responder",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: 4th suit forcing",
      promptThemeTint: "preempt",
      customPrompts: [
        {
          id: "bid3-18-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3nt",
          expectedChoiceDisplay: "3NT",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">
                    It&apos;s not always necessary to bid 4th suit forcing, here you can just bid{" "}
                    <TextWithColoredSuits text="3NT" />.
                  </p>
                  <p className="ct-revealRichBody">
                    Let&apos;s rewind for a second - Despite it not being correct here, 4th suit forcing often is a
                    good bid, let&apos;s look at why. It keeps the auction low and you can get free information about
                    your partner&apos;s hand. However, the most descriptive bid in this instance is{" "}
                    <TextWithColoredSuits text="3NT" />, it sends a strong message to your partner - I think we are
                    badly misfitting, and naturally I have lots of stuff in hearts since you could easily have a
                    singleton or even void there (partner has not promised anything in hearts), I have a double stopper
                    at least in both spades and hearts.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    <span className="ct-revealGold">
                      In summary: I don&apos;t have a fit, and I have lots of stuff in the majors - I think we are
                      misfitting.
                    </span>
                  </p>
                  <p className="ct-revealRichBody">
                    That is going to be particularly useful to your partner who might have a very good hand, you are
                    helping them make a sensible decision to pass <TextWithColoredSuits text="3NT" />, as your points
                    are not well placed to help their minor suits thrive (which would be a problem if you reached the
                    heights of <TextWithColoredSuits text="5 of a minor" /> or slam in a minor).
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid3-18-wrap",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Finish",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    The key takeaway - we don&apos;t automatically have to bid 4th suit, sometimes there are more
                    descriptive bids, but often 4th suit will be useful and keep the auction low - giving both sides
                    space to explore. However, sometimes it&apos;s better to just describe your hand and try discourage
                    partner by jumping to <TextWithColoredSuits text="3NT" /> sending a strong signal &quot;we are
                    misfitting&quot;.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KQ1094", H: "KQJ9", D: "42", C: "Q5" },
    },
    rounds: [],
  },
  {
    id: "bid3-19",
    difficulty: 3,
    title: "4th suit forcing (4): continuation auction",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♦ P 1♠ P 2♣ P 2♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid3-19-q--reveal": "1♦ P 1♠ P 2♣ P 2♥ P 3♥",
        "bid3-19-wrap": "1♦ P 1♠ P 2♣ P 2♥ P 3♥",
      },
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/VJ29-nk5c6k?si=8zFIDYFPHe4YMv-E",
      questionNumbers: [],
      contractLabel: "You are South",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: 4th suit forcing",
      promptThemeTint: "preempt",
      customPrompts: [
        {
          id: "bid3-19-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3h",
          expectedChoiceDisplay: "3♥",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText:
            "Explanation: The correct answer is 3♥. A few important points on respond to 4th suit.\n\nRule: Raising 4th suit is natural it shows 3-4 cards in the suit.\n\nThink of it like this, in this auction the bid of 2♥ was unnatural, it was just an artificial bid asking you to describe your hand. You have described your hand, by showing hearts. Its really quite simple.\n\nWhat about 2NT as an alternative? You have 3 cards in the suit but you don't have a stopper, so bidding 2NT isn't a good idea. If the opponent's make the first 5 heart tricks, what will you say to your partner?\n\nIt's typically a good idea to just bid 2NT if you had a robust stopper. 3♥ is natural, showing some cards in the suit, but not a robust stopper.",
          videoUrl: "",
        },
        {
          id: "bid3-19-wrap",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Finish",
          promptText:
            "I've found it is commonly a source of confusion to \"raise 4th suit\" like in this hand, there are some misconceptions or confusion around it, but this is the most common and natural meaning of the bid.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "8", H: "1073", D: "AKJ84", C: "KQJ7" },
    },
    rounds: [],
  },
  {
    id: "bid3-20",
    difficulty: 3,
    title: "4th suit forcing (5): recap",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ P 1♠ P 2♣ P 2♦ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid3-20-q1--reveal": "1♥ P 1♠ P 2♣ P 2♦ P 2♠",
        "bid3-20-q2--reveal": "1♥ P 1♠ P 2♣ P 2♦ P 3♣",
        "bid3-20-q3--reveal": "1♥ P 1♠ P 2♣ P 2♦ P 2NT",
      },
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/YCwnIRe8jE8?si=nQRo8GAEuwM2s0Nb",
      questionNumbers: [],
      contractLabel: "You are South",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: 4th suit forcing",
      promptThemeTint: "preempt",
      customPrompts: [
        {
          id: "bid3-20-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2s",
          expectedChoiceDisplay: "2♠",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText:
            "Remember - after a 4th suit auction, bidding partner's suit shows 2 cards in the suit. A jump in partner's suit shows 3 cards.",
          videoUrl: "",
        },
        {
          id: "bid3-20-info1",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: "The hand is going to change slightly, with the same original auction, press continue to move on.",
          videoUrl: "",
        },
        {
          id: "bid3-20-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          shownHandsOverride: {
            DECLARER: { S: "4", H: "AKJ42", D: "43", C: "KJ932" },
          },
          promptText: "What do you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3c",
          expectedChoiceDisplay: "3♣",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: "a nice natural bid of 3♣. Let's change the hand one more time on the next page",
          videoUrl: "",
        },
        {
          id: "bid3-20-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          shownHandsOverride: {
            DECLARER: { S: "83", H: "AKJ42", D: "AQ", C: "KJ93" },
          },
          promptText: "what do you bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2nt",
          expectedChoiceDisplay: "2NT",
          noContinue: true,
          revealText:
            "Get in the habit of bidding 2NT with a decent stopper.. Very often 3NT will be the contract you want to gravitate towards without a major fit, so it's a good idea to let partner know, as soon as possible, that its a feasible spot.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "Q4", H: "AKJ42", D: "43", C: "KJ93" },
    },
    rounds: [],
  },
  {
    id: "bid2-29",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "High level doubles (1)",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♠ X 4♠ X P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-29-q2--reveal": "1♠ X 4♠ X P Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "High level doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: High level doubles",
      promptThemeTint: "respondToDouble",
      videoUrlBeforeStart: "https://youtube.com/shorts/7ebCPrUNGBc",
      customPrompts: [
        {
          id: "bid2-29-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is partner's double takeout or penalty?",
          options: [
            { id: "takeout", label: "Takeout" },
            { id: "penalty", label: "Penalty" },
          ],
          expectedChoice: "takeout",
          expectedChoiceDisplay: "Takeout",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    Takeout, but the word itself is misleading, because often we leave takeout doubles in when they are
                    made at the 4 level or higher. However, partner will not have a stack of spades.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">📘 Rule</p>
                  <p className="ct-revealRichBody">
                    Rule: Whenever the opponents bid and raise, showing at least 8+ card fit, our doubles show "good
                    hands", but they do not show a heavy holding in the opponent's trump suit.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    Think about it, here the opponent's will likely have a 9-10 card fit, how many trumps can partner
                    really have?
                  </p>
                  <p className="ct-revealRichBody">
                    Modern bridge has deemed it more important to allocate the meaning of "I have a good hand" to X,
                    rather than "I have a lot of their suit". The main reason for this is because when they have big
                    fits, we never have a big stack of their suit.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-29-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "So what do you bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText:
            "Pass. Even though the X is not penalty in the strict sense, and it is actually \"takeout\" (although that word is misleading). We normally do not go on the 5 level to make a contract (and try make 11 tricks), we rather defend on the 4 level. The times we go on the 5 level are with extreme shape, usually a spade void.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "2", H: "KQ104", D: "A1032", C: "A942" },
    },
    rounds: [],
  },
  {
    id: "bid2-30",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "High level doubles (2)",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "4♥ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-30-q1--reveal": "4♥ Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "High level doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: High level doubles",
      promptThemeTint: "respondToDouble",
      videoUrlBeforeStart: "https://youtube.com/shorts/v3k-dh25iew",
      customPrompts: [
        {
          id: "bid2-30-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "The auction has started at the 4 level, how do you handle it?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText:
            "Pass. Double here is takeout, it is almost always done with a shortage in hearts. Unfortunately, despite having a strong hand, we cannot bid here. We have to hope partner comes in with a takeout double, in which case you will teach your opponent a painful lesson..\n\nRule: Don't make a takeout double if you would much prefer to defend.\n\nRather make a certain positive score by defending. How would you feel if you doubled, partner bid 4♠, and that got doubled? You have turned a plus score into a potentially significant minus. And as mentioned, partner may come in with a double, in which case you'll be smiling for days.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "A43", H: "KQ104", D: "AJ92", C: "K10" },
    },
    rounds: [],
  },
  {
    id: "bid2-31",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "High level doubles (3)",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "3♥ X 4♥ X P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-31-q1--reveal": "3♥ X 4♥ X P 4♠",
        "bid2-31-q2--reveal": "3♥ X 4♥ X P Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "High level doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: High level doubles",
      promptThemeTint: "respondToDouble",
      videoUrlBeforeStart: "https://youtube.com/shorts/agHE-l5L16I",
      customPrompts: [
        {
          id: "bid2-31-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "You decided to go with double since your spade suit quality is very poor. What now?",
          playDecisionInput: "biddingBox",
          expectedChoice: "4s",
          expectedChoiceDisplay: "4♠",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "Let's change the hand slightly",
          revealText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                <span className="ct-revealRichBadge ct-revealRichBadge--violet">4♠</span>
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  4♠ is a good bid. Partner&apos;s double does not insist on penalty, it just shows a good hand and asks
                  you to do something sensible.
                </p>
                <ul
                  className="ct-revealRichPoints"
                  style={{ listStyleType: "disc", listStylePosition: "inside", paddingLeft: "0.25em" }}
                >
                  <li>You have a 5th spade.</li>
                  <li>You have a singleton heart with no wasted values.</li>
                </ul>
                <p className="ct-revealRichBody">
                  Your hand is actually excellent, you may make 6. But we prefer to go by the idea of:
                </p>
                <p className="ct-revealRichBody">
                  &quot;When the opponent&apos;s preempt, don&apos;t try bid thin slams. Things aren&apos;t breaking well, the
                  hand is distributional, and also we don&apos;t have enough room to bid it confidently, don&apos;t gamble
                  and get -50.&quot;
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-31-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          shownHandsOverride: {
            south: { S: "KQ10", H: "K10", D: "A1043", C: "Q1092" },
          },
          promptText:
            "What about on this hand - we have the same auction as before, but your hand has changed?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          wrongTryText: "Not quite — try again.",
          noContinue: true,
          revealText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                <span className="ct-revealRichBadge ct-revealRichBadge--violet">Pass</span>
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  In this context we definitely want to pass. We have defensive values in hearts, a balanced hand.
                </p>
                <p className="ct-revealRichBody">
                  Try to see how this hand is vastly different to the previous hand, which is why partner&apos;s double
                  sends the message &quot;Look at your hand and do something intelligent based on whether your hand is good
                  for declaring (often this will mean short heart, no points in hearts) or good for defending.&quot;
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "J7642", H: "2", D: "AK104", C: "AK4" },
    },
    rounds: [],
  },
  {
    id: "bid2-32",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "High level doubles (4)",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "5♦ X P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-32-q1--reveal": "5♦ X P Pass",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "High level doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: High level doubles",
      promptThemeTint: "respondToDouble",
      videoUrlBeforeStart: "https://youtube.com/shorts/bRKDdt08zjM",
      customPrompts: [
        {
          id: "bid2-32-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is the flavour of a 5 level double and what do you bid here?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          noContinue: true,
          revealText:
            "Almost 100% of the time we pass 5 level doubles.\n\nIt is the combination of the opponent's already being high, and the impossibility of us having a sensible constructive auction. Double is not tightly defined, just a good hand, say 14 or 15+ points. If double was always takeout, we have to regularly pass with very strong hands, it would be too restrictive.\n\nRule: If you always pass 5 level doubles you will be fine, don't worry about the rare occasions where it might be correct to bid.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "AJ9432", H: "KJ54", D: "2", C: "82" },
    },
    rounds: [],
  },
  {
    id: "bid2-33",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "High level doubles (5)",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♠ P 3♠ P 4NT P 5♦ P 6♠ P P X P P P",
    vulnerability: "EW Vul",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-33-q2--reveal": "1♠ 3♣ 4♠ 5♣ 6♠ X",
      },
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "High level doubles",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: High level doubles",
      promptThemeTint: "respondToDouble",
      videoUrlBeforeStart: "https://youtube.com/shorts/0-ZbA-gUXaU",
      customPrompts: [
        {
          id: "bid2-33-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <PracticeAuctionMiniTable auctionText="1♠ P 3♠ P 4NT P 5♦ P 6♠ P P X P P P" dealerCompass="E" />
              <p className="ct-revealRichBody ct-revealRichBody--belowMiniTable">
                THe opponents bid slam, nothing fancy, 4NT just asked for keycards. What is partner&apos;s
                double?
              </p>
            </div>
          ),
          options: [
            { id: "penalty", label: "Penalty" },
            { id: "takeout", label: "Takeout" },
            { id: "somethingElse", label: "Something else" },
          ],
          expectedChoice: "somethingElse",
          expectedChoiceDisplay: "Something else",
          wrongTryText: "Not quite — try again.",
          noContinue: false,
          continueButtonLabel: "lets change things around a little bit",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  It is what is called a &quot;lightner double&quot;. That is a double that communicates the following
                  message.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Rule</h4>
                <p className="ct-revealRichBody">
                  I have a void, I want you to try find it and lead it, so we can beat the contract.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  It is not a double for the sake of getting significant penalties, it is basically just a type of lead
                  directing double.
                </p>
                <p className="ct-revealRichBody">
                  If you think you will beat the opponent&apos;s slam on any lead, feel free to double anyway. But
                  usually against good opponent&apos;s they don&apos;t freely bid slams like this that are going down
                  (It&apos;s clearly not a sacrifice). That is why we use the double to convey that messager.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-33-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          shownHandsOverride: {
            south: { S: "4", H: "105432", D: "53", C: "KQ1094" },
          },
          promptText: (
            <div className="ct-revealRich">
              <PracticeAuctionMiniTable auctionText="1♠ 3♣ 4♠ 5♣ 6♠ X" dealerCompass="W" />
              <p className="ct-revealRichBody ct-revealRichBody--belowMiniTable">What will you lead here?</p>
            </div>
          ),
          options: [
            { id: "trump", label: "Trump" },
            { id: "heart", label: "heart" },
            { id: "diamond", label: "diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "heart",
          expectedChoiceDisplay: "Heart",
          wrongTryText: "Not quite — try again.",
          noContinue: true,
          revealText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                <span className="ct-revealRichBadge ct-revealRichBadge--violet">Heart</span>
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Rule</h4>
                <p className="ct-revealRichBody">Make an unusual lead, I have a void.</p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  So, we certainly do not lead clubs, we lead our longest suit outside of clubs.
                </p>
                <p className="ct-revealRichBody">
                  Why lead our longest suit? The chances are that partner&apos;s void is opposite our longst suit.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "43", H: "J98432", D: "5", C: "J1053" },
    },
    rounds: [],
  },
  {
    id: "bid2-34",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Loser count in bidding (1)",
    trumpSuit: "D",
    contract: "?",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♦ X P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Loser count in bidding",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Loser count in bidding",
      promptThemeTint: "loserCount",
      videoUrlBeforeStart: "https://youtube.com/shorts/wPC-yLS_5IM?si=F9_JxUNWy_f_PEOz",
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-34-q1--reveal": "1♦ X P 4♠",
        "bid2-34-info2": "1♦ X P 4♠",
        "bid2-34-info3": "1♦ X P 4♠",
        "bid2-34-info4": "1♦ X P 4♠",
        "bid2-34-show-full-hand": "1♦ X P 4♠",
      },
      customPrompts: [
        {
          id: "bid2-34-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Loser count in bidding is actually a very powerful tool. It is often much more accurate than point
                  count. Lets begin by looking at how to do it, and how to apply it.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-34-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "Lets assume partner just has a normal takeout double, our likely combined strength is good enough for ..?",
          options: [
            { id: "partscore", label: "competing for the partscore" },
            { id: "invite", label: "inviting game" },
            { id: "game", label: "bidding game" },
          ],
          expectedChoice: "game",
          expectedChoiceDisplay: "bidding game",
          wrongTryText: "Not quite - try again.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                <span className="ct-revealRichBadge ct-revealRichBadge--violet">Bid game</span>
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  According to Losing Trick Count: You have a &quot;7 loser hand&quot; which is enough opposite an
                  opening hand to bid game, if you have a fit. (a takeout double should be approximately opening hand
                  strength).
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-34-info2",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">The losing trick count works like this.</p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <div style={{ display: "flex", gap: "0.65em", alignItems: "flex-start", marginBottom: "0.85em" }}>
                  <span
                    style={{
                      flex: "0 0 auto",
                      width: "1.7em",
                      height: "1.7em",
                      borderRadius: "50%",
                      background: "#0f5132",
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    1
                  </span>
                  <p className="ct-revealRichKey" style={{ margin: 0 }}>
                    Very simply - Count 1 loser for every A, K and Q you are missing in a suit
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.65em", alignItems: "flex-start" }}>
                  <span
                    style={{
                      flex: "0 0 auto",
                      width: "1.7em",
                      height: "1.7em",
                      borderRadius: "50%",
                      background: "#0f5132",
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    2
                  </span>
                  <p className="ct-revealRichBody" style={{ margin: 0 }}>
                    However, if you only have 0 cards in the suit, count 0 losers. If you have 1 card, the most you can
                    have is 1 loser. Not surprisingly, with 2 cards in a suit (a doubleton) the most you can have is 2
                    losers.
                  </p>
                </div>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  If you have a singelton, it is 1 loser unless you have the Ace in which case it is no losers. But a singleton K is still one loser. Similarly for a doubleton, it is 2 losers unless you have the Ace and/or King. The queen is not worth anything. So, Kx or Ax is one loser in that suit, AK doubleton is no losers.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Lets look at this hand, suit by suit. (When you do this a lot its easier than counting points).
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <ul className="ct-revealRichPoints">
                  <li>Spade suit: 2 losers. You are missing the Ace and King. Only two because you have the Queen!</li>
                  <li>Heart Suit: 2 losers, you are missing the K and Q but have the Ace.</li>
                  <li>Diamond suit: 1 loser, you only have 1 card</li>
                  <li>Club suit: two losers.. can you see why?</li>
                </ul>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Overall you have 7 losers, what do we do with the number 7 - what now?
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-34-info3",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  The losing trick count formula has been explained in many ways. I want to explain it in a very simple
                  way.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <strong>Key point #1:</strong> Remember the number 7, lucky 7. An opening hand is approximately 7
                  losers
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <strong>Key point #2:</strong> Two opening hands should equal game! (many people already have a sense
                  of that)
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  HOWEVER, this ONLY applies when we have a fit. The losing trick count does not really apply before we
                  have a fit, point count is much more accurate at that stage.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-34-info4",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Lets see the full hand",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  A quick note about slams: Quite logically slam needs 2 less losers than game. So if you have 5 losers
                  opposite an opening hand, you may very well have slam on (although in slam you also need some other
                  ingredients, like enough aces etc). It is a good guide, that should get your mind valuing your hand in
                  its approximate correct category.
                </p>
                <p className="ct-revealRichBody">
                  Its often a rough guide, but actually a very good guide. Its regularly a better guide than point count.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Paul&apos;s verdict</h4>
                <p className="ct-revealRichBody">
                  I like to use both, when I have a fit I like to think about my point count and my loser count. There
                  will be times where game seems correct with loser count, but seems a bit ridiculous with point count,
                  as your hand is quite weak in terms of points. I like to moderate my decisions with both, but loser
                  count is something I put a lot of weight into.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-34-show-full-hand",
          type: "INFO",
          atRoundIdx: -1,
          revealFullHandSeats: ["north"],
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Partner only had 11 points for the double, your combined point count is 19. So despite finding
                  partner with a total minimum, game made on a finesse!
                </p>
                <p className="ct-revealRichBody">
                  We lost 1 spade, 1 heart, 1 diamond only. (Focus on the south hand, the long trump hand, when looking
                  at losers for the hand. Check out last weeks problems Theme: Counting losers, for more on that topic)
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "K732", H: "K1043", D: "62", C: "AJ4" },
      south: { S: "Q10854", H: "A43", D: "3", C: "Q1042" },
    },
    rounds: [],
  },
  {
    id: "bid2-35",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Loser count in bidding (2)",
    trumpSuit: "S",
    contract: "?",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♠ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Loser count in bidding",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Loser count in bidding",
      promptThemeTint: "loserCount",
      videoUrlBeforeStart: "https://youtube.com/shorts/HoQChGMXl3I?si=Hnm8jzqr0aojhT1w",
      customPrompts: [
        {
          id: "bid2-35-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  We saw on the previous hand that the possibility of bidding low high card point games is there if we
                  go by loser count. But, I think players with the best judgment use both ideas to moderate each other.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-35-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "In terms of high card points, do you have enough for game opposite your partner's 1♠ opening?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          expectedChoiceDisplay: "Yes",
          wrongTryText: "Not quite - try again.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText:
            "I think most people would agree that this hand is strong enough for game. It is 13 high card points, and a bunch of 10s.",
          videoUrl: "",
        },
        {
          id: "bid2-35-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "How many losers does the hand have?",
          options: [
            { id: "6", label: "6" },
            { id: "7", label: "7" },
            { id: "8", label: "8" },
            { id: "9", label: "9" },
          ],
          expectedChoice: "9",
          expectedChoiceDisplay: "9",
          wrongTryText: "Not quite - try again.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  It is an 9 loser hand.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <ul className="ct-revealRichPoints">
                  <li>2 in spades</li>
                  <li>2 in hearts</li>
                  <li>2 in diamonds</li>
                  <li>3 in clubs</li>
                </ul>
                <p className="ct-revealRichBody">totaling 9 losers.</p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  According to losing trick count,, this would just be a 2♠ Bid. (remember you need two 7 loser hands for game opposite an opening hand)
                </p>
                <p className="ct-revealRichBody">
                  With 9 losers, that is 2 more losers than game, so we drop down to 2♠ as the appropriate contract.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-35-conclusion",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Conclusion: Don't get carried away too far with loser count. It is a good guide, but when point count
                  strongly indicates one direction, it is a good idea to consider that.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Useful summary</h4>
                <p className="ct-revealRichBody">
                  Use both loser count and point count, don't get too carried away with any single idea.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "A103", H: "A1043", D: "A82", C: "J105" },
    },
    rounds: [],
  },
  {
    id: "bid2-36",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Loser count in bidding (3)",
    trumpSuit: "S",
    contract: "?",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♦ P 1♠ P 2♦ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Loser count in bidding",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Loser count in bidding",
      promptThemeTint: "loserCount",
      videoUrlBeforeStart: "https://youtube.com/shorts/DUCMtkyhtY4?si=eXBBxIZGQc7RGjqB",
      auctionShowResolvedDuringInfoPromptId: "bid2-36-info-continue-auction",
      auctionResolvedText: "1♦ P 1♠ P 2♦ P 2♠ P 3♠ P ?",
      auctionResolvedTextByPromptId: {
        "bid2-36-q3-rebid--reveal": "1♦ P 1♠ P 2♦ P 2♠",
        "bid2-36-info-continue-auction": "1♦ P 1♠ P 2♦ P 2♠ P 3♠ P ?",
        "bid2-36-q4-now-what": "1♦ P 1♠ P 2♦ P 2♠ P 3♠ P ?",
        "bid2-36-q4-now-what--reveal": "1♦ P 1♠ P 2♦ P 2♠ P 3♠ P 4♠",
      },
      customPrompts: [
        {
          id: "bid2-36-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Lets figure out what to do in this auction.
                </p>
                <p className="ct-revealRichBody">
                  For starters, since it is on theme, lets look at our losing trick count -how many losers does this hand have?
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-36-q1-losers",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "For starters, since it is on theme, lets look at our losing trick count -how many losers does this hand have?",
          options: [
            { id: "6", label: "6" },
            { id: "7", label: "7" },
            { id: "8", label: "8" },
          ],
          expectedChoice: "7",
          expectedChoiceDisplay: "7",
          wrongTryText: "Good try! Have another count.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: "It has 7 losers.",
          videoUrl: "",
        },
        {
          id: "bid2-36-q2-fit-check",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "It has 7 losers. The losing trick count states that a 7 loser hand opposite an opening hand is enough for game, does that apply here?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          expectedChoiceDisplay: "No",
          wrongTryText: "Not quite - try again.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText:
            "No, it only applies when we have a fit, without a fit it is not a particularly relevant measure.",
          videoUrl: "",
        },
        {
          id: "bid2-36-info-point-count",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Without a fit, point count is a much more reliable measure, don&apos;t bid too much with the justification of losing trick count when you don&apos;t have a fit.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-36-q3-rebid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          playDecisionInput: "biddingBox",
          promptText: "So, what is the appropriate rebid here?",
          expectedChoice: "2s",
          expectedChoiceDisplay: "2♠",
          wrongTryText: "Good try! Have another look at the hand value.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <ul className="ct-revealRichPoints">
                  <li>A simple 2♠ is a good idea. There are a couple good and bad features of this hand.</li>
                  <li>Your suit is nice, and your high cards are nice (the outside Ace).</li>
                  <li>Your shape is quite decent.</li>
                  <li>
                    Your singleton in partner&apos;s suit can actually be a bad thing, the hand would be much better if the singleton was elsewhere. I would not see that singleton as an asset particularly.
                  </li>
                </ul>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Rule</h4>
                <p className="ct-revealRichBody">
                  Shortages in partner&apos;s long suits are typically not a good thing.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  The alarm bells should be on that you are misfitting. It is quite plausible that partner could have shortage in your spade suit, and you have shortage in partner&apos;s diamond suit.
                </p>
                <p className="ct-revealRichBody">
                  This is the type of auction we want to use a lot of caution with, no justification should push you to over-value this hand beyond its 9 points.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-36-info-continue-auction",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  You rebid 2♠ but that does not end the auction.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-36-q4-now-what",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          playDecisionInput: "biddingBox",
          promptText: "What do you bid now?",
          expectedChoice: "4s",
          expectedChoiceDisplay: "4♠",
          wrongTryText: "Good try! Have another look at partner's 3♠ rebid.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText:
            "It is a good idea to bid 4♠ here, partner has shown probably 2 card spade suit but a useful hand for you. You can definitely consider losing trick count now - perhaps you already had it in the back of your mind, that your hand was a 7 loser hand - which is useful if partner has support!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "KQ10943", H: "A97", D: "5", C: "432" },
    },
    rounds: [],
  },
  {
    id: "bid2-37",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Loser count in bidding (4)",
    trumpSuit: "H",
    contract: "?",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1NT P 2♣ P 2♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Loser count in bidding",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Loser count in bidding",
      promptThemeTint: "loserCount",
      videoUrlBeforeStart: "https://youtube.com/shorts/TyV50o2W5ic?si=3uEL7vK9al-bQVSs",
      showAuctionDuringPlayDecisionReveal: true,
      auctionResolvedTextByPromptId: {
        "bid2-37-q2-involve--reveal": "1NT P 2♣ P 2♥ P 4♣",
        "bid2-37-info2-partner": "1NT P 2♣ P 2♥ P 4♣ P 4♥ P P P",
        "bid2-37-info3-full-hand": "1NT P 2♣ P 2♥ P 4♣ P 4♥ P P P",
      },
      customPrompts: [
        {
          id: "bid2-37-q1-losers",
          type: "SINGLE_NUMBER",
          atRoundIdx: -1,
          promptText:
            "Partner opens 1NT, you bid 2♣ simple stayman, and partner shows 4 card hearts - how are you feeling about the hand - Firstly how many losers does the hand have?",
          expectedAnswer: 6,
          successText: "Spot on!",
          autoContinueOnCorrect: false,
          continueButtonLabel: "continue",
          videoUrl: "",
        },
        {
          id: "bid2-37-info1",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichLead">
                  <span className="ct-revealRichBadge ct-revealRichBadge--violet">Explanation: 6 losers.</span>
                </p>
                <ul className="ct-revealRichPoints">
                  <li>There are 2 spade losers, 2 hearts, 1 diamond and 1 club.</li>
                  <li>We have said that 7 losers opposite 7 losers is often game.</li>
                  <li>If you drop that loser count by 2, you are thinking about slam.</li>
                  <li>When partner opens a normal 1 level bid, we can assume they have around 7 losers.</li>
                  <li>However, a 1NT opening is normally around 5-6 losers.</li>
                </ul>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Is that math getting a bit complicated?</h4>
                <ul className="ct-revealRichPoints">
                  <li>Lets recap 7 +7 losers = 14, which is game.</li>
                  <li>If we drop that by two, we can get to slam (slam is two less losers than game).</li>
                  <li>So, we need a combined total of 12.</li>
                  <li>We have 6, and a 1NT opening is 5-6, that definitely puts us in range</li>
                </ul>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-37-info-partnership",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  But, bridge is a partnership discussion, it cannot simply be solved by one player with a cool equation.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Rule</h4>
                <p className="ct-revealRichBody">
                  There is no substitute for partnership bidding, always involve your partner if you can
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Especially when it comes to slam bidding, you won&apos;t do well if you try to do it all yourself.
                  Games can be &quot;bashed&quot; without being precise, but slams are about being precise, and it is
                  costly to forget that.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-37-q2-involve",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          playDecisionInput: "biddingBox",
          promptText: "How can we involve partner here?",
          expectedChoice: "4c",
          expectedChoiceDisplay: "4♣",
          wrongTryText: "Not quite - try again.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Explanation: <TextWithColoredSuits text="4♣" /> is a splinter here, it agrees hearts and lets partner
                  know you have a shortage in clubs. Partner, who is also a member of this website, knows that points
                  opposite your shortage means slow down/stop. So, partner can look at their hand and let you know
                  whether slam seems like a good idea or not. (check bidding level 3, problems 1-5 on splinters for
                  more on this).
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-37-info2-partner",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "show the full hand",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Partner bid <TextWithColoredSuits text="4♥" />, saying I don't like the sounds of this. We respected
                  partner's decision. Hand evaluation techniques are just a guide, there is no substitute for
                  partnership involvement.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-37-info3-full-hand",
          type: "INFO",
          atRoundIdx: -1,
          revealFullHandSeats: ["north"],
          promptText:
            "We are very glad to have stopped in game. Not suprisignly partner has heavy club values (which is why partner signed off), which is a bad mis-fit of points.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "Q84", H: "AJ53", D: "J2", C: "AKJ8" },
      south: { S: "K92", H: "Q1042", D: "KQ1043", C: "3" },
    },
    rounds: [],
  },
  {
    id: "bid2-38",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Loser count in bidding (5)",
    trumpSuit: "H",
    contract: "?",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    vulnerability: "NS Vul",
    visibleFullHandSeats: ["south"],
    auction: "1♥ 2♦ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Loser count in bidding",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Loser count in bidding",
      promptThemeTint: "loserCount",
      videoUrlBeforeStart: "https://youtube.com/shorts/KDp6ZWm2-1Q?si=jyganyMAggbdpue6",
      auctionResolvedTextByPromptId: {
        "bid2-38-q2-bid--reveal": "1♥ 2♦ 4♥",
      },
      customPrompts: [
        {
          id: "bid2-38-q1-losers",
          type: "SINGLE_NUMBER",
          atRoundIdx: -1,
          promptText:
            "We have a fit so we can consult losing trick count to help judge how good our hand is - what is the loser count for our hand?",
          expectedAnswer: 7,
          successText: "Spot on!",
          autoContinueOnCorrect: false,
          continueButtonLabel: "continue",
          videoUrl: "",
        },
        {
          id: "bid2-38-info1",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Explanation: We have 7 losers, so according to losing trick count, we have enough for game (7 losers opposite 7 losers is enough for game, as discussed in previous problems).",
          videoUrl: "",
        },
        {
          id: "bid2-38-q2-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          playDecisionInput: "biddingBox",
          promptText: "So what do you bid here?",
          expectedChoice: "4h",
          expectedChoiceDisplay: "4♥",
          wrongTryText: "Not quite - try again.",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Answer: <TextWithColoredSuits text="4♥" />
                </p>
                <p className="ct-revealRichBody">
                  Explanation: <TextWithColoredSuits text="4♥" /> is a bold bid, but a good bid. Just a note worth discussing - it would be far too
                  much to splinter. When it comes to splinters and suggesting to partner we might have slam on, it
                  should be done sparingly, on good hands. We need proper high card points, keycards, Aces and Kings.
                  Just because we have low losing trick count, does not mean we want to exaggerate the assets of our
                  hand.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Rule</h4>
                <p className="ct-revealRichBody">
                  It is a good idea to bid boldly to game with 9+ trump fits and distributional hands, but slam is a
                  totally different story. Slow to slam - don't make shaky bids when it comes to slam bidding, be
                  sound and serious
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "K108532", H: "Q964", D: "3", C: "72" },
    },
    rounds: [],
  },
  {
    id: "bid2-39",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Better Rebid Fundamentals (1)",
    trumpSuit: "H",
    contract: "?",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♥ P 1♠ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Better Rebid Fundamentals",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Better Rebid Fundamentals",
      promptThemeTint: "rebidFundamentals",
      videoUrlBeforeStart: "https://youtube.com/shorts/b-8PPp5fZII?si=-0zmn7VeCytbZeiw",
      auctionResolvedTextByPromptId: {
        "bid2-39-2c": "1♥ P 1♠ P 2♣ P 2♥ P ?",
        "bid2-39-bid": "1♥ P 1♠ P 2♣ P 2♥ P ?",
        "bid2-39-bid--reveal": "1♥ P 1♠ P 2♣ P 2♥ P 2♠",
        "bid2-39-summary": "1♥ P 1♠ P 2♣ P 2♥ P 2♠",
        "bid2-39-balanced-answer": "1♣ P 1♠ P 1NT",
      },
      customPrompts: [
        {
          id: "bid2-39-info1",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                What do you rebid here? Let&apos;s think about three ideas that
                should be on your mind, hopefully we can confidently answer them
                by the end.
              </p>
              <ol className="ct-revealRichPoints">
                <li>
                  Should I raise responder&apos;s suit (like in this auction)
                  with 3 card support?
                </li>
                <li>
                  Is <TextWithColoredSuits text="2♣" /> forcing — do I want to
                  force?
                </li>
                <li>
                  Is <TextWithColoredSuits text="3♣" /> a possibility and a good
                  idea? (Let&apos;s assume the standard treatment of playing it
                  as natural.)
                </li>
              </ol>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-39-raise3",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                Let&apos;s start with — is it okay to raise partner on 3?
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Partner has only shown 4 cards, and as a starting point you
                  normally want 4 cards to raise. However, with an unbalanced
                  hand and 3 cards it is fine to raise.
                </p>
                <p className="ct-revealRichBody">
                  HOWEVER, a simple raise like that shows a hand in the 11-14
                  type range — just a basic opening. When you are stronger than
                  that, a simple raise is not correct. Doing a stronger raise,
                  such as <TextWithColoredSuits text="3♠" />, is definitely
                  wrong — all the stronger raises need to show 4 card support.
                </p>
                <p className="ct-revealRichBody">
                  So with a stronger hand, we wait for a moment. We don&apos;t
                  show our 3 card support; instead we bid our hand naturally,
                  showing our second suit (here that is clubs). So a simple{" "}
                  <TextWithColoredSuits text="2♣" /> bid looks good — but are we
                  too strong for that?
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-39-2c",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="2♣" /> can be up to about 17
                  points. We are right on the maximum, but that is okay.
                  Don&apos;t be nervous that partner will pass — just trust it.
                  Partner needs to know that you can have up to 17 points, and
                  should not be passing with about 9+ points. Even with 8
                  points, partner should try to find a bid if possible.
                </p>
                <p className="ct-revealRichBody">
                  In other words, <TextWithColoredSuits text="2♣" /> is not
                  forcing, but partner should not pass with about 8 or 9+
                  points.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-39-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichBody">
                After your <TextWithColoredSuits text="2♣" /> bid, partner has
                given preference to <TextWithColoredSuits text="2♥" />. What do
                you do now?
              </p>
            </div>
          ),
          playDecisionInput: "biddingBox",
          expectedChoice: "2s",
          expectedChoiceDisplay: "2♠",
          noContinue: false,
          revealText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                <span className="ct-revealRichBadge ct-revealRichBadge--violet">
                  <TextWithColoredSuits text="2♠" />
                </span>
              </p>
              <p className="ct-revealRichBody">
                <TextWithColoredSuits text="2♠" /> is the correct bid. It shows 3
                spades, but it also shows a strong hand. Why? Because with 11-14
                you would have directly bid <TextWithColoredSuits text="2♠" /> (and
                not bid <TextWithColoredSuits text="2♣" />), so bidding it this
                way shows about 15-17.
              </p>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-39-summary",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <h4 className="ct-revealRichHeading">In summary</h4>
                <p className="ct-revealRichBody">
                  With an <strong>unbalanced 11-14</strong> hand and 3 card
                  support, just support partner immediately. With a stronger
                  hand, first bid your second suit, then support later.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-39-balanced",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                What about if you had a balanced 11-14 and 3 card support?
              </p>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-39-balanced-answer",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          shownHandsOverride: {
            south: { S: "A103", H: "KQ5", D: "J108", C: "Q1032" },
          },
          promptText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichBody--muted">
                (Take a look at the new hand and new auction, make sure you agree
                with that rebid.)
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  With a balanced hand and 3 card support, it is routine to rebid
                  1NT rather than to support partner&apos;s potential 4 card suit.
                  Decades ago it was in fashion to support with such hands, but
                  now it is extinct at expert level bridge.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "K103", H: "AKJ94", D: "4", C: "AQ43" },
    },
    rounds: [],
  },
  {
    id: "bid2-40",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Better Rebid Fundamentals (2)",
    trumpSuit: "D",
    contract: "?",
    dealerCompass: "N",
    declarerCompass: "N",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♥ P 1NT P 2♦ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Better Rebid Fundamentals",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Better Rebid Fundamentals",
      promptThemeTint: "rebidFundamentals",
      videoUrlBeforeStart: "https://youtube.com/shorts/vK4K-6MgRvI?si=ACgDh5M6vBt8OCQr",
      customPrompts: [
        {
          id: "bid2-40-info1",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                Let&apos;s look at this from responder&apos;s point of view.
              </p>
              <p className="ct-revealRichBody--muted">
                You are South. Partner opened{" "}
                <TextWithColoredSuits text="1♥" />, you responded{" "}
                <TextWithColoredSuits text="1NT" />, and partner has now shown a
                second suit with <TextWithColoredSuits text="2♦" />. It is your
                call.
              </p>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-40-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichBody">
                In the auction above, what do you bid?
              </p>
            </div>
          ),
          playDecisionInput: "biddingBox",
          expectedChoice: ["2s", "3d", "3h"],
          expectedChoiceDisplay: "2♠, 3♦ or 3♥",
          noContinue: false,
          revealText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                There are a few possibilities here — my preferences are{" "}
                <TextWithColoredSuits text="2♠" />,{" "}
                <TextWithColoredSuits text="3♥" />, or the simple{" "}
                <TextWithColoredSuits text="3♦" />. Let&apos;s go through them.
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Firstly, is pass a good idea? It is not. Partner may have 17
                  points, so passing with 11 looks like a bad idea — we may have
                  more than enough for game. It also defies my golden rule of
                  bidding: always support partner (for more, see the bidding
                  theme &quot;Responding to partner&quot; — problems 6–10 of
                  Bidding Stage 1).
                </p>
                <p className="ct-revealRichBody">
                  The other problem with pass: you actually have an excellent
                  hand. You have good four-card support, and you hold{" "}
                  <TextWithColoredSuits text="♥Kx" /> of partner&apos;s long
                  suit — those are magical points. Those hearts are worth a lot
                  more than 3 points (honours opposite partner&apos;s length are
                  very good).
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-40-3c2s",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <h4 className="ct-revealRichHeading">
                  <TextWithColoredSuits text="3♦" /> — a decent bid
                </h4>
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="3♦" /> shows four-card support
                  (Partner&apos;s bid only promises 4 to begin with, so you
                  can&apos;t support with only 3 cards — being at the 3 level on
                  a 7-card fit would not be good).
                </p>
                <p className="ct-revealRichBody">
                  The main problem with <TextWithColoredSuits text="3♦" /> is
                  that your hand is basically a maximum, and that is not
                  conveyed by the bid.
                </p>
              </section>
              <p className="ct-revealRichLead">
                <span className="ct-revealRichBadge ct-revealRichBadge--violet">
                  <TextWithColoredSuits text="2♠" />
                </span>
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="2♠" /> is a quirky bid that applies
                  to exactly this situation. Partner opened, you responded{" "}
                  <TextWithColoredSuits text="1NT" /> (denying spades). Now all
                  of a sudden you have bid spades — what does it show?
                </p>
                <p className="ct-revealRichBody">
                  For starters, it says nothing about spades, since you already
                  denied spades by bidding <TextWithColoredSuits text="1NT" />{" "}
                  (you did not bid <TextWithColoredSuits text="1♠" />). So in
                  this context <TextWithColoredSuits text="2♠" /> shows a maximum
                  raise of partner&apos;s second suit — here that is diamonds. It
                  is an artificial bid that has become fairly standard in expert
                  circles, since previously <TextWithColoredSuits text="2♠" />{" "}
                  was not used for any purpose.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-40-3h",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <p className="ct-revealRichLead">
                What about <TextWithColoredSuits text="3♥" />?
              </p>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Make sure to first discuss with partner! One good use of the
                  bid is to play it as four-card support with{" "}
                  <TextWithColoredSuits text="♥Hx" /> (so{" "}
                  <TextWithColoredSuits text="♥Ax, ♥Kx or ♥Qx" /> — you cannot
                  hold three hearts, having bid{" "}
                  <TextWithColoredSuits text="1NT" /> over{" "}
                  <TextWithColoredSuits text="1♥" />). That is a specific idea
                  that is somewhat common, but don&apos;t treat it as standard —
                  agree it with partner before you use it.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-40-summary",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <h4 className="ct-revealRichHeading">In summary</h4>
                <ul className="ct-revealRichPoints">
                  <li>
                    Pass should be out of the question — with 9+ points we
                    normally can&apos;t pass, since partner can have 17+.
                  </li>
                  <li>
                    <TextWithColoredSuits text="2♠" /> here, where you have
                    responded <TextWithColoredSuits text="1NT" /> denying spades,
                    shows a maximum hand with support for partner&apos;s second
                    suit. (It comes up reasonably frequently.)
                  </li>
                  <li>
                    <TextWithColoredSuits text="3♥" /> is something to think
                    about and discuss with partner — it works well when it comes
                    up. (If partner had opened{" "}
                    <TextWithColoredSuits text="1♠" /> instead,{" "}
                    <TextWithColoredSuits text="3♠" /> would convey the same
                    meaning.)
                  </li>
                </ul>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "Q42", H: "K9", D: "K964", C: "K643" },
    },
    rounds: [],
  },
  {
    id: "bid2-41",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Better Rebid Fundamentals (3)",
    trumpSuit: "H",
    contract: "?",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♠ P 1NT P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Better Rebid Fundamentals",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Better Rebid Fundamentals",
      promptThemeTint: "rebidFundamentals",
      videoUrlBeforeStart: "https://youtube.com/shorts/2WfS5j0Q4n8?si=KpQ76YxmPUg53GCe",
      auctionResolvedTextByPromptId: {
        "bid2-41-bid--reveal": "1♠ P 1NT P 2♥",
        "bid2-41-summary": "1♠ P 1NT P 2♥",
        "bid2-41-reveal": "1♠ P 1NT P 2♥",
      },
      customPrompts: [
        {
          id: "bid2-41-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Your turn..",
          playDecisionInput: "biddingBox",
          expectedChoice: "2h",
          expectedChoiceDisplay: "2♥",
          noContinue: false,
          revealText:
            "Bidding 2♥ is always a good idea. Partner can have lots of hearts and still have to respond 1NT. I've seen people say they didn't rebid 2♥ because their suit was bad. Rather think of it this way, opposite partner's 5 card heart suit, your hearts are support. When looked like that, it becomes move obvious why you don't need great hearts to rebid 2♥.\n\nOften partner will bid 2♠ and you will play there or pass 2♥ will often be fine.",
          videoUrl: "",
        },
        {
          id: "bid2-41-summary",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "reveal the full hand",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  <strong>
                    Always rebid your hearts, don&apos;t come up with excuses
                    not to.
                  </strong>
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-41-reveal",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          revealFullHandSeats: ["north", "south"],
          promptText: "4♥ is cold,",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "5", H: "KQ10765", D: "875", C: "A85" },
      south: { S: "A8764", H: "J842", D: "A2", C: "K3" },
    },
    rounds: [],
  },
  {
    id: "bid2-42",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Better Rebid Fundamentals (4)",
    trumpSuit: "D",
    contract: "?",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♠ P 1NT P 2♣ P 2♦ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Better Rebid Fundamentals",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Better Rebid Fundamentals",
      promptThemeTint: "rebidFundamentals",
      videoUrlBeforeStart: "https://youtube.com/shorts/rB6q4oMnlzA?si=aBD5j1OZYY4UQxCQ",
      auctionResolvedTextByPromptId: {
        "bid2-42-bid--reveal": "1♠ P 1NT P 2♣ P 2♦ P P",
        "bid2-42-keyidea": "1♠ P 1NT P 2♣ P 2♦ P P",
        "bid2-42-length": "1♠ P 1NT P 2♣ P 2♦ P P",
        "bid2-42-reveal": "1♠ P 1NT P 2♣ P 2♦ P P",
      },
      customPrompts: [
        {
          id: "bid2-42-info1",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText:
            "It's good to be clear on the auction where responder bids 1N and then rebids their own suit, what does that show in terms of strength and length?",
          videoUrl: "",
        },
        {
          id: "bid2-42-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Your turn..",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          noContinue: false,
          revealText:
            "Pass looks like a good idea despite having a fairly strong hand. The main reason is that you're misfiring. Imagine partner with say 6-9 points and diamonds and 6-7 diamonds. 2♦ might be a sensible contract and any further bidding by you may end you in 3♦ which might not make.",
          videoUrl: "",
        },
        {
          id: "bid2-42-keyidea",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <h4 className="ct-revealRichHeading">Key idea</h4>
                <p className="ct-revealRichBody">
                  <strong>always be conservative with a misfit</strong>
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-42-length",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "reveal the full hand",
          promptText:
            "Partner should not expect more than a singleton most of the time, you've already shown 9 cards at least in spades and clubs. So a bid of a new suit is typically 6 cards or more. It does not show any extra points, a minimum hand is still very possible.",
          videoUrl: "",
        },
        {
          id: "bid2-42-reveal",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          revealFullHandSeats: ["north", "south"],
          promptText: "The full hand:",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "3", H: "Q92", D: "QJ109653", C: "Q8" },
      south: { S: "AK1052", H: "K103", D: "4", C: "AJ52" },
    },
    rounds: [],
  },
  {
    id: "bid2-43",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Better Rebid Fundamentals (5)",
    trumpSuit: "NT",
    contract: "?",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♠ P 1NT P 2♣ P 2NT P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Better Rebid Fundamentals",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Better Rebid Fundamentals",
      promptThemeTint: "rebidFundamentals",
      videoUrlBeforeStart: "https://youtube.com/shorts/PE5ecVdDb14?si=5CRHcp8MsWxa31dQ",
      auctionResolvedTextByPromptId: {
        "bid2-43-bid--reveal": "1♠ P 1NT P 2♣ P 2NT P 3NT",
        "bid2-43-reveal": "1♠ P 1NT P 2♣ P 2NT P 3NT",
      },
      customPrompts: [
        {
          id: "bid2-43-info1",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText:
            "The 2NT rebid is a very important one, it frames the whole structure. It's important to be quite exact with it.\n\nLet's take a similar hand to what we had on the previous problem,",
          videoUrl: "",
        },
        {
          id: "bid2-43-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Your turn..",
          playDecisionInput: "biddingBox",
          expectedChoice: "3nt",
          expectedChoiceDisplay: "3NT",
          noContinue: false,
          continueButtonLabel: "show me partner's hand",
          revealText:
            "It's a pretty good idea to bid game, 3NT. 2NT should be about 11-12 points. It conveys the message, \"with the upper range of a normal opening 11-14 hand, let's look for game\". Also let's think about it logically -- in order to Make 2NT we surely need at least 22-23 points. If opener can can have about 11-12, surely responder also needs about 1-12 to offer 2NT?",
          videoUrl: "",
        },
        {
          id: "bid2-43-reveal",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          revealFullHandSeats: ["north", "south"],
          promptText:
            "Some people might say \"I would bid 3NT with that hand rather than 2NT\". The reality of modern bridge needs to be highlighted from time to time  - you can't have it all ways - unless your openings are always solid 12-13 points, bidding 3NT would be unsound. What I mean is, you do not want to end up in bad 23 point 3NT contracts, because one player opened 11 and the other game forced with 12. Especially when there is a bid to show your hand. That bid is 2NT, which shows 11-12 points.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "53", H: "AJ84", D: "KQ108", C: "Q43" },
      south: { S: "AK1042", H: "Q103", D: "4", C: "A1092" },
    },
    rounds: [],
  },
  {
    id: "bid2-44",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the shoulder #1 (1)",
    trumpSuit: "S",
    contract: "?",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "P 1NT P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the shoulder #1",
      promptThemeTint: "overShoulder",
      videoUrlBeforeStart: "",
      auctionResolvedTextByPromptId: {
        "bid2-44-ltc": "P 1NT P 2♥ P 2♠ P ?",
        "bid2-44-summary": "P 1NT P 2♥ P 2♠ P ?",
        "bid2-44-bid": "P 1NT P 2♥ P 2♠ P ?",
        "bid2-44-bid--reveal": "P 1NT P 2♥ P 2♠ P 4♥",
        "bid2-44-reveal": "P 1NT P 2♥ P 2♠ P 4♥ P 4NT P 5♠ P 5NT P 6♠",
      },
      customPrompts: [
        {
          id: "bid2-44-info1",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  What is your plan here, how good is your hand?
                </p>
                <p className="ct-revealRichBody">
                  We need to first be able to look at our hand and decide whether we think slam is
                  plausible or not.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-44-opinion",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is your opinion of this hand?",
          options: [
            { id: "game", label: "This is just a game hand, slam is unlikely." },
            { id: "slam", label: "I want to bid slam" },
            { id: "investigate", label: "I want to investigate slam." },
          ],
          expectedChoice: "investigate",
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">I want to investigate slam.</p>
                <p className="ct-revealRichBody">
                  There are some bridge hands where you do not need partner&apos;s involvement, and
                  you can just bid slam or even grand slam. Those hands are rare.
                </p>
                <p className="ct-revealRichBody">
                  Most good slam bidding is a discussion, you try to show your hand as accurately as
                  possible, and partner can then gauge what to do.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  But firstly, how do we judge that this hand might be suitable for slam?
                </p>
                <p className="ct-revealRichBody">
                  Point count only gives 12, opposite 15-17, which isn&apos;t enough for our 33 point
                  slams.
                </p>
                <p className="ct-revealRichBody">
                  But, point count is not your best measure for distributional hands. A better
                  measure is Losing Trick Count on hands like this, (see problems 34-38 of bidding
                  Stage 2). It is highly accurate, and is definitely worth learning.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-44-ltc",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  You have a 7 loser hand, partner for their 1NT is expected to have about a 5-6
                  loser hand.
                </p>
                <p className="ct-revealRichBody">
                  If you add your losers together, 7+5, you get 12. That makes slam (the traditional
                  way to calculate it is to subtract from 24, so your total loser count is 12,
                  subtracted from 24 also equals 12. That is the number of expected tricks, I
                  personally find this to be a hassle).
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-44-summary",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  The key things I would remember about the losing trick count for bidding is
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  1. Two 7 loser hands is game, which totals 14 losers if you add it together. (An
                  opening hand is approximately 7 losers often)
                </p>
                <p className="ct-revealRichBody">
                  2. If the combined loser count is 12 (same as the number of tricks you need for
                  slam), you may have enough for slam IF you have a fit. So, two 6 loser hands, or a
                  5 loser and a 7 loser.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  However, that is a guide, its not a law. We use it to determine that we are in the
                  &quot;slam zone&quot;. Once we decide we are in the slam zone, the task becomes to
                  get partner&apos;s opinion on the matter. What is the best way to do that? You have
                  transferred to spades, now what?
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-44-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "4h",
          expectedChoiceDisplay: "4♥",
          noContinue: false,
          continueButtonLabel: "Reveal the full hand",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  After transferring to spades, bidding <TextWithColoredSuits text="4♥" /> is a
                  splinter - showing a short heart and slam interest.
                </p>
                <p className="ct-revealRichBody">
                  Partner needs to look at their hand and judge it like this -
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  1. Points in hearts are bad, sign off with lots of points in hearts, bid on
                  without much in hearts. A good guide is to sign off with 3+ points in hearts (they
                  are effectively &quot;wasted points&quot;.) However, an Ace is the one card that is
                  &quot;okay&quot;, not wasted but not an ideal holding.
                </p>
                <p className="ct-revealRichBody">
                  2. The ideal holding is no high cards in hearts
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  A Quick note - why is <TextWithColoredSuits text="4♥" /> a splinter? If you wanted
                  to bid hearts naturally, you can just bid <TextWithColoredSuits text="3♥" />. Since
                  you have a natural <TextWithColoredSuits text="3♥" /> available, a jump is a
                  splinter (and not another natural bid).
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-44-reveal",
          type: "INFO",
          atRoundIdx: -1,
          revealFullHandSeats: ["north", "south"],
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  12 top tricks, so <TextWithColoredSuits text="6♠" /> is an excellent contract
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Partner should look particularly closely at their heart holding.
                </p>
                <p className="ct-revealRichBody">
                  An Ace is good, without any other wasted cards.
                </p>
                <p className="ct-revealRichBody">
                  Partner should not worry about their spade length, you have shown 6+ spades.
                </p>
                <p className="ct-revealRichBody">
                  The hand is about whether partner&apos;s high cards are well placed or not, here
                  they are.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  If, for example, just the <TextWithColoredSuits text="K♣" /> was in hearts, you would be on a finesse
                  for 12 tricks instead of having 12 top tricks like you do now
                </p>
                <p className="ct-revealRichBody">
                  If, for example, the <TextWithColoredSuits text="K♣" /> and <TextWithColoredSuits text="Q♣" /> was in hearts instead, you would only
                  have 11 tricks and no real chance for a 12th.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  You can hopefully see that every extra card in hearts makes the contract worse.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "K5", H: "A932", D: "A104", C: "KQ75" },
      south: { S: "AQJ642", H: "8", D: "832", C: "AJ10" },
    },
    rounds: [],
  },
  {
    id: "bid2-45",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the shoulder #1 (2)",
    trumpSuit: "S",
    contract: "?",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the shoulder #1",
      promptThemeTint: "overShoulder",
      videoUrlBeforeStart: "",
      auctionResolvedTextByPromptId: {
        "bid2-45-open": "?",
        "bid2-45-open--reveal": "1♠ P 1NT P ?",
        "bid2-45-fourspades": "1♠ P 1NT P ?",
        "bid2-45-rebid": "1♠ P 1NT P ?",
        "bid2-45-rebid--reveal": "1♠ P 1NT P 3♥ P 3NT P ?",
        "bid2-45-next": "1♠ P 1NT P 3♥ P 3NT P ?",
        "bid2-45-next--reveal": "1♠ P 1NT P 3♥ P 3NT P 4♠ P P P",
        "bid2-45-reveal": "1♠ P 1NT P 3♥ P 3NT P 4♠ P P P",
      },
      customPrompts: [
        {
          id: "bid2-45-open",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "You pick up this very nice looking hand. What do you open playing fairly standard methods?",
          playDecisionInput: "biddingBox",
          expectedChoice: "1s",
          expectedChoiceDisplay: "1♠",
          hidePlayDecisionHeading: true,
          playCardRevealHideSuccessBanner: true,
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  A simple <TextWithColoredSuits text="1♠" /> opening is best. Let&apos;s look at the common alternatives and explain why they are wrong.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="2♣" /> — It is not a good idea to open <TextWithColoredSuits text="2♣" /> unless you have say 22+ points. When you get so many points, you run a real risk that if you open on the 1 level, everyone will pass and that will end the auction — that is why we have <TextWithColoredSuits text="2♣" /> available.
                </p>
                <p className="ct-revealRichBody">
                  I have a lot to say on the topic of <TextWithColoredSuits text="2♣" />. People see it as an achievement to open it, when really it is a tool that should be reserved for very rare circumstances when you have a lot of points.
                </p>
                <p className="ct-revealRichBody">
                  One big source of confusion — people confuse high card point strength with general playing strength. It is true that you don&apos;t need high card points to have a strong hand, the current hand may make grand slam opposite the <TextWithColoredSuits text="K♠" /> and <TextWithColoredSuits text="A♥" />, yet it is not a high card point strong hand.
                </p>
                <p className="ct-revealRichBody">
                  <a href="https://bridgechampions.com/bidding/advanced/opening-2c-avoid-whenever-possible" target="_blank" rel="noopener noreferrer">More on this: Opening 2♣ — avoid whenever possible</a>
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  We can acknowledge that you can have a very &quot;strong&quot; hand without having that many high card points, but reserve the <TextWithColoredSuits text="2♣" /> opening for hands with lots of high card points — avoid it otherwise.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-45-fourspades",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="4♠" /> — Openings of <TextWithColoredSuits text="4♠" /> should be reserved for a specific type of hand: a distributional hand that does not have opening values. So, say 10 or less points, with typically 8 spades. Or perhaps 7 good spades and 7-4-1-1 shape, or better. It is important that partner knows what to do after you open <TextWithColoredSuits text="4♠" />, so they should be able to accurately predict the nature of your hand.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Don&apos;t open <TextWithColoredSuits text="4♠" /> with opening values. Open on the 1 level with 11+ points and a long major.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-45-rebid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "The bidding has progressed, what is your next bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3h",
          expectedChoiceDisplay: "3♥",
          hidePlayDecisionHeading: true,
          playCardRevealHideSuccessBanner: true,
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  In standard bidding, a jump to <TextWithColoredSuits text="3♥" /> is natural and game forcing, showing typically 5+ in each suit. Partner has bid 3NT, suggesting no fit and likely points in the minors. Partner likely does not even have 2 card spades, or else might have bid <TextWithColoredSuits text="3♠" /> over <TextWithColoredSuits text="3♥" />.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-45-next",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What next?",
          playDecisionInput: "biddingBox",
          expectedChoice: "4s",
          expectedChoiceDisplay: "4♠",
          hidePlayDecisionHeading: true,
          playCardRevealHideSuccessBanner: true,
          noContinue: false,
          continueButtonLabel: "continue",
          revealFullHandSeats: ["north", "south"],
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="4♠" /> is a simple and good bid here. You have communicated to partner that you probably have 7 spades or at least 6 good ones. You have also said you have a very nice game forcing hand with spades and hearts.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Some optimists will tell you how powerful this hand is and how little you need for slam. If you are playing opposite a thoughtful partner, they should be aware of how good their hand could be with the right cards. You are saying you can make game opposite the wrong cards — imagine what you can do opposite good cards!
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Distributional hands can be very powerful if partner has a fit and/or the right cards. Without that, don&apos;t overestimate their power.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody"><TextWithColoredSuits text="4♠" /> is high enough, you do not make more.</p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-45-reveal",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  A side note — if you open <TextWithColoredSuits text="2♣" />, partner with this hand should almost certainly insist on slam; combined you should have about 33+ high card points. With 33+ high card points, typically slam will be sensible even without a fit. On this hand, you only make 10 tricks.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  In summary — high card points can sometimes be irrelevant, but not always. In your partnership, reserve <TextWithColoredSuits text="2♣" /> as a hand with lots of high card points, while also appreciating that even if partner opens on the 1 level, they can have a hand that can take lots of tricks even if they don&apos;t have a lot of high card strength.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "K", H: "94", D: "Q942", C: "AJ8742" },
      south: { S: "AQ108743", H: "KQ632", D: "A", C: "" },
    },
    rounds: [],
  },
  {
    id: "bid2-46",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the shoulder #1 (3)",
    trumpSuit: "S",
    contract: "6♠X",
    dealerCompass: "E",
    declarerCompass: "E",
    viewerCompass: "S",
    vulnerability: "NS Vul",
    visibleFullHandSeats: ["south"],
    auction: "1♦ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the shoulder #1",
      promptThemeTint: "overShoulder",
      videoUrlBeforeStart: "",
      auctionPartnersRed: true,
      auctionResolvedTextByPromptId: {
        "bid2-46-overcall": "1♦ ?",
        "bid2-46-overcall--reveal": "1♦ 1♥",
        "bid2-46-auction-explain": "1♦ 1♥ 2♠ 4♦ 4♠ ?",
        "bid2-46-fivehearts": "1♦ 1♥ 2♠ 4♦ 4♠ ?",
        "bid2-46-fivehearts--reveal": "1♦ 1♥ 2♠ 4♦ 4♠ 5♥",
        "bid2-46-double-meaning": "1♦ 1♥ 2♠ 4♦ 4♠ 5♥ 5NT P 6♠ P P X",
        "bid2-46-double-meaning--reveal": "1♦ 1♥ 2♠ 4♦ 4♠ 5♥ 5NT P 6♠ P P X",
      },
      customPrompts: [
        {
          id: "bid2-46-overcall",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What, if anything, do you do with this hand?",
          playDecisionInput: "biddingBox",
          expectedChoice: "1h",
          expectedChoiceDisplay: "1♥",
          hidePlayDecisionHeading: true,
          playCardRevealHideSuccessBanner: true,
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Just bid <TextWithColoredSuits text="1♥" />. When vulnerable the winning style is to have a very good quality suit when you preempt. This suit is not good enough, at least one more top honor is needed. (see bidding: Preempts for more on this).
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  A lot of people are not used to this as a possibility, but the expert rule goes:
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  When you are vulnerable, if your suit is not good enough for preempting — you can simply bid it on the 1 level.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  As we are in the year 2026, passing is out of fashion with such hands. In summary, a simple <TextWithColoredSuits text="1♥" /> bid is okay.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-46-auction-explain",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="2♠" /> is game forcing with 6+ spades.
                </p>
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="4♦" /> is a splinter = 4+ hearts with 0 or 1 diamonds.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-46-fivehearts",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "The auction has heated up quickly, partner has shown a good fit hearts and the opponents have found a spade bid. Your turn to bid.",
          playDecisionInput: "biddingBox",
          expectedChoice: "5h",
          expectedChoiceDisplay: "5♥",
          hidePlayDecisionHeading: true,
          playCardRevealHideSuccessBanner: true,
          noContinue: false,
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  The preferred bid is <TextWithColoredSuits text="5♥" />. It is true you are vulnerable and should be careful in such situations, but why is this hand worth venturing off onto the 5 level for?
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  1. Key feature - big trump fit with two singletons (one in each hand). This is a central reason for when the 5 level becomes profitable. Partner has a singleton in one of the suits, and you have a singleton in the other - and you have a big trump fit.
                </p>
                <p className="ct-revealRichBody">
                  2. You have 2 extra hearts for your initial bid of <TextWithColoredSuits text="1♥" />, so your hand has really come to life. Having found a big trump fit, your hand suddenly is very useful despite its very minimal point count.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-46-double-meaning",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "5NT is \"pick a slam\" — West has both diamonds and spades. The bidding hasn't stopped with its excitement though, the opponents are now launched into slam and partner has doubled — what is going on?",
          options: [
            { id: "penalty", label: "Partner is doubling to take a big penalty" },
            { id: "different_reason", label: "Partner is doubling for a different reason" },
          ],
          expectedChoice: "different_reason",
          noContinue: false,
          continueButtonLabel: "continue",
          revealFullHandSeats: ["north", "east", "south", "west"],
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Quality opponents don&apos;t freely bid slam to go several off, so we don&apos;t use the double for the sake of racking up a big penalty. Instead it is a &quot;Lightner double&quot;. (see bidding stage 2, problem 33 for more on that).
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  The double says &quot;I have a void, please lead it&quot;. It is easy this time to know where the void is, as partner has already told you in the bidding. You lead a diamond.
                </p>
                <p className="ct-revealRichBody">
                  Partner doesn&apos;t risk underleading the club to get back to your hand for a second ruff, partner just sensibly cashes the <TextWithColoredSuits text="A♣" /> for 1 off.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "102", H: "KJ952", D: "", C: "A109872" },
      east: { S: "KQ63", H: "", D: "AQ10875", C: "643" },
      south: { S: "5", H: "Q1087643", D: "32", C: "KQ5" },
      west: { S: "AJ9874", H: "A", D: "KJ964", C: "J" },
    },
    rounds: [],
  },
  {
    id: "bid2-47",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the shoulder #1 (4)",
    trumpSuit: "C",
    contract: "?",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    vulnerability: "None Vul",
    visibleFullHandSeats: ["south"],
    auction: "1♥ 1NT 2♥ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the shoulder #1",
      promptThemeTint: "overShoulder",
      videoUrlBeforeStart: "",
      auctionResolvedTextByPromptId: {
        "bid2-47-bid": "1♥ 1NT 2♥ ?",
        "bid2-47-bid--reveal": "1♥ 1NT 2♥ 2NT P 3♣ P P P",
        "bid2-47-reveal": "1♥ 1NT 2♥ 2NT P 3♣ P P P",
      },
      customPrompts: [
        {
          id: "bid2-47-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Your turn, pass looks like an obvious possibility, is there anything else?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2nt",
          expectedChoiceDisplay: "2NT",
          noContinue: false,
          continueButtonLabel: "Reveal the full hand",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  The correct bid is 2NT - see the problems on Theme: Lebensohl if this was not on
                  your radar.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  How it works - it tells partner you want to compete, partner is forced to bid{" "}
                  <TextWithColoredSuits text="3♣" />, and you either pass{" "}
                  <TextWithColoredSuits text="3♣" /> or bid something else. Why not just bid it
                  directly - this helps us distinguish between bad hands that just want to compete,
                  and game forcing hands.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Why do we want to compete? Competing for the partscore is the core of bridge. There
                  are a couple key reasons to do so.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  1. The points are approximately half-half with both sides. We have around 19/20
                  points likely.
                </p>
                <p className="ct-revealRichBody">
                  2. The opponents are in an 8 card fit on the 2 level - that&apos;s a comfortable and good
                  spot for them to be, we don&apos;t want to allow that normally.
                </p>
                <p className="ct-revealRichBody">
                  3. We are not vulnerable - an excellent time to compete, even 2 off can be a good
                  score.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-47-reveal",
          type: "INFO",
          atRoundIdx: -1,
          revealFullHandSeats: ["north", "east", "south", "west"],
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Once we decide to compete, we simply just bid our long suit. We don&apos;t have the
                  right shape for a takeout double since partner could bid diamonds if we did that!
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Don&apos;t be concerned about finding partner with 2 clubs only. Firstly partner is
                  expected to be short in hearts (they have a heart fit!), and{" "}
                  <em className="ct-revealRichKey">
                    the necessity of competing for the part score and removing the opponents from a
                    comfortable 2 level contract outweighs any other consideration
                  </em>
                  , especially when we are Not Vul.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "AJ", H: "A2", D: "AJ643", C: "Q954" },
      east: { S: "Q102", H: "J65", D: "K875", C: "J76" },
      south: { S: "8743", H: "1074", D: "10", C: "K10832" },
      west: { S: "K965", H: "KQ983", D: "Q92", C: "A" },
    },
    rounds: [],
  },
  {
    id: "bid2-48",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the shoulder #1 (5)",
    trumpSuit: "S",
    contract: "?",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    auction: "1♣ P 1♠ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the shoulder #1",
      promptThemeTint: "overShoulder",
      videoUrlBeforeStart: "",
      auctionResolvedTextByPromptId: {
        "bid2-48-bid1": "1♣ P 1♠ P ?",
        "bid2-48-bid1--reveal": "1♣ P 1♠ P 2♥ P 2NT P ?",
        "bid2-48-bid2": "1♣ P 1♠ P 2♥ P 2NT P ?",
        "bid2-48-bid2--reveal": "1♣ P 1♠ P 2♥ P 2NT P 3♣ P 3NT P ?",
        "bid2-48-bid3": "1♣ P 1♠ P 2♥ P 2NT P 3♣ P 3NT P ?",
        "bid2-48-bid3--reveal": "1♣ P 1♠ P 2♥ P 2NT P 3♣ P 3NT P P P",
        "bid2-48-summary": "1♣ P 1♠ P 2♥ P 2NT P 3♣ P 3NT P P P",
        "bid2-48-reveal": "1♣ P 1♠ P 2♥ P 2NT P 3♣ P 3NT P P P",
      },
      customPrompts: [
        {
          id: "bid2-48-bid1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "You pick up a nice distributional hand, how do you handle this?",
          playDecisionInput: "biddingBox",
          expectedChoice: "2h",
          expectedChoiceDisplay: "2♥",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="2♥" /> is the correct bid. It is a reverse which shows
                  5+ clubs, 4+ hearts, and 17+ points. An excellent start. See bidding Theme:
                  Reverses for more on this.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-48-bid2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Partner now bids 2NT, what is your next bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "3c",
          expectedChoiceDisplay: "3♣",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="3♣" />, simple and natural bidding, you&apos;re now
                  showing longer clubs, you likely have at least 6 good clubs, but probably 7 for this
                  bid. Partner bids 3NT. You have a very distributional hand, with a void. Is 3NT
                  where it ends or not?
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-48-bid3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you bid?",
          playDecisionInput: "biddingBox",
          expectedChoice: "pass",
          expectedChoiceDisplay: "Pass",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">Pass</p>
                <p className="ct-revealRichBody">
                  You have already shown most of the features of your hand. You have shown 7 clubs
                  typically, 4 hearts and 17+ points. It is true partner doesn&apos;t know about your
                  void, but partner has rebid 3NT expecting very little or no help in diamonds. If
                  partner wanted to know more, a <TextWithColoredSuits text="3♦" /> bid (4th suit)
                  over <TextWithColoredSuits text="3♣" />, might have been bid.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-48-summary",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Reveal the full hand",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichHeading">In summary</p>
                <p className="ct-revealRichBody">
                  You have told partner almost everything about your hand, and partner has said that
                  3NT is the contract, trust partner.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "bid2-48-reveal",
          type: "INFO",
          atRoundIdx: -1,
          revealFullHandSeats: ["north", "east", "south", "west"],
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  As you can see the hands are badly misfitting and 3NT is your best bet. Partner
                  gets a diamond lead, and you make the contract, anything else is doomed.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  <em className="ct-revealRichKey">
                    Don&apos;t get carried away with distributional hands when you are misfitting - if
                    you&apos;ve already shown your hand it is time to trust partner.
                  </em>
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "10953", H: "J106", D: "AKJ763", C: "" },
      east: { S: "764", H: "A9753", D: "1084", C: "74" },
      south: { S: "KQ", H: "KQ82", D: "", C: "AK98653" },
      west: { S: "AJ82", H: "4", D: "Q952", C: "QJ102" },
    },
    rounds: [],
  },
];

// Temporarily hidden (work-in-progress, not ready for live). Remove ids below to re-enable.
const BC_HIDDEN_BIDDING_IDS = new Set([]);
if (process.env.NODE_ENV === "production") {
  for (let bcI = BIDDING_PUZZLES.length - 1; bcI >= 0; bcI--) {
    if (BIDDING_PUZZLES[bcI] && BC_HIDDEN_BIDDING_IDS.has(BIDDING_PUZZLES[bcI].id)) {
      BIDDING_PUZZLES.splice(bcI, 1);
    }
  }
}
export { BIDDING_PUZZLES };

function BiddingTrainer(routeProps) {
  return (
    <CountingTrumpsTrainer
      {...routeProps}
      puzzlesOverride={BIDDING_PUZZLES}
      trainerLabel="Bidding"
      categoryKey="bidding"
    />
  );
}

export default BiddingTrainer;

