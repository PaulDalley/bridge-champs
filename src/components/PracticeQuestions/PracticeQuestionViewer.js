import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-materialize';
import MakeBoard from '../BridgeBoard/MakeBoard';
import BoardAnnotationOverlay from './BoardAnnotationOverlay';
import { firebase } from '../../firebase/config';
import { makeBoardObjectFromString } from '../../helpers/helpers';
import './PracticeQuestionViewer.css';

const PracticeQuestionViewer = ({ match, history, a, subscriptionActive }) => {
  const bundleId = match.params.bundleId;
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [boardDimensions, setBoardDimensions] = useState({ width: 600, height: 400 });

  const isAdmin = a === true;
  const isLocked = !isAdmin && !subscriptionActive;

  useEffect(() => {
    if (isLocked) {
      history.push('/membership');
      return;
    }

    // Fetch practice question bundle
    const fetchBundle = async () => {
      try {
        // Try to find in category collections
        const categories = ['cardPlay', 'bidding', 'defence'];
        let bundleData = null;
        let bodyData = null;

        for (const category of categories) {
          const summaryRef = firebase.firestore().collection(category);
          const bodyRef = firebase.firestore().collection(category + 'Body');
          
          const summaryDoc = await summaryRef.doc(bundleId).get();
          if (summaryDoc.exists) {
            const data = summaryDoc.data();
            if (data.contentType === 'practiceQuestions') {
              bundleData = { id: summaryDoc.id, ...data };
              
              // Fetch body with questions
              if (data.body) {
                const bodyDoc = await bodyRef.doc(data.body).get();
                if (bodyDoc.exists) {
                  bodyData = bodyDoc.data();
                }
              }
              break;
            }
          }
        }

        if (bundleData && bodyData) {
          setBundle({
            ...bundleData,
            questions: bodyData.questions || [],
          });
        } else {
          console.error('Practice question bundle not found');
          history.push('/');
        }
      } catch (error) {
        console.error('Error fetching practice question bundle:', error);
        history.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [bundleId, history, isLocked]);

  // Measure board dimensions when it renders
  useEffect(() => {
    const measureBoard = () => {
      const boardElement = document.querySelector('.PracticeQuestionViewer-board-container');
      if (boardElement) {
        const rect = boardElement.getBoundingClientRect();
        setBoardDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Measure after a short delay to ensure board is rendered
    const timer = setTimeout(measureBoard, 100);
    window.addEventListener('resize', measureBoard);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureBoard);
    };
  }, [currentQuestionIndex, bundle]);

  if (loading) {
    return (
      <div className="PracticeQuestionViewer">
        <div className="PracticeQuestionViewer-loading">Loading practice questions...</div>
      </div>
    );
  }

  if (!bundle || !bundle.questions || bundle.questions.length === 0) {
    return (
      <div className="PracticeQuestionViewer">
        <div className="PracticeQuestionViewer-error">No questions found in this bundle.</div>
      </div>
    );
  }

  const currentQuestion = bundle.questions[currentQuestionIndex];
  const totalQuestions = bundle.questions.length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Parse board data - handle both string format and structured format
  let makeBoardProps = null;
  if (currentQuestion.boardData) {
    if (typeof currentQuestion.boardData === 'string') {
      // Legacy string format
      const parsed = makeBoardObjectFromString(currentQuestion.boardData);
      makeBoardProps = parsed;
    } else {
      // Structured format from new board creator
      const board = currentQuestion.boardData;
      // Convert structured format to MakeBoard props
      const formatHandString = (hand) => {
        if (!hand) return '';
        const suits = ['S', 'H', 'D', 'C'];
        const parts = suits.map(suit => {
          const cards = hand[suit] || '';
          return cards ? `*${suit}-${cards}` : '';
        }).filter(Boolean);
        return parts.join('');
      };
      
      makeBoardProps = {
        boardType: board.boardType || 'full',
        position: board.position || 'full',
        North: formatHandString(board.north),
        South: formatHandString(board.south),
        East: formatHandString(board.east),
        West: formatHandString(board.west),
        vuln: board.vulnerability || 'none',
        dealer: board.dealer || 'North',
        bidding: Array.isArray(board.bidding) ? board.bidding.join('/') : (board.bidding || ''),
      };
    }
  }

  return (
    <div className="PracticeQuestionViewer">
      <div className="PracticeQuestionViewer-header">
        <h1 className="PracticeQuestionViewer-title">{bundle.title}</h1>
        <div className="PracticeQuestionViewer-progress">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>

      <div className="PracticeQuestionViewer-content">
        {/* Board with annotations */}
        <div className="PracticeQuestionViewer-board-wrapper">
          <div className="PracticeQuestionViewer-board-container" style={{ position: 'relative' }}>
            {makeBoardProps && (
              <MakeBoard
                {...makeBoardProps}
                showVuln={makeBoardProps.showVuln !== false}
              />
            )}
            {currentQuestion.annotations && (
              <BoardAnnotationOverlay
                annotations={currentQuestion.annotations}
                visible={showAnswer}
                boardWidth={boardDimensions.width}
                boardHeight={boardDimensions.height}
              />
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="PracticeQuestionViewer-question">
          <h2>Question</h2>
          <div 
            className="PracticeQuestionViewer-question-text"
            dangerouslySetInnerHTML={{ __html: currentQuestion.questionText || '' }}
          />
        </div>

        {/* Show Answer Button */}
        {!showAnswer && (
          <div className="PracticeQuestionViewer-actions">
            <Button
              className="btn-large PracticeQuestionViewer-show-answer-btn"
              onClick={handleShowAnswer}
            >
              Show Answer
            </Button>
          </div>
        )}

        {/* Answer Section */}
        {showAnswer && (
          <div className="PracticeQuestionViewer-answer">
            <h2>Answer</h2>
            <div 
              className="PracticeQuestionViewer-answer-text"
              dangerouslySetInnerHTML={{ __html: currentQuestion.answerText || '' }}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="PracticeQuestionViewer-navigation">
          <Button
            className="btn"
            disabled={isFirstQuestion}
            onClick={handlePreviousQuestion}
          >
            ← Previous Question
          </Button>
          
          <div className="PracticeQuestionViewer-navigation-progress">
            {currentQuestionIndex + 1} / {totalQuestions}
          </div>

          <Button
            className="btn"
            disabled={isLastQuestion}
            onClick={handleNextQuestion}
          >
            Next Question →
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  a: state.auth.a,
  subscriptionActive: state.auth.subscriptionActive,
});

export default connect(mapStateToProps)(withRouter(PracticeQuestionViewer));

