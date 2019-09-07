// import { userInfo } from "os";

var config = {
    apiKey: "AIzaSyBLWbtxhvdEsy3WaHpxfq92Yloh4UNdMqc",
    authDomain: "ourkids-613f9.firebaseapp.com",
    databaseURL: "https://ourkids-613f9.firebaseio.com",
    projectId: "ourkids-613f9",
    storageBucket: "ourkids-613f9.appspot.com",
    messagingSenderId: "532273295893",
};
firebase.initializeApp(config);
var db = firebase.firestore();
const firestore = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user.email)
    } else {
        // console.log('not login')
        // window.location.href='login.html'
    }
});

async function login() {
    try {
        let email = $('#email').val();
        let password = $('#password').val();

        await firebase.auth().signInWithEmailAndPassword(email, password);
        // console.log('123')

        window.location = 'index.html'

    } catch (err) {
        console.log(err);
        Swal.fire('登入信箱或密碼輸入錯誤')
    }
}

async function signup() {
    try {
        let name = $('#text').val();
        let email = $('#email').val();
        let password = $('#password').val();
        let password2 = $('#password2').val();
        if (password != password2) {
            Swal.fire('密碼不一致')
            return;
        }
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        // console.log('123')
        await db.collection('Manager').doc(email).set({
            name: name,
            email: email,
            admin: false,
        });
        window.location = 'index.html'

    } catch (err) {
        console.log(err);
    }
}

// GET USER INFO 
// async function userName() {
//     try {
//         let text = await db.collection("sourceCMS").doc(user).get();
//         let data = text.data();
//         console.log(user);
//         for (let key in data) {
//             //console.log(key);

//             $('.' + key).val(data[key]);

//         }

//     } catch (err) {
//         console.log(err);
//     }
// }