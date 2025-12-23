// CHANGED FOR COMPATIBILITY REAASONS:
// import * as firebase from "firebase"; // DEPRECATED
// import "@firebase/firestore";

// NEW COMPATIBILITY IMPORTS:
import firebase from "firebase/compat/app"; // COMPATIBLE WITH v9 of firebase
import "firebase/compat/auth";
import "firebase/compat/firestore";

// console.log(firebase.firestore.FieldValue);
// console.log(firebase.firestore.FieldValue.serverTimestamp());

const config = {
  apiKey: "AIzaSyCT-YNVbhvxt2UNttu36HZQvo3k2bgl3JY",
  authDomain: "bridgechampions.firebaseapp.com",
  databaseURL: "https://bridgechampions.firebaseio.com",
  projectId: "bridgechampions",
  storageBucket: "bridgechampions.appspot.com",
  messagingSenderId: "562622614107",
};

firebase.initializeApp(config);
const database = firebase.firestore();

// ADD AND USE NEW REFS, probably using a function for reusability:
// declarerPlay, defence, bidding, quiz
export const getFirebaseDbRef = (refName) => {
  return database.collection(refName);
};

// article summary data:
const articlesRef = database.collection("articles");
// article body data:
const articleRef = database.collection("article");

// 3 NEW TYPES OF ARTICLES:
const biddingSummaryRef = database.collection("bidding");
const biddingBodyRef = database.collection("biddingBody");
const cardPlaySummaryRef = database.collection("cardPlay");
const cardPlayBodyRef = database.collection("cardPlayBody");
const defenceSummaryRef = database.collection("defence");
const defenceBodyRef = database.collection("defenceBody");

const usersRef = database.collection("users");
const categoriesRef = database.collection("categories");
const quizzesRef = database.collection("quizzes");
const quizRef = database.collection("quiz");
const countsRef = database.collection("counts").doc("counts");
const membersRef = database.collection("members");
const membersDataRef = database.collection("membersData");
const freeDailyRef = database.collection("freeDaily");
const questionsRef = database.collection("questions");
// const database = firebase.database();
// const articlesRef = database.ref('articles');
// const articleRef = database.ref('article');

// console.log(firebase.database);
// console.log(firebase.auth);

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const emailAuthProvider = new firebase.auth.EmailAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export {
  firebase,
  googleAuthProvider,
  emailAuthProvider,
  facebookAuthProvider,
  articlesRef,
  articleRef,
  biddingSummaryRef,
  biddingBodyRef,
  cardPlaySummaryRef,
  cardPlayBodyRef,
  defenceSummaryRef,
  defenceBodyRef,
  categoriesRef,
  quizzesRef,
  quizRef,
  usersRef,
  countsRef,
  membersRef,
  membersDataRef,
  freeDailyRef,
  questionsRef,
  database as default,
};

// ##** FIRESTORE API:
// - with the full path:
// const document = firebase.firestore().doc('users/user_id-xyz');
// - alternating between collection and document key:
// const document = firebase.firestore().collection('users').doc('user_id-xyz');

// ## ADD - like .push({}) from the realtime database.
// - Important: Unlike "push IDs" in the Firebase Realtime Database, Cloud Firestore auto-generated IDs do not provide any automatic ordering. If you want to be able to order your documents by creation date, you should store a timestamp as a field in the documents.
// document.add({ ... })
//   .then(res => res.id)  // <- res.id is the auto-generated ID

// ## TESTING:
// articlesRef.add({
//     title: "BANANAS",
//     content: "this shit is bananas"
// })
//     .then(res => {
//        const id = res.id;
//        articlesRef.doc(id).set({
//            body: "THIS IS THE BODY OF ARTICLE"
//         })
//         .then(res2 => {
//
//         });
//     })

// ## TESTING BATCH
// const batch = database.batch();
// const newArticleRef = articleRef.doc();
// const newArticlesRef = articlesRef.doc();
// console.log(newArticleRef);
// console.log(newArticleRef.id);
// console.log(newArticlesRef);
// console.log(newArticlesRef.id);
// batch.set(newArticlesRef, {
//     title: "BANANAS",
//     content: "this shit is bananas",
//     body: newArticleRef.id,
//     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//     updatedAt: firebase.firestore.FieldValue.serverTimestamp()
// });
// batch.set(newArticleRef, {
//     body: "lala this is my article body"
// });
// batch.commit().then(something => { console.log(something) });

// ## OR can generate a doc reference id and then use set with it:
// var newCityRef = db.collection('cities').doc();
// // Later...
// var setDoc = newCityRef.set({
//     // ...
// })

// ## SET: replace if it exists, create if it doesnt:
//    - returns a promise
// document.set({...})

// ## UPDATE: update fields with an object
//   - returns a promise
// document.update({...})

// ## DELETE:
//  - returns a promise.
// document.delete()

// ## GET:
// - fetch once: returns a promise with the snapshot:
// document.get()
//     .then(snapshot => {
//         if (snapshot && snapshot.exists) {
//             const data = snapshot.data();
//         }
//     })
//     .catch(err => ...)

// - subscribe: using the onSnapshot listener:
// document.onSnapshot(snapshot => {
//    if (snapshot && snapshot.exists) {
//        const data = snapshot.data();
//    }
// })

// ## TIMESTAMPS:
// // Get the `FieldValue` object
// var FieldValue = require("firebase-admin").firestore.FieldValue;
//
// // Create a document reference
// var docRef = db.collection('objects').doc('some-id');
//
// // Update the timestamp field with the value from the server
// var updateTimestamp = docRef.update({
//     timestamp: FieldValue.serverTimestamp()
// });

//##** FIREBASE REAL TIME DATABASE:

// import database from '...firebase/config';
// const articlesDB = database.ref('articles');

// let res2 = database.ref('users').push({ name: "Sean", hobbies: "zzz"});
// console.log(res2.getKey())

// .on() to subscribe
// - 'value' - when values changed
// - 'child_removed' - when a child of the ref is deleted.
// - 'child_changed'
// - 'child_added'
// .once() to fetch data once.
//.update({...}) to update
//.push({...}) to create a new thing and automatically generate a new id.
//.remove() to remove a thing
//.set({...}) to overwrite a thing

//.child(<uniqueId>) to access an entry using its id.
// - then you can update, remove and set the child.

//##** FULL ARTICLE STUFF for POSTING and then retrieving articles:
// -- create the article first, then use its returned id stored
//   in res.getKey() to create another database entry for the
//   article content which has the same id as the article in
//   the articles database:
// let res = database.ref('articles')
//     .push({
//             name: "Suzie",
//             hobbies: "eating cake",
//             createdAt: firebase.database.ServerValue.TIMESTAMP
//     })
//     .then(res => {
//         let articlesRef = database.ref('article');
//         articlesRef.child(res.getKey()).set({
//             title: 'test fallafel',
//             createdAt: firebase.database.ServerValue.TIMESTAMP
//         })
//             .then(() => {
//                 database.ref(`article/${res.getKey()}`)
//                     .once('value')
//                     .then(snapshot => console.log(snapshot.val()));
//             });
//     });

// ##** fetch all articles:
// database.ref('articles').once('value')
//     .then(snapshot => console.log(snapshot.val()));

// ##** fetch one article by id:
// let articleId = '-L3wH4FJrSxEdvfimeVx';
// database.ref(`article/${articleId}`).once('value')
//     .then(snapshot => console.log(snapshot.val()))
//     .catch(err => )

// const query = firebase.database().ref("...").orderByKey();
// query.once('value')
// query.child('someKey').once('value');

// ##** Snapshot properties:
// - key
// - ref

// ##** Snapshot methods:

// ## CREATE an array of objects from the collection returned by the DB:
// const arrOfData = [];
// - snapshot.forEach(child => {
//      child.val(); child.key;
//      arrOfData.push({ id: child.key, ...child.val()})
// })
// - child
// - exists
// - exportVal
// - getPriority
// - toJSON
// - val
// - numChildren
// - hasChildren
// - hasChild
//

// database.ref('articles').push({ content: 'blabla', id: res.getKey() })
//     .then(res3 => {
//         console.log(res.getKey() == res3.getKey());
//     });
//https://bridgechampions.firebaseio.com/users.json
// database.ref('users/hobbies/like').set("cake")
// database.ref('users').set({
//     name: "Sean",
//     hobbies: {
//         like: "tea"
//     } // nothing is returned from the promise:
// }).then(() => console.log('data updated'))
//   .catch((err) => console.log('this failed: ', err));

// ##* CRUD FUNCTIONALITY FROM FIREBASE:
// database.ref(...).set(value, onCompleteCallbackFn) - returns a promise containing void
// database.ref(...).remove(onCompleteCallbackFn) - will remove whatever is at ...
// - .set(null) is equivalent to .remove()
// .ref(...).update(
// - more efficient, must be called with an object
// - doesnt update nested objects - just replaces them.
// - .update({'somePath/location/city'}) <- to update the object prop location with
//   its own prop city without replacing the whole location object.
// - if you do .update and update something to null == deleting it.

// ## READ:
// 1) fetch basic data once - returns a promise:
// - will reject with error if auth fails
// database.ref(...).once('value')
// .then((dataSnapshot) => { dataSnapshot.val() })
// .catch(e => {})

// 2) subscribe/listen to changes: fetch data every time it changes - server notifies us.
// - returns a function
// const subscription = database.ref(...).on('value',
//          (snapshot) => { snapshot.val() },
//          (err) => console.log(e));
//
// - subscription.off() <- to unsubscribe.
// - database.ref().off <- cancel all subscriptions to base route
