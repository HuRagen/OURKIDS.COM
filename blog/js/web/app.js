let data = {
    recordsImgList: [{
        postTitle: '',
        postTimes: '',
        postImg: '',
        docId: '',
    }],
    recordsImg: { postTitle: '', postTimes: '', postContent: '', postImg: '', docId: '', },
}
let vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        async directContent(id) {
            window.location.href = "./blogImg.html?" + "id=" + id;
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
                this.getImgContent(id);
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
            } catch (error) {
                console.error(error);
            }
        },
        async getblogImg() {
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
                $.getScript("js/functions.js", function() {});
            } catch (e) {
                console.log(e);
            }
        },

    },
    created() {
        this.getblogImg();
        this.getUrlId();

    },
});