// https://stackoverflow.com/questions/21607808/convert-a-youtube-video-url-to-embed-code
function getYoutubeId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
      return match[2];
  } else {
      return 'error';
  }
}

function getYoutubeVideoTemplate(youtubeID,yTitle,yContent){
  let yvt = `
    <div style="margin: 10%">
      <div class="embed-responsive embed-responsive-16by9">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeID}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
      <h2>${yTitle}</h2>
      <p>${yContent}</p>
    </div>
  `
  return yvt
}

//append youtube video from id
var addEvlNavCLickWith = function(evlName){
  getEvideos(evlName)
  .then(result=>{
    $("#youtube-list").remove();
    var htmlString = `<div id="youtube-list"></div>`
    $('#evl-youtube').html(htmlString)
    if(result.length !== 0){
      result.forEach(element => {
        var yid = getYoutubeId(element.youtubeUrl)
        if(yid !== 'error'){
          var eleYTitle = element.ytitle || " ";
          var eleYcontent = element.ycontent || " ";
          $("#youtube-list").append(getYoutubeVideoTemplate(yid,eleYTitle,eleYcontent))
        }else{
          console.error("youtube url error");
        }
      });
    }
  })
}

//append nav button to renew youtube video
let bindEventVideoListNav = async ()=>{
    let data1 = await getAllDataFromCollection("events-videos-list")
    //do first time
    addEvlNavCLickWith(data1[0].name)

    data1.forEach((ele,i)=>{
      let liStrTemp = `<li><a id="nav-evl-${i}" href="" onclick="return false" style="margin: 3px;">${ele.name}</a></li>`
      $("#nav-evl").append(liStrTemp)
      $("#nav-evl-"+i).click(()=>{
        addEvlNavCLickWith(ele.name)
      })
    });
}

