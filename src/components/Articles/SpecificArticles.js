import React, {Component} from 'react';
import {connect} from 'react-redux';
import ArticleListItem from './ArticleListItem';
import { setCurrentArticle } from '../../store/actions/articlesActions';

class SpecificArticles extends Component {
    setCurrentArticleAndGoTo = (article, id) => {
        this.props.setCurrentArticle(article);
        this.props.history.push(`/article/${id}`);
    };

     render() {
         if (!this.props.tournamentArticles) {
             this.props.history.push('/tournaments');
         }

        //  console.log(this.props.match.params.tournamentName);
         let tournamentName = this.props.match.params.tournamentName.split("_").join(" ");
        //  console.log(tournamentName);
        //  console.log(this.props.tournamentArticles[tournamentName]);
    //      console.log(this.props.tournamentArticles);
         let relevantArticles = this.props.tournamentArticles[tournamentName];

        let articleJSX = relevantArticles.map((article, idx) => (
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

        let articleJSXLeft = articleJSX.filter((article, idx) => idx%2===0);
        let articleJSXRight = articleJSX.filter((article, idx) => idx%2!==0);

        return (
            <div className="Articles-outer_div">
                <div className="Articles-container">
                    <div className="Articles-container-left">
                        {articleJSXLeft}
                    </div>
                    <div className="Articles-container-right">
                        {articleJSXRight}
                    </div>
                </div>


                <br />
                <br />

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    tournamentArticles: state.articles.tournamentArticles,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentArticle: (article) => dispatch(setCurrentArticle(article))
});

export default connect(mapStateToProps, mapDispatchToProps)(SpecificArticles);