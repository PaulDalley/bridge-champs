import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Add from "./Add";
import QuizListItem from "../components/Quizzes/QuizListItem";
import QuizCategoryHeader from "../components/Quizzes/QuizCategoryHeader";
import "./Quizzes.css";
import { getQuizzes, setCurrentQuiz } from "../store/actions/quizzesActions";
import { resetFilters } from "../store/actions/filtersActions";
import { filterQuizzes } from "../helpers/helpers";
import { getCategoryName } from "../services/quizCategoryService";

const Quizzes = ({ history }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categoryNames, setCategoryNames] = useState({});
  const [categoryNamesLoading, setCategoryNamesLoading] = useState(true);
  
  const quizzes = useSelector((state) => 
    filterQuizzes(
      state.quizzes.quizzes || [],
      state.filters,
      state.auth.quizScores
    )
  );
  const a = useSelector((state) => state.auth.a);
  const quizScores = useSelector((state) => state.auth.quizScores || {});
  const dispatch = useDispatch();

  useEffect(() => {
    if (quizzes.length === 0) {
      dispatch(getQuizzes());
    }
    return () => {
      dispatch(resetFilters());
    };
  }, []);

  // Group quizzes by category
  const groupedQuizzes = {};
  quizzes.forEach((quiz) => {
    const category = quiz.category || 'Uncategorized';
    if (!groupedQuizzes[category]) {
      groupedQuizzes[category] = [];
    }
    groupedQuizzes[category].push(quiz);
  });

  // Fetch category names
  useEffect(() => {
    const fetchCategoryNames = async () => {
      const names = {};
      const categories = Object.keys(groupedQuizzes);
      
      for (const categoryId of categories) {
        try {
          const name = await getCategoryName(categoryId);
          names[categoryId] = name;
        } catch (error) {
          names[categoryId] = categoryId;
        }
      }
      
      setCategoryNames(names);
      setCategoryNamesLoading(false);
      
      // Expand first category by default
      if (categories.length > 0 && Object.keys(expandedCategories).length === 0) {
        setExpandedCategories({ [categories[0]]: true });
      }
    };

    if (Object.keys(groupedQuizzes).length > 0) {
      fetchCategoryNames();
    } else {
      setCategoryNamesLoading(false);
    }
  }, [quizzes.length]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategoryUpdate = async () => {
    // Refetch category names
    const names = {};
    const categories = Object.keys(groupedQuizzes);
    
    for (const categoryId of categories) {
      try {
        const name = await getCategoryName(categoryId);
        names[categoryId] = name;
      } catch (error) {
        names[categoryId] = categoryId;
      }
    }
    
    setCategoryNames(names);
  };

  const setCurrentQuizAndGoTo = (quiz, id) => {
    dispatch(setCurrentQuiz(quiz));
    history.push(`/quiz/${id}`);
  };

  const isMobileSize = window.innerWidth <= 672;

  // Render quizzes grouped by category
  const categories = Object.keys(groupedQuizzes).sort();
  
  let contentJSX;
  if (categories.length > 0 && !categoryNamesLoading) {
    contentJSX = categories.map((categoryId) => {
      const categoryQuizzes = groupedQuizzes[categoryId];
      const categoryName = categoryNames[categoryId] || categoryId;
      const isExpanded = expandedCategories[categoryId] !== false; // Default to expanded
      
      let quizzesJSX = categoryQuizzes.map((quiz) => {
        const completed = quizScores[quiz.body] !== undefined;
        return (
          <QuizListItem
            key={quiz.id}
            date={quiz.date}
            body={quiz.body}
            quizType={quiz.quizType}
            id={quiz.id}
            teaser={quiz.teaser}
            teaser_board={quiz.teaser_board}
            title={quiz.title}
            difficulty={quiz.difficulty}
            router={history}
            a={a}
            clickHandler={setCurrentQuizAndGoTo}
            completed={completed}
          />
        );
      });

      // Split for two-column layout on desktop
      let quizzesJSXLeft, quizzesJSXRight;
      if (!isMobileSize && quizzesJSX.length > 0) {
        quizzesJSXLeft = quizzesJSX.filter((_, idx) => idx % 2 === 0);
        quizzesJSXRight = quizzesJSX.filter((_, idx) => idx % 2 !== 0);
      }

      return (
        <div key={categoryId} className="Quizzes-category-group">
          <QuizCategoryHeader
            categoryId={categoryId}
            categoryName={categoryName}
            quizCount={categoryQuizzes.length}
            isExpanded={isExpanded}
            onToggle={() => toggleCategory(categoryId)}
            onUpdate={handleCategoryUpdate}
          />
          {isExpanded && (
            <>
              {!isMobileSize ? (
                <div className="Articles-container Quizzes-container">
                  <div className="Articles-container-left">{quizzesJSXLeft}</div>
                  <div className="Articles-container-right">{quizzesJSXRight}</div>
                </div>
              ) : (
                <div className="Articles-container">{quizzesJSX}</div>
              )}
            </>
          )}
        </div>
      );
    });
  } else if (quizzes.length === 0) {
    contentJSX = (
      <div className="Quizzes-empty">
        <p>No quizzes found.</p>
      </div>
    );
  }

  return (
    <div className="Articles-outer_div">
      <div className="CategoryArticles-header">
        <div className="container">
          <h1 className="CategoryArticles-title">Quizzes</h1>
          <p className="CategoryArticles-subtitle">
            Practice and test your knowledge
          </p>
        </div>
      </div>
      
      <div className="CategoryArticles-content">
        <div className="container">
          <Add goto="create/quiz" history={history} />
          {contentJSX}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
