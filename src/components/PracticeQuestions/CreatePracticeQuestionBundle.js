import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, TextInput, Select, Row, Col, Icon } from 'react-materialize';
import { firebase } from '../../firebase/config';
import BridgeBoardCreator from '../../v2/components/BridgeBoardCreator/BridgeBoardCreator';
import RichTextEditor from 'react-rte';
import AnnotationDrawer from './AnnotationDrawer';
import './CreatePracticeQuestionBundle.css';

const CreatePracticeQuestionBundle = ({ match, history, a, articleType }) => {
  const bundleId = match?.params?.bundleId;
  const category = articleType || match?.params?.category || 'cardPlay';
  const isEditMode = !!bundleId;

  // Bundle metadata
  const [title, setTitle] = useState('');
  const [teaser, setTeaser] = useState('');
  const [difficulty, setDifficulty] = useState('1');
  const [articleNumber, setArticleNumber] = useState('1');
  
  // Questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Current question being edited
  const [showBoardCreator, setShowBoardCreator] = useState(false);
  const [showAnnotationDrawer, setShowAnnotationDrawer] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check admin access
  useEffect(() => {
    if (a !== true) {
      history.push('/');
    }
  }, [a, history]);

  // Load existing bundle if editing
  useEffect(() => {
    if (isEditMode && bundleId) {
      loadBundle();
    }
  }, [bundleId, isEditMode]);

  const loadBundle = async () => {
    try {
      const summaryRef = firebase.firestore().collection(category);
      const bodyRef = firebase.firestore().collection(category + 'Body');
      
      const summaryDoc = await summaryRef.doc(bundleId).get();
      if (summaryDoc.exists) {
        const data = summaryDoc.data();
        setTitle(data.title || '');
        setTeaser(data.teaser || '');
        setDifficulty(data.difficulty || '1');
        setArticleNumber(data.articleNumber?.toString() || '1');
        
        if (data.body) {
          const bodyDoc = await bodyRef.doc(data.body).get();
          if (bodyDoc.exists) {
            const bodyData = bodyDoc.data();
            setQuestions(bodyData.questions || []);
          }
        }
      }
    } catch (error) {
      console.error('Error loading bundle:', error);
      alert('Error loading practice question bundle');
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      boardData: null,
      questionText: RichTextEditor.createEmptyValue(),
      answerText: RichTextEditor.createEmptyValue(),
      annotations: [],
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      if (currentQuestionIndex >= newQuestions.length) {
        setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1));
      }
    }
  };

  const handleBoardCreated = (boardData) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      boardData: boardData.board, // Store structured format
    };
    setQuestions(updatedQuestions);
    setShowBoardCreator(false);
  };

  const handleAnnotationsUpdated = (annotations) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      annotations,
    };
    setQuestions(updatedQuestions);
    setShowAnnotationDrawer(false);
  };

  const handleQuestionTextChange = (value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      questionText: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleAnswerTextChange = (value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      answerText: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setSaving(true);

    try {
      const summaryRef = firebase.firestore().collection(category);
      const bodyRef = firebase.firestore().collection(category + 'Body');

      // Prepare questions data (convert RichTextEditor values to HTML strings)
      const questionsData = questions.map(q => ({
        boardData: q.boardData,
        questionText: q.questionText?.toString('html') || '',
        answerText: q.answerText?.toString('html') || '',
        annotations: q.annotations || [],
      }));

      // Check if any question is missing required data
      const incompleteQuestions = questionsData.filter(
        q => !q.boardData || !q.questionText || !q.answerText
      );
      
      if (incompleteQuestions.length > 0) {
        alert(`Please complete all questions. ${incompleteQuestions.length} question(s) are incomplete.`);
        setSaving(false);
        return;
      }

      if (isEditMode && bundleId) {
        // Update existing bundle
        const summaryDoc = await summaryRef.doc(bundleId).get();
        if (summaryDoc.exists) {
          const data = summaryDoc.data();
          
          // Update summary
          await summaryRef.doc(bundleId).update({
            title,
            teaser,
            difficulty,
            articleNumber: Number(articleNumber),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });

          // Update body
          if (data.body) {
            await bodyRef.doc(data.body).update({
              questions: questionsData,
            });
          }
        }
      } else {
        // Create new bundle
        const batch = firebase.firestore().batch();
        
        const newBodyRef = bodyRef.doc();
        const newSummaryRef = summaryRef.doc();

        batch.set(newBodyRef, {
          questions: questionsData,
        });

        batch.set(newSummaryRef, {
          contentType: 'practiceQuestions',
          title,
          teaser,
          difficulty,
          articleNumber: Number(articleNumber),
          category,
          body: newBodyRef.id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        await batch.commit();
      }

      alert('Practice question bundle saved successfully!');
      history.push(`/${category}`);
    } catch (error) {
      console.error('Error saving bundle:', error);
      alert('Error saving practice question bundle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || null;

  return (
    <div className="CreatePracticeQuestionBundle">
      <div className="CreatePracticeQuestionBundle-header">
        <h2>{isEditMode ? 'Edit' : 'Create'} Practice Question Bundle</h2>
        <Button onClick={() => history.push(`/${category}`)}>
          <Icon left>arrow_back</Icon>
          Back to {category === 'cardPlay' ? 'Declarer Play' : category === 'bidding' ? 'Bidding' : 'Defence'}
        </Button>
      </div>

      <div className="CreatePracticeQuestionBundle-content">
        {/* Bundle Metadata */}
        <div className="CreatePracticeQuestionBundle-section">
          <h3>Bundle Information</h3>
          <Row>
            <Col s={12} m={8}>
              <TextInput
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Col>
            <Col s={12} m={2}>
              <TextInput
                label="Article Number"
                type="number"
                value={articleNumber}
                onChange={(e) => setArticleNumber(e.target.value)}
              />
            </Col>
            <Col s={12} m={2}>
              <Select
                label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
              </Select>
            </Col>
          </Row>
          <Row>
            <Col s={12}>
              <TextInput
                label="Teaser/Description"
                value={teaser}
                onChange={(e) => setTeaser(e.target.value)}
              />
            </Col>
          </Row>
        </div>

        {/* Questions Management */}
        <div className="CreatePracticeQuestionBundle-section">
          <div className="CreatePracticeQuestionBundle-questions-header">
            <h3>Questions ({questions.length})</h3>
            <Button onClick={handleAddQuestion} className="green">
              <Icon left>add</Icon>
              Add Question
            </Button>
          </div>

          {questions.length > 0 && (
            <>
              {/* Question Navigation */}
              <div className="CreatePracticeQuestionBundle-question-nav">
                {questions.map((_, index) => (
                  <Button
                    key={index}
                    className={index === currentQuestionIndex ? 'active' : ''}
                    onClick={() => setCurrentQuestionIndex(index)}
                    small
                  >
                    Question {index + 1}
                  </Button>
                ))}
              </div>

              {/* Current Question Editor */}
              {currentQuestion && (
                <div className="CreatePracticeQuestionBundle-question-editor">
                  <div className="CreatePracticeQuestionBundle-question-actions">
                    <Button
                      onClick={() => handleDeleteQuestion(currentQuestionIndex)}
                      className="red"
                      small
                    >
                      <Icon left>delete</Icon>
                      Delete Question
                    </Button>
                  </div>

                  {/* Board */}
                  <div className="CreatePracticeQuestionBundle-board-section">
                    <h4>Bridge Board</h4>
                    {currentQuestion.boardData ? (
                      <div className="CreatePracticeQuestionBundle-board-display">
                        <div className="CreatePracticeQuestionBundle-board-actions">
                          <Button
                            onClick={() => setShowBoardCreator(true)}
                            small
                          >
                            <Icon left>edit</Icon>
                            Edit Board
                          </Button>
                          <Button
                            onClick={() => setShowAnnotationDrawer(true)}
                            small
                            className="blue"
                          >
                            <Icon left>draw</Icon>
                            Draw Annotations
                          </Button>
                        </div>
                        {/* Board preview would go here - you can use MakeBoard component */}
                        <div className="CreatePracticeQuestionBundle-board-preview">
                          Board created ✓
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setShowBoardCreator(true)}>
                        <Icon left>add</Icon>
                        Create Board
                      </Button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="CreatePracticeQuestionBundle-text-section">
                    <h4>Question Text</h4>
                    <RichTextEditor
                      value={currentQuestion.questionText || RichTextEditor.createEmptyValue()}
                      onChange={handleQuestionTextChange}
                    />
                  </div>

                  {/* Answer Text */}
                  <div className="CreatePracticeQuestionBundle-text-section">
                    <h4>Answer Text</h4>
                    <RichTextEditor
                      value={currentQuestion.answerText || RichTextEditor.createEmptyValue()}
                      onChange={handleAnswerTextChange}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="CreatePracticeQuestionBundle-actions">
          <Button
            onClick={handleSave}
            disabled={saving}
            large
            className="green"
          >
            <Icon left>{saving ? 'hourglass_empty' : 'save'}</Icon>
            {saving ? 'Saving...' : 'Save Bundle'}
          </Button>
        </div>
      </div>

      {/* Board Creator Modal */}
      {showBoardCreator && (
        <div className="CreatePracticeQuestionBundle-modal">
          <div className="CreatePracticeQuestionBundle-modal-content">
            <div className="CreatePracticeQuestionBundle-modal-header">
              <h3>Create Bridge Board</h3>
              <Button
                onClick={() => setShowBoardCreator(false)}
                flat
                small
              >
                <Icon>close</Icon>
              </Button>
            </div>
            <BridgeBoardCreator
              onBoardCreated={handleBoardCreated}
              onCancel={() => setShowBoardCreator(false)}
            />
          </div>
        </div>
      )}

      {/* Annotation Drawer Modal */}
      {showAnnotationDrawer && currentQuestion?.boardData && (
        <div className="CreatePracticeQuestionBundle-modal">
          <div className="CreatePracticeQuestionBundle-modal-content">
            <div className="CreatePracticeQuestionBundle-modal-header">
              <h3>Draw Annotations</h3>
              <Button
                onClick={() => setShowAnnotationDrawer(false)}
                flat
                small
              >
                <Icon>close</Icon>
              </Button>
            </div>
            <AnnotationDrawer
              boardData={currentQuestion.boardData}
              annotations={currentQuestion.annotations || []}
              onSave={handleAnnotationsUpdated}
              onCancel={() => setShowAnnotationDrawer(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  a: state.auth.a,
});

export default connect(mapStateToProps)(withRouter(CreatePracticeQuestionBundle));



