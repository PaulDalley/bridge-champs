import React from 'react';
import './Walkthrough.css';
import $ from 'jquery';
import {Articles} from '../../containers/Articles';
// const stepsText = {
//     step1: {
//         header: "Articles",
//         content: "Fresh, high quality bridge content with new articles added regularly. Articles are nicely categorised by topic and by level so you can easily find what suits you.",
//         left: '25rem',
//         top: '22rem',
//         arrowPos: 'topLeft',
//     },
//     step2: {
//         header: "Tournaments",
//         content: "Expert analysis of the latest Bridge Tournaments covering all the most interesting hands.",
//         left: '25rem',
//         top: '25.5rem',
//         arrowPos: 'topLeft',
//     },
//     step3: {
//         header: "Quizzes",
//         content: "Regularly updated quizzes that will test your knowledge in Opening Leads, Bidding, Declarer and Defensive play. Take the quiz and then read analysis of the question. Compete to top the leaderboards and earn Champion Points.",
//         left: '25rem',
//         top: '29rem',
//         arrowPos: 'topLeft',
//     },
//     step4: {
//         header: "Article Category Shortcuts",
//         content: "These links give you short cuts to your favourite article categories.",
//         left: '25rem',
//         top: '32.5rem',
//         arrowPos: 'topLeft',
//     },
//     step5: {
//         header: "Filter as you like",
//         content: "These filters let you look for exactly what you are after. You can do a keyword search. You can select the appropriate difficulty ranging from Improver to Intermediate to Advanced, or General which is content that will interest players of any skill level. You can find your category of interest. And you can easily reset the filters with the reset button.",
//         left: '10rem',
//         top: '15rem',
//         arrowPos: 'top',
//         cb: (toggleSideNav, displayArticles) => {
//             // toggleSideNav();
//             displayArticles();
//         }
//     },
//     step6: {
//         header: "Article and Quiz list items",
//         content: "Each item in our content lists shows you a title, the date it was published, the difficulty level of its content, the category, and a bridge hand and position(s) that it is based upon.",
//         left: '10rem',
//         top: '65rem',
//         arrowPos: 'top',
//     }
// }

const stepsText = [
    // {
    //     header: "Main Navigation",
    //     content: "The main Navigation menu, Quick access content tabs, and Account related",
    //     left: '0rem',
    //     top: '9rem',
    //     // top: '23.5%',
    //     arrowPos: 'topCorner',
    // },
    {
        header: "Articles",
        content: "Fresh, high quality bridge content with new articles added regularly. Articles are nicely categorised by topic and by level so you can easily find what suits you.",
        left: '25rem',
        top: '25rem',
        // top: '23.5%',
        arrowPos: 'topLeft',
        // cb: (displayArticles, toggleSideNav) => toggleSideNav()
    },
    {
        header: "Quizzes",
        content: "Regularly updated quizzes that will test your knowledge in Opening Leads, Bidding, Declarer and Defensive play. Take the quiz and then read analysis of the question. Compete to top the leaderboards and earn Champion Points.",
        left: '25rem',
        top: '29rem',
        // top: '27.25%',
        arrowPos: 'topLeft',
    },
    {
        header: "Article Category Shortcuts",
        content: "These links give you short cuts to your favourite article categories without needing to go to articles and perform a filter by category.",
        left: '25rem',
        top: '32rem',
        // top: '30.55%',
        arrowPos: 'topLeft',
    },
    {
        header: "Tournaments",
        content: "These are a category of article providing expert analysis of the latest Bridge Tournaments and all the most interesting hands with articles grouped by Tournament Name and Date (coverage Coming Soon).",
        left: '25rem',
        top: '35.5rem',
        // top: "35%",
        arrowPos: 'topLeft',
    },
    {
        header: "Coming Soon",
        content: `Our goal is to make one of the most engaging and educational Bridge sites online. As site development continues and our user-base grows we want to add social and interactive elements. We will be adding many new features to the site. These are the next features to be added.`,
        left: '25rem',
        top: '40rem',
        // top: '39%',
        arrowPos: 'topLeft',
    },
    {
        header: "Free daily content",
        left: '0rem',
        top: '0rem',
        arrowPos: "none",
        content: "FREEDAILY"
    },
    // {
    //     header: "Submit a Question",
    //     content: "Create a hand, a board, a bidding situation, anything you like, and ask a question. You will be able to view the questions asked by other users, comment on them, and read answers from our experts.",
    //     left: '25rem',
    //     top: '40.5rem',
    //     // top: '39%',
    //     arrowPos: 'topLeft',
    // },
    // {
    //     header: "Play with and chat to other members",
    //     content: `We want to let you discuss content and play out the hands explored in articles and quizzes to cement your learning and make the learning process interactive and fun.`,
    //     left: '25rem',
    //     top: '46rem',
    //     // top: '39%',
    //     arrowPos: 'topLeft',
    // },
    {
        header: "Filter as you like",
        content: "These filters let you look for exactly what you are after. You can do a keyword search. You can select the appropriate difficulty ranging from Improver to Intermediate to Advanced, or General which is content that will interest players of any skill level. You can find your category of interest. And you can easily reset the filters with the reset button.",
        left: '10rem',
        top: '15rem',
        arrowPos: 'top',
        cb: (displayArticles, toggleSideNav) => displayArticles()
    },
    {
        header: "Article and Quiz list items",
        content: "Each item in our content lists shows you a title, the date it was published, the difficulty level of its content, the category, and a bridge hand and position(s) that it is based upon.",
        left: '10rem',
        top: '45rem',
        arrowPos: 'top',
    }
]

const totalNumSteps = stepsText.length;


class Walkthrough extends React.Component {
    addClassToModal = () => {
        this.setState({ modalOpen: true });
        setTimeout(() => {
            // console.log("ADDING ZINDEX CLASS");
            $("#modal_1").addClass('DailyFreeSingleton-Modal');
        }, 1500)
    }
    removeClassFromModal = () => {
        this.setState({ modalOpen: false });
        setTimeout(() => {
            // console.log("ADDING ZINDEX CLASS");
            $("#modal_1").removeClass('DailyFreeSingleton-Modal');
            $("#modal_1").removeClass('open');
            // $("#free_article_modal_trigger").click();
            // $("#free_quiz_modal_trigger").click();
        }, 1500)
    }

    openArticleModal = () => {
        // console.log('clicked article');
        // console.log($("#free_article_modal_trigger"));
        $("#free_article_modal_trigger").click();
        this.addClassToModal();
    };
    openQuizModal = () => {
        // console.log('clicked quiz');
        // console.log($("#free_quiz_modal_trigger"));
        $("#free_quiz_modal_trigger").click();
        this.addClassToModal();
    }

    toggleSideNav = () => {
        $('#toggle-side-nav').click();
    }
    exitWalkthrough = () => {
        // if (this.state.modalOpen) this.removeClassFromModal();
        this.toggleSideNav();
        this.props.exitWalkthrough();
    }
    gotoNextStep = () => {
        // console.log(this.state.step);
        // console.log(totalNumSteps);
        if (stepsText[this.state.step].content === "FREEDAILY") {
            this.removeClassFromModal();
        }

        if (this.state.step === (totalNumSteps - 1)) {
            this.exitWalkthrough();
        }
        this.setState((prevState) => ({step: prevState.step + 1}));
    }
    gotoPrevStep = () => {
        if (stepsText[this.state.step].content === "FREEDAILY") {
            this.removeClassFromModal();
        }

        if (this.state.step > 0) {
            if (this.state.step == 4) {
                // this.toggleSideNav();
                this.setState((prevState) => ({
                    step: prevState.step - 1,
                    showArticles: false,
                }));
            }
            else {
                this.setState((prevState) => ({
                    step: prevState.step - 1
                }));
            }
        }
    };

    displayArticles = () => {
        this.setState({showArticles: true});
    }

    state = {
        step: 0,
        showArticles: false,
        walkthroughSteps: stepsText.map((step, idx) => ((
            <WalkthroughStep stepNumber={idx + 1}
                             numSteps={totalNumSteps}
                             left={step.left}
                             top={step.top}
                             header={step.header}
                             content={step.content}
                             arrowPos={step.arrowPos}
                             exitWalkthrough={this.exitWalkthrough}
                             displayArticles={this.displayArticles}
                             toggleSideNav={this.toggleSideNav}
                             gotoNextStep={this.gotoNextStep}
                             gotoPrevStep={this.gotoPrevStep}
                             cb={step.cb}
                             openArticleModal={this.openArticleModal}
                             openQuizModal={this.openQuizModal}
                             removeClassFromModal={this.removeClassFromModal}
                             history={this.props.history}
            />
        ))),
        // walkthroughSteps: [
        //     <WalkthroughStep stepNumber={1}
        //                      numSteps={totalNumSteps}
        //                      left={stepsText.step1.left}
        //                      top={stepsText.step1.top}
        //                      header={stepsText.step1.header}
        //                      content={stepsText.step1.content}
        //                      arrowPos={stepsText.step1.arrowPos}
        //                      exitWalkthrough={this.exitWalkthrough}
        //                      gotoNextStep={this.gotoNextStep}
        //                      gotoPrevStep={this.gotoPrevStep}
        //     />,
        //     <WalkthroughStep stepNumber={2}
        //                      numSteps={totalNumSteps}
        //                      left={stepsText.step2.left}
        //                      top={stepsText.step2.top}
        //                      header={stepsText.step2.header}
        //                      content={stepsText.step2.content}
        //                      arrowPos={stepsText.step2.arrowPos}
        //                      exitWalkthrough={this.exitWalkthrough}
        //                      gotoNextStep={this.gotoNextStep}
        //                      gotoPrevStep={this.gotoPrevStep}
        //     />,
        //     <WalkthroughStep stepNumber={3}
        //                      numSteps={totalNumSteps}
        //                      left={stepsText.step3.left}
        //                      top={stepsText.step3.top}
        //                      header={stepsText.step3.header}
        //                      content={stepsText.step3.content}
        //                      arrowPos={stepsText.step3.arrowPos}
        //                      exitWalkthrough={this.exitWalkthrough}
        //                      gotoNextStep={this.gotoNextStep}
        //                      gotoPrevStep={this.gotoPrevStep}
        //     />,
        //     <WalkthroughStep stepNumber={4}
        //                      numSteps={totalNumSteps}
        //                      left={stepsText.step4.left}
        //                      top={stepsText.step4.top}
        //                      header={stepsText.step4.header}
        //                      content={stepsText.step4.content}
        //                      arrowPos={stepsText.step4.arrowPos}
        //                      exitWalkthrough={this.exitWalkthrough}
        //                      gotoNextStep={this.gotoNextStep}
        //                      gotoPrevStep={this.gotoPrevStep}
        //     />,
        //     <WalkthroughStep stepNumber={5}
        //                      numSteps={totalNumSteps}
        //                      left={stepsText.step5.left}
        //                      top={stepsText.step5.top}
        //                      header={stepsText.step5.header}
        //                      content={stepsText.step5.content}
        //                      arrowPos={stepsText.step5.arrowPos}
        //                      exitWalkthrough={this.exitWalkthrough}
        //                      gotoNextStep={this.gotoNextStep}
        //                      gotoPrevStep={this.gotoPrevStep}
        //                      cb={ () => stepsText.step5.cb(this.toggleSideNav, this.displayArticles) }
        //     />,
        //     <WalkthroughStep stepNumber={6}
        //                      numSteps={totalNumSteps}
        //                      left={stepsText.step6.left}
        //                      top={stepsText.step6.top}
        //                      header={stepsText.step6.header}
        //                      content={stepsText.step6.content}
        //                      arrowPos={stepsText.step6.arrowPos}
        //                      exitWalkthrough={this.exitWalkthrough}
        //                      gotoNextStep={this.gotoNextStep}
        //                      gotoPrevStep={this.gotoPrevStep}
        //     />,
        //
        //
        // ],
    }


    componentDidMount() {
        this.toggleSideNav();
    }

    render() {
        // const isMobileSize = window.innerWidth <= 672;

        return (
            <div className="Walkthrough-container">
                <div className="Walkthrough-container-background"
                    // onClick={() => this.exitWalkthrough() }
                >
                </div>
                { this.state.walkthroughSteps[this.state.step] }

                {(this.state.showArticles &&
                this.state.step >= stepsText.findIndex(el => el.header === "Filter as you like")) &&
                <div className="Walkthrough-articles"
                    // onClick={() => this.exitWalkthrough() }
                >
                    <Articles
                        articles={this.props.articles}
                        location={{search: '?page1'}}
                        history={this.props.history}
                        dontNavigate={true}
                    />
                </div>}


            </div>
        )
    }
}
;
export default Walkthrough;

export const WalkthroughStep = ({cb,
                                    history,
                                    openArticleModal,
                                    removeClassFromModal,
                                    openQuizModal,
                                    displayArticles,
                                    toggleSideNav,
                                    arrowPos,
                                    gotoNextStep,
                                    gotoPrevStep,
                                    stepNumber,
                                    numSteps,
                                    left,
                                    top,
                                    header,
                                    content,
                                    exitWalkthrough}) => {
    // console.log(header);
    // console.log(content);
    if (cb) cb(displayArticles, toggleSideNav);

    return (
        <div className="Walkthrough-stepBox"
             style={{
                 position: 'relative',
                 top: top,
                 left: left,
             }}
        >
            <div className={`Walkthrough-arrow-${arrowPos}`}></div>

            <div className="Walkthrough-close"
                 onClick={() => exitWalkthrough() }
            >
                <i className="material-icons">close</i>
            </div>
            <div className="Walkthrough-stepBox-header">{header}</div>
            <hr style={{
                textAlign: 'center',
                backgroundColor: "#8d0018",
                height: '.45rem',
                width: "95%",
                fontSize: "3rem",
            }}/>


            {content !== "FREEDAILY" && <div>{content}</div> }
            {content === "FREEDAILY" && <div>
                Take the <a style={{cursor: 'pointer'}}
                onClick={(e) => {e.preventDefault(); openQuizModal(); }}>
                Free Quiz
                </a> of the day.
                {/*and read the <a onClick={(e) => {e.preventDefault(); openArticleModal(); }}>*/}
                {/*Free Article</a> of the day.*/}
            </div> }


            <br />
            <div className="Walkthrough-back-next">

                {stepNumber > 1 && <span onClick={() => gotoPrevStep() } className="Walkthrough-step-back">Back&nbsp;&nbsp;&nbsp;</span>}

                {stepNumber !== numSteps &&
                    <span onClick={() => gotoNextStep() }
                          className="Walkthrough-step-next">Next {stepNumber}/{numSteps}</span>
                }
                {stepNumber === numSteps &&
                    <span onClick={() => gotoNextStep() }
                          className="Walkthrough-step-next">Done</span>
                }  {stepNumber === numSteps &&
                <span onClick={() => {toggleSideNav(); history.push('/membership') }}
                      className="Walkthrough-step-next Walkthrough-step-last">
                    Sign up
                </span>
                }
           </div>

        </div>
    )
}

