import React from "react";
import QuizListItem from "../Quizzes/QuizListItem";
import ArticleListItem from "../Articles/ArticleListItem";
import { DisplayQuiz } from "../Quizzes/DisplayQuiz";
import { DisplayArticle } from "../Articles/DisplayArticle";
import { setCurrentArticle } from "../../store/actions/articlesActions";
import { setCurrentQuiz } from "../../store/actions/quizzesActions";
import { freeDailyRef } from "../../firebase/config";
import { connect } from "react-redux";
import {
  Modal,
  Collapsible,
  CollapsibleItem,
  ProgressBar,
  Col,
} from "react-materialize";
import $ from "jquery";
import "./DailyFreeSingleton.css";

class DailyFreeSingleton extends React.Component {
  state = {
    article: {},
    quiz: {},
    loaded: false,
  };

  componentDidMount() {
    // $('#8d0018')
    let toggle = false;
    // let collapsibleHeaders = $('.collapsible-header');
    // collapsibleHeaders.each((idx, el) => ($(el).attr('id', `DailyFreeSingleton-${idx}`)));
    // // console.log(collapsibleHeaders);
    // $('#DailyFreeSingleton-0').click(
    //     () => {
    //         setTimeout(() => {
    //             if (!toggle) {
    //                 // 43.5
    //                 // $('.DailyFreeSingleton-icons-external-div-second').css('opacity', '0');
    //                 $('.DailyFreeSingleton-icons-external-div-second').css('top', '55.25rem');
    //                 // $('.DailyFreeSingleton-icons-external-div-second').css('transform', 'translateX(38.05rem)');
    //                 toggle = !toggle;
    //             }
    //             else {
    //                 // 5.2
    //                 $('.DailyFreeSingleton-icons-external-div-second').css('top', '17.2rem');
    //                 // $('.DailyFreeSingleton-icons-external-div-second').css('transform', 'translateX(0)');
    //                 // $('.DailyFreeSingleton-icons-external-div-second').css('opacity', '1');
    //                 toggle = !toggle;
    //             }
    //         }, 120);
    //     }
    // )
    // $('#DailyFreeSingleton-0').hover(
    //     () => {
    //         $('#DailyFreeSingleton-icon-article').css('color', '#8d0018');
    //     }
    // )
    // $('#DailyFreeSingleton-0').mouseleave(
    //     () => {
    //         $('#DailyFreeSingleton-icon-article').css('color', 'black');
    //     }
    // )
    // $('#DailyFreeSingleton-1').hover(
    //     () => {
    //         $('#DailyFreeSingleton-icon-quiz').css('color', '#8d0018');
    //     }
    // )
    // $('#DailyFreeSingleton-1').mouseleave(
    //     () => {
    //         $('#DailyFreeSingleton-icon-quiz').css('color', 'black');
    //     }
    // )

    return freeDailyRef.get().then((snapshot) => {
      // console.log(snapshot);
      const data = {};
      snapshot.forEach((childSnapshot) => {
        let key = childSnapshot.id;
        // console.log(key);
        let childData = childSnapshot.data();
        // console.log(childData);
        data[key] = childData;
        // console.log(" I HAVE CHILD DATA HERE");
        // console.log(childData.subcategory);
      });
      data["loaded"] = true;
      // console.log(data);
      this.setState({ ...data });
    });
  }

  openArticleModal = () => {
    // console.log('clicked article');
    // console.log($("#free_article_modal_trigger"));
    $("#free_article_modal_trigger").click();
  };
  openQuizModal = () => {
    // console.log('clicked quiz');
    // console.log($("#free_quiz_modal_trigger"));
    $("#free_quiz_modal_trigger").click();
  };

  // shouldComponentUpdate() {
  //     return true;
  // }
  // setCurrentXAndGoTo = (data, id, type) => {
  //     const {text, ...rest} = data;
  //     this.props.setCurrentArticle(data);
  //     this.props.history.push(`/${type}/${id}`);
  // };

  render() {
    const { article, quiz } = this.state;
    let articleJSX;
    let quizJSX;
    let quizDisplayJSX;
    let articleDisplayJSX;
    if (this.state.loaded) {
      const {
        body: quizBodyId,
        answer,
        answers,
        question,
        ...quizMetadata
      } = quiz;
      quizMetadata.body = quizBodyId;

      quizDisplayJSX = (
        <Modal
          className="modal-fixed-footer DailyFreeSingleton-Modal"
          style={{
            width: "100vw",
            minWidth: "100vw",
            // height: "85vh",
            // minHeight: "85vh",
            // position: "absolute",
            // top: "10rem",
          }}
          trigger={
            <button
              id="free_quiz_modal_trigger"
              style={{ opacity: 0, zIndex: -1 }}
            >
              btn
            </button>
          }
        >
          <DisplayQuiz
            quizMetadata={quizMetadata}
            match={{ params: { id: quizBodyId } }}
            quiz={{ [quizBodyId]: { answer, answers, question } }}
            submitted={false}
            quizScores={{}}
            quizScoresFetched={true}
            haveData={true}
            dailyFree={true}
            startSubmitUserQuizScore={() => {}}
            dontScrollTop={true}
          />
        </Modal>
      );

      const { body: articleId, text, ...articleMetadata } = article;
      articleMetadata.body = articleId;
      // console.log(articleMetadata.id);
      // console.log(articleId);

      // const articleId = article.id;

      // console.log(text);
      // console.log(articleMetadata);
      // console.log(articleId);

      articleDisplayJSX = (
        <Modal
          className="modal-fixed-footer DailyFreeSingleton-Modal"
          style={{
            width: "100vw",
            minWidth: "100vw",
            height: "100vh",
            minHeight: "100vh",
          }}
          trigger={
            <button
              id="free_article_modal_trigger"
              style={{ opacity: 0, zIndex: -1 }}
            >
              btn
            </button>
          }
        >
          <DisplayArticle
            articleMetadata={articleMetadata}
            match={{ params: { id: articleId } }}
            article={{ [articleId]: { text } }}
            haveData={true}
          />
        </Modal>
      );

      articleJSX = (
        <ArticleListItem
          createdAt={article.createdAt}
          body={article.body}
          category={article.category}
          difficulty={article.difficulty}
          id={article.id}
          teaser={article.teaser}
          teaser_board={article.teaser_board}
          title={article.title}
          clickHandler={this.openArticleModal}
        />
      );
      quizJSX = (
        <QuizListItem
          date={quiz.date}
          body={quiz.body}
          quizType={quiz.quizType}
          id={quiz.id}
          teaser={quiz.teaser}
          teaser_board={quiz.teaser_board}
          title={quiz.title}
          difficulty={quiz.difficulty}
          clickHandler={this.openQuizModal}
        />
      );
    }

    if (!this.state.loaded) {
      return (
        <div
          className="DisplayArticle-container"
          style={{ minHeight: "100vh" }}
        >
          <Col s={12}>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <ProgressBar />
          </Col>
        </div>
      );
    }

    let shizzle = false;
    if (shizzle) {
      return (
        <div className="DailyFreeSingleton-container">
          <div className="DailyFreeSingleton-icons-external-div">
            <i
              className="DailyFreeSingleton-item-icon far fa-newspaper"
              id="DailyFreeSingleton-icon-article"
            ></i>
          </div>
          <div className="DailyFreeSingleton-icons-external-div DailyFreeSingleton-icons-external-div-second">
            <i
              className="DailyFreeSingleton-item-icon DailyFreeSingleton-item-icon-quiz far fa-question-circle"
              id="DailyFreeSingleton-icon-quiz"
            ></i>
          </div>
          <Collapsible defaultActiveKey={false}>
            <CollapsibleItem
              header={`Daily free article`}
              style={{ zIndex: "1000" }}
              className="DailyFreeSingleton-item"
            >
              {articleJSX}
            </CollapsibleItem>
            <CollapsibleItem
              header="Daily free quiz"
              style={{ zIndex: "1000" }}
              className="DailyFreeSingleton-item"
              // id="DailyFreeSingleton-quiz"
            >
              {quizJSX}
            </CollapsibleItem>
          </Collapsible>
          {quizDisplayJSX}
          {articleDisplayJSX}
        </div>
      );
    } else {
      return (
        <div
        //     style={{margin: '0',
        //     padding: '0', marginBottom: '3rem',
        //     paddingBottom: '3rem', width: '100%',
        //     position: 'relative', right: '12.5rem',
        // }}
        >
          <div className="DailyFreeSingleton-containerTwo">
            <div className="DailyFreeSingleton-singleItem">
              {/*onClick={() => this.openArticleModal()}>*/}
              <div className="DailyFreeSingleton-item_header">
                <i
                  className="DailyFreeSingleton-item-iconTwo far fa-newspaper"
                  id="DailyFreeSingleton-icon-article"
                ></i>
                Free Daily Article
              </div>
              <div className="DailyFreeSingleton-item_body">{articleJSX}</div>
            </div>
            <div className="DailyFreeSingleton-singleItem DailyFreeSingleton-quizItem">
              {/*onClick={() => this.openQuizModal()}>*/}
              <div className="DailyFreeSingleton-item_header">
                <i
                  className="DailyFreeSingleton-item-iconTwo DailyFreeSingleton-item-icon-quiz far fa-question-circle"
                  id="DailyFreeSingleton-icon-quiz"
                ></i>
                Free Daily Quiz
              </div>
              <div className="DailyFreeSingleton-item_body">{quizJSX}</div>
            </div>
          </div>
          <div className="HomePage-SeparationLine DailyFreeSingleton-SeparationLine"></div>
          {quizDisplayJSX}
          {articleDisplayJSX}
        </div>
      );
    }
  }
}

export default DailyFreeSingleton;
// const
//     mapDispatchToProps = (dispatch) => ({
//         setCurrentArticle: (article) => dispatch(setCurrentArticle(article)),
//         setCurrentQuiz: (quiz) => dispatch(setCurrentQuiz(quiz)),
//     });
//
// export default connect(
//     null,
//     mapDispatchToProps)(DailyFreeSingleton);
