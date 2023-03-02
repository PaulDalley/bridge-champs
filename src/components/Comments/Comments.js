import React, { Component } from 'react';
import { firebase } from '../../firebase/config';
// import AddComment from './AddComment';
// import Comment from './Comment';

const commentsRef = firebase.firestore().collection('comments');

class Comments extends Component {
    state = {

    }

    submitComment = () => {
        // userUid: this.props.uid,
        // userPhoto: this.props.photoURL,
        // userName:  this.props.username || this.props.displayName || "Anonymous",
        // commentBody:
        // parentUID,
    }


    prepareNextBatch = (lastVisible) => {
        const next = commentsRef
            .orderBy("createdAt")
            .startAfter(lastVisible)
            .limit(20);
        this.setState({ nextBatch: next });
    }

    getNextBatch = () => {
        this.state.nextBatch.get()
            .then((documentSnapshots) => {
                // Get the last visible document
                console.log(documentSnapshots);
                const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
                console.log("last", lastVisible);
                this.prepareNextBatch(lastVisible);
        });
    }

    componentDidMount() {
        console.log(this.props);
        if (!this.props.parentId) return;
        // Get the first batch of comments:
        const first = commentsRef
            .where('parent', '==', this.props.parentId)
            .orderBy("createdAt")
            .limit(20);

        return first.get().then((documentSnapshots) => {
            // Get the last visible document
            console.log(documentSnapshots);
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
            console.log("last", lastVisible);
            this.prepareNextBatch(lastVisible);
        });
    }

    render() {
        return (
          <div>

            {/*<AddComment submitHandler={this.submitComment}/>*/}
          </div>
        );
    }
}

export default Comments;
