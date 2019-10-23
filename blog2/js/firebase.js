// Initialize Firebase
var config = {
    apiKey: "AIzaSyDFQ2Pz3kymACjI8_qXvDnOvw0dThKah1E",
    authDomain: "academy-art.firebaseapp.com",
    databaseURL: "https://academy-art.firebaseio.com",
    projectId: "academy-art",
    storageBucket: "academy-art.appspot.com",
    messagingSenderId: "547906759834"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);


// ***************
// checking user
// ***************
async function logOut () {
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        initUser()
    }, function(error) {
        console.error('Sign Out Error', error);
    });
}

async function initUser () {
    try {
        firebase.auth().onAuthStateChanged(user => {
            if (user) { 
                var data = {
                    userUid: user.uid,
                    displayName:user.displayName
                }
                $('.loginBtn').html('<a href="panel/"><span>歡迎 ' + data.displayName + '</span></a>')
                $('.myLessonsAndEvents').fadeIn()
                $('.logOut').fadeIn()
            } else {
                console.log('not sign in')
                $('.loginBtn').html('<a href="panel/"><span>註冊 / 登入</span></a>')
                $('.myLessonsAndEvents').fadeOut()
                $('.logOut').fadeOut()
            }
        });
    } catch (error) {
        console.log(error)
    }
}

async function attendLesson (lessonId) {
    $('#buyLesson').attr('disabled', true)
    setTimeout(function(){
        $('#buyLesson').attr('disabled', false)
    }, 2000)
    try {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) { 
                var data = {
                    userUid: user.uid,
                    displayName: user.displayName
                }
                data.lessonId = lessonId

                await addLessonToCart(data)
            } else {
                swal({
                    title: '請先登入',
                    text: "",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '前往登入',
                    cancelButtonText: '下次再說'
                }).then((result) => {
                    if (result.value) {
                        window.location.href="panel/"       
                    }
                })
                console.log('not sign in')
            }
        });
    } catch (error) {
        console.error(error)
    }
}

async function attendEvent (eventId) {
    $('#attendEvent').attr('disabled', true)
    setTimeout(function(){
        $('#attendEvent').attr('disabled', false)
    }, 2000)
    try {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) { 
                var data = {
                    userUid: user.uid,
                    displayName: user.displayName
                }
                data.eventId = eventId
                
                await addEventToCart(data)
            } else {
                swal({
                    title: '請先登入',
                    text: "",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '前往登入',
                    cancelButtonText: '下次再說'
                }).then((result) => {
                    if (result.value) {
                        window.location.href="panel/"       
                    }
                })
                console.log('not sign in')
            }
        });
    } catch (error) {
        console.error(error)
    }
}

async function addLessonToCart (data) {
    try {
        var db = firebase.firestore()
        // check if user has added event to cart already
        let query = await db.collection('myLessons')
            .where('adminVerified', '==', false)
            .where('lessonId', '==', data.lessonId)
            .where('userUid', '==', data.userUid)
            .get()
        if (query.size > 0) {
            console.log('user has already attend !')
            return
        }

        // creating orders        
        var lessonData = await getLessonData(data.lessonId)
        data.applyDateTime = parseDateTimeFormat()
        data.adminVerified = false
        if (!lessonData.price) {
            data.price = 0
        } else {
            data.price = lessonData.price
        }
        data.lessonName = lessonData.name
        data.lessonCategory = lessonData.category
        // import verification code js to use this method
        data.verificationCode = GenerateCodeNumber("00000000")
        // getting user info
        var user = await getUserInfo(data.userUid)
        data.userBankAccount = user.bankAccount
        // getting bank info
        var bank = await getBank()
        for (key in bank) {
            data[key] = bank[key]
        }

        await db.collection('myLessons').add(data)
        let transferInfo = `<ul style="text-align: left;">
                <li>銀行名稱： ${ data.bankName}</li>
                <li>銀行代號： ${ data.bankCode}</li>
                <li>戶名： ${ data.accountName}</li>
                <li>匯款帳號： ${ data.bankAccount}</li>
                <li>往來行： ${ data.correspondent}</li>
                <hr>
                <li>課程名稱： ${ data.lessonName}</li>
                <li>金額： ${ data.price || 0}</li>
                <li>確認碼： ${ data.verificationCode}</li>
            </ul>
            <small>匯款時請備註確認碼</small>
            <small>如果此購買為0元，至用戶中心點擊確認即可</small>`
        swal(
            '匯款資訊',
            transferInfo,
            'info'
        )
    } catch (error) {
        console.error(error)
    }
}

async function addEventToCart (data) {
    try {
        var db = firebase.firestore()
        // check if user has added event to cart already
        let query = await db.collection('myEvents')
            .where('adminVerified', '==', false)
            .where('eventId', '==', data.eventId)
            .where('userUid', '==', data.userUid)
            .get()
        if (query.size > 0) {
            console.log('user has already attend !')
            return
        }

        // creating orders
        var eventData = await getSingleEvent(data.eventId)
        
        data.applyDateTime = parseDateTimeFormat()
        data.adminVerified = false
        data.fee = eventData.fee
        data.eventName = eventData.title
        data.location = eventData.location
        data.date = eventData.date
        data.time = eventData.time

        // getting user info
        var user = await getUserInfo(data.userUid)
        data.userBankAccount = user.bankAccount
        // getting bank info
        var bank = await getBank()
        for (key in bank) {
            data[key] = bank[key]
        }
        // import verification code js to use this method
        data.verificationCode = GenerateCodeNumber("00000000")

        await db.collection('myEvents').add(data)
        let transferInfo = `<ul style="text-align: left;">
                <li>銀行名稱： ${ data.bankName}</li>
                <li>銀行代號： ${ data.bankCode}</li>
                <li>戶名： ${ data.accountName}</li>
                <li>匯款帳號： ${ data.bankAccount}</li>
                <li>往來行： ${ data.correspondent}</li>
                <hr>
                <li>活動名稱： ${ data.eventName}</li>
                <li>金額： ${ data.fee || 0}</li>
                <li>確認碼： ${ data.verificationCode}</li>
            </ul>
            <small>匯款時請備註確認碼</small>
            <small>如果此購買為0元，至用戶中心點擊確認即可</small>`
        swal(
            '匯款資訊',
            transferInfo,
            'info'
        )
    } catch (error) {
        console.error(error)
    }
}

async function getUserInfo (userUid) {
    try {
        var db = firebase.firestore()
        var query = await db.collection('users').where('userUid', '==', userUid).get()
        var data = query.docs[0].data()
        return data
    } catch (error) {
        console.log(error)   
    }
}

async function getBank () {
    try {
        var db = firebase.firestore()
        var query = await db.collection('system').doc('bank').get()
        var data = query.data()
        return data
    } catch (error) {
        console.log(error)   
    }
}

// ***************
// home page section starts
// ***************
// getting firebase data
async function getHomePageContent () {
    try {
        var db = firebase.firestore()
        var query = await db.collection('cms').doc('cms').get()
        var data = query.data()
        return data
    } catch (error) {
        console.error(error)
    }
}

async function getFooter () {
    try {
        var db = firebase.firestore()
        var query = await db.collection('cms').doc('footer').get()
        var data = query.data()
        return data
    } catch (error) {
        console.error(error)
    }
}

async function bindHomePageData () {
    try {
        var content = await getHomePageContent()
        bindIncomingEvents()
        for (var key in content) {
            // if string contains 'img'
            var n = key.indexOf("Img")
            var c = key.indexOf("countingTo")
            if (n > 0) {
                if (key == 'teacherBgImg') {
                    $('#teacherBgImg').attr('style', 'background-image: url("' + content[key] + '")')
                    $('#colorlib-counter').attr('style', 'background-image: url("' + content[key] + '")')
                    // console.log(key)
                    $('#teacherBgImg').stellar({
                        horizontalScrolling: false,
                        hideDistantElements: false, 
                        responsive: true
                    });    
                } else {
                    $('#' + key).attr('style', 'background-image: url(' + content[key] + ')')
                }
                
            } else if (c > 0) {
                $('#' + key).attr('data-to', content[key])
            } else if (key == 'hotLessonsList') {
                // console.log(content[key])
                bindHomePageHotLessons(content[key])
            } else if (key == 'briefLink1' || key == 'briefLink2' || key == 'briefLink3' ) {
                $('#' + key).attr('href', content[key])
            } else {
                $('#' + key).html(content[key])
            }
        }
        bindActSectionFrom(content)
        // console.log(content)
        
    } catch (error) {
        console.error(error)
    }
}

async function bindIncomingEvents () {
    try {
        var data = await getEvents()
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
        var htmlString = ''
        for (var i = 0; i < data.length; i++) {
            var date = new Date(data[i].date)
            htmlString += '<div class="col-md-12 animate-box"><div class="event-entry"><div class="desc">'
            htmlString += '<p class="meta"><span class="day">' + date.getDate() + '</span><span class="month">' + month[date.getMonth()] + '</span></p>'
            htmlString += '<h2><a href="event-detail.html?id=' + data[i].docId + '">' + data[i].title + '</a></h2></div><div class="location">'
            htmlString += '<p id="moreEventsSummary1">' + data[i].brief + '</p>'
            htmlString += '</div></div></div>'
            if (i == 2) {
                break
            }
        }
        $('#incomingEvents').html(htmlString)
        if (data.length === 0) {
            $('#incomingEventsImg').attr('style', 'background-image: url("images/party.jpg")')
        } else {
            $('#incomingEventsImg').attr('style', 'background-image: url("' + data[0].singleEventContentImg + '")')
        }
    } catch (error) {
        console.error(error)
    }
}

async function bindHomePageHotLessons (dataArray) {
    try {
        var db = firebase.firestore()
        var data = []
        for (var i = 0; i < dataArray.length; i++) {
            var doc = await db.collection('lessons').doc(dataArray[i]).get()
            var item = doc.data()
            if (!item) {
                break
            }
            item.docId = dataArray[i]
            data.push(item)
        }
        // console.log(data)
        var htmlString = ''
        for (var i = 0; i < data.length; i++) {
            htmlString += '<div class="col-md-4 animate-box"><div class="classes">'
            let imgString = "'" + data[i].lessonImg + "'"
            htmlString += '<div class="classes-img" style="background-image: url(' + imgString + ');">'
            // htmlString += '<span class="price text-center"><small>$' + (parseFloat(data[i].price).formatMoney(0)) + '</small></span>'
            htmlString += '</div><div class="desc">'
            htmlString += '<h3><a href="lessons.html?id=' + data[i].docId + '">' + data[i].name + '</a></h3>'
            htmlString += '<p>' + data[i].brief + '</p>'
            htmlString += '<p><a href="lessons.html?id=' + data[i].docId + '" class="btn-learn">瞭解課程詳情 <i class="icon-arrow-right3"></i></a></p>'
			htmlString += '</div></div></div>'
        }
        $('.hotLessons').html(htmlString)

        sliderMain()
        contentWayPoint()
        loaderPage()

    } catch (error) {
        console.error(error)
    }

}

async function bindActSectionFrom (homePageContent) {
    try {
        var getLiActivityStringTemplate = function(actTitle,actImg){
            var htmlString = `
                <li style="background-image: url(${actImg});">
                    <div class="overlay"></div>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-8 col-sm-12 col-md-offset-2 slider-text">
                                <div class="slider-text-inner text-center">
                                        <h1>${actTitle}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                `
            return htmlString;
        }

        var sliderAllActivity = function() {
            $('#colorlib-hero-all .flexslider').flexslider({
                animation: "fade",
                // easing: "swing",
                // direction: "vertical",
                slideshowSpeed: 2000,
                directionNav: true,
                start: function(){
                    setTimeout(function(){
                            $('.slider-text').removeClass('animated fadeInUp');
                            $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                    }, 500);
                },
                before: function(){
                    setTimeout(function(){
                            $('.slider-text').removeClass('animated fadeInUp');
                            $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                    }, 500);
                }
            });
        };
        let actSectionData = [];
        Array.from(Array(5).keys())
            .map(ele=>ele+1)
            .forEach(number=>{
                let actTitlekey = "actTitle"+number;
                let actImgkey = "actImg"+number;
                actSectionData.push({
                    "actTitle":homePageContent[actTitlekey],
                    "actImage":homePageContent[actImgkey]
                })
            })

        $("colorlib-hero-all .flexslider").remove();
        let flexHtmlString = `<div class="flexslider"><ul id="activitySlide" class="slides" style="padding-left:2em;padding-right:2em;padding-bottom:7em;"></div>`
        $('#colorlib-hero-all').html(flexHtmlString)
        actSectionData.forEach(ele=>{
            let achtmlString = getLiActivityStringTemplate(ele.actTitle,ele.actImage);
            $('#activitySlide').append(achtmlString);
        });
        sliderAllActivity()
    } catch (error) {
        console.error(error)
    }
}


async function bindPageFooter () {
    try {
        var footer = await getFooter()
        $('#pageFooterAddress').html(footer.pageFooterAddress)
        $('#pageFooterPhone').html('<i class="icon-phone"></i> ' + footer.pageFooterPhone)
        $('#pageFooterEmail').html('<i class="icon-envelope"></i> ' + footer.pageFooterEmail)
        $('#pageFooterLink').html('<i class="icon-location4"></i> ' + footer.pageFooterLink)
    } catch (error) {
        console.error(error)
    }
}

// async function getCategories () {
//     try {
//         var db = firebase.firestore()
//         var query = await db.collection('categories').get()
//         var data = []   
//         query.docs.forEach(doc => {
//             data.push(doc.data())
//         })
//         return data
//     } catch (error) {
//         console.error(error)
//     }
// }


// async function bindNavbarCats () {
//     try {
//         var data = await getCategories()
//         var htmlString = ''
//         for (var i = 0; i < data.length; i++) {
//             htmlString += '<li><a href="categories.html?category=' + data[i].name + '">' + data[i].name + '</a></li>'
//         }
//         // console.log(htmlString)
//         $('.navbarCats').html(htmlString)
//         dropdown()
//     } catch (error) {
//         console.error(error)
//     }
// }

// ***************
// home page section ends
// ***************
// ***************
// category section starts
// ***************

// async function bindPageCategory () {
//     try {
//         // get category from url
//         var url = new URL(window.location.href);
//         var category = url.searchParams.get("category")
//         if (!category) {
//             window.location.href = "index.html"
//         }
//         $('#categoryTitle').html(category)
//         $('#categoryBreadcrumb').html('<span><a href="index.html"> 首頁 </a> | ' + category + '</span>')
//         var data = await getLessonsOfCats(category)
//         var htmlString = ''
//         for (var i = 0; i < data.length; i++) {
//             htmlString += '<div class="col-md-4 animate-box"><div class="classes">'
//             htmlString += '<div class="classes-img" style="background-image: url(' + data[i].lessonImg + ');">'
//             htmlString += '<span class="price text-center"><small>$' + (parseFloat(data[i].price).formatMoney(0)) + '</small></span>'
//             htmlString += '</div><div class="desc">'
//             htmlString += '<h3><a href="lessons.html?id=' + data[i].docId + '">' + data[i].name + '</a></h3>'
//             htmlString += '<p>' + data[i].brief + '</p>'
//             htmlString += '<p><a href="lessons.html?id=' + data[i].docId + '" class="btn-learn">瞭解課程詳情 <i class="icon-arrow-right3"></i></a></p>'
// 			htmlString += '</div></div></div>'
//         }
//         $('.categoryContents').html(htmlString)
//         sliderMain()
//         contentWayPoint()
//         loaderPage()
//     } catch (error) {
//         console.error(error)
//     }
// }

async function getLessonsOfCats (cat) {
    try {
        var db = firebase.firestore()
        var query = await db.collection('lessons').where('category', '==', cat).orderBy('createDateTime', 'desc').get()
        var data = []
        query.docs.forEach(doc => {
            var item = doc.data()
            item.docId = doc.id
            data.push(item)
        })
        return data
    } catch (error){
        console.error(error)
    }
}

async function getLessonsOfAge (age) {
    try {
        var db = firebase.firestore()
        var query = await db.collection('lessons').where('age', '==', age).orderBy('createDateTime', 'desc').get()
        var data = []
        query.docs.forEach(doc => {
            var item = doc.data()
            item.docId = doc.id
            data.push(item)
        })
        return data
    } catch (error){
        console.error(error)
    }
}

// ***************
// category section ends
// ***************
// ***************
// lesson section starts
// ***************

async function getLessonData (docId) {
    try {
        var db = firebase.firestore()
        var doc = await db.collection('lessons').doc(docId).get()
        return doc.data()
    } catch (error) {
        console.error(error)
    }
}

async function bindPageLesson () {
    try {
        // get category from url
        var url = new URL(window.location.href);
        var docId = url.searchParams.get("id")
        if (!docId) {
            window.location.href = "index.html"
        }
        var data = await getLessonData(docId)
        
        var mappingData = {
            "brief":data.brief,
            "category":data.category,
            "lessonBg":data.lessonBg,
            "lessonCurriculum":data.lessonCurriculum,
            "lessonCurriculumName":data.lessonCurriculumName,
            "lessonImg":data.lessonImg,
            "name":data.name,
            "paragraph1":data.paragraph1,
            "price":data.price,
            "studyUrl":data.studyUrl,
            "title1":data.title
        }
        data = mappingData;
        // console.log(data)
        // bind page title and breadcrumb
        $('#name').html(data.name)
        $('#breadcrumb').html('<a href="index.html"> 首頁 </a> | <a href="categories.html?category=' + data.category + '">' + data.category + '</a> | ' + data.name)
        $('#buyLesson').attr('onclick', 'attendLesson("' + docId + '"); return false;')
        $('#tryLesson').attr('onclick', 'window.open("'+data.studyUrl+'","_blank");')
        // $('#downloadLesson').click(function(){
        //     window.open(data.lessonCurriculum, "_blank") 
        // })
        
        
        // .attr('onclick', 'window.open("'+data.lessonCurriculum+'","_blank");')
        $('#downloadLesson').attr('href',data.lessonCurriculum)
        $('#downloadLesson').attr('download',data.lessonCurriculumName)
        $('#downloadLesson').attr('onclick','')

        for (var key in data) {
            if (key == 'lessonBg' || key == 'lessonImg') {
                let img = '"' + data[key] + '"'
                $('#' + key).attr('style', 'background-image: url(' + img + ')')
            } else if (key == 'price') {
                // formatting to money
                $('#' + key).html('$' + (parseFloat(data.price)).formatMoney(0))
            } else {
                $('#' + key).html(data[key])
            }
        }

        sliderMain()
        contentWayPoint()
        loaderPage()

    } catch (error) {
        console.error(error)
    }
}


// ***************
// lessons ends
// ***************


// ***************
// classlist start
// ***************


async function getAllDataFromCollection(name){
    try {
        var db = firebase.firestore()
        var query = await db.collection(name).get()
        var data = []   
        query.docs.forEach(doc => {
            data.push(doc.data())
        })
        return data
    } catch (error) {
        console.error(error)
    }
}



// async function bindHomePageHotLessons (dataArray) {
//     try {
//         var db = firebase.firestore()
//         var data = []
//         for (var i = 0; i < dataArray.length; i++) {
//             var doc = await db.collection('lessons').doc(dataArray[i]).get()
//             var item = doc.data()
//             if (!item) {
//                 break
//             }
//             item.docId = dataArray[i]
//             data.push(item)
//         }
//         // console.log(data)
//         var htmlString = ''
//         for (var i = 0; i < data.length; i++) {
//             htmlString += '<div class="col-md-4 animate-box"><div class="classes">'
//             htmlString += '<div class="classes-img" style="background-image: url(' + data[i].lessonImg + ');">'
//             // htmlString += '<span class="price text-center"><small>$' + (parseFloat(data[i].price).formatMoney(0)) + '</small></span>'
//             htmlString += '</div><div class="desc">'
//             htmlString += '<h3><a href="lessons.html?id=' + data[i].docId + '">' + data[i].name + '</a></h3>'
//             htmlString += '<p>' + data[i].brief + '</p>'
//             htmlString += '<p><a href="lessons.html?id=' + data[i].docId + '" class="btn-learn">瞭解課程詳情 <i class="icon-arrow-right3"></i></a></p>'
// 			htmlString += '</div></div></div>'
//         }
//         $('.hotLessons').html(htmlString)

//         sliderMain()
//         contentWayPoint()
//         loaderPage()

//     } catch (error) {
//         console.error(error)
//     }

// }

async function getOneHotLessonContentFrom(id){
    try {
        var db = firebase.firestore()
        var doc = await db.collection('lessons').doc(id).get()
        // console.log(doc.exists)
        if (doc.exists) {
            var item = doc.data()
            item.docId = id;
            return item;
        }
    } catch (error) {
        console.error(error)
    }
}

async function bindClassList (type,name) {
    try {
        let data;
        switch(type) {
            case "categories":
                if(name === "熱門課程"){
                    var hpc = await getHomePageContent()
                    var hotLessonsListID = hpc.hotLessonsList
                    data = await Promise.all(hotLessonsListID.map(async (lessonID) => {
                        return getOneHotLessonContentFrom(lessonID);
                    }));
                }else{
                    data = await getLessonsOfCats(name)
                }
                break;
            case "age":
                data = await getLessonsOfAge(name)
                break;
        }
        var htmlString = ''
        for (var i = 0; i < data.length; i++) {
            if (!data[i]) {
                continue;
            }
            htmlString += '<div class="col-md-4 animate-box"><div class="classes">'
            let imgString = "'" + data[i].lessonImg + "'"
            htmlString += '<div class="classes-img" style="background-image: url(' + imgString + ');">'
            // htmlString += '<span class="price text-center"><small>$' + (parseFloat(data[i].price).formatMoney(0)) + '</small></span>'
            htmlString += '</div><div class="desc">'
            htmlString += '<h3><a href="lessons.html?id=' + data[i].docId + '">' + data[i].name + '</a></h3>'
            htmlString += '<p>' + data[i].brief + '</p>'
            // htmlString += '<p><a href="lessons.html?id=' + data[i].docId + '" class="btn-learn"> <i class="icon-arrow-right3"></i></a></p>'
            htmlString += '<p><a href="lessons.html?id=' + data[i].docId + '" class="btn-learn">瞭解課程詳情 <i class="icon-arrow-right3"></i></a></p>'
			htmlString += '</div></div></div>'
        }
        $('.categoryContents').html(htmlString)
        sliderMain()
        contentWayPoint()
        loaderPage()
    } catch (error) {
        console.error(error)
    }
}



// ***************
// classlist end
// ***************









// ***************
// about us starts
// ***************

// getting firebase data
async function getPageAboutContent () {
    try {
        var db = firebase.firestore()
        var query = await db.collection('cms').doc('cmsAbout').get()
        var data = query.data()
        return data
    } catch (error) {
        console.error(error)
    }
}

async function bindPageAboutData () {
    try {
        var content = await getPageAboutContent()
        for (var key in content) {
            // if string contains 'img'
            // console.log(key);
            var n = key.indexOf("Img")
            if (n > 0) {
                $('#' + key).attr('style', 'background-image: url(' + content[key] + ')')
            } else {
                $('#' + key).html(content[key])
            }
        }
        //關於我們-教室環境-slider
        bindCzoneSectionFrom(content)
        // console.log(content)
        sliderMain()
        contentWayPoint()
        loaderPage()
    } catch (error) {
        console.error(error)
    }
}


async function bindCzoneSectionFrom (aboutPageContent) {
    try {
        var getStringTemplate = function(czoneImg){
            var htmlString = `
                <li class="czoneSmall" style="background-image: url(${czoneImg});">
                    <div class="overlay"></div>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-8 col-sm-12 col-md-offset-2 slider-text">
                                <div class="slider-text-inner text-center">
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                `
            return htmlString;
        }

        var sliderCzoneActivity = function() {
            $('#colorlib-hero-all .flexslider').flexslider({
                    animation: "fade",
                    // easing: "swing",
                    // direction: "vertical",
                    slideshowSpeed: 2000,
                    directionNav: true,
                    start: function(){
                            setTimeout(function(){
                                    $('.slider-text').removeClass('animated fadeInUp');
                                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                            }, 500);
                    },
                    before: function(){
                            setTimeout(function(){
                                    $('.slider-text').removeClass('animated fadeInUp');
                                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                            }, 500);
                    }
            });
        };
        let czoneSectionData = [];
        Array.from(Array(6).keys())
            .map(ele=>ele+1)
            .forEach(number=>{
                let pageCzoneImgkey = "pageCzoneImg"+number;
                czoneSectionData.push({
                    "pageCzoneImg": aboutPageContent[pageCzoneImgkey]
                })
            })

        $("colorlib-hero-all .flexslider").remove();
        let flexHtmlString = `<div class="flexslider"><ul id="czoneSlide" class="slides" style="padding: 0em 0em"></div>`
        $('#colorlib-hero-all').html(flexHtmlString)
        czoneSectionData.forEach(ele=>{
            let czonehtmlString = getStringTemplate(ele.pageCzoneImg);

            $('#czoneSlide').append(czonehtmlString);
        });
        sliderCzoneActivity()

    } catch (error) {
        console.error(error)
    }
}

// ***************
// about us ends
// ***************
// ***************
// event starts
// ***************

async function getPageEventData () {
    try {
        var db = firebase.firestore()
        var doc = await db.collection('eventsMain').doc('eventsMain').get()
        return doc.data()
    } catch (error) {
        console.error(error)
    }
}

async function getEvents () {
    try {
        var db = firebase.firestore()
        var now = this.parseDateTimeFormat('date')
        var query = await db.collection('events').where('date', '>=', now).orderBy('date').get()
        var data = []
        query.docs.forEach(doc => {
            var item = doc.data()
            item.docId = doc.id
            data.push(item)
        })
        return data
    } catch (error) {
        console.error(error)
    }
}

async function getEventFrom (toYear,startMonth,endMonth) {
    try {
        var toYear = toYear || new Date().getFullYear() 

        var paddingStartMonth = startMonth < 10 ? "0"+startMonth :startMonth
        var toYearStart = toYear+"-"+paddingStartMonth+"-01"

        var toYearEnd
        if(endMonth !== 12){
            endMonth+=1
            var paddingEndMonth = endMonth < 10 ? "0"+endMonth :endMonth
            toYearEnd = toYear+"-"+paddingEndMonth+"-01"
        }else{
            var paddingEndMonth = "01"
            toYear+=1
            toYearEnd = toYear+"-"+paddingEndMonth+"-01"
        }
        
        var db = firebase.firestore()

        var query = await db.collection('events').where('date', '>=', toYearStart).where('date', '<', toYearEnd).orderBy('date').get()
        var data = []
        query.docs.forEach(doc => {
            var item = doc.data()
            item.docId = doc.id
            data.push(item)
        })
        return data
    } catch (error) {
        console.error(error)
    }
}

var changeTheEventsPageWith = function(events){
    console.log(events)
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    let getEventHtml = (eventImg,eventDay,eventMonth,eventID,eventTitle,eventLocation,eventTime,eventBrief)=>{
        let htmlTemplate = `
        <div class="col-md-12 animate-box" style="padding: 1em;">
            <div class="col-md-3 eventSameHeight">
                <img src="${eventImg}" class="img-responsive eventSameHeight" alt="Image">
            </div>
            <div class="col-md-9 eventSameHeight">	
                <div class="event-entry">
                    <div class="desc">
                        <p class="meta"><span class="day">${eventDay}</span><span class="month">${eventMonth}</span></p>
                        <h2><a href="event-detail.html?id=${eventID}">${eventTitle}</a></h2>
                    </div>
                    <div class="location hidden-xs">
                        <i class="icon-map"></i>${eventLocation}<br>
                        <i class="fas fa-clock"></i>${eventTime}<br>
                    </div>
                    <div class="location">
                        <a href="event-detail.html?id=${eventID}">詳情點我</a>
                    </div>
                </div>				
            </div>
        </div>
        `;
        return htmlTemplate;
        // <br>
        // <p>${eventBrief}</p>
    }
    var htmlString = '<div class="row" id="eventsContentRow"></div>'
    $('#eventsContent').html(htmlString)

    events.sort((aEvent,bEvent)=>{
        var a = new Date(aEvent.date)
        var b = new Date(bEvent.date)
        // date compare reverse
        return (a<b)-(a>b)
    }).forEach(event=>{
        var date = new Date(event.date)
        var eventDetailHtml = getEventHtml(event.singleEventContentImg,date.getDate(),month[date.getMonth()],event.docId,event.title,event.location,event.time,event.brief)
        $('#eventsContentRow').append(eventDetailHtml)
    });

    // var htmlString = '<div class="row">'
    // for (var i = 0; i < events.length; i++) {
    //     if (i > 2 && i % 3 == 0) {
    //         htmlString += '</div><div class="row">'
    //     }
    //     var date = new Date(events[i].date)
    //     htmlString += '<div class="col-md-4 animate-box"><div class="event-entry"><div class="desc">'
    //     htmlString += '<p class="meta"><span class="day">' + date.getDate() + '</span><span class="month">' + month[date.getMonth()] + '</span></p>'
    //     htmlString += '<h2><a href="event-detail.html?id=' + events[i].docId + '">' + events[i].title + '</a></h2>'
    //     htmlString += '</div><div class="location"><i class="icon-map"></i> ' + events[i].location
    //     htmlString += '<br><i class="fas fa-clock"></i> ' + events[i].time
    //     htmlString += '<br><br><p>' + events[i].brief + '</p>'
    //     htmlString += '</div></div></div>'
    // }
    // htmlString += '</div>'
    contentWayPoint()
    loaderPage()
}

async function bindEventPage () {
    try {
        /*
        // bind top section
        var data = await getPageEventData()
        $('#eventsMainTitle').html(data.eventsMainTitle)
        $('#eventsBreadcrumb').html('<a href="index.html">首頁</a> | ' + data.eventsMainTitle)
        $('#pageEventsBgImg').attr('style', 'background-image: url("' + data.pageEventsBgImg + '")')
        */

       // bind events
       getEventFrom(new Date().getFullYear(),1,12)
       .then(result=>changeTheEventsPageWith(result));

       var addNavCLickOn = function(selector,rangeStart,rangeEnd){
           $(selector).click(()=>{
               getEventFrom(defaultYear,rangeStart,rangeEnd)
               .then(result=>changeTheEventsPageWith(result));
           });
       }
         
       addNavCLickOn('#nav-range1',1,3);
       addNavCLickOn('#nav-range2',4,6);
       addNavCLickOn('#nav-range3',7,9);
       addNavCLickOn('#nav-range4',10,12);
       addNavCLickOn('#nav-range5',1,12);

    } catch (error) {
        console.error(error)
    }


}

// ***************
// detailed event starts
// ***************

async function getSingleEvent (docId) {
    try {
        var db = firebase.firestore()
        var doc = await db.collection('events').doc(docId).get()
        return doc.data()
    } catch (error) {
        console.log(error)
    }
}

async function bindSingleEvent () {
    try {
        var url = new URL(window.location.href);
        var docId = url.searchParams.get("id")
        if (!docId) {
            window.location.href = "event.html"
        }
        var eventMain = await getPageEventData()
        var data = await getSingleEvent(docId)
        // console.log(eventMain)
        // console.log(data)
        $('.title').html(data.title)
        $('#breadcrumb').html('<a href="index.html">首頁</a> | <a href="event.html">' + eventMain.eventsMainTitle + '</a> | ' + data.title)
        $('#dateTime').html('時間：' + data.date + ' ' + data.time)
        $('#location').html('地點：' + data.location)
        $('#fee').html('費用：' + data.fee)
        $('#subTitle').html(data.subTitle)
        $('#paragraph1').html(data.paragraph1)
        $('#paragraph2').html(data.paragraph2)
        $('#singleEventBgImg').attr('style', 'background-image: url("' + data.singleEventBgImg + '")')
        // $('#singleEventContentImg').attr('style', 'background-image: url("' + data.singleEventContentImg + '")')
        $('#singleEventContentImg').attr('src',data.singleEventContentImg)
        $('#attendEvent').attr('onclick', "attendEvent('" + docId + "'); return false;")
        sliderMain()
        contentWayPoint()
        loaderPage()
    } catch (error) {
        console.log(error)
    }
}

// ***************
// event ends
// ***************


// ***************
// activity starts
// ***************


async function getActivityFrom (toYear,startMonth,endMonth) {
    try {
        var toYear = toYear || new Date().getFullYear() 

        var paddingStartMonth = startMonth < 10 ? "0"+startMonth :startMonth
        var toYearStart = toYear+"-"+paddingStartMonth+"-01"

        var toYearEnd
        if(endMonth !== 12){
            endMonth+=1
            var paddingEndMonth = endMonth < 10 ? "0"+endMonth :endMonth
            toYearEnd = toYear+"-"+paddingEndMonth+"-01"
        }else{
            var paddingEndMonth = "01"
            toYear+=1
            toYearEnd = toYear+"-"+paddingEndMonth+"-01"
        }
        
        var db = firebase.firestore()

        var query = await db.collection('activities').where('date', '>=', toYearStart).where('date', '<', toYearEnd).orderBy('date').get()
        var data = []
        query.docs.forEach(doc => {
            var item = doc.data()
            item.docId = doc.id
            data.push(item)
        })
        return data
    } catch (error) {
        console.error(error)
    }
}

var doOneSlider = function(imageResult,title,index){
    // $(".flexslider").remove();
    var getResultListStringFrom = function(imageResult){
        var resultHtmlString = ""
        if(imageResult.length !== 0){
            imageResult.forEach(function(image){
                var htmlString = `
                <li>
                    <img src="${image}">
                </li>`;
                resultHtmlString += htmlString
            });   
        }
        return resultHtmlString
    }

    let htmlString = `
    <div class="flexslider carousel">
        <h4>${title}</h4>
        <ul class="slides">
            ${getResultListStringFrom(imageResult)}
        </ul>
    </div>
    `
    return htmlString;
//     $(".flexslider").append(`<div class="custom-navigation">
//     <a href="#" class="flex-prev">Prev</a>
//     <div class="custom-controls-container"></div>
//     <a href="#" class="flex-next">Next</a>
//   </div>`)
    
}

var addMulSliderFrom = function(activityList){
    let refreshHtml = activityList.map(function(activity,index){
        var imageList = []
        if(activity.actImg1){
            imageList.push(activity.actImg1)
        }
        if(activity.actImg2){
            imageList.push(activity.actImg2)
        }
        if(activity.actImg3){
            imageList.push(activity.actImg3)
        }
        if(activity.actImg4){
            imageList.push(activity.actImg4)
        }
        if(activity.actImg5){
            imageList.push(activity.actImg5)
        }
        if(activity.actImg6){
            imageList.push(activity.actImg6)
        }
        return doOneSlider(imageList,activity.title,index)
    }).reduce(function(a,b){
        return a+b
    },[])
    console.log(refreshHtml)
    $('#colorlib-hero-activity').html(refreshHtml)
    $('.flexslider').flexslider({
        animation: "slide",
        animationLoop: false,
        itemWidth: 210,
        itemMargin: 5
    });

    sliderMain()
    contentWayPoint()
    loaderPage()
}

async function bindPageActivityData () {
    try {
        // $("#colorlib-hero-activity").remove()
        getActivityFrom(new Date().getFullYear(),1,12)
        .then(activityList=>addMulSliderFrom(activityList));
       

        var addNavCLickOn = function(selector,rangeStart,rangeEnd){
            $(selector).click(()=>{
                getActivityFrom(defaultYear,rangeStart,rangeEnd)
                .then(activityList=>addMulSliderFrom(activityList))
            });
        }

        addNavCLickOn('#nav-range1',1,3);
        addNavCLickOn('#nav-range2',4,6);
        addNavCLickOn('#nav-range3',7,9);
        addNavCLickOn('#nav-range4',10,12);
        addNavCLickOn('#nav-range5',1,12);


    } catch (error) {
        console.error(error)
    }
}

async function getEvideos (_evListName) {
    try {

        var db = firebase.firestore()
        // var now = this.parseDateTimeFormat('date')
        var query = await db.collection('events-videos')
                            .where('evListName', '==', _evListName)
                            .get()
        var data = []
        query.docs.forEach(doc => {
            var item = doc.data()
            item.docId = doc.id
            data.push(item)
        })
        return data
    } catch (error) {
        console.error(error)
    }
}


// ***************
// activity ends
// ***************


// ***************
// utility section
// ***************
var sliderMain = function() {
		
    $('#colorlib-hero .flexslider').flexslider({
      animation: "fade",

      // easing: "swing",
      // direction: "vertical",

      slideshowSpeed: 5000,
      directionNav: true,
      start: function(){
          setTimeout(function(){
              $('.slider-text').removeClass('animated fadeInUp');
              $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
          }, 500);
      },
      before: function(){
          setTimeout(function(){
              $('.slider-text').removeClass('animated fadeInUp');
              $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
          }, 500);
      }

    });

};

var dropdown = function() {

    $('.has-dropdown').mouseenter(function(){

        var $this = $(this);
        $this
            .find('.dropdown')
            .css('display', 'block')
            .addClass('animated-fast fadeInUpMenu');

    }).mouseleave(function(){
        var $this = $(this);

        $this
            .find('.dropdown')
            .css('display', 'none')
            .removeClass('animated-fast fadeInUpMenu');
    });

};

var contentWayPoint = function() {
    var i = 0;
    $('.animate-box').waypoint( function( direction ) {

        if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
            
            i++;

            $(this.element).addClass('item-animate');
            setTimeout(function(){

                $('body .animate-box.item-animate').each(function(k){
                    var el = $(this);
                    setTimeout( function () {
                        var effect = el.data('animate-effect');
                        if ( effect === 'fadeIn') {
                            el.addClass('fadeIn animated-fast');
                        } else if ( effect === 'fadeInLeft') {
                            el.addClass('fadeInLeft animated-fast');
                        } else if ( effect === 'fadeInRight') {
                            el.addClass('fadeInRight animated-fast');
                        } else {
                            el.addClass('fadeInUp animated-fast');
                        }

                        el.removeClass('item-animate');
                    },  k * 200, 'easeInOutExpo' );
                });
                
            }, 100);
            
        }

    } , { offset: '85%' } );
};

// Loading page
var loaderPage = function() {
    $(".colorlib-loader").fadeOut("slow");
};

Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function parseDateTimeFormat (type) {
    var now = new Date()
    var mm = now.getMonth() + 1 // getMonth() is zero-based
    var dd = now.getDate()
    var hour = now.getHours()
    var min = now.getMinutes()
    var sec = now.getSeconds()
    if (type === 'date') {
        var string = now.getFullYear() + '-' + (mm > 9 ? '' : '0') + mm + '-' + (dd > 9 ? '' : '0') + dd
        return string
    } else {
        var string = now.getFullYear() + '/' + (mm > 9 ? '' : '0') + mm + '/' + (dd > 9 ? '' : '0') + dd + ' ' + (hour > 9 ? '' : '0') + hour + ':' + (min > 9 ? '' : '0') + min + ':' + (sec > 9 ? '' : '0') + sec
        return string
    }
}

let defaultYear = new Date().getFullYear();

function addNavYear(type){
    var navListHtml = '<ul id="page-nav-year-list" class="pager"></ul>';
    $('#page-nav-year').append(navListHtml)

    var currentYear = new Date().getFullYear()
    var yearList = []
    if(type === "event"){
        for (var i = currentYear; i < currentYear+2; i++) {
            yearList.push(i)
        }
    }else if(type === "activity"){
        for (var i = currentYear-3; i < currentYear+1; i++) {
            yearList.push(i)
        }
    }
    
    var addNavCLickOn = function(selector,value){
        $(selector).click(()=>{
            defaultYear = value;
        });
    }

    yearList.forEach(function(ele,index){
        var yearNavHtml = '<li><a id="nav-year'+index+'" href="" onclick="return false;">'+ele+'年</a></li>\n'
        $('#page-nav-year-list').append(yearNavHtml)
        addNavCLickOn('#nav-year'+index,ele);
    })
  }

function addNavMonth(){
    let navListHtml = `
      <ul class="pager">
        <li><a id="nav-range1" href="" onclick="return false;">1-3月</a></li>
        <li><a id="nav-range2" href="" onclick="return false;">4-6月</a></li>
        <li><a id="nav-range3" href="" onclick="return false;">7-9月</a></li>
        <li><a id="nav-range4" href="" onclick="return false;">10-12月</a></li>
        <li><a id="nav-range5" href="" onclick="return false;">所有月份</a></li>
      </ul>
    `;
    $('#page-nav-month').append(navListHtml)
  }
  