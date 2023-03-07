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
} from "../store/actions/categoryArticlesActions";
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

/*const mapStateToProps = ({ articles, auth }) => ({
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
*/

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const CreateCategoryArticle = ({
  articleType,
  bodyRef,
  history,
  edit,
  match,
}) => {
  const a = useSelector((state) => state.auth.a);
  const articles = useSelector(
    (state) => state.categoryArticles?.[articleType]
  );
  const dispatch = useDispatch();

  const [article, setArticle] = useState(RichTextEditor.createEmptyValue());
  const [articleId, setArticleId] = useState(match?.params?.id);
  const [articleLoaded, setArticleLoaded] = useState(false);
  const [difficulty, setDifficulty] = useState("1");
  const [articleNumber, setArticleNumber] = useState("1");
  const [teaser, setTeaser] = useState("");
  const [teaserBoard, setTeaserBoard] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("[Add New Category]");
  const [subcategory, setSubcategory] = useState("");
  const [categories, setCategories] = useState(["[Add New Category]"]);
  const [newCategory, setNewCategory] = useState("");
  const [body, setBody] = useState("");
  const [categoriesSubscription, setCategoriesSubscription] =
    useState(undefined);

  const setDataIfEditing = () => {
    let articleMetadata = findQuizById(articles, articleId);

    let {
      body,
      category,
      difficulty,
      teaser,
      teaser_board,
      title,
      subcategory,
    } = articleMetadata;

    if (subcategory === undefined) subcategory = "";

    setArticle("");
    setDifficulty(difficulty);
    setTeaser(teaser);
    setTeaserBoard(teaser_board);
    setTitle(title);
    setCategory(category);
    setSubcategory(subcategory);
    setBody(body);
    setArticleId(articleId);

    dispatch(getArticle(body, history, bodyRef));
  };

  const addCategory = (e) => {
    e.preventDefault();
    categoriesRef
      .doc(newCategory)
      .set({
        category: newCategory,
      })
      .then(() => {
        setNewCategory("");
      });
    // .then(() => {
    //   return <Toast toast="category added to categories list">
    //       Toast
    //   </Toast>
    // })
  };

  useEffect(() => {
    if (!a) history.push(`/${articleType}`);

    if (edit) {
      setDataIfEditing();
    }

    const _categoriesSubscription = categoriesRef.onSnapshot((snapshot) => {
      console.log("--- receiving categories snapshot ---");
      console.log(snapshot);
      if (snapshot && snapshot.docs.length > 0) {
        const categories = snapshot.docs.map((doc) => doc.id);
        setCategories(["[Add New Category]", ...categories]);
      }
    });
    setCategoriesSubscription(_categoriesSubscription);

    return () => {
      if (categoriesSubscription) categoriesSubscription();
    };
  }, []);

  useEffect(() => {
    let articleBody = article[body];
    if (articleBody && !articleLoaded) {
      setArticleLoaded(true);
      setArticle(articleBody.text);
    }
  }, [article]);

  const submitArticle = (e) => {
    e.preventDefault();
    const useArticleType = articleType;
    const useBodyRef = bodyRef;

    let _article = {
      articleType: articleType,
      title: title,
      category: category,
      difficulty: difficulty,
      teaser_board: teaserBoard,
      teaser: teaser,
      articleNumber: articleNumber,
    };

    if (subcategory !== "") {
      _article["subcategory"] = subcategory;
    }

    let articleText = prepareArticleString(article.toString("html"));
    let articleBody = { text: articleText };

    dispatch(
      startAddArticle(_article, articleBody, useArticleType, useBodyRef)
    );

    switch (articleType) {
      case "defence":
        history.push("/defence");
        break;
      case "cardPlay":
        history.push("/cardPlay");
        break;
      case "bidding":
        history.push("/bidding");
        break;
    }
  };

  const submitEditArticle = (e) => {
    e.preventDefault();
    let _article = {
      articleType: articleType,
      title: title,
      category: category,
      difficulty: difficulty,
      articleNumber: articleNumber,
      teaser_board: teaserBoard,
      teaser: teaser,
      body: body,
      id: articleId,
    };

    if (subcategory !== "") {
      article["subcategory"] = subcategory;
    }

    let articleText = prepareArticleString(article).toString("html");
    let articleBody = { text: articleText };
    dispatch(startEditArticle(_article, articleBody, articleType, bodyRef));

    switch (articleType) {
      //   case "article":
      //     this.props.history.push("/articles");
      //     break;
      case "defence":
        history.push("/defence");
        break;
      case "cardPlay":
        history.push("/cardPlay");
        break;
      case "bidding":
        history.push("/bidding");
        break;
      //   case "tournament":
      //     this.props.history.push("/tournaments");
    }
  };

  const submitDeleteArticle = (e) => {
    e.preventDefault();
    // console.log("I WANT TO DELETE U");
    // $('#CreateArticle-confirm_delete').modal('close');
    let modal = $(".modal");
    let modalOverlay = $(".modal-overlay");
    modal.removeClass("open");
    modal.removeAttr("style");
    modalOverlay.remove();
    $("body").css({ overflow: "auto" });
    dispatch(startDeleteArticle(articleId, body, articleType, bodyRef));
    history.push(`/${articleType}`);
  };

  // START OF RENDERING CODE:
  let categoriesJSX = categories.map((category) => (
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
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      {categoriesJSX}
    </Select>
  );

  return (
    <div className="CreateArticle-container">
      <form>
        <h3 style={{ paddingTop: "3rem", textAlign: "center" }}>
          {" "}
          Create {articleType} post
        </h3>
        <Row>
          <TextInput
            s={12}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            label="Post Title"
          />
        </Row>
        <Row>{categoriesInput}</Row>
        {category === "[Add New Category]" && (
          <Row>
            <TextInput
              s={6}
              name="newCategory"
              onChange={(e) => setNewCategory(e.target.value)}
              label="Add New Category"
              value={newCategory}
            />
            <Button
              floating
              flat
              onClick={(e) => addCategory(e)}
              className="green darken-5"
              waves="light"
              icon={<Icon>add</Icon>}
            />
          </Row>
        )}

        <Row>
          <TextInput
            s={6}
            name="subcategory"
            label="Add (Optional) Subcategory or leave blank"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          ></TextInput>
        </Row>

        <Row>
          <Select
            s={12}
            name="difficulty"
            type="select"
            label="Article Difficulty Level"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20,
            ].map((n) => {
              return <option value={n}>Level {n}</option>;
            })}
          </Select>
        </Row>
        <Row>
          <Select
            s={12}
            name="articleNumber"
            type="select"
            label="Article Number At This Difficulty Level"
            value={articleNumber}
            onChange={(e) => setArticleNumber(e.target.value)}
          >
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20,
            ].map((n) => {
              return <option value={n}>Level {n}</option>;
            })}
          </Select>
        </Row>
        <Row>
          <GenerateBridgeBoard />
        </Row>
        <Row>
          <TextInput
            s={12}
            name="teaserBoard"
            label="Article Teaser Hand"
            value={teaserBoard}
            onChange={(e) => setTeaserBoard(e.target.value)}
          ></TextInput>
        </Row>
        <Row>
          <TextInput
            s={12}
            name="teaser"
            label="Article Teaser Introduction"
            // type="textarea"
            value={teaser}
            onChange={(e) => setTeaser(e.target.value)}
          ></TextInput>
        </Row>
        <Row>
          {!edit && (
            <RichTextEditor
              value={article}
              onChange={(article) => {
                console.log("--- RICH TEXT EDITOR CHANGED ---");
                console.log(article);
                setArticle(article);
              }}
              className="editor"
            />
          )}
          {edit && articleLoaded && (
            <Textarea
              s={12}
              name="article"
              label="Article"
              type="textarea"
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              style={{
                fontSize: "2.4rem",
              }}
            />
          )}
        </Row>
        {!edit && (
          <Button
            className="CreateArticle-submit"
            onClick={(e) => submitArticle(e)}
            waves="light"
          >
            Submit Article
            <Icon left>done_all</Icon>
          </Button>
        )}
        {edit && (
          <Button
            className="CreateArticle-edit"
            onClick={(e) => submitEditArticle(e)}
            waves="light"
            style={{ paddingRight: "1rem", marginRight: "1rem" }}
          >
            Edit Article
            <Icon left>done_all</Icon>
          </Button>
        )}

        {edit && (
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
              onClick={(e) => submitDeleteArticle(e)}
            >
              Delete Article
              <Icon left> delete</Icon>
            </Button>
          </Modal>
        )}
      </form>
    </div>
  );
};

export default withRouter(CreateCategoryArticle);
