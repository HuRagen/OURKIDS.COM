let data = {
    accountbox: true,
    form: {},
    testFormList: [{
        postImg: '',
        Title: '',
        theme: '',
        age: '',
        content: '',
        postTimes: '',
    }],

}

let vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        async commingsoon() {
            console.log("getMe")
            Swal.fire("功能即將上線", "", "success")
        },
        async registerForm() {
            var trigger = $('.accountbox-trigger'),
                container = $('.accountbox-wrapper');
            $('<div class="body-overlay"></div>').prependTo(container);

            trigger.on('click', function(e) {
                e.preventDefault();
                container.addClass('is-visible');
            });

            $('.body-overlay').on('click', function() {
                container.removeClass('is-visible');
            });

            $('span.accountbox-close-button').on('click', function() {
                container.removeClass('is-visible');
            });

        },
        async submitForm() {
            console.log(this.form)
            try {
                var container = $('.accountbox-wrapper');
                container.removeClass('is-visible');

                Swal.fire("提交成功", "", "success")
                await db
                    .collection("FormOrder")
                    .add({
                        Name: this.form.name,
                        Id: this.form.id,
                        email: this.form.email,
                        type: this.form.type,
                    });

            } catch (error) {
                console.error(error);
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
    },
    created() {
        this.gettestList();
    },
});