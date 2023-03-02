import React, {Component} from 'react';
import {connect} from 'react-redux';
import Add from './Add';
import {submitQuestion, getArticles, getArticlesChunk, getArticleCount, setCurrentArticle } from '../store/actions/questionsActions';
import { filterArticles } from '../helpers/helpers';
import QuestionListItem from '../components/Questions/QuestionListItem';
import Filters from './Filters';
import { CardPanel, Button } from 'react-materialize';
import Pagination from '../components/Pagination';
import AskQuestion from '../components/Questions/AskQuestion';
import './Questions.css';

const QuestionsX = [
    {
        title: "How do I do xyz and such?",
        board: `<MakeBoard boardType="single" position="North" North="*S-Q10842*H-K93*D-AJ*C-AK2" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♠/P/4♣/P" />`,
        text: "This is a question. I am asking you a question. Hello there Mr. BridgeChampions.com, can you answer my really intelligible bridge question? it is an interest question and lots of people would want to know the answer to this amazing question and such. Please answer my question and so forth. Thank you.",
        createdAt: new Date(),
    },
    {
        title: "How do I do xyz and such?",
        board: `<MakeBoard boardType="single" position="North" North="*S-Q10842*H-K93*D-AJ*C-AK2" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♠/P/4♣/P" />`,
        text: "This is a question. I am asking you a question. Hello there Mr. BridgeChampions.com, can you answer my really intelligible bridge question? it is an interest question and lots of people would want to know the answer to this amazing question and such. Please answer my question and so forth. Thank you.",
        createdAt: new Date(),
    },
    {
        title: "How do I do xyz and such?",
        board: `<MakeBoard boardType="single" position="North" North="*S-Q10842*H-K93*D-AJ*C-AK2" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♠/P/4♣/P" />`,
        text: "This is a question. I am asking you a question. Hello there Mr. BridgeChampions.com, can you answer my really intelligible bridge question? it is an interest question and lots of people would want to know the answer to this amazing question and such. Please answer my question and so forth. Thank you.",
        createdAt: new Date(),
    },
    {
        title: "How do I do xyz and such?",
        board: `<MakeBoard boardType="single" position="North" North="*S-Q10842*H-K93*D-AJ*C-AK2" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♠/P/4♣/P" />`,
        text: "This is a question. I am asking you a question. Hello there Mr. BridgeChampions.com, can you answer my really intelligible bridge question? it is an interest question and lots of people would want to know the answer to this amazing question and such. Please answer my question and so forth. Thank you.",
        createdAt: new Date(),
    },
    {
        title: "How do I do xyz and such?",
        board: `<MakeBoard boardType="single" position="North" North="*S-Q10842*H-K93*D-AJ*C-AK2" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♠/P/4♣/P" />`,
        text: "This is a question. I am asking you a question. Hello there Mr. BridgeChampions.com, can you answer my really intelligible bridge question? it is an interest question and lots of people would want to know the answer to this amazing question and such. Please answer my question and so forth. Thank you."
    },
    {
        title: "How do I do xyz and such?",
        board: `<MakeBoard boardType="single" position="North" North="*S-Q10842*H-K93*D-AJ*C-AK2" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♠/P/4♣/P" />`,
        text: "This is a question. I am asking you a question. Hello there Mr. BridgeChampions.com, can you answer my really intelligible bridge question? it is an interest question and lots of people would want to know the answer to this amazing question and such. Please answer my question and so forth. Thank you.",
        createdAt: new Date(),
    },
    {
        title: "How do I do xyz and such?",
        board: `<MakeBoard boardType="single" position="North" North="*S-Q10842*H-K93*D-AJ*C-AK2" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♠/P/4♣/P" />`,
        text: "This is a question. I am asking you a question. Hello there Mr. BridgeChampions.com, can you answer my really intelligible bridge question? it is an interest question and lots of people would want to know the answer to this amazing question and such. Please answer my question and so forth. Thank you.",
        createdAt: new Date(),
    },
];


class Questions extends Component {
    // title: this.state.title,
    // category: this.state.category,
    // teaser: this.state.teaser,
    // createdAt: ...
    // board/hand..

    state = {
        pageOfItems: [],
        articles: [],
    }

    componentDidMount() {
        console.log(this.props.articles);
        // this.props.fetchArticles();
    }

    setCurrentArticleAndGoTo = (article, id) => {
        this.props.setCurrentArticle(article);
        this.props.history.push(`/article/${id}`);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ articles: nextProps.articles });
    }

    onChangePage = (pageOfItems) => {
        this.setState({
            pageOfItems
        });
    };


    render() {
        console.log(this.state.articles);
        const questions = QuestionsX;
        const pagination =  (<Pagination items={questions}
                                         onChangePage={this.onChangePage} />);
        let articleJSX;
        // if (this.state.articles.length !== 0) {
            // articleJSX = this.state.pageOfItems.map((article, idx) => (
            // articleJSX = this.state.articles.map((article, idx) => (
        articleJSX = questions.map((article, idx) => (
                <QuestionListItem key={article.id}
                                 createdAt={article.createdAt}
                                 body={article.body}
                                 category={article.category}
                                 difficulty={article.difficulty}
                                 id={article.id}
                                 text={article.text}
                                 teaser_board={article.board}
                                 title={article.title}
                                 router={this.props.history}
                                 a={this.props.a}
                                 clickHandler={this.setCurrentArticleAndGoTo}/>
            ));

        // console.log(articleJSX.length);

        // let len = articleJSX.length / 2;
        // let articleJSXLeft = articleJSX.filter((article, idx) => idx < len);
        // let articleJSXRight = articleJSX.filter((article, idx) => idx >= len);
        const isMobileSize = window.innerWidth <= 672;
        let articleJSXLeft;
        let articleJSXRight;
        if (articleJSX && !isMobileSize) {
            articleJSXLeft = articleJSX.filter((article, idx) => idx % 2 === 0);
            articleJSXRight = articleJSX.filter((article, idx) => idx % 2 !== 0);
        }
        // console.log(window.innerWidth);
        // console.log(isMobileSize);

        return (
            <div className="Articles-outer_div">
               {/*<Filters page="articles"/>*/}


                <div>
                    <AskQuestion submitQuestion={this.props.submitQuestion}
                                 uid={this.props.uid}
                    />
                </div>

                {this.props.articles.length > 0 &&
                <div className="Articles-Pagination center-align">
                    {pagination}
                    {/*<Pagination items={this.props.articles} onChangePage={this.onChangePage} />*/}
                </div>}

                {!isMobileSize &&
                <div className="Articles-container">

                    <div className="Articles-container-left">
                        {articleJSXLeft}
                    </div>
                    <div className="Articles-container-right">
                        {articleJSXRight}
                    </div>
                </div>
                }
                {isMobileSize &&
                <div className="Articles-container">
                    { articleJSX }
                </div>
                }


                <br />
                <br />



                {/*Hello from articles*/}
                {/*<ul className="pagination">*/}
                {/*<li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>*/}
                {/*<li className="active"><a href="#!">1</a></li>*/}
                {/*<li className="waves-effect"><a href="#!">2</a></li>*/}
                {/*<li className="waves-effect"><a href="#!">3</a></li>*/}
                {/*<li className="waves-effect"><a href="#!">4</a></li>*/}
                {/*<li className="waves-effect"><a href="#!">5</a></li>*/}
                {/*<li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>*/}
                {/*</ul>*/}

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    // articles: filterArticles(state.articles.articles, state.filters),
    articles: QuestionsX,
    articlesCount: state.articles.articlesCount,
    a: state.auth.a,
    uid: state.auth.uid,
});

const mapDispatchToProps = (dispatch) => ({
    submitQuestion: (data) => dispatch(submitQuestion(data)),
    fetchArticles: () => dispatch(getArticles()),
    getArticleCount: () => dispatch(getArticleCount()),
    setCurrentArticle: (article) => dispatch(setCurrentArticle(article))
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions);