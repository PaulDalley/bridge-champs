import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { withRouter } from "../hoc/withRouter";
import {
  findQuizById,
  replaceSuitMacros,
  prepareArticleString,
} from "../helpers/helpers";
import {
  startAddArticle,
  startEditArticle,
  getArticle,
  startDeleteArticle,
} from "../store/actions/articlesActions";
import {
  Row,
  TextInput,
  Select,
  Button,
  Icon,
  Toast,
  Col,
  Modal,
  Textarea,
  DatePicker,
} from "react-materialize"; // Input component deprecated
import { categoriesRef } from "../firebase/config";
import "./CreateArticle.css";
import $ from "jquery";

import GenerateBridgeBoard from "../components/BridgeBoard/GenerateBridgeBoard";

import RichTextEditor from "react-rte";

// import firebase from "firebase";
// import Firepad from "firepad";
// import CodeMirror from 'codemirror';

class CreateArticle extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = {
  //         article: RichTextEditor.createEmptyValue()
  //     };
  // }
  state = {
    article: RichTextEditor.createEmptyValue(),
    difficulty: "general",
    teaser: "",
    teaser_board: "",
    title: "",
    category: "[Add New Category]",
    subcategory: "",
    tournamentName: "",
    tournamentStartDate: "",
    tournamentEndDate: "",
    tournamentImage: "",
    categories: ["[Add New Category]"],
    newCategory: "",
    body: "",
    isTournament: false,
  };

  componentDidMount() {
    // console.log("IN HERE")
    if (!this.props.a) this.props.history.push(`/${this.props.type}s`);

    if (this.props.edit) {
      // if (this.props.type === 'tournament') {
      //     article['subcategory'] = this.state.tournamentName;
      // } else if (this.props.type === 'article' &&
      //     this.state.subcategory !== "") {
      //     article['subcategory'] = this.state.subcategory;
      //     if (this.state.tournamentDate !== "") {
      //         article['tournamentDate'] = this.state.tournamentDate;
      //     }
      // }

      let articleMetadata = findQuizById(
        this.props.articles,
        this.props.match.params.id
      );
      let articleId = this.props.match.params.id;
      let {
        body,
        category,
        difficulty,
        teaser,
        teaser_board,
        title,
        subcategory,
        tournamentStartDate,
        tournamentEndDate,
      } = articleMetadata;
      if (subcategory === undefined) subcategory = "";
      if (tournamentStartDate === undefined) tournamentStartDate = "";
      if (tournamentEndDate === undefined) tournamentEndDate = "";
      let isTournament = category === "Tournament";
      this.setState({
        article: "",
        difficulty,
        teaser,
        teaser_board,
        title,
        category,
        subcategory,
        tournamentStartDate,
        tournamentEndDate,
        tournamentName: subcategory,
        body,
        articleId,
        isTournament,
      });
      this.props.getArticle(body);
    }

    if (this.props.articleType === "tournament") {
      this.setState({ category: "Tournament" });
      // console.log(`THIS IS THE TOURNAMENT FORM, ${this.props.type}`);
    } else if (this.props.articleType === "articles") {
      // console.log(`THIS IS THE ARTICLE FORM, ${this.props.type}`);
      const categoriesSubscription = categoriesRef.onSnapshot((snapshot) => {
        if (snapshot && snapshot.docs.length > 0) {
          const categories = snapshot.docs.map((doc) => doc.id);
          // console.log(categories);
          this.setState({ categories: ["[Add New Category]", ...categories] });
        }
      });
      this.setState({ categoriesSubscription });
    }
  }
  componentWillUnmount() {
    if (this.state.categoriesSubscription) {
      this.state.categoriesSubscription();
    }
  }

  addCategory = (e) => {
    // categoriesRef.set()
    e.preventDefault();
    // console.log(e);
    // console.log(this.state.newCategory);
    categoriesRef
      .doc(this.state.newCategory)
      .set({
        category: this.state.newCategory,
      })
      .then(() => {
        this.setState({ newCategory: "" });
      });
    // .then(() => {
    //   return <Toast toast="category added to categories list">
    //       Toast
    //   </Toast>
    // })
  };

  componentDidUpdate(prevProps, prevState) {
    // console.log("COMPONENT JUST UPDATED")
    // console.log(this.state.body);
    // console.log(this.props.article);
    let articleBody = this.props.article[this.state.body];
    if (articleBody && !this.state.articleLoaded) {
      this.setState({
        articleLoaded: true,
        // article: RichTextEditor.createValueFromString(articleBody.text, 'html')
        article: articleBody.text,
      });
    }
  }

  // componentDidMount() {
  // const firepadRef = firebase.database().ref();
  // // const codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
  // const codeMirror =  window.CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
  // const firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
  //     richTextShortcuts: true,
  //     richTextToolbar: true,
  //     defaultText: 'Hello, World!'
  // });
  // }

  // componentDidUpdate(prevProps, prevState) {
  //     console.log(this.state);
  // }

  handleChange = (e) => {
    // console.log(e.target.name);
    // console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  articleChange = (article) => {
    this.setState({ article });
    // console.log(article.toString('html')); // 'html' or 'markdown'
  };

  onInputDateChange = (key, date) => {
    this.setState({ [key]: date });
  };

  submitArticle = (e) => {
    e.preventDefault();
    const articleType = this.props.articleType;
    const useBodyRef = this.props.bodyRef;

    let article = {
      title: this.state.title,
      category: this.state.category,
      difficulty: this.state.difficulty,
      teaser_board: this.state.teaser_board,
      teaser: this.state.teaser,
    };

    if (this.props.articleType === "tournament") {
      article["subcategory"] = this.state.tournamentName;
      if (this.state.tournamentStartDate !== "") {
        article["tournamentStartDate"] = this.state.tournamentStartDate;
      }
      if (this.state.tournamentEndDate !== "") {
        article["tournamentEndDate"] = this.state.tournamentEndDate;
      }
      if (this.state.tournamentImage !== "") {
        article["tournamentLogo"] = this.state.tournamentImage;
      }
    } else if (
      this.props.articleType === "articles" &&
      this.state.subcategory !== ""
    ) {
      article["subcategory"] = this.state.subcategory;
    }

    let articleText = prepareArticleString(this.state.article.toString("html"));
    // .split("&gt;").join('>')
    // .split("&lt;").join('<')
    // .split('♦').join(`<span className='red-suit'>♦</span>`)
    // .split('♥').join(`<span className='red-suit'>♥</span>`)
    // // .split(' ♦').join(`<span className='red-suit'>&nbsp;♦</span>`)
    // // .split(' ♥').join(`<span className='red-suit'>&nbsp;♥</span>`)
    // // .split('♦ ').join(`<span className='red-suit'>♦&nbsp;</span>`)
    // // .split(/♦[.]?/).join(`<span className='red-suit'>♦&nbsp;</span>`)
    // // .split(/♥[.]?/).join(`<span className='red-suit'>♥&nbsp;</span>`)
    // .split(/(![shcd])/)
    // .map(substr => replaceSuitMacros(substr))
    // .join("");

    let articleBody = { text: articleText };

    this.props.addArticle(article, articleBody, articleType, useBodyRef);

    // switch (this.props.type) {
    //   case "articles":
    //     this.props.history.push("/articles");
    //     break;
    //   case "tournament":
    //     this.props.history.push("/tournaments");
    // }

    switch (articleType) {
      case "articles":
        this.props.history.push("/articles");
        break;
      case "defence":
        this.props.history.push("/defence");
        break;
      case "cardPlay":
        this.props.history.push("/cardPlay");
        break;
      case "bidding":
        this.props.history.push("/bidding");
        break;
      case "tournament":
        this.props.history.push("/tournaments");
    }
  };

  submitEditArticle = (e) => {
    e.preventDefault();
    let article = {
      title: this.state.title,
      category: this.state.category,
      difficulty: this.state.difficulty,
      teaser_board: this.state.teaser_board,
      teaser: this.state.teaser,
      body: this.state.body,
      id: this.state.articleId,
    };

    if (this.props.articleType === "tournament" || this.state.isTournament) {
      article["subcategory"] = this.state.tournamentName;
      if (this.state.tournamentStartDate !== "") {
        article["tournamentStartDate"] = this.state.tournamentStartDate;
      }
      if (this.state.tournamentEndDate !== "") {
        article["tournamentEndDate"] = this.state.tournamentEndDate;
      }
      if (this.state.tournamentImage !== "") {
        article["tournamentLogo"] = this.state.tournamentImage;
      }
    } else if (
      this.props.articleType === "articles" &&
      this.state.subcategory !== ""
    ) {
      article["subcategory"] = this.state.subcategory;
    }

    let articleText = prepareArticleString(this.state.article); //.toString('html')
    // .split("&gt;").join('>')
    // .split("&lt;").join('<')
    // // .split(' ♦').join(`<span className='red-suit'>&nbsp;♦</span>`)
    // // .split(' ♥').join(`<span className='red-suit'>&nbsp;♥</span>`)
    // // // .split('♦ ').join(`<span className='red-suit'>♦&nbsp;</span>`)
    // // // .split('♥ ').join(`<span className='red-suit'>♥&nbsp;</span>`)
    // // .split(/♦[.]?/).join(`<span className='red-suit'>♥&nbsp;</span>`)
    // // .split(/♥[.]?/).join(`<span className='red-suit'>♥&nbsp;</span>`)
    // .split('♦').join(`<span className='red-suit'>♦</span>`)
    // .split('♥').join(`<span className='red-suit'>♥</span>`)
    // .split(/(![shcd])/)
    // .map(substr => replaceSuitMacros(substr))
    // .join("");

    let articleBody = { text: articleText };

    this.props.editArticle(article, articleBody);

    switch (this.props.articleType) {
      case "articles":
        this.props.history.push("/articles");
        break;
      case "tournament":
        this.props.history.push("/tournaments");
    }
  };

  submitDeleteArticle = (e) => {
    e.preventDefault();
    // console.log("I WANT TO DELETE U");
    // $('#CreateArticle-confirm_delete').modal('close');
    let modal = $(".modal");
    let modalOverlay = $(".modal-overlay");
    modal.removeClass("open");
    modal.removeAttr("style");
    modalOverlay.remove();
    $("body").css({ overflow: "auto" });
    this.props.deleteArticle(this.state.articleId, this.state.body);
    this.props.history.push(`/${this.props.articleType}s`);
  };

  resetTournamentDates = (e) => {
    e.preventDefault();
    this.setState({ tournamentStartDate: "", tournamentEndDate: "" });
  };

  render() {
    let categoriesJSX = this.state.categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ));
    let categoriesInput = (
      <Select
        s={12}
        name="category"
        type="select"
        label="Article Category"
        value={this.state.category}
        onChange={this.handleChange}
      >
        {categoriesJSX}
      </Select>
    );

    return (
      <div className="CreateArticle-container">
        <form>
          <h3 style={{ paddingTop: "3rem", textAlign: "center" }}>
            {" "}
            Create {this.props.articleType} post
          </h3>
          <Row>
            <TextInput
              s={12}
              name="title"
              onChange={this.handleChange}
              value={this.state.title}
              label="Post Title"
            />
          </Row>
          {this.props.articleType === "articles" && (
            <Row>{categoriesInput}</Row>
          )}
          {this.props.articleType === "articles" &&
            this.state.category === "[Add New Category]" && (
              <Row>
                <TextInput
                  s={6}
                  name="newCategory"
                  onChange={this.handleChange}
                  label="Add New Category"
                  value={this.state.newCategory}
                />
                <Button
                  floating
                  flat
                  onClick={(e) => this.addCategory(e)}
                  className="green darken-5"
                  waves="light"
                  icon={<Icon>add</Icon>}
                />
              </Row>
            )}
          {this.props.articleType === "tournament" && (
            <Row>
              <TextInput
                s={12}
                name="tournamentName"
                onChange={this.handleChange}
                value={this.state.tournamentName}
                label="Enter tournament name"
              />
            </Row>
          )}
          {this.props.articleType === "tournament" && (
            <Row>
              <TextInput
                s={12}
                name="tournamentImage"
                onChange={this.handleChange}
                value={this.state.tournamentImage}
                label="Paste the URL of the tournaments logo (if any)"
              />
            </Row>
          )}

          {(this.props.articleType === "tournament" ||
            this.state.isTournament) && (
            <Row>
              {this.state.tournamentStartDate === "" && (
                // <Input name='tournamentStartDate'
                //        type='date'
                //        label="Select Start Date"
                //        onChange={ (e, value) => {
                //            this.onInputDateChange(e, value)
                //        }}/>
                <DatePicker
                  name="tournamentStartDate"
                  // type='date'
                  label="Select Start Date"
                  onChange={(value) => {
                    this.onInputDateChange("tournamentStartDate", value);
                  }}
                />
              )}{" "}
              {!(this.state.tournamentStartDate === "") && (
                <Col>{this.state.tournamentStartDate}</Col>
              )}
              {/*{this.state.tournamentStartDate !== "" && <Input name='tournamentStartDate'*/}
              {/*type='date'*/}
              {/*label="Select Start Date"*/}
              {/*value={this.state.tournamentStartDate}*/}
              {/*onChange={ (e, value) => {*/}
              {/*this.onInputDateChange(e, value)*/}
              {/*}}/>*/}
              {/*}*/}
              <Col>-</Col>
              {this.state.tournamentEndDate === "" && (
                // <Input name='tournamentEndDate'
                //        type='date'
                //        label="Select End Date"
                //        onChange={ (e, value) => {
                //            this.onInputDateChange(e, value)
                //        }}/>
                <DatePicker
                  name="tournamentEndDate"
                  //   type="date"
                  label="Select End Date"
                  onChange={(value) => {
                    this.onInputDateChange("tournamentEndDate", value);
                  }}
                />
              )}{" "}
              {!(this.state.tournamentEndDate === "") && (
                <Col>{this.state.tournamentEndDate}</Col>
              )}
              <Col>
                <Button
                  waves="light"
                  onClick={(e) => this.resetTournamentDates(e)}
                  className="CreateArticle-delete"
                >
                  Reset Dates
                  <Icon left>refresh</Icon>
                </Button>
              </Col>
            </Row>
          )}

          {this.props.articleType === "articles" && (
            <Row>
              <TextInput
                s={6}
                name="subcategory"
                label="Add (Optional) Subcategory or leave blank"
                value={this.state.subcategory}
                onChange={this.handleChange}
              ></TextInput>
            </Row>
          )}
          <Row>
            <Select
              s={12}
              name="difficulty"
              type="select"
              label="Article Difficulty"
              value={this.state.difficulty}
              onChange={this.handleChange}
            >
              <option value="general">General</option>
              <option value="beg">Beginner</option>
              <option value="int">Intermediate</option>
              <option value="adv">Advanced</option>
            </Select>
          </Row>
          <Row>
            <GenerateBridgeBoard />
          </Row>
          <Row>
            <TextInput
              s={12}
              name="teaser_board"
              label="Article Teaser Hand"
              value={this.state.teaser_board}
              onChange={this.handleChange}
            ></TextInput>
          </Row>
          <Row>
            <TextInput
              s={12}
              name="teaser"
              label="Article Teaser Introduction"
              // type="textarea"
              value={this.state.teaser}
              onChange={this.handleChange}
            ></TextInput>
          </Row>
          <Row>
            {!this.props.edit && (
              <RichTextEditor
                value={this.state.article}
                onChange={this.articleChange}
                className="editor"
              />
            )}
            {this.props.edit && this.state.articleLoaded && (
              <Textarea
                s={12}
                name="article"
                label="Article"
                type="textarea"
                value={this.state.article}
                onChange={this.handleChange}
                style={{
                  fontSize: "2.4rem",
                }}
              />
            )}
          </Row>
          {!this.props.edit && (
            <Button
              className="CreateArticle-submit"
              onClick={(e) => this.submitArticle(e)}
              waves="light"
            >
              Submit Article
              <Icon left>done_all</Icon>
            </Button>
          )}
          {this.props.edit && (
            <Button
              className="CreateArticle-edit"
              onClick={(e) => this.submitEditArticle(e)}
              waves="light"
            >
              Edit Article
              <Icon left>done_all</Icon>
            </Button>
          )}

          {this.props.edit && (
            <Modal
              header="Confirm Deletion"
              trigger={
                <Button waves="light" className="CreateArticle-delete">
                  Delete Article
                  <Icon left> delete</Icon>
                </Button>
              }
            >
              <br />
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                Are you sure you want to delete?
              </p>
              <br />
              <br />
              <Button
                waves="light"
                className="CreateArticle-delete"
                onClick={(e) => this.submitDeleteArticle(e)}
              >
                Delete Article
                <Icon left> delete</Icon>
              </Button>
            </Modal>
          )}
        </form>
      </div>
    );
  }
}
const mapStateToProps = ({ articles, auth }) => ({
  a: auth.a,
  articles: articles.articles,
  article: articles.article,
});
const mapDispatchToProps = (dispatch) => ({
  addArticle: (article, articleBody) =>
    dispatch(startAddArticle(article, articleBody)),
  getArticle: (id) => dispatch(getArticle(id)),
  editArticle: (article, articleBody) =>
    dispatch(startEditArticle(article, articleBody)),
  deleteArticle: (articleId, bodyId) =>
    dispatch(startDeleteArticle(articleId, bodyId)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateArticle)
);
// export default CreateArticle;
