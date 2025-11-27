import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Card, Icon, Preloader } from 'react-materialize';
import { firebase } from '../firebase/config';
import './Videos.css';

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
        submitting: false
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
                .catch(error => {
                    console.error('Error deleting video:', error);
                    alert('Error deleting video');
                });
        }
    };

    render() {
        const { videos, loading, showAddForm, newVideo, submitting } = this.state;
        const { uid, subscriptionActive } = this.props;

        const isAdmin = this.props.email === "paul.dalley@hotmail.com";
        const isPremium = this.props.tier === "premium" || isAdmin;
        const canViewVideos = isPremium;

        if (!canViewVideos && !isAdmin) {
      return (
        <div className="Videos-container center-align" style={{ marginTop: "5rem" }}>
          <h4>Premium Membership Required</h4>
          <p>Videos are only available to Premium members.</p>
          <Link to="/membership">
            <Button waves="light">Upgrade to Premium</Button>
          </Link>
        </div>
      );
    }

    if (loading) {
            return (
                <div className="Videos-container center-align" style={{ marginTop: '5rem' }}>
                    <Preloader size="big" />
                </div>
            );
        }

        return (
            <div className="Videos-container">
                <Row>
                    <Col s={12}>
                        <div className="Videos-header">
                            <h3>Bridge Videos</h3>
                            {isAdmin && (
                                <Button
                                    waves="light"
                                    className="Videos-add-button"
                                    onClick={() => this.setState({ showAddForm: !showAddForm })}
                                >
                                    {showAddForm ? 'Cancel' : 'Add Video'}
                                    <Icon left>{showAddForm ? 'close' : 'add'}</Icon>
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>

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
                                    <div className="Videos-video-wrapper">
                                        <iframe
                                            width="100%"
                                            height="250"
                                            src={video.url}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
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
        );
    }
}

const mapStateToProps = (state) => ({
    uid: state.auth.uid,
    subscriptionActive: state.auth.subscriptionActive,
  tier: state.auth.tier,
    email: state.auth.email,
});

export default connect(mapStateToProps)(Videos);
