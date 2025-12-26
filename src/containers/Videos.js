import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Card, Icon, Preloader, Modal } from 'react-materialize';
import { firebase } from '../firebase/config';
import './Videos.css';
import Add from './Add';

class Videos extends Component {
    state = {
        videos: [],
        loading: true,
        showAddForm: false,
        newVideo: {
            title: '',
            url: '',
            description: '',
            category: 'Declarer Play'
        },
        submitting: false,
        selectedVideo: null,
        showPaywall: false
    };

    componentDidMount() {
        this.fetchVideos();
    }

    fetchVideos = () => {
        firebase.firestore()
            .collection('videos')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                const videos = [];
                snapshot.forEach(doc => {
                    videos.push({ id: doc.id, ...doc.data() });
                });
                this.setState({ videos, loading: false });
            }, error => {
                console.error('Error fetching videos:', error);
                this.setState({ loading: false });
            });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            newVideo: {
                ...prevState.newVideo,
                [name]: value
            }
        }));
    };

    getYouTubeEmbedUrl = (url) => {
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

    getYouTubeThumbnail = (url) => {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1].split('?')[0];
        }
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { newVideo } = this.state;
        
        if (!newVideo.title || !newVideo.url) {
            alert('Please fill in title and URL');
            return;
        }

        this.setState({ submitting: true });

        const videoData = {
            title: newVideo.title,
            url: this.getYouTubeEmbedUrl(newVideo.url),
            description: newVideo.description,
            category: newVideo.category,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: this.props.uid || 'anonymous'
        };

        firebase.firestore()
            .collection('videos')
            .add(videoData)
            .then(() => {
                this.setState({
                    newVideo: { title: '', url: '', description: '', category: 'Declarer Play' },
                    showAddForm: false,
                    submitting: false
                });
            })
            .catch(error => {
                console.error('Error adding video:', error);
                alert('Error adding video. Please try again.');
                this.setState({ submitting: false });
            });
    };

    deleteVideo = (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            firebase.firestore()
                .collection('videos')
                .doc(id)
                .delete()
                .then(() => {
                    console.log('Video deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting video:', error);
                    alert('Error deleting video. Please try again.');
                });
        }
    };

    handleVideoClick = (video) => {
        const { tier, email } = this.props;
        const isAdmin = this.props.a;
        const isPremium = tier === "premium" || isAdmin;

        if (isPremium) {
            this.setState({ selectedVideo: video });
        } else {
            this.setState({ showPaywall: true });
        }
    };

    closeModal = () => {
        this.setState({ selectedVideo: null, showPaywall: false });
    };

    render() {
        const { videos, loading, showAddForm, newVideo, submitting, selectedVideo, showPaywall } = this.state;
        const { email } = this.props;

        const isAdmin = this.props.a;

        if (loading) {
            return (
                <div className="Videos-container center-align" style={{ marginTop: '5rem' }}>
                    <Preloader size="big" />
                </div>
            );
        }

        return (
            <div className="Videos-outer">
                <Add goto="create/video" history={this.props.history} />
                
                {/* Header Banner */}
                <div className="CategoryArticles-header">
                    <div className="container">
                        <h1 className="CategoryArticles-title">Videos</h1>
                        <p className="CategoryArticles-subtitle">
                            Learn from video lessons
                        </p>
                    </div>
                </div>

                <div className="CategoryArticles-content">
                    <div className="container">
                        <div className="Videos-container">
                            {isAdmin && (
                                <Row>
                                    <Col s={12}>
                                        <div className="Videos-admin-controls" style={{ marginBottom: '2rem', textAlign: 'right' }}>
                                            <Button
                                                waves="light"
                                                className="Videos-add-button"
                                                onClick={() => this.setState({ showAddForm: !showAddForm })}
                                            >
                                                {showAddForm ? 'Cancel' : 'Add Video'}
                                                <Icon left>{showAddForm ? 'close' : 'add'}</Icon>
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {showAddForm && isAdmin && (
                                <Row>
                                    <Col s={12} m={10} l={8} offset="m1 l2">
                                        <Card className="Videos-form-card">
                                            <h5>Add New Video</h5>
                                            <form onSubmit={this.handleSubmit}>
                                                <Row>
                                                    <Col s={12}>
                                                        <label htmlFor="title">Video Title</label>
                                                        <input
                                                            id="title"
                                                            type="text"
                                                            name="title"
                                                            value={newVideo.title}
                                                            onChange={this.handleInputChange}
                                                            required
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col s={12}>
                                                        <label htmlFor="url">YouTube URL</label>
                                                        <input
                                                            id="url"
                                                            type="text"
                                                            name="url"
                                                            value={newVideo.url}
                                                            onChange={this.handleInputChange}
                                                            required
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col s={12}>
                                                        <label htmlFor="category">Category</label>
                                                        <select
                                                            id="category"
                                                            name="category"
                                                            value={newVideo.category}
                                                            onChange={this.handleInputChange}
                                                            className="browser-default"
                                                        >
                                                            <option value="Declarer Play">Declarer Play</option>
                                                            <option value="Defence">Defence</option>
                                                            <option value="Bidding">Bidding</option>
                                                            <option value="General">General</option>
                                                        </select>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col s={12}>
                                                        <label htmlFor="description">Description</label>
                                                        <textarea
                                                            id="description"
                                                            name="description"
                                                            value={newVideo.description}
                                                            onChange={this.handleInputChange}
                                                            rows="4"
                                                            style={{ border: '1px solid #9e9e9e', padding: '10px', width: '100%' }}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col s={12} className="center-align">
                                                        <Button waves="light" type="submit" disabled={submitting}>
                                                            {submitting ? 'Adding...' : 'Add Video'}
                                                            <Icon left>save</Icon>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </form>
                                        </Card>
                                    </Col>
                                </Row>
                            )}

                            <Row>
                                {videos.length === 0 ? (
                                    <Col s={12} className="center-align">
                                        <p style={{ marginTop: '3rem', fontSize: '1.2rem', color: '#666' }}>
                                            No videos yet. {isAdmin && 'Click "Add Video" to get started!'}
                                        </p>
                                    </Col>
                                ) : (
                                    videos.map(video => (
                                        <Col s={12} m={6} l={4} key={video.id}>
                                            <Card className="Videos-card">
                                                <div 
                                                    className="Videos-video-wrapper" 
                                                    onClick={() => this.handleVideoClick(video)}
                                                    style={{ cursor: 'pointer', position: 'relative' }}
                                                >
                                                    <img 
                                                        src={this.getYouTubeThumbnail(video.url)}
                                                        alt={video.title}
                                                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                                        borderRadius: '50%',
                                                        width: '60px',
                                                        height: '60px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Icon style={{ color: 'white', fontSize: '30px' }}>play_arrow</Icon>
                                                    </div>
                                                </div>
                                                <div className="Videos-card-content">
                                                    <h5>{video.title}</h5>
                                                    {video.category && (
                                                        <span className="Videos-category">{video.category}</span>
                                                    )}
                                                    {video.description && (
                                                        <p>{video.description}</p>
                                                    )}
                                                    {isAdmin && (
                                                        <Button
                                                            waves="light"
                                                            className="red"
                                                            onClick={() => this.deleteVideo(video.id)}
                                                            small
                                                        >
                                                            Delete
                                                            <Icon left small>delete</Icon>
                                                        </Button>
                                                    )}
                                                </div>
                                            </Card>
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </div>
                    </div>
                </div>

                {/* Video Player Modal */}
                <Modal
                    open={!!selectedVideo}
                    options={{
                        onCloseEnd: this.closeModal,
                        dismissible: true
                    }}
                    style={{ width: '80%', maxWidth: '900px' }}
                >
                    {selectedVideo && (
                        <div>
                            <h4>{selectedVideo.title}</h4>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                <iframe
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    src={selectedVideo.url}
                                    title={selectedVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            {selectedVideo.description && (
                                <p style={{ marginTop: '1rem' }}>{selectedVideo.description}</p>
                            )}
                        </div>
                    )}
                </Modal>

                {/* Paywall Modal */}
                <Modal
                    open={showPaywall}
                    options={{
                        onCloseEnd: this.closeModal,
                        dismissible: true
                    }}
                    style={{ width: '80%', maxWidth: '500px' }}
                >
                    <div className="center-align" style={{ padding: '2rem' }}>
                        <Icon style={{ fontSize: '80px', color: '#ee6e73' }}>lock</Icon>
                        <h4>Premium Content</h4>
                        {this.props.tier === "basic" ? (
                            <>
                                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                                    Premium videos require a Premium membership.
                                </p>
                                <p style={{ fontSize: '0.95rem', marginBottom: '2rem', fontStyle: 'italic', color: '#666' }}>
                                    Already a Basic member? Upgrade to Premium now and contact us afterward for a prorated refund on your remaining Basic subscription.
                                </p>
                            </>
                        ) : (
                            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                                Upgrade to Premium to access our exclusive video library!
                            </p>
                        )}
                        <Link to="/membership">
                            <Button waves="light" large>
                                Upgrade to Premium
                                <Icon right>arrow_forward</Icon>
                            </Button>
                        </Link>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    uid: state.auth.uid,
    subscriptionActive: state.auth.subscriptionActive,
    tier: state.auth.tier,
    email: state.auth.email,
    a: state.auth.a,
});

export default connect(mapStateToProps)(Videos);
