let data = {
    sectionOneForm: {
        content1: "",
        content2: "",
        content3: "",
        postImg: '',
    },
    sectionTwoForm: {
        Title: "",
        Title2: "",
        subTitle: "",
        content1: "",
        content2: "",
        content3: "",
        postImg: '',
    },
    sectionThreeForm: {
        Title: "",
        Title2: "",
        subTitle: "",
        content1: "",
        content2: "",
        content3: "",
        postImg: '',
    },
    sectionFourForm: {
        Title: "",
        Title2: "",
        subTitle: "",
        content1: "",
        content2: "",
        content3: "",
        postImg: '',
    },
    editor1: "",
    file: [],
}

let vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        async fileSelected1(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader1);
            reader.readAsDataURL(file);
        },
        async imageLoader1(event) {
            this.sectionOneForm.postImg = event.target.result;
        },
        async fileSelected2(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader2);
            reader.readAsDataURL(file);
        },
        async imageLoader2(event) {
            this.sectionTwoForm.postImg = event.target.result;
        },
        async fileSelected3(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader3);
            reader.readAsDataURL(file);
        },
        async imageLoader3(event) {
            this.sectionThreeForm.postImg = event.target.result;
        },
        async fileSelected4(event) {
            const file = event.target.files.item(0); //取得File物件
            this.file = event.target.files.item(0); //取得File物件
            const reader = new FileReader(); //建立FileReader 監聽 Load 事件
            reader.addEventListener('load', this.imageLoader4);
            reader.readAsDataURL(file);
        },
        async imageLoader4(event) {
            this.sectionFourForm.postImg = event.target.result;
        },
        async getsectionOneForm() {
            try {
                let query = await db
                    .collection("web-business")
                    .doc("sectionOne")
                    .get();
                this.sectionOneForm = query.data();
                console.log(this.sectionOneForm)
            } catch (error) {
                console.error(error);
            }
        },
        async updateSectionOneForm(file) {
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
                            .collection("web-business")
                            .doc("sectionOne")
                            .update({
                                postImg: imgRef,
                                content1: this.sectionOneForm.content1,
                                content2: this.sectionOneForm.content2,
                                content3: this.sectionOneForm.content3,
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async getsectionTwoForm() {
            try {
                let query = await db
                    .collection("web-business")
                    .doc("sectionTwo")
                    .get();
                this.sectionTwoForm = query.data();
                console.log(this.sectionTwoForm)
            } catch (error) {
                console.error(error);
            }
        },
        async updateSectionTwoForm(file) {
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
                            .collection("web-business")
                            .doc("sectionTwo")
                            .update({
                                postImg: imgRef,
                                Title: this.sectionTwoForm.Title,
                                Title2: this.sectionTwoForm.Title2,
                                subTitle: this.sectionTwoForm.subTitle,
                                content1: this.sectionTwoForm.content1,
                                content2: this.sectionTwoForm.content2,
                                content3: this.sectionTwoForm.content3,
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async getsectionThreeForm() {
            try {
                let query = await db
                    .collection("web-business")
                    .doc("sectionThree")
                    .get();
                this.sectionThreeForm = query.data();
                console.log(this.sectionThreeForm)
            } catch (error) {
                console.error(error);
            }
        },
        async updateSectionThreeForm(file) {
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
                            .collection("web-business")
                            .doc("sectionThree")
                            .update({
                                postImg: imgRef,
                                Title: this.sectionThreeForm.Title,
                                Title2: this.sectionThreeForm.Title2,
                                subTitle: this.sectionThreeForm.subTitle,
                                content1: this.sectionThreeForm.content1,
                                content2: this.sectionThreeForm.content2,
                                content3: this.sectionThreeForm.content3,
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
        async getsectionFourForm() {
            try {
                let query = await db
                    .collection("web-business")
                    .doc("sectionFour")
                    .get();
                this.sectionFourForm = query.data();
                console.log(this.sectionFourForm.postImg)
            } catch (error) {
                console.error(error);
            }
        },
        async updateSectionFourForm(file) {
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
                            .collection("web-business")
                            .doc("sectionFour")
                            .update({
                                postImg: imgRef,
                                Title: this.sectionFourForm.Title,
                                Title2: this.sectionFourForm.Title2,
                                subTitle: this.sectionFourForm.subTitle,
                                content1: this.sectionFourForm.content1,
                                content2: this.sectionFourForm.content2,
                                content3: this.sectionFourForm.content3,
                            });
                        Swal.fire("更新成功", "", "success")
                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        },
    },
    created() {
        this.getsectionOneForm();
        this.getsectionTwoForm();
        this.getsectionThreeForm();
        this.getsectionFourForm();
    },
});