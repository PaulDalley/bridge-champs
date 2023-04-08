import * as helpers from './helpers';
// import expect from 'expect';

describe("Testing card string sorting helper", () => {
    it('sorts all 13 cards correctly from reversed', () => {
        let cards = "23456789TJQKA";
        let expected = "AKQJT98765432";
        expect(helpers.sortCardString(cards)).toEqual(expected);
    });
    it('sorts 12 cards correctly from reversed', () => {
        let cards = "23456789TJQK";
        let expected = "KQJT98765432";
        expect(helpers.sortCardString(cards)).toEqual(expected);
    });
    it('sorts 11 cards correctly from reversed', () => {
        let cards = "3456789TJQK";
        let expected = "KQJT9876543";
        expect(helpers.sortCardString(cards)).toEqual(expected);
    });
    it('sorts 10 cards correctly from reversed', () => {
        let cards = "345679TJQK";
        let expected = "KQJT976543";
        expect(helpers.sortCardString(cards)).toEqual(expected);
    });
})

/* Rules regarding doubling:
bid = "_/_/1♦/1NT/P/*2♦/P/2♥/P/3NT/P/P/P";
bid = "_/_/_/1♦/1NT/P/*2♦/P/2♥/P/3NT/P/P/P";

CANT REDOUBLE OR DOUBLE:
   bid = "";
   bid = "_";
   bid = "_/_";
   bid = "_/_/_";



    CAN REDOUBLE:
    bid = "_/_/_/1♦/X/";
    bid = "_/_/_/1♦/X/P/P";

    1) Cant double your partner
    bid = "_/_/_/1♦/X/P";

    2) Cant double a double or a redouble

    1) Cant redouble your partner
    2) Can only redouble if last bid was a double and made by your opponents.
       - ignore passes always

*/
describe("Testing double and redouble checker", () => {
    helpers.canDoubleChecker(biddingString);
    helpers.canRedoubleChecker(biddingString);
});


describe("Testing prepareArticleString", () => {
    //helpers.prepareArticleString(articleString);

    // beforeEach(() => {
    //
    // })

    it('replaces 6♦ with coloured span', () => {
        expect(helpers.prepareArticleString('6♦')).toEqual(`6<span className='red-suit'>♦</span>`);
    });
    it('replaces ♦6 with coloured span', () => {
        expect(helpers.prepareArticleString('♦6')).toEqual(`<span className='red-suit'>♦</span>6`);
    });
    it('replaces 6♥ with coloured span', () => {
        expect(helpers.prepareArticleString('6♥')).toEqual(`6<span className='red-suit'>♥</span>`);
    });
    it('replaces ♥6 with coloured span', () => {
        expect(helpers.prepareArticleString('♥6')).toEqual(`<span className='red-suit'>♥</span>6`);
    });

    it('can properly replace a regular text string with macros', () => {
        expect(helpers.prepareArticleString("hello 4!c and 6!d then 9!s and also 10!h"))
            .toEqual(`hello 4♣ and 6<span className='red-suit'>♦</span> then 9♠ and also 10<span className='red-suit'>♥</span>`)
    });
    it('can properly replace a regular text string with macros, inverted', () => {
        expect(helpers.prepareArticleString("hello 4!c and !d6 then 9!s and also !h10"))
            .toEqual(`hello 4♣ and <span className='red-suit'>♦</span>6 then 9♠ and also <span className='red-suit'>♥</span>10`)
    });

    it('can handle a string with multiple red suits, 1', () => {
        expect(helpers.prepareArticleString("hello 4♣ and 6♦ then 9♠ and also 10♥"))
            .toEqual(`hello 4♣ and 6<span className='red-suit'>♦</span> then 9♠ and also 10<span className='red-suit'>♥</span>`)
    });
    it('can handle a string with multiple red suits, 2', () => {
        expect(helpers.prepareArticleString("hello 4♣ and ♦6 then 9♠ and also ♥10"))
            .toEqual(`hello 4♣ and <span className='red-suit'>♦</span>6 then 9♠ and also <span className='red-suit'>♥</span>10`)
    });
    it('can handle a string with multiple red suits, 3', () => {
        expect(helpers.prepareArticleString("hello 4♣ and 6♥ then 9♠ and also 10♦"))
            .toEqual(`hello 4♣ and 6<span className='red-suit'>♥</span> then 9♠ and also 10<span className='red-suit'>♦</span>`)
    });
    it('can handle a string with multiple red suits, 4', () => {
        expect(helpers.prepareArticleString("hello 4♣ and ♥6 then 9♠ and also ♦10"))
            .toEqual(`hello 4♣ and <span className='red-suit'>♥</span>6 then 9♠ and also <span className='red-suit'>♦</span>10`)
    });

    it('can handle a string with multiple red suits, 5', () => {
        console.log(helpers.prepareArticleString("test - this 4♦ is a ♦4 and then ♥A and A♥"));
        expect(helpers.prepareArticleString("test - this 4♦ is a ♦4 and then ♥A and A♥"))
            .toEqual(`test - this 4<span className='red-suit'>♦</span> is a <span className='red-suit'>♦</span>4 and then <span className='red-suit'>♥</span>A and A<span className='red-suit'>♥</span>`)
    })

    it('does not wrap an existing span in another span when parsing', () => {
        expect(helpers.prepareArticleString(`hello 4♣ and 6♦ then 9♠ and also 10♥ ♦5 stuff 6<span className='red-suit'>♥</span>`))
            .toEqual(
                `hello 4♣ and 6<span className='red-suit'>♦</span> then 9♠ and also 10<span className='red-suit'>♥</span> <span className='red-suit'>♦</span>5 stuff 6<span className='red-suit'>♥</span>`
            );
    });
    it('does not wrap existing spans in another span when parsing, 2', () => {
        const articleString = `
            <p>test - this 4<span className='red-suit'>♦</span> is a <span className='red-suit'>♦</span>4 and then <span className='red-suit'>♥</span>A and A<span className='red-suit'>♥</span></p>
            <p><br></p>
            <p>bidding="_/1♦/P/1♥/P/1♠"</p>
            <p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠/2♥" />		</p>
            <p><br></p>
            <p>test - this 4<span className='red-suit'>♦</span> is a <span className='red-suit'>♦</span>4 and then <span className='red-suit'>♦</span>A and A<span className='red-suit'>♦</span>	</p>
            <p><br></p>
            <p>4<span className='red-suit'>♥</span> 4<span className='red-suit'>♥</span> <span className='red-suit'>♥</span>4 <span className='red-suit'>♥</span>4</p>
            <p>4♣ 4♣ ♣4 ♣4</p>
            <p>4♠ 4♠ ♠4 ♠4</p>
            <p>4<span className='red-suit'>♦</span> 4<span className='red-suit'>♦</span> <span className='red-suit'>♦</span>4 <span className='red-suit'>♦</span>4</p>
        `;
        expect(helpers.prepareArticleString(articleString)).toEqual(articleString);
    });
    it('does not wrap existing spans in another span when parsing, 3', () => {
        const articleString = `
        <p>This article will recommend using short ♣ over better minor. It allows you to quickly get an accurate and helpful picture of your partner's hand as soon as possible in the auction. Before going into the recommendation, lets first take a brief look at some history.</p><p><strong>A brief history:</strong> Originally the "norm" in bridge was to open your longest suit. Your longest suit will be a minimum of 4 cards in length. After a while people started playing systems whereby openings of 1 Major indicated a 5 card holding. That led to a problem, for example when a player had &nbsp;4432 shape hand (4♠ 4<span className='red-suit'><span className='red-suit'>♥</span></span> and 32 in the minors). Previously players were opening their longest suits up the line - so they would open 1<span className='red-suit'><span className='red-suit'>♥</span></span>, however 5 card majors made that no longer possible. Therefore players had to open 1 of a minor with such hands.&nbsp;</p><p><br></p><p><strong>Bridge champions short club</strong>: The basic idea is to open 1♣ on all balanced hands that do not contain a 5 card major. That means that every 4432 or 4333 opens 1♣. This includes hands where you have 4<span className='red-suit'><span className='red-suit'>♦</span></span>. For example if you have 4♠ 3<span className='red-suit'><span className='red-suit'>♥</span></span> 4<span className='red-suit'><span className='red-suit'>♦</span></span> 2<span className='red-suit'><span className='red-suit'>♥</span></span> the suggested opening is 1♣ not 1<span className='red-suit'><span className='red-suit'>♦</span></span>!</p><p><strong>Advantages of this version of short ♣</strong></p><ul>  <li>Every time partner opens 1♣ you have a good idea that they have a balanced hand (11)12-14 which occurs approximately 80% of the time. The rest of the time partner may have 18-19 balanced or an unbalanced hand with clubs. Overall you will have a major edge in the bidding if you can get a feel for partner's hand early in the bidding. Also second bids become much more descriptive because they can instantly clarify that a hand is not balanced, indicating that the original 1♣ opening contained a 5 card suit (although sometimes 4441 shape is possible).&nbsp;</li>  <li>When your partner opens 1<span className='red-suit'><span className='red-suit'>♦</span></span> they will have at least 5 <span className='red-suit'><span className='red-suit'>♦</span></span>'s. There is 1 exception to this, partner may have 4441 shape in which case they would have 4<span className='red-suit'><span className='red-suit'>♦</span></span>'s. Knowing your partner has 5<span className='red-suit'><span className='red-suit'>♦</span></span> when they open 1<span className='red-suit'><span className='red-suit'>♦</span></span> instead of only knowing they hold 3<span className='red-suit'><span className='red-suit'>♦</span></span>'s (if you play better minor) can give you a huge advantage.&nbsp;</li>  <li>When partner opens 1<span className='red-suit'><span className='red-suit'>♦</span></span> they will very typically have an unbalanced hand unless the have 5 <span className='red-suit'><span className='red-suit'>♦</span></span>'s and 332 in the other suits (in fact it is reasonable to consider those hands as balanced and just open 1♣!). Knowing your partner is unbalanced is an advantage as subsequent bids become more descriptive (other short club systems that open 1<span className='red-suit'><span className='red-suit'>♦</span></span> with 4 card diamond suits do not share this advantage). Take the following auction. <MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" />. Partner must have at least 5 <span className='red-suit'><span className='red-suit'>♦</span></span>'s and 4♠'s. You can already start to visualise the large potential of your hand. Your 5-4 trump fit, your Ax of <span className='red-suit'><span className='red-suit'>♦</span></span>'s opposite partner's 5 card diamonds is extremely useful for setting up the suit. Your ♣ shortage can help reduce losers in the suit. You should already seriously be thinking of game as a possibility and bid accordingly. Lets take a seriously sub minimum opening hand (7 points!!) for partner and see how easy game would be to make with 14 points total between the two hands.</li></ul><p>&nbsp;<MakeBoard boardType="double" position="North/South" North="*S-A1065*H-7*D-K10432*C-1043" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" /></p><p>If for example trumps break 4♠ will likely a cold contract. Draw 2 rounds of trumps then play AK of <span className='red-suit'><span className='red-suit'>♦</span></span>'s then ruff a <span className='red-suit'><span className='red-suit'>♦</span></span>. Eventually ruff 2 clubs for 11 tricks! (or if the <span className='red-suit'><span className='red-suit'>♦</span></span>'s didn't break then you will need to ruff 2<span className='red-suit'><span className='red-suit'>♦</span></span>'s and only have enough trumps for 1 ♣ ruff - 10 tricks). It is easy to visualise this and therefore bid accurately when 1<span className='red-suit'><span className='red-suit'>♦</span></span> is such a descriptive bid (showing 5+ <span className='red-suit'><span className='red-suit'>♦</span></span>'s almost all the time, and typically unbalanced).&nbsp;</p>
        `;
        expect(helpers.prepareArticleString(articleString)).toEqual(articleString);
    })

    it('does add the colouring span if the next html element is NOT a span', () => {
        expect(helpers.prepareArticleString(`<p>hello 4♣ and 6♥ then 9♠ and also 10♦</p>`))
            .toEqual(`<p>hello 4♣ and 6<span className='red-suit'>♥</span> then 9♠ and also 10<span className='red-suit'>♦</span></p>`)
    });

    describe("Not breaking MakeBoard bidding property values by inserting spans", () => {
        it("doesn't break a MakeBoard string", () => {
            expect(
                helpers.prepareArticleString(
                    `<MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠/2♥" />`
                )).toEqual(`<MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠/2♥" />`
            );
        });
        it("doesn't break bidding=...", () => {
            expect(helpers.prepareArticleString(`bidding="_/1♦/P/1♥/P/1♠"`)).toEqual(`bidding="_/1♦/P/1♥/P/1♠"`);
        });
    });

    describe("Testing Macros", () => {
        // CLUBS:
        it('replaces 4!c with ♣', () => {
            expect(helpers.prepareArticleString('4!c')).toEqual('4♣');
        });
        it('replaces 4!C with ♣', () => {
            expect(helpers.prepareArticleString('4!C')).toEqual('4♣');
        });
        it('replaces !c4 with ♣', () => {
            expect(helpers.prepareArticleString('!c4')).toEqual('♣4');
        });
        it('replaces !C4 with ♣', () => {
            expect(helpers.prepareArticleString('!C4')).toEqual('♣4');
        });

        // SPADES:
        it('replaces 4!s with ♠', () => {
            expect(helpers.prepareArticleString('4!s')).toEqual('4♠');
        });
        it('replaces 4!S with ♠', () => {
            expect(helpers.prepareArticleString('4!S')).toEqual('4♠');
        });
        it('replaces !s4 with ♣', () => {
            expect(helpers.prepareArticleString('!s4')).toEqual('♠4');
        });
        it('replaces !S4 with ♣', () => {
            expect(helpers.prepareArticleString('!S4')).toEqual('♠4');
        });
        it('replaces 4!d with ♦', () => {
            expect(helpers.prepareArticleString('4!d')).toEqual(`4<span className='red-suit'>♦</span>`);
        });
        it('replaces 4!D with ♦', () => {
            expect(helpers.prepareArticleString('4!D')).toEqual(`4<span className='red-suit'>♦</span>`);
        });
        it('replaces !d4 with ♦', () => {
            expect(helpers.prepareArticleString('!d4')).toEqual(`<span className='red-suit'>♦</span>4`);
        });
        it('replaces !D4 with ♦', () => {
            expect(helpers.prepareArticleString('!D4')).toEqual(`<span className='red-suit'>♦</span>4`);
        });
        it('replaces 4!h with ♥', () => {
            expect(helpers.prepareArticleString('4!h')).toEqual(`4<span className='red-suit'>♥</span>`);
        });
        it('replaces 4!H with ♥', () => {
            expect(helpers.prepareArticleString('4!H')).toEqual(`4<span className='red-suit'>♥</span>`);
        });
        it('replaces !h4 with ♥', () => {
            expect(helpers.prepareArticleString('!h4')).toEqual(`<span className='red-suit'>♥</span>4`);
        });
        it('replaces !H4 with ♥', () => {
            expect(helpers.prepareArticleString('!H4')).toEqual(`<span className='red-suit'>♥</span>4`);
        });
    });
});


describe("testing parseDocumentIntoJSX", () => {
    let re;
    beforeEach(() => {
        re = /<MakeBoard .* \/>/;
    });

    it("regex matches the MakeBoard string", () => {
        console.log(re);
        const alone = re.exec(`<MakeBoard boardType="single"
                          position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-"
                          South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-"
                          vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" />`);
        const spaces = re.exec(` <MakeBoard boardType="single"
                          position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-"
                          South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-"
                          vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" /> `);
        const punctuation = re.exec(`.<MakeBoard boardType="single"
                          position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-"
                          South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-"
                          vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" />.`);
        const inParagraph = re.exec(`Take the following auction. <MakeBoard boardType="single"
                             position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-"
                             South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-"
                             vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" />. Take the following auction.`);
    });

    it("Can parse an article properly, 1", () => {
        const result = helpers.parseDocumentIntoJSX(`<p>This article will recommend using short ♣ over better minor. It allows you to quickly get an accurate and helpful picture of your partner's hand as soon as possible in the auction. Before going into the recommendation, lets first take a brief look at some history.</p><p><strong>A brief history:</strong> Originally the "norm" in bridge was to open your longest suit. Your longest suit will be a minimum of 4 cards in length. After a while people started playing systems whereby openings of 1 Major indicated a 5 card holding. That led to a problem, for example when a player had &nbsp;4432 shape hand (4♠ 4<span className='red-suit'><span className='red-suit'>♥</span></span> and 32 in the minors). Previously players were opening their longest suits up the line - so they would open 1<span className='red-suit'><span className='red-suit'>♥</span></span>, however 5 card majors made that no longer possible. Therefore players had to open 1 of a minor with such hands.&nbsp;</p><p><br></p><p><strong>Bridge champions short club</strong>: The basic idea is to open 1♣ on all balanced hands that do not contain a 5 card major. That means that every 4432 or 4333 opens 1♣. This includes hands where you have 4<span className='red-suit'><span className='red-suit'>♦</span></span>. For example if you have 4♠ 3<span className='red-suit'><span className='red-suit'>♥</span></span> 4<span className='red-suit'><span className='red-suit'>♦</span></span> 2<span className='red-suit'><span className='red-suit'>♥</span></span> the suggested opening is 1♣ not 1<span className='red-suit'><span className='red-suit'>♦</span></span>!</p><p><strong>Advantages of this version of short ♣</strong></p><ul>  <li>Every time partner opens 1♣ you have a good idea that they have a balanced hand (11)12-14 which occurs approximately 80% of the time. The rest of the time partner may have 18-19 balanced or an unbalanced hand with clubs. Overall you will have a major edge in the bidding if you can get a feel for partner's hand early in the bidding. Also second bids become much more descriptive because they can instantly clarify that a hand is not balanced, indicating that the original 1♣ opening contained a 5 card suit (although sometimes 4441 shape is possible).&nbsp;</li>  <li>When your partner opens 1<span className='red-suit'><span className='red-suit'>♦</span></span> they will have at least 5 <span className='red-suit'><span className='red-suit'>♦</span></span>'s. There is 1 exception to this, partner may have 4441 shape in which case they would have 4<span className='red-suit'><span className='red-suit'>♦</span></span>'s. Knowing your partner has 5<span className='red-suit'><span className='red-suit'>♦</span></span> when they open 1<span className='red-suit'><span className='red-suit'>♦</span></span> instead of only knowing they hold 3<span className='red-suit'><span className='red-suit'>♦</span></span>'s (if you play better minor) can give you a huge advantage.&nbsp;</li>  <li>When partner opens 1<span className='red-suit'><span className='red-suit'>♦</span></span> they will very typically have an unbalanced hand unless the have 5 <span className='red-suit'><span className='red-suit'>♦</span></span>'s and 332 in the other suits (in fact it is reasonable to consider those hands as balanced and just open 1♣!). Knowing your partner is unbalanced is an advantage as subsequent bids become more descriptive (other short club systems that open 1<span className='red-suit'><span className='red-suit'>♦</span></span> with 4 card diamond suits do not share this advantage). Take the following auction. <MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" /> . Partner must have at least 5 <span className='red-suit'><span className='red-suit'>♦</span></span>'s and 4♠'s. You can already start to visualise the large potential of your hand. Your 5-4 trump fit, your Ax of <span className='red-suit'><span className='red-suit'>♦</span></span>'s opposite partner's 5 card diamonds is extremely useful for setting up the suit. Your ♣ shortage can help reduce losers in the suit. You should already seriously be thinking of game as a possibility and bid accordingly. Lets take a seriously sub minimum opening hand (7 points!!) for partner and see how easy game would be to make with 14 points total between the two hands.</li></ul><p>&nbsp;<MakeBoard boardType="double" position="North/South" North="*S-A1065*H-7*D-K10432*C-1043" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" /></p><p>If for example trumps break 4♠ will likely a cold contract. Draw 2 rounds of trumps then play AK of <span className='red-suit'><span className='red-suit'>♦</span></span>'s then ruff a <span className='red-suit'><span className='red-suit'>♦</span></span>. Eventually ruff 2 clubs for 11 tricks! (or if the <span className='red-suit'><span className='red-suit'>♦</span></span>'s didn't break then you will need to ruff 2<span className='red-suit'><span className='red-suit'>♦</span></span>'s and only have enough trumps for 1 ♣ ruff - 10 tricks). It is easy to visualise this and therefore bid accurately when 1<span className='red-suit'><span className='red-suit'>♦</span></span> is such a descriptive bid (showing 5+ <span className='red-suit'><span className='red-suit'>♦</span></span>'s almost all the time, and typically unbalanced).&nbsp;</p>`);
        const unbuggedResult = helpers.parseDocumentIntoJSX(`<p>This article will recommend using short ♣ over better minor. It allows you to quickly get an accurate and helpful picture of your partner's hand as soon as possible in the auction. Before going into the recommendation, lets first take a brief look at some history.</p><p><strong>A brief history:</strong></p><p>Originally the "norm" in bridge was to open your longest suit. Your longest suit will be a minimum of 4 cards in length. After a while people started playing systems whereby openings of 1 Major indicated a 5 card holding. That led to a problem, for example when a player had 4432 shape hand (4♠ 4<span className='red-suit'>♥</span> and 32 in the minors). Previously players were opening their longest suits up the line - so they would open 1<span className='red-suit'>♥</span>, however 5 card majors made that no longer possible. Therefore players had to open 1 of a minor with such hands.</p><p><strong>Bridge champions short club:</strong></p><p>The basic idea is to open 1♣ on all balanced hands that do not contain a 5 card major. That means that every 4432 or 4333 opens 1♣. This includes hands where you have 4<span className='red-suit'>♦</span>. For example if you have 4♠ 3<span className='red-suit'>♥</span> 4<span className='red-suit'>♦</span> 2<span className='red-suit'>♥</span> the suggested opening is 1♣ not 1<span className='red-suit'>♦</span>!</p><p><br></p><p><strong>Advantages of this version of short ♣:</strong></p><ul>  <li>Every time partner opens 1♣ you have a good idea that they have a balanced hand (11)12-14 which occurs approximately 80% of the time. The rest of the time partner may have 18-19 balanced or an unbalanced hand with clubs. Overall you will have a major edge in the bidding if you can get a feel for partner's hand early in the bidding. Also second bids become much more descriptive because they can instantly clarify that a hand is not balanced, indicating that the original 1♣ opening contained a 5 card suit (although sometimes 4441 shape is possible).</li>  <li>When your partner opens 1<span className='red-suit'>♦</span> they will have at least 5 <span className='red-suit'>♦</span>'s. There is 1 exception to this, partner may have 4441 shape in which case they would have 4<span className='red-suit'>♦</span>'s. Knowing your partner has 5<span className='red-suit'>♦</span> when they open 1<span className='red-suit'>♦</span> instead of only knowing they hold 3<span className='red-suit'>♦</span>'s (if you play better minor) can give you a huge advantage. When partner opens 1<span className='red-suit'>♦</span> they will very typically have an unbalanced hand unless the have 5 <span className='red-suit'>♦</span>'s and 332 in the other suits (in fact it is reasonable to consider those hands as balanced and just open 1♣!). Knowing your partner is unbalanced is an advantage as subsequent bids become more descriptive (other short club systems that open 1<span className='red-suit'>♦</span> with 4 card diamond suits do not share this advantage). Take the following auction.</li></ul><p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" /></p><ul>  <li>Partner must have at least 5 <span className='red-suit'>♦</span>'s and 4♠'s. You can already start to visualise the large potential of your hand. Your 5-4 trump fit, your Ax of <span className='red-suit'>♦</span>'s opposite partner's 5 card diamonds is extremely useful for setting up the suit. Your ♣ shortage can help reduce losers in the suit. You should already seriously be thinking of game as a possibility and bid accordingly. Lets take a seriously sub minimum opening hand (7 points!!) for partner and see how easy game would be to make with 14 points total between the two hands.</li></ul><p><br></p><p><MakeBoard boardType="double" position="North/South" North="*S-A1065*H-7*D-K10432*C-1043" East="*S-*H-*D-*C-" South="*S-K9872*H-109432*D-A3*C-8" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♦/P/1♥/P/1♠" /></p><p>If for example trumps break 4♠ will likely a cold contract. Draw 2 rounds of trumps then play AK of <span className='red-suit'>♦</span>'s then ruff a <span className='red-suit'>♦</span>. Eventually ruff 2 clubs for 11 tricks! (or if the <span className='red-suit'>♦</span>'s didn't break then you will need to ruff 2<span className='red-suit'>♦</span>'s and only have enough trumps for 1 ♣ ruff - 10 tricks). It is easy to visualise this and therefore bid accurately when 1<span className='red-suit'>♦</span> is such a descriptive bid (showing 5+ <span className='red-suit'>♦</span>'s almost all the time, and typically unbalanced).</p><p><br></p>`);
        // console.log(result);
        // console.log(unbuggedResult);
    });
});