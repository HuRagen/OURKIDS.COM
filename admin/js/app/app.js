;
(function(Vue) {
    new Vue({
        el: '#app',
        data: {
            list: [
                { name: '', email: '', permission: '', }
            ],
            userList: [
                { name: '', phome: '', uid: '', }
            ],
            form: { managerName: '', managerEmail: '', managerPassword: '', managerCheckPassword: '', admin: true, permission: 'admin', },
            userInfo: { name: "", email: "", phone: "", createdAt: "", bankInfo: "", introCode: "", uid: "" },
            userPlans: { planBought: "", currentLevelIndex: "", directRefer: "", totalPerformance: "", totalReturnBonus: "", referrer: "", },
            userPlans2: { planBought: "", },
            referrer: { name: "" },
            bulletinList: [
                { postTitle: '', postTimes: '', docid: '' }
            ],
            bulletinForm: { postTitle: '', postContent: '', id: '' },
            advertisesList: [
                { bannerImg: '', postImg: '', postTitle: '', category: '廣告', postTimes: '', docid: '' }
            ],
            advertisesForm: { bannerImg: '', postTitle: '', id: '' },
            newsList: [
                { bannerImg: '', postImg: '', postTitle: '', postContent: '', category: '', postTimes: '', docid: '' }
            ],
            newsForm: { bannerImg: '', postTitle: '', postTitle: '', postContent: '', category: '', postSource: '', id: '' },
            plans: { planLevelIndex: '', uid: '', },
            editor1: "",
            user: { token: "", },
            file: [],
        },
        methods: {
            async getManagerInfo() {
                try {
                    let query = await db.collection("appManager").get();
                    let managerList = [];
                    query.forEach(doc => {
                        managerList.push(doc.data());
                    });
                    this.list = managerList;
                    // console.log(this.list);
                    setTimeout(function() { $("#dataTable").DataTable(); }, 1000);
                    //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
                } catch (e) {
                    console.log(e);
                }
            },
            async getUserInfo() {
                try {
                    let query = await db.collection("users").get();
                    let usersList = [];
                    query.forEach(doc => {
                        usersList.push(doc.data());
                    });
                    this.userList = usersList;
                    // console.log(this.list);
                    setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                    //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
                } catch (e) {
                    console.log(e);
                }
            },
            async addAdmin() {
                try {
                    const db = firebase.firestore();
                    await firebase
                        .auth()
                        .createUserWithEmailAndPassword(this.form.managerEmail, this.form.managerPassword);
                    await db
                        .collection("appManager")
                        .doc(this.form.managerEmail)
                        .set({
                            name: this.form.managerName,
                            email: this.form.managerEmail,
                            permission: this.form.permission,
                            admin: this.form.admin
                        });
                    Swal.fire('新增管理員成功').then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                } catch (err) {
                    // console.log("密碼長度至少6碼");
                    Swal.fire('密碼長度至少6碼').then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                }
            },
            async deleteManager(id) {
                try {
                    let user = firebase.auth().getUserByEmail(id)
                    user.delete().then(function() {
                        Swal.fire('已刪除該管理員');
                    })

                } catch (err) {
                    Swal.fire('執行錯誤');
                }
            },
            async redirect() {
                window.location.href = "./index.html";
            },
            async directInfo(id) {
                window.location.href = "./userinfo.html?" + "id=" + id;
            },
            async directBulletin(id) {
                window.location.href = "./bulletinedit.html?" + "id=" + id;
            },
            async directadvertises(id) {
                window.location.href = "./advertisesedit.html?" + "id=" + id;
            },
            async directnews(id) {
                window.location.href = "./discovermenegeredit.html?" + "id=" + id;
            },

            async getUrlId() {
                let url = location.href
                console.log(url)
                if (url.indexOf('?') != -1) {
                    //之後去分割字串把分割後的字串放進陣列中
                    var ary1 = url.split('?');
                    // console.log(ary1)
                    //此時ary1裡的內容為：
                    //ary1[0] = 'index.aspx'，ary1[1] = 'id=U001'

                    //最後如果我們要找id的資料就直接取ary[0]下手，name的話就是ary[1]
                    var ary2 = ary1[1].split('=');
                    // console.log(ary2)
                    //此時ary3裡的內容為：
                    //ary3[0] = 'id'，ary3[1] = 'U001'

                    //取得id值
                    var id = ary2[1];
                    this.getInfo(id);
                    this.getPlans(id);
                    this.getBulletin(id);
                    this.getAdvertises(id);
                    this.getNews(id);
                    // console.log(id)
                }
            },
            async getInfo(id) {
                try {
                    let query = await db
                        .collection("users")
                        .doc(id)
                        .get();
                    // let product = [];
                    // query.forEach(doc => {
                    //   product.push(doc.data());
                    // });
                    this.userInfo = query.data();
                    // console.log(this.userInfo.name);
                } catch (e) {
                    console.log(e);
                }
            },
            async getPlans(id) {
                try {
                    let query = await db
                        .collection("plans")
                        .doc(id)
                        .get();
                    // let product = [];
                    // query.forEach(doc => {
                    //   product.push(doc.data());
                    // });
                    this.userPlans = query.data();
                    if (this.userPlans.planBought == 1) {
                        this.userPlans.planBought = "$1000"
                    }
                    if (this.userPlans.planBought == 2) {
                        this.userPlans.planBought = "$3000"
                    }
                    if (this.userPlans.planBought == 3) {
                        this.userPlans.planBought = "$5000"
                    }
                    if (this.userPlans.planBought == 4) {
                        this.userPlans.planBought = "$10000"
                    }
                    if (this.userPlans.planBought == 5) {
                        this.userPlans.planBought = "$30000"
                    }
                    if (this.userPlans.planBought == 6) {
                        this.userPlans.planBought = "$50000"
                    }
                    if (this.userPlans.currentLevelIndex == 0) {
                        this.userPlans.currentLevelIndex = "一般會員"
                    }
                    if (this.userPlans.currentLevelIndex == 1) {
                        this.userPlans.currentLevelIndex = "BA"
                    }
                    if (this.userPlans.currentLevelIndex == 2) {
                        this.userPlans.currentLevelIndex = "BB"
                    }
                    if (this.userPlans.currentLevelIndex == 3) {
                        this.userPlans.currentLevelIndex = "BC"
                    }
                    if (this.userPlans.currentLevelIndex == 4) {
                        this.userPlans.currentLevelIndex = "BD"
                    }
                    if (this.userPlans.currentLevelIndex == 5) {
                        this.userPlans.currentLevelIndex = "BE"
                    }
                    if (this.userPlans.currentLevelIndex == 6) {
                        this.userPlans.currentLevelIndex = "BF"
                    }
                    let ref = this.userPlans.referrer
                    this.userPlans2 = query.data();
                    console.log(this.userPlans2)
                    this.getreferrer(ref);
                } catch (e) {
                    console.log(e);
                }
            },

            async getreferrer(id) {
                try {
                    let query = await db
                        .collection("users")
                        .doc(id)
                        .get();
                    // let product = [];
                    // query.forEach(doc => {
                    //   product.push(doc.data());
                    // });
                    this.referrer = query.data();
                    console.log(this.referrer.name);
                } catch (e) {
                    console.log(e);
                }
            },
            // get bulletin list
            async getBulletinList() {
                try {
                    let query = await db.collection("bulletinboard").get();
                    let bulletin = [];
                    query.forEach(doc => {
                        item = doc.data();
                        item.docId = doc.id;
                        bulletin.push(item);
                        // console.log(item)
                    });
                    this.bulletinList = bulletin;
                    setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                    //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
                } catch (e) {
                    console.log(e);
                }
            },
            async addBulletin() {
                try {
                    var db = firebase.firestore();
                    var ckdata = CKEDITOR.instances.editor1.getData();
                    await db
                        .collection("bulletinboard")
                        .add({
                            postTimes: moment(this.form.date1).format('YYYY-MM-DD'),
                            postTitle: this.bulletinForm.postTitle,
                            postContent: ckdata,
                        });
                    Swal.fire("更新成功", "", "success").then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            },
            async updateBulletin(id) {
                try {
                    var db = firebase.firestore();
                    var ckdata = CKEDITOR.instances.editor1.getData();
                    await db
                        .collection("bulletinboard")
                        .doc(id)
                        .update({
                            postTimes: moment(this.form.date1).format('YYYY-MM-DD'),
                            postTitle: this.bulletinForm.postTitle,
                            postContent: ckdata,
                        });
                    Swal.fire("更新成功", "", "success").then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            },
            async getBulletin(id) {
                try {
                    let query = await db
                        .collection("bulletinboard")
                        .doc(id)
                        .get();
                    this.bulletinForm = query.data();
                    this.bulletinForm.id = id
                        // console.log(this.bulletinForm.id)
                        // CKeditor function
                    var editor = CKEDITOR.instances['editor1'];
                    editor.setData(this.bulletinForm.postContent);
                } catch (error) {
                    console.error(error);
                }
            },
            async getAdvertisesList() {
                try {
                    let query = await db.collection("advertises").get();
                    let advertises = [];
                    query.forEach(doc => {
                        item = doc.data();
                        item.docId = doc.id;
                        advertises.push(item);
                        // console.log(item)
                    });
                    this.advertisesList = advertises;
                    setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                    //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
                } catch (e) {
                    console.log(e);
                }
            },
            async fileSelected(event) {
                const file = event.target.files.item(0); //取得File物件
                this.file = event.target.files.item(0); //取得File物件
                const reader = new FileReader(); //建立FileReader 監聽 Load 事件
                reader.addEventListener('load', this.imageLoader);
                reader.readAsDataURL(file);
            },
            async imageLoader(event) {
                this.advertisesForm.bannerImg = event.target.result;
            },
            async submitUpload(file) {
                console.log("updating");
                var db = firebase.firestore();
                var storage = firebase.storage();
                var storageRef = firebase.storage().ref();
                console.log(this.file);
                var file = this.file;

                // Create the file metadata
                var metadata = {
                    contentType: file.type
                };

                // Upload file and metadata to the object 'images/mountains.jpg'
                var uploadTask = storageRef
                    .child("images/" + file.name)
                    .put(file, metadata);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(
                    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function(snapshot) {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        var progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log("Upload is paused");
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log("Upload is running");
                                break;
                        }
                        Swal.fire("上傳資料中")
                    },
                    function(error) {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case "storage/unauthorized":
                                // User doesn't have permission to access the object
                                break;
                            case "storage/canceled":
                                // User canceled the upload
                                break;
                            case "storage/unknown":
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                        }
                    },
                    async() => {
                        try {
                            // Upload completed successfully, now we can get the download URL
                            var downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            // console.log('File available at', downloadURL)
                            console.log(downloadURL);
                            let imgRef = downloadURL;
                            await db
                                .collection("advertises")
                                .add({
                                    bannerImg: imgRef,
                                    postImg: imgRef,
                                    postTimes: moment(this.form.date1).format('YYYY-MM-DD'),
                                    postTitle: this.advertisesForm.postTitle,
                                });
                            Swal.fire("更新成功", "", "success").then((result) => {
                                if (result.value) {
                                    this.redirect();
                                }
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                );
            },
            async getAdvertises(id) {
                try {
                    let query = await db
                        .collection("advertises")
                        .doc(id)
                        .get();
                    this.advertisesForm = query.data();
                    this.advertisesForm.id = id
                } catch (error) {
                    console.error(error);
                }
            },
            async submitUpdate(file, id) {
                var db = firebase.firestore();
                var storage = firebase.storage();
                var storageRef = firebase.storage().ref();
                var file = this.file;

                // Create the file metadata
                var metadata = {
                    contentType: file.type
                };

                // Upload file and metadata to the object 'images/mountains.jpg'
                var uploadTask = storageRef
                    .child("images/" + file.name)
                    .put(file, metadata);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(
                    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function(snapshot) {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        var progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log("Upload is paused");
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log("Upload is running");
                                break;
                        }
                        Swal.fire("上傳資料中")
                    },
                    function(error) {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case "storage/unauthorized":
                                // User doesn't have permission to access the object
                                break;
                            case "storage/canceled":
                                // User canceled the upload
                                break;
                            case "storage/unknown":
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                        }
                    },
                    async() => {
                        try {
                            // Upload completed successfully, now we can get the download URL
                            var downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            // console.log('File available at', downloadURL)
                            console.log(downloadURL);
                            let imgRef = downloadURL;
                            await db
                                .collection("advertises")
                                .doc(id)
                                .update({
                                    bannerImg: imgRef,
                                    postImg: imgRef,
                                    postTimes: moment(this.form.date1).format('YYYY-MM-DD'),
                                    postTitle: this.advertisesForm.postTitle,
                                });
                            Swal.fire("更新成功", "", "success").then((result) => {
                                if (result.value) {
                                    this.redirect();
                                }
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                );
            },
            async getNewsList() {
                try {
                    let query = await db.collection("news").get();
                    let news = [];
                    query.forEach(doc => {
                        item = doc.data();
                        item.docId = doc.id;
                        news.push(item);
                        // console.log(item)
                    });
                    this.newsList = news;
                    setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                    //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
                } catch (e) {
                    console.log(e);
                }
            },
            async addNews(file) {
                console.log("updating");
                var db = firebase.firestore();
                var storage = firebase.storage();
                var storageRef = firebase.storage().ref();
                console.log(this.file);
                var file = this.file;

                // Create the file metadata
                var metadata = {
                    contentType: file.type
                };

                // Upload file and metadata to the object 'images/mountains.jpg'
                var uploadTask = storageRef
                    .child("images/" + file.name)
                    .put(file, metadata);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(
                    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function(snapshot) {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        var progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log("Upload is paused");
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log("Upload is running");
                                break;
                        }
                        Swal.fire("上傳資料中")
                    },
                    function(error) {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case "storage/unauthorized":
                                // User doesn't have permission to access the object
                                break;
                            case "storage/canceled":
                                // User canceled the upload
                                break;
                            case "storage/unknown":
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                        }
                    },
                    async() => {
                        try {
                            // Upload completed successfully, now we can get the download URL
                            var downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            // console.log('File available at', downloadURL)
                            let imgRef = downloadURL;
                            var ckdata = CKEDITOR.instances.editor1.getData();
                            await db
                                .collection("news")
                                .add({
                                    bannerImg: imgRef,
                                    postImg: imgRef,
                                    postTimes: moment(this.form.date1).format('YYYY-MM-DD'),
                                    postTitle: this.newsForm.postTitle,
                                    postContent: ckdata,
                                    category: this.newsForm.category,
                                    postSource: this.newsForm.postSource,
                                });
                            Swal.fire("更新成功", "", "success").then((result) => {
                                if (result.value) {
                                    this.redirect();
                                }
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                );
            },
            async fileSelected2(event) {
                const file = event.target.files.item(0); //取得File物件
                this.file = event.target.files.item(0); //取得File物件
                const reader = new FileReader(); //建立FileReader 監聽 Load 事件
                reader.addEventListener('load', this.imageLoader2);
                reader.readAsDataURL(file);
            },
            async imageLoader2(event) {
                this.sectionOneForm.postImg = event.target.result;
            },
            async submitUpdateNews(file, id) {
                var db = firebase.firestore();
                var storage = firebase.storage();
                var storageRef = firebase.storage().ref();
                var file = this.file;

                // Create the file metadata
                var metadata = {
                    contentType: file.type
                };

                // Upload file and metadata to the object 'images/mountains.jpg'
                var uploadTask = storageRef
                    .child("images/" + file.name)
                    .put(file, metadata);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(
                    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function(snapshot) {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        var progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log("Upload is paused");
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log("Upload is running");
                                break;
                        }
                        Swal.fire("上傳資料中")
                    },
                    function(error) {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case "storage/unauthorized":
                                // User doesn't have permission to access the object
                                break;
                            case "storage/canceled":
                                // User canceled the upload
                                break;
                            case "storage/unknown":
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                        }
                    },
                    async() => {
                        try {
                            // Upload completed successfully, now we can get the download URL
                            var downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            // console.log('File available at', downloadURL)
                            console.log(downloadURL);
                            let imgRef = downloadURL;
                            await db
                                .collection("advertises")
                                .doc(id)
                                .update({
                                    bannerImg: imgRef,
                                    postImg: imgRef,
                                    postTimes: moment().format('YYYY-MM-DD'),
                                    postTitle: this.advertisesForm.postTitle,
                                });
                            Swal.fire("更新成功", "", "success").then((result) => {
                                if (result.value) {
                                    this.redirect();
                                }
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                );
            },
            async getNews(id) {
                try {
                    let query = await db
                        .collection("news")
                        .doc(id)
                        .get();
                    this.newsForm = query.data();
                    this.newsForm.id = id
                        // CKeditor function
                    var editor = CKEDITOR.instances['editor1'];
                    editor.setData(this.newsForm.postContent);
                } catch (error) {
                    console.error(error);
                }
            },
            async deletediscover(id) {
                try {
                    let query = await db
                        .collection("news")
                        .doc(id)
                        .delete();
                    Swal.fire("刪除成功", "", "success").then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            },
            async deletebulletin(id) {
                try {
                    await db
                        .collection("bulletinboard")
                        .doc(id)
                        .delete();
                    Swal.fire("刪除成功", "", "success").then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            },
            async deleteadv(id) {
                try {
                    await db
                        .collection("advertises")
                        .doc(id)
                        .delete();
                    Swal.fire("刪除成功", "", "success").then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            },
            async buyPlans() {
                this.plans.uid = this.userInfo.uid;
                console.log(this.plans.uid)
                if (this.plans.planLevelIndex == "1000") {
                    this.plans.planLevelIndex = 1
                }
                if (this.plans.planLevelIndex == "3000") {
                    this.plans.planLevelIndex = 2
                }
                if (this.plans.planLevelIndex == "5000") {
                    this.plans.planLevelIndex = 3
                }
                if (this.plans.planLevelIndex == "10000") {
                    this.plans.planLevelIndex = 4
                }
                if (this.plans.planLevelIndex == "30000") {
                    this.plans.planLevelIndex = 5
                }
                if (this.plans.planLevelIndex == "50000") {
                    this.plans.planLevelIndex = 6
                }
                try {
                    let data = { "uid": this.plans.uid, "planLevelIndex": this.plans.planLevelIndex };
                    console.log(data);
                    axios.post('https://bob.timesapi.com:8443/api/Plan/directBuyPlan', data)
                        .then(res => {
                            console.log(res);
                        })
                    Swal.fire("升級成功", "", "success").then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                } catch (error) {
                    Swal.fire("error");
                }
            },
            async updatePlans() {
                if (this.plans.planLevelIndex == "3000") {
                    this.plans.planLevelIndex = 2
                }
                if (this.plans.planLevelIndex == "5000") {
                    this.plans.planLevelIndex = 3
                }
                if (this.plans.planLevelIndex == "10000") {
                    this.plans.planLevelIndex = 4
                }
                if (this.plans.planLevelIndex == "30000") {
                    this.plans.planLevelIndex = 5
                }
                if (this.plans.planLevelIndex == "50000") {
                    this.plans.planLevelIndex = 6
                }
                try {
                    let data = { "uid": this.userInfo.uid, "planLevelIndex": this.plans.planLevelIndex };
                    console.log(data);
                    axios.post('https://bob.timesapi.com:8443/api/Plan/directBuyPlan', data)
                        .then(res => {
                            console.log(res);
                        })
                    Swal.fire("升級成功", "", "success").then((result) => {
                        if (result.value) {
                            this.redirect();
                        }
                    });
                } catch (error) {
                    Swal.fire("error");
                }
            },



        },
        created() {
            this.getUrlId();
            this.getManagerInfo();
            this.getUserInfo();
            this.getBulletinList();
            this.getAdvertisesList();
            this.getNewsList();
        },
    })
})(Vue)