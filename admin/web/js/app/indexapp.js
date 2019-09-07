let data = {
    bulletinList: [
        { postTitle: '', postTimes: '', docid: '' }
    ],
    bulletinForm: { postTitle: '', postContent: '', id: '' },
    faqList: [
        { title: '', docid: '' }
    ],
    faqForm: { title: '', answer: '', id: '' },
    sectionOneForm: {
        Title: "",
        Title2: "",
        subTitle: "",
        content1: "",
        content2: "",
        content3: "",
    },
    sectionTwoForm: {
        Title: "",
        Title2: "",
        subTitle: "",
        content1: "",
        content2: "",
        content3: "",
    },
    sectionThreeForm: {
        content1: "",
        content2: "",
        content3: "",
    },
    editor1: "",
    file: [],
}

let vm = new Vue({
    el: '#app',
    data: data,
    methods: {
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
                this.getBulletin(id);
                this.getFaq(id);
                // console.log(id)
            }
        },
        async directBulletin(id) {
            window.location.href = "./bulletinedit.html?" + "id=" + id;
        },
        async directFaq(id) {
            window.location.href = "./faqedit.html?" + "id=" + id;
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
                Swal.fire("更新成功", "", "success")
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
                Swal.fire("更新成功", "", "success")
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
        async getsectionOneForm() {
            try {
                let query = await db
                    .collection("web-Index")
                    .doc("sectionOne")
                    .get();
                this.sectionOneForm = query.data();
                // CKeditor function
            } catch (error) {
                console.error(error);
            }
        },
        async updateSectionOneForm() {
            try {
                var db = firebase.firestore();
                await db
                    .collection("web-Index")
                    .doc("sectionOne")
                    .update({
                        Title: this.sectionOneForm.Title,
                        Title2: this.sectionOneForm.Title2,
                        subTitle: this.sectionOneForm.subTitle,
                        content1: this.sectionOneForm.content1,
                        content2: this.sectionOneForm.content2,
                        content3: this.sectionOneForm.content3,
                    });
                Swal.fire("更新成功", "", "success")
            } catch (error) {
                console.error(error);
            }
        },
        async getsectionTwoForm() {
            try {
                let query = await db
                    .collection("web-Index")
                    .doc("sectionTwo")
                    .get();
                this.sectionTwoForm = query.data();
                // CKeditor function
            } catch (error) {
                console.error(error);
            }
        },
        async updateSectionTwoForm() {
            try {
                var db = firebase.firestore();
                await db
                    .collection("web-Index")
                    .doc("sectionTwo")
                    .update({
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
        },
        async getsectionThreeForm() {
            try {
                let query = await db
                    .collection("web-Index")
                    .doc("sectionThree")
                    .get();
                this.sectionThreeForm = query.data();
                // CKeditor function
            } catch (error) {
                console.error(error);
            }
        },
        async updateSectionThreeForm() {
            try {
                var db = firebase.firestore();
                await db
                    .collection("web-Index")
                    .doc("sectionThree")
                    .update({
                        content2: this.sectionThreeForm.content2,
                        content1: this.sectionThreeForm.content1,
                        content3: this.sectionThreeForm.content3,
                    });
                Swal.fire("更新成功", "", "success")
            } catch (error) {
                console.error(error);
            }
        },
        async getFaqList() {
            try {
                let query = await db.collection("web-faq").get();
                let faq = [];
                query.forEach(doc => {
                    item = doc.data();
                    item.docId = doc.id;
                    faq.push(item);
                    // console.log(item)
                });
                this.faqList = faq;
                setTimeout(function() { $("#dataTable").DataTable(); }, 100000);
                //Init dataTable with more time after fetch all datas. 其他有用到jquery datatable 插件的表格 就加上面這段即可
            } catch (e) {
                console.log(e);
            }
        },
        async addFaq() {
            try {
                var db = firebase.firestore();
                var ckdata = CKEDITOR.instances.editor1.getData();
                await db
                    .collection("web-faq")
                    .add({
                        title: this.faqForm.title,
                        answer: ckdata,
                    });
                Swal.fire("更新成功", "", "success")
            } catch (error) {
                console.error(error);
            }
        },
        async updateFaq(id) {
            try {
                var db = firebase.firestore();
                var ckdata = CKEDITOR.instances.editor1.getData();
                await db
                    .collection("web-faq")
                    .doc(id)
                    .update({
                        title: this.faqForm.postTitle,
                        answer: ckdata,
                    });
                Swal.fire("更新成功", "", "success")
            } catch (error) {
                console.error(error);
            }
        },
        async getFaq(id) {
            try {
                let query = await db
                    .collection("web-faq")
                    .doc(id)
                    .get();
                this.faqForm = query.data();
                this.faqForm.id = id
                    // console.log(this.bulletinForm.id)
                    // CKeditor function
                var editor = CKEDITOR.instances['editor1'];
                editor.setData(this.faqForm.answer);
            } catch (error) {
                console.error(error);
            }
        },
        async deleteFaq(id) {
            try {
                await db
                    .collection("web-faq")
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
        async deleteBulletin(id) {
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

    },
    created() {
        this.getUrlId();
        this.getBulletinList();
        this.getsectionOneForm();
        this.getsectionTwoForm();
        this.getsectionThreeForm();
        this.getFaqList();
    },
});