import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getArticle,
  getArticleMetadata,
} from "../../store/actions/articlesActions";
import { Markup } from "interweave";
import "./DisplayArticle.css";
import {
  parseDocumentIntoJSX,
  makeDateString,
  findArticleById,
  makeBoardObjectFromString,
  getDifficultyStr,
} from "../../helpers/helpers";
import MakeBoard from "../../components/BridgeBoard/MakeBoard";
import { Col, ProgressBar } from "react-materialize";
import Comments from "../Comments/Comments";

export class DisplayArticle extends Component {
  componentDidMount() {
    if (!this.props.haveData) {
      const articleId = this.props.match.params.id;
      const articleType = this.props?.articleType;
      this.props.getArticle(articleId, this.props.history, articleType);
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  render() {
    // console.log(this.props.article);
    const articleId = this.props.match.params.id;
    // console.log(articleId);
    // console.log(this.props.quizMetadata.id);
    // console.log(this.props.quizMetadata.body);
    let article;
    let articleText;
    if (this.props.article) {
      // console.log(articleId);
      article = this.props.article[this.props.match.params.id];
      // console.log(this.props.article);
      // console.log(this.props.match.params.id);
      // console.log(article);
      if (article) articleText = article.text;
    }
    // console.log("should be article here:");
    // console.log(this.props.article);
    // console.log("ARTICLE CONTENT:");
    // console.log(article);

    // if (this.props.articleMetadata) {
    //     console.log("SOMETHING HERE");
    // }

    let articleMetadata = {};
    if (this.props.articleMetadata) {
      articleMetadata = this.props.articleMetadata;
    } else {
      articleMetadata = findArticleById(this.props.articles, articleId);
    }
    if (!articleMetadata) {
      this.props.getArticleMetadata(articleId);
    }

    const bindings = {};
    const re = /<MakeBoard .* \/>/;
    let matches;
    let articleDataArray = [];
    let curIdx = 0;
    let id = 0;
    let strRemaining;
    if (articleText) {
      // console.log("FULL ARTICLE TEXT");
      // console.log(articleText);
      // console.log(articleText.split(/(<MakeBoard .* \/>)/));
      articleDataArray = parseDocumentIntoJSX(articleText);
      // console.log(articleDataArray);

      // strRemaining = articleText.slice(curIdx);
      // do {
      //     strRemaining = strRemaining.slice(curIdx);
      //     matches = re.exec(strRemaining);
      //     // console.log(matches);
      //     if (matches) {
      //         let boardStrLen = matches[0].length;
      //         let strBefore = matches.input.slice(0, matches.index);
      //         let boardStr = matches[0];
      //         curIdx = matches.index + boardStrLen;
      //         // console.log(matches);
      //         // console.log("1:::")
      //         // console.log(matches[0]);
      //         // console.log("2:::")
      //         // console.log(matches.index)
      //         // console.log("3:::")
      //         // console.log(matches.input)
      //         articleDataArray.push(<Markup key={id} content={strBefore}/>);
      //         id += 1
      //         articleDataArray.push(
      //             <div key={id} className="Display-board_container">
      //
      //                 <MakeBoard {...makeBoardObjectFromString(boardStr, true)} />
      //             </div>
      //         );
      //         id += 1
      //     }
      // } while (matches);
      // articleDataArray.push(<Markup key={id+1} content={strRemaining} />);
    }
    // console.log(articleDataArray);
    // console.log(article);
    // console.log(this.props);
    if (!article) {
      return (
        <div className="DisplayArticle-container">
          <Col s={12}>
            <ProgressBar />
          </Col>
        </div>
      );
    }
    // console.log("--- Article MetaData ---");
    // console.log(articleMetadata);

    return (
      <div className="DisplayArticle-container">
        {articleMetadata && (
          <div>
            <h3 className="DisplayArticle-title">{articleMetadata.title}</h3>
            <div className="DisplayArticle-category">
              {articleMetadata.category}
            </div>
            <div
              className={`DisplayArticle-difficulty ArticlesListItem-difficulty-${articleMetadata.difficulty}`}
            >
              {getDifficultyStr(articleMetadata.difficulty)}
            </div>
            <div className="DisplayArticle-createdAt">
              {makeDateString(articleMetadata.createdAt)}
            </div>
          </div>
        )}
        {articleDataArray}
        {/*<div dangerouslySetInnerHTML={{__html: articleText }}>*/}
        {/*</div>*/}

        {/*<Markup matchers={[new MyMatcher('MakeBoard')]} content={articleText}/>*/}

        {/*<JsxParser*/}
        {/*bindings={bindings}*/}
        {/*components={{ MakeBoard }}*/}
        {/*jsx={ articleText }*/}
        {/*/>*/}
        {this.props.article && (
          <Comments
            uid={this.props.uid}
            username={this.props.username}
            displayName={this.props.displayName}
            photoURL={this.props.photoURL}
            parentId={this.props.article.id}
          />
        )}
      </div>
    );
  }
}
// const mapStateToProps = (state, ownProps) => ({
//     article: state.articles.article,
//     articlesCount: state.articles.articlesCount,
// });
//
// export default connect(
//     mapStateToProps,
//     { getArticle })
// (DisplayArticle);

export default connect(
  (state) => ({
    uid: state.auth.uid,
    username: state.auth.username,
    displayName: state.auth.displayName,
    photoURL: state.auth.photoURL,
    articles: state.articles.articles,
    article: state.articles.article,
    articleMetadata: state.articles.currentArticle,
  }),
  { getArticle, getArticleMetadata }
)(DisplayArticle);

// export default DisplayArticle;
