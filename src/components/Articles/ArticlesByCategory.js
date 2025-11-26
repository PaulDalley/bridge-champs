import React, {Component} from 'react';
import {connect} from 'react-redux';
import Add from '../../containers/Add';
import {getArticles, fetchArticlesByCategory, getArticlesChunk, getArticleCount, setCurrentArticle } from '../../store/actions/articlesActions';
import { filterArticles, urlToCategory } from '../../helpers/helpers';
import ArticleListItem from './ArticleListItem';
import Filters from '../../containers/Filters';
import { CardPanel } from 'react-materialize';
import Pagination from '../Pagination';

class ArticlesByCategory extends Component {
    state = {
        pageOfItems: [],
        articles: this.props.articles,
    }
    componentDidMount() {
        // console.log(this.props);
        if (this.state.articles.length === 0) {
            // this.props.fetchArticles();
            const category = urlToCategory(this.props.location.pathname.slice(1));
            this.props.fetchArticlesByCategory(category);
        }
    }
    setCurrentArticleAndGoTo = (article, id) => {
        this.props.setCurrentArticle(article);
        this.props.history.push(`/article/${id}`);
    };


    componentWillReceiveProps(nextProps) {
        // console.log("ARTICLE DATA SHOULD BE ARRIVING");
        // console.log(nextProps.articles);
        this.setState({articles: nextProps.articles});
    }
    onChangePage = (pageOfItems) => {
        // update state with new page of items
        this.setState({
            pageOfItems
        })
    };


    render() {
        const pagination =  (<Pagination items={this.state.articles} onChangePage={this.onChangePage} />);
        let articleJSX;
        if (this.state.articles.length !== 0) {
            articleJSX = this.state.pageOfItems.map((article, idx) => (
                <ArticleListItem key={article.id}
                                 createdAt={article.createdAt}
                                 body={article.body}
                                 category={article.category}
                                 difficulty={article.difficulty}
                                 id={article.id}
                                 teaser={article.teaser}
                                 teaser_board={article.teaser_board}
                                 title={article.title}
                                 router={this.props.history}
                                 a={this.props.a}
                                 clickHandler={this.setCurrentArticleAndGoTo}/>
            ));
        }

        const isMobileSize = window.innerWidth <= 672;
        let articleJSXLeft;
        let articleJSXRight;
        if (articleJSX && !isMobileSize) {
            articleJSXLeft = articleJSX.filter((article, idx) => idx % 2 === 0);
            articleJSXRight = articleJSX.filter((article, idx) => idx % 2 !== 0);
        }
        return (
            <div className="Articles-outer_div">
                {/*<CardPanel className="Articles-filters">*/}
                    {/*<Filters page="articles"/>*/}
                {/*</CardPanel>*/}
                <Add goto="create/article" history={this.props.history}/>

                {this.props.articles.length > 0 &&
                <div className="Articles-Pagination center-align">
                    {pagination}
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

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    articles: filterArticles(state.articles.articles, {category: urlToCategory(ownProps.location.pathname.slice(1))}),
    articlesCount: state.articles.articlesCount,
    a: state.auth.a,
});

const mapDispatchToProps = (dispatch) => ({
    fetchArticles: () => dispatch(getArticles()),
    fetchArticlesByCategory: (category) => dispatch(fetchArticlesByCategory(category)),
    // getArticleCount: () => dispatch(getArticleCount()),
    setCurrentArticle: (article) => dispatch(setCurrentArticle(article))
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesByCategory);