let data = {
    recordsImgForm: {
        postTitle: '',
        postImg: '',
    },
    recordsImgList: [
        { postTitle: '', postTimes: '', docId: '', }
    ],
    testFormList: [{
        postImg: '',
        Title: '',
        theme: '',
        age: '',
        content: '',
        postTimes: '',
    }],
    recordsImg: { postTitle: '', postTimes: '', postContent: '', postImg: '', docId: '', },
    editor1: "",
    file: [],
    testFormfile: [],
    testForm: {
        postImg: '',
    },
    testFormContent: {
        postImg: '',
        Title: '',
        theme: '',
        age: '',
        content: '',
        postTimes: '',
    }

}

let vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        async directContent(id) {
            window.location.href = "./blogedit.html?" + "id=" + id;
        },
        async directTestContent(id) {
            window.location.href = "./testedit.html?" + "tid=" + id;
        },
        async directContent2(id) {
            window.location.href = "./recordmenegeredit2.html?" + "id=" + id;
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
                if (ary2[0] == "tid") {
                    var id = ary2[1];
                    this.getTestContent(id);
                } else {
                    var id = ary2[1];
                    this.getImgContent(id);
                }

            }
        },
        async fileSelected1(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader1);
            reader.readAsDataURL(file);
        },
        async fileSelected2(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader2);
            reader.readAsDataURL(file);
        },
        async imageLoader1(event) {
            this.recordsImgForm.postImg = event.target.result;
        },
        async imageLoader2(event) {
            this.testForm.postImg = event.target.result;
            console.log('getME')
            console.log(this.testForm.postImg)
        },
        async getrecordsImg() {
            try {
                let query = await db.collection("blog").get();
                let records = [];
                query.forEach(doc => {
                    item = doc.data();
                    item.docId = doc.id;
                    records.push(item);
                    console.log(item)
                });
                this.recordsImgList = records;
                // console.log(this.opp)
                setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
            } catch (e) {
                console.log(e);
            }
        },
        async gettestList() {
            try {
                let query = await db.collection("TestBank").get();
                let records = [];
                query.forEach(doc => {
                    item = doc.data();
                    item.docId = doc.id;
                    records.push(item);
                    console.log(item)
                });
                this.testFormList = records;
                console.log(this.testFormList)
                setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
            } catch (e) {
                console.log(e);
            }
        },
        async getImgContent(id) {
            try {
                let query = await db
                    .collection("blog")
                    .doc(id)
                    .get();
                this.recordsImg = query.data();
                this.recordsImg.docId = id;
                var editor = CKEDITOR.instances['editor1'];
                editor.setData(this.recordsImg.postContent);
            } catch (error) {
                console.error(error);
            }
        },
        async getTestContent(id) {
            try {
                let query = await db
                    .collection("TestBank")
                    .doc(id)
                    .get();
                this.testFormContent = query.data();
                this.testFormContent.docId = id;
                var editor = CKEDITOR.instances['editor1'];
                editor.setData(this.testFormContent.content);
            } catch (error) {
                console.error(error);
            }
        },
        async addrecordsImgForm(file) {
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
                            .collection("blog")
                            .add({
                                postImg: imgRef,
                                postTitle: this.recordsImgForm.postTitle,
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
        async addtestForm(file) {
            var db = firebase.firestore();
            var storage = firebase.storage();
            var storageRef = firebase.storage().ref();
            var file = this.file;

            // Create the file metadata
            var metadata = {
                contentType: file.type
            };

            // Upload testFormfile and metadata to the object 'images/mountains.jpg'
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
                        // console.log('testFormfile available at', downloadURL)
                        console.log(downloadURL);
                        let imgRef = downloadURL;
                        var ckdata = CKEDITOR.instances.editor2.getData();
                        let data = {
                            postImg: imgRef,
                            Title: this.testForm.Title,
                            theme: this.testForm.theme,
                            age: this.testForm.age,
                            content: ckdata,
                            postTimes: moment().format('YYYY-MM-DD'),
                        }
                        console.log(data)
                        await db
                            .collection("TestBank")
                            .add(data);
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async updaterecordsImgForm(file) {
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
                            .collection("blog")
                            .doc(this.recordsImg.docId)
                            .update({
                                postImg: imgRef,
                                postTitle: this.recordsImg.postTitle,
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
        async updatetestForm(file) {
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
                        let data = {
                            postImg: imgRef,
                            Title: this.testFormContent.Title,
                            theme: this.testFormContent.theme,
                            age: this.testFormContent.age,
                            content: ckdata,
                            postTimes: moment().format('YYYY-MM-DD'),
                        }
                        await db
                            .collection("TestBank")
                            .doc(this.testFormContent.docId)
                            .update(data);
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async deleteContent(id) {
            try {
                await db
                    .collection("blog")
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
        this.getrecordsImg();
        this.gettestList();
        this.getUrlId();
    },
});