let data = {
    actImgList: [{
        postTime: '',
        docId: '',
    }],
    actImgForm: {
        Img: '',
        number: '',
        docId: '',
    },
    actBounsContent: {
        Img: '',
        docId: '',
    },
    onlineForm: {
        postTitle: '',
        postImg: '',
    },
    offlineForm: {
        postTitle: '',
        postImg: '',
    },
    onlineList: [
        { postTitle: '', postTimes: '', docId: '', }
    ],
    offlineList: [
        { postTitle: '', postTimes: '', docId: '', }
    ],
    online: { postTitle: '', postTimes: '', postContent: '', postImg: '', docId: '', },
    offline: { postTitle: '', postTimes: '', postContent: '', postLink: '', docId: '', },

}
let vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        async directContent(id) {
            window.location.href = "./activitybounsedit.html?" + "id=" + id;
        },
        async directContent2(id) {
            window.location.href = "./onlineedit.html?" + "id=" + id;
        },
        async directContent3(id) {
            window.location.href = "./offlineedit.html?" + "id=" + id;
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
                this.getactBounsContent(id);
                this.getonlineContent(id);
                this.getofflineContent(id);
            }
        },
        async fileSelected1(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader1);
            reader.readAsDataURL(file);
        },
        async imageLoader1(event) {
            this.actImgForm.Img = event.target.result;
        },
        async fileSelected2(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader2);
            reader.readAsDataURL(file);
        },
        async imageLoader2(event) {
            this.actBounsContent.Img = event.target.result;
        },
        async fileSelected3(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader3);
            reader.readAsDataURL(file);
        },
        async imageLoader3(event) {
            this.onlineForm.postImg = event.target.result;
        },
        async fileSelected4(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader4);
            reader.readAsDataURL(file);
        },
        async imageLoader4(event) {
            this.offlineForm.postImg = event.target.result;
        },
        async fileSelected5(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader5);
            reader.readAsDataURL(file);
        },
        async imageLoader5(event) {
            this.online.postImg = event.target.result;
        },
        async fileSelected6(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader6);
            reader.readAsDataURL(file);
        },
        async imageLoader6(event) {
            this.offline.postImg = event.target.result;
        },
        async getactList() {
            try {
                let query = await db.collection("web-activitybouns").get();
                let actlist = [];
                query.forEach(doc => {
                    item = doc.data();
                    item.docId = doc.id;
                    actlist.push(item);
                    // console.log(item)
                });
                this.actImgList = actlist;
                // console.log(this.opp)
                setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
            } catch (e) {
                console.log(e);
            }
        },
        async getactBounsContent(id) {
            try {
                let query = await db
                    .collection("web-activitybouns")
                    .doc(id)
                    .get();
                this.actBounsContent = query.data();
                this.actBounsContent.docId = id;
            } catch (error) {
                console.error(error);
            }
        },
        async addContent(file) {
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
                            .collection("web-activitybouns")
                            .doc(this.actImgForm.number)
                            .set({
                                Img: imgRef,
                                number: this.actImgForm.number,
                                postTime: moment().format('YYYY-MM-DD'),
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async updateActImgForm(file) {
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
                            .collection("web-activitybouns")
                            .doc(this.actBounsContent.docId)
                            .update({
                                Img: imgRef,
                                number: this.actImgForm.number,
                                postTime: moment().format('YYYY-MM-DD'),
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async getonlineList() {
            try {
                let query = await db.collection("web-online").get();
                let online = [];
                query.forEach(doc => {
                    item = doc.data();
                    item.docId = doc.id;
                    online.push(item);
                    console.log(item)
                });
                this.onlineList = online;
                // console.log(this.opp)
                setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
            } catch (e) {
                console.log(e);
            }
        },
        async getofflineList() {
            try {
                let query = await db.collection("web-offline").get();
                let offline = [];
                query.forEach(doc => {
                    item = doc.data();
                    item.docId = doc.id;
                    offline.push(item);
                    console.log(item)
                });
                this.offlineList = offline;
                // console.log(this.opp)
                setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
            } catch (e) {
                console.log(e);
            }
        },
        async addonlineForm(file) {
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
                        var ckdata = CKEDITOR.instances.editor1.getData();
                        await db
                            .collection("web-online")
                            .add({
                                postImg: imgRef,
                                postTitle: this.onlineForm.postTitle,
                                postContent: ckdata,
                                postTimes: moment().format('YYYY-MM-DD'),
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async addofflineForm(file) {
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
                        var ckdata = CKEDITOR.instances.editor2.getData();
                        await db
                            .collection("web-offline")
                            .add({
                                postImg: imgRef,
                                postTitle: this.offlineForm.postTitle,
                                postContent: ckdata,
                                postTimes: moment().format('YYYY-MM-DD'),
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async updateonline(file) {
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
                        var ckdata = CKEDITOR.instances.editor1.getData();
                        await db
                            .collection("web-online")
                            .doc(this.online.docId)
                            .update({
                                postImg: imgRef,
                                postTitle: this.online.postTitle,
                                postContent: ckdata,
                                postTimes: moment().format('YYYY-MM-DD'),
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async updateoffline(file) {
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
                        var ckdata = CKEDITOR.instances.editor2.getData();
                        await db
                            .collection("web-offline")
                            .doc(this.offline.docId)
                            .update({
                                postImg: imgRef,
                                postTitle: this.offline.postTitle,
                                postContent: ckdata,
                                postTimes: moment().format('YYYY-MM-DD'),
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },

        async getonlineContent(id) {
            try {
                let query = await db
                    .collection("web-online")
                    .doc(id)
                    .get();
                this.online = query.data();
                this.online.docId = id;
                var editor = CKEDITOR.instances['editor1'];
                editor.setData(this.online.postContent);
            } catch (error) {
                console.error(error);
            }
        },
        async getofflineContent(id) {
            try {
                let query = await db
                    .collection("web-offline")
                    .doc(id)
                    .get();
                this.offline = query.data();
                this.offline.docId = id;
                var editor = CKEDITOR.instances['editor2'];
                editor.setData(this.offline.postContent);
            } catch (error) {
                console.error(error);
            }
        },
        async deleteContent(id) {
            try {
                await db
                    .collection("web-activitybouns")
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
        async deleteContent2(id) {
            try {
                await db
                    .collection("web-online")
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
        async deleteContent3(id) {
            try {
                await db
                    .collection("web-offline")
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





    },
    created() {
        this.getUrlId();
        this.getactList();
        this.getonlineList();
        this.getofflineList();
    },
});