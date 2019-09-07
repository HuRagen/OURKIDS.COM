var config = {
    apiKey: "AIzaSyB7XWMdMvVvw1PM6tzNSMqDx2zSdfqZZco",
    authDomain: "bob-api-ed3fb.firebaseapp.com",
    databaseURL: "https://bob-api-ed3fb.firebaseio.com",
    projectId: "bob-api-ed3fb",
    storageBucket: "bob-api-ed3fb.appspot.com",
    messagingSenderId: "424380050382",
};
firebase.initializeApp(config);

var db = firebase.firestore();
const firestore = firebase.firestore();