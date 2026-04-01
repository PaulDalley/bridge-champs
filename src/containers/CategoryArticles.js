import React, { Component } from "react";
import { connect } from "react-redux";
import Add from "./Add";
import {
  getArticles,
  setCurrentArticle,
} from "../store/actions/categoryArticlesActions";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import {
  filterCategoryArticles,
  sortCategoryArticlesByLevelAndArticleNumber,
} from "../helpers/helpers";
import { groupContentByLevel, mapCategoryToVideoCategory } from "../helpers/contentGrouping";
import CategoryArticleListItem from "../components/Articles/CategoryArticleListItem";
import VideoCard from "../components/Articles/VideoCard";
import LevelBanner from "../components/Articles/LevelBanner";
import PracticeQuestionBundleCard from "../components/PracticeQuestions/PracticeQuestionBundleCard";
import { getBannerText } from "../services/categoryBannerService";
import { firebase } from "../firebase/config";
import "./CategoryArticles.css";
import FiltersCategoryArticles from "./FiltersCategoryArticles";
import SkeletonLoader from "../components/UI/SkeletonLoader";
import { Helmet } from "react-helmet-async";
import { Button, Row, Col, Card, Icon, TextInput, Select } from "react-materialize";

const CategoryArticles = ({ articleType, history, dontNavigate, location }) => {
  const pageNumber = Number(location.search.split("e")[1]);

  const [page, setPage] = useState(pageNumber ? pageNumber : 1);
  const [bannerTexts, setBannerTexts] = useState({});
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [practiceQuestionsLoading, setPracticeQuestionsLoading] = useState(true);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    description: '',
    difficulty: '1'
  });
  const [submittingVideo, setSubmittingVideo] = useState(false);
  const articles = useSelector(
    (state) => state.categoryArticles?.[articleType]
  );
  const a = useSelector((state) => state.auth.a);
  const subscriptionActive = useSelector((state) => state.auth.subscriptionActive);
  const uid = useSelector((state) => state.auth.uid);
  
  // Debug: Log admin and subscription status
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('CategoryArticles - Admin (a):', a, 'Type:', typeof a, 'Subscription Active:', subscriptionActive);
    }
  }, [a, subscriptionActive]);
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (articles === undefined || articles?.length === 0) {
      dispatch(getArticles(articleType));
    }
  }, []);

  useEffect(() => {
    if (articles === undefined || articles?.length === 0) {
      dispatch(getArticles(articleType));
    }
  }, [articleType]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [articleType]);

  // Fetch videos for this category
  useEffect(() => {
    const videoCategory = mapCategoryToVideoCategory(articleType);
    setVideosLoading(true);
    
    const unsubscribe = firebase.firestore()
      .collection('videos')
      .where('category', '==', videoCategory)
      .onSnapshot(
        (snapshot) => {
          const videosList = [];
          snapshot.forEach((doc) => {
            const videoData = { id: doc.id, ...doc.data() };
            videosList.push(videoData);
            // Log for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log('Fetched video:', videoData.title, 'Category:', videoData.category, 'Difficulty:', videoData.difficulty);
            }
          });
          // Sort by createdAt descending (newest first)
          videosList.sort((a, b) => {
            const dateA = a?.createdAt?.toDate ? a.createdAt.toDate() : new Date(a?.createdAt || 0);
            const dateB = b?.createdAt?.toDate ? b.createdAt.toDate() : new Date(b?.createdAt || 0);
            return dateB - dateA;
          });
          setVideos(videosList);
          setVideosLoading(false);
        },
        (error) => {
          console.error('Error fetching videos:', error);
          setVideos([]);
          setVideosLoading(false);
        }
      );

    return () => unsubscribe();
  }, [articleType]);

  const setCurrentArticleAndGoTo = (article, id) => {
    if (dontNavigate) {
      return;
    }
    dispatch(setCurrentArticle(article));
    // Most category article routes live at `/${articleType}/:id` or nested paths.
    const nextPath =
      articleType === "counting"
        ? `/counting/articles/${id}`
        : articleType === "cardPlay"
          ? `/cardPlay/articles/${id}`
          : articleType === "defence"
            ? `/defence/articles/${id}`
          : articleType === "biddingBasics"
            ? `/bidding/basics/${id}`
          : articleType === "biddingAdvanced"
            ? `/bidding/advanced/${id}`
          : articleType === "cardPlayBasics"
            ? `/cardPlay/basics/${id}`
          : articleType === "defenceBasics"
            ? `/defence/basics/${id}`
          : articleType === "bidding"
            ? `/bidding/advanced/${id}`
        : `/${articleType}/${id}`;
    history.push(nextPath);
  };

  // Video form helpers
  const getYouTubeEmbedUrl = (url) => {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setNewVideo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    
    if (!newVideo.title || !newVideo.url) {
      alert('Please fill in title and URL');
      return;
    }

    setSubmittingVideo(true);

    const videoCategory = mapCategoryToVideoCategory(articleType);
    const videoData = {
      title: newVideo.title,
      url: getYouTubeEmbedUrl(newVideo.url),
      description: newVideo.description,
      category: videoCategory,
      difficulty: newVideo.difficulty || '1',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: uid || 'anonymous'
    };

    try {
      await firebase.firestore().collection('videos').add(videoData);
      setNewVideo({ title: '', url: '', description: '', difficulty: '1' });
      setShowVideoForm(false);
      alert('Video added successfully!');
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Error adding video. Please try again.');
    } finally {
      setSubmittingVideo(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await firebase.firestore().collection('videos').doc(videoId).delete();
      alert('Video deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video. Please try again.');
    }
  };

  // Fetch practice questions for this category
  useEffect(() => {
    setPracticeQuestionsLoading(true);
    
    const summaryRef = firebase.firestore().collection(articleType);
    const bodyRef = firebase.firestore().collection(articleType + 'Body');
    
    const unsubscribe = summaryRef
      .where('contentType', '==', 'practiceQuestions')
      .onSnapshot(
        async (snapshot) => {
          const bundles = [];
          const fetchPromises = [];
          
          snapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            
            // Fetch body to get question count
            if (data.body) {
              fetchPromises.push(
                bodyRef.doc(data.body).get().then((bodyDoc) => {
                  if (bodyDoc.exists) {
                    const bodyData = bodyDoc.data();
                    const questions = bodyData.questions || [];
                    return { ...data, questionCount: questions.length };
                  }
                  return { ...data, questionCount: 0 };
                }).catch(() => {
                  return { ...data, questionCount: 0 };
                })
              );
            } else {
              bundles.push({ ...data, questionCount: 0 });
            }
          });
          
          // Wait for all body fetches
          const results = await Promise.all(fetchPromises);
          bundles.push(...results);
          
          // Sort by articleNumber
          bundles.sort((a, b) => {
            const numA = Number(a?.articleNumber || 0);
            const numB = Number(b?.articleNumber || 0);
            return numA - numB;
          });
          
          setPracticeQuestions(bundles);
          setPracticeQuestionsLoading(false);
        },
        (error) => {
          console.error('Error fetching practice questions:', error);
          setPracticeQuestions([]);
          setPracticeQuestionsLoading(false);
        }
      );

    return () => unsubscribe();
  }, [articleType]);

  // Group articles, videos, and practice questions by level for banner display
  const sortedArticles = sortCategoryArticlesByLevelAndArticleNumber(articles);
  const filteredArticles = filterCategoryArticles(sortedArticles, filters);
  const groupedContent = groupContentByLevel(filteredArticles || [], videos || [], practiceQuestions || []);

  // Get category info
  const getCreatePath = () => {
    if (articleType === "biddingBasics") return "/create/bidding/basics";
    if (articleType === "bidding") return "/create/bidding";
    if (articleType === "cardPlayBasics") return "/create/cardPlay/basics";
    if (articleType === "defenceBasics") return "/create/defence/basics";
    return `/create/${articleType}`;
  };

  const isComingSoonBasics = articleType === "cardPlayBasics" || articleType === "defenceBasics";
  const showComingSoon = isComingSoonBasics && a !== true;

  const getCategoryInfo = () => {
    switch (articleType) {
      case 'defence':
        return { name: 'Defence', subtitle: 'Master defensive play' };
      case 'cardPlay':
        return { name: 'Declarer Play', subtitle: 'Skilled declarer play comes from simple counting and basic pattern recognition' };
      case 'bidding':
        return { name: 'Bidding – Articles & explanations', subtitle: 'Deeper concepts and expert-level bidding judgment.' };
      case 'biddingBasics':
        return { name: 'Bidding – Improve your fundamentals', subtitle: 'Critically important to get this right. Build a solid foundation.' };
      case 'biddingAdvanced':
        return { name: 'Bidding – Articles & explanations', subtitle: 'Deeper concepts and expert-level bidding judgment.' };
      case 'cardPlayBasics':
        return { name: 'Declarer Play – Improve your fundamentals', subtitle: 'Coming soon. Build a solid foundation.' };
      case 'defenceBasics':
        return { name: 'Defence – Improve your fundamentals', subtitle: 'Coming soon. Build a solid foundation.' };
      case 'counting':
        return { name: 'Counting', subtitle: 'Articles and videos to support the Counting practice hands' };
      default: 
        return { name: articleType, subtitle: 'Expert bridge articles and analysis' };
    }
  };

  const categoryInfo = getCategoryInfo();

  // Fetch banner texts for all levels when content changes
  useEffect(() => {
    if (groupedContent.length === 0) {
      setBannerTexts({});
      return;
    }

    const fetchBannerTexts = async () => {
      const texts = {};
      const levels = groupedContent.map(g => g.level);
      
      for (const level of levels) {
        try {
          const text = await getBannerText(articleType, level);
          texts[level] = text;
        } catch (error) {
          console.error(`Error fetching banner for level ${level}:`, error);
          // Use fallback text on error
          texts[level] = level === '1' ? 'Start here - Learn the patterns' : `Level ${level}`;
        }
      }
      setBannerTexts(texts);
    };

    fetchBannerTexts();
  }, [articleType, groupedContent.length]);

  // Render articles and videos grouped by level with banners
  let contentJSX;
  if (groupedContent.length > 0) {
    contentJSX = groupedContent.map((group, groupIdx) => {
      const bannerText = bannerTexts[group.level] || `Level ${group.level}`;
      const hasContent = (group.articles?.length > 0) || (group.videos?.length > 0);
      
      if (!hasContent) return null;
      
      return (
        <div key={`level-${group.level}`} className="CategoryArticles-level-group">
          <LevelBanner 
            text={bannerText} 
            level={group.level}
            category={articleType}
            categoryName={categoryInfo.name}
            onUpdate={() => {
              // Refetch banner texts when updated
              const fetchBannerTexts = async () => {
                const texts = {};
                const levels = groupedContent.map(g => g.level);
                for (const level of levels) {
                  try {
                    const text = await getBannerText(articleType, level);
                    texts[level] = text;
                  } catch (error) {
                    texts[level] = level === '1' ? 'Start here - Learn the patterns' : `Level ${level}`;
                  }
                }
                setBannerTexts(texts);
              };
              fetchBannerTexts();
            }}
          />
          <div className="CategoryArticles-grid">
            {/* Render articles */}
            {group.articles.map((article) => (
              <CategoryArticleListItem
                key={article.id}
                createdAt={article.createdAt}
                body={article.body}
                category={article.category}
                difficulty={article.difficulty}
                articleNumber={article.articleNumber}
                id={article.id}
                teaser={article.teaser}
                teaser_board={article.teaser_board}
                title={article.title}
                router={history}
                a={a}
                subscriptionActive={subscriptionActive}
                hasVideo={article.hasVideo === true}
                isFree={article.isFree === true}
                clickHandler={setCurrentArticleAndGoTo}
                articleType={articleType}
              />
            ))}
            {/* Render videos */}
            {group.videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                url={video.url}
                description={video.description}
                createdAt={video.createdAt}
                difficulty={video.difficulty || '1'}
                a={a}
                subscriptionActive={subscriptionActive}
                onDelete={a === true ? handleDeleteVideo : undefined}
              />
            ))}
          </div>
          
          {/* Practice Questions Section */}
          {group.practiceQuestions && group.practiceQuestions.length > 0 && (
            <div className="CategoryArticles-practice-questions-section">
              <h2 className="CategoryArticles-practice-questions-header">
                Practice Questions
              </h2>
              <div className="CategoryArticles-grid">
                {group.practiceQuestions.map((bundle) => (
                  <PracticeQuestionBundleCard
                    key={bundle.id}
                    id={bundle.id}
                    title={bundle.title}
                    teaser={bundle.teaser}
                    difficulty={bundle.difficulty}
                    articleNumber={bundle.articleNumber}
                    questionCount={bundle.questionCount || 0}
                    clickHandler={(id) => {
                      history.push(`/practice-questions/${id}`);
                    }}
                    a={a}
                    subscriptionActive={subscriptionActive}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    });
  }

  const getCategoryTitle = () => {
    return `${categoryInfo.name} Articles - Bridge Champions`;
  };

  const getCategoryDescription = () => {
    return `${categoryInfo.subtitle}. Browse our collection of expert ${categoryInfo.name.toLowerCase()} articles and improve your Bridge game.`;
  };

  const getCategoryUrl = () => {
    return `https://bridgechampions.com/${articleType}`;
  };

  return (
    <div className="CategoryArticles">
      <Helmet>
        <title>{getCategoryTitle()}</title>
        <meta name="description" content={getCategoryDescription()} />
        <link rel="canonical" href={getCategoryUrl()} />
        <meta property="og:url" content={getCategoryUrl()} />
        <meta property="og:title" content={getCategoryTitle()} />
        <meta property="og:description" content={getCategoryDescription()} />
      </Helmet>
      {/* Admin Action Buttons */}
      {a === true && (
        <div className="CategoryArticles-admin-buttons">
          {/* Add Practice Questions Button */}
          <div>
            <Button
              floating
              large
              className="purple darken-2"
              onClick={() => history.push(`/create-practice-questions/${articleType}`)}
              waves="light"
            >
              <Icon>quiz</Icon>
            </Button>
            <span className="CategoryArticles-button-label">Add Practice Questions</span>
          </div>

          {/* Add Video Button */}
          <div>
            <Button
              floating
              large
              className="red darken-2"
              onClick={() => setShowVideoForm(!showVideoForm)}
              waves="light"
            >
              <Icon>videocam</Icon>
            </Button>
            <span className="CategoryArticles-button-label">Add Video</span>
          </div>
          
          {/* Add Article Button */}
          <div>
            <Button
              onClick={(e) => history.push(getCreatePath())}
              floating
              large
              className="green darken-2"
              waves="light"
            >
              <Icon>add</Icon>
            </Button>
            <span className="CategoryArticles-button-label">Add Article</span>
          </div>
        </div>
      )}
      
      {/* Fallback: Show Add component if not admin (for other pages) - hide for Coming Soon basics */}
      {a !== true && !showComingSoon && <Add goto={getCreatePath()} history={history} />}

      <div className="CategoryArticles-header">
        <div className="container">
          <h1 className="CategoryArticles-title">{categoryInfo.name}</h1>
          <p className="CategoryArticles-subtitle">
            {categoryInfo.subtitle}
          </p>
        </div>
      </div>

      {showComingSoon && (
        <div className="CategoryArticles-coming-soon container" style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "36rem", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }} aria-hidden="true">🚧</div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.75rem", color: "#0F4C3A" }}>Coming Soon</h2>
          <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: 1.6 }}>
            We’re building a dedicated <strong>Improve your fundamentals</strong> section here. Check back later for focused, foundational content.
          </p>
        </div>
      )}

      {!showComingSoon && (
      <>
      <div className="CategoryArticles-filters-section">
        <div className="container">
          <FiltersCategoryArticles />
          
          {/* Add Video Form */}
          {showVideoForm && a === true && (
            <Row style={{ marginTop: '2rem' }}>
              <Col s={12} m={10} l={8} offset="m1 l2">
                <Card>
                  <h5>Add New Video</h5>
                  <form onSubmit={handleVideoSubmit}>
                    <Row>
                      <Col s={12}>
                        <TextInput
                          s={12}
                          label="Video Title"
                          name="title"
                          value={newVideo.title}
                          onChange={handleVideoInputChange}
                          required
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col s={12}>
                        <TextInput
                          s={12}
                          label="YouTube URL"
                          name="url"
                          value={newVideo.url}
                          onChange={handleVideoInputChange}
                          required
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col s={12} m={6}>
                        <Select
                          s={12}
                          label="Difficulty Level"
                          name="difficulty"
                          value={newVideo.difficulty}
                          onChange={handleVideoInputChange}
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
                        <label htmlFor="video-description">Description</label>
                        <textarea
                          id="video-description"
                          name="description"
                          value={newVideo.description}
                          onChange={handleVideoInputChange}
                          rows="4"
                          style={{ border: '1px solid #9e9e9e', padding: '10px', width: '100%', fontFamily: 'inherit' }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col s={12} className="center-align">
                        <Button waves="light" type="submit" disabled={submittingVideo}>
                          {submittingVideo ? 'Adding...' : 'Add Video'}
                          <Icon left>save</Icon>
                        </Button>
                        <Button
                          waves="light"
                          style={{ marginLeft: '1rem' }}
                          onClick={() => {
                            setShowVideoForm(false);
                            setNewVideo({ title: '', url: '', description: '', difficulty: '1' });
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>

      <div className="CategoryArticles-content">
        <div className="container">
          {articles === undefined || videosLoading ? (
            <div className="CategoryArticles-grid">
              <SkeletonLoader type="card" count={6} />
            </div>
          ) : groupedContent.length > 0 ? (
            <div className="CategoryArticles-level-groups">
              {contentJSX}
            </div>
          ) : (
            <div className="CategoryArticles-empty">
              <p>No content found matching your filters.</p>
              <p>Try adjusting your difficulty level filter.</p>
            </div>
          )}
        </div>
      </div>

      </>
      )}

    </div>
  );
};

export default CategoryArticles;
