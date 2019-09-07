var config = {
    apiKey: "AIzaSyBLWbtxhvdEsy3WaHpxfq92Yloh4UNdMqc",
    authDomain: "ourkids-613f9.firebaseapp.com",
    databaseURL: "https://ourkids-613f9.firebaseio.com",
    projectId: "ourkids-613f9",
    storageBucket: "ourkids-613f9.appspot.com",
    messagingSenderId: "532273295893",
};
firebase.initializeApp(config);
// check User
firebase.auth().onAuthStateChanged(async(user) => {
    if (user) {
        let userdoc = await db.collection('Manager').doc(user.email).get();
        let userData = userdoc.data();

        for (let key in userData) {

            $('.' + key).html(userData[key]);

        }
        if (!userData.admin) { window.location.href = 'index.html' }
        //    INPUT LINK
        console.log(userData)
    } else {
        window.location.href = 'login.html'
    }

});


var db = firebase.firestore();
const firestore = firebase.firestore();

// ***************
// checking user
// ***************

async function signout() {
    try {

        await firebase.auth().signOut();
        // console.log('123')

        window.location = 'login.html'

    } catch (err) {
        console.log(err);
    }
}