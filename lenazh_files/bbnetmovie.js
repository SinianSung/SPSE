/*
Rest of the Configuration is set in flvplayer.swf
    protocols : rtmp, rtmpt
    url :	/Streaming, /main, /video
    bitrates : 150,400,800
    bitratekeys : low,mid,high
*/
//var BB_FLASH_SERVER = '194.60.217.142:80';
var BB_FLASH_SERVER = '194.60.217.246:80';
var BB_PLAYER_CONTROL_HEIGHT = 35;

var bbPlayers = {};

/**
 * Inserts an FlashVideoPlayer
 * @param String containerName id of the div for the player
 * @param int id id of the video
 * @param int width original width of the video
 * @param int height original height of the video
 * @param String color color for the player controls ex. -> 'FFCC00'
 * @param String movieName optional name of the movie
 * @return void
 **/
function openPlayer(containerName, id, width, height, color, movieName,movieUrl){
  //Inserts MovieName, optional
  if (movieName) {
    var movieNameDiv = document.getElementById('movie_name');
    if(movieNameDiv !== null) {
      movieNameDiv.innerHTML = movieName;
    }
  }
  
  //is Div for player available?
  var div = document.getElementById(containerName);
  if(div === null) {
    return;
  }
  
  //Is link for player vailable?
  var link = document.getElementById(containerName + '_movie_' + id);
  if(link === null) {
    return;
  }
  //Is color set?
  if (color === null) {
    color = 'FFCC00';
  }
    
  //Set all links to italic
  var links = div.getElementsByTagName('a');
  if(links !== null){
    for(var i = 0; i < links.length; i++){
      if(links[i].id !== null && links[i].id.indexOf(containerName) === 0){
        links[i].style.fontStyle = 'normal'; 
      }
    }
  }
  link.style.fontStyle = 'italic';
  //Insert Movie text
  var p = document.getElementById(containerName + '_player_text');
  if(p !== null){
    var t = document.getElementById(containerName + '_movie_text_' + id);
      if(t !== null) {
        p.innerHTML = t.innerHTML;
      }
      else {
        p.innerHTML = '&nbsp;';
      }			
    }
  //Calculate Size for Player
  var w = 340;
  var h = 273;
  if(width > 0 && height > 0){
     h = w / width * height;
  }
  //Add height of Controls to the height of the video
  h += BB_PLAYER_CONTROL_HEIGHT;
  //Create player
  bbPlayers[containerName] = {'movieid' : id, 'displaystate' : 'normal'};
	
	if(movieUrl && movieUrl.length>0){
		var wm = new WebmovieMapper(movieUrl,color);
		if(wm.isValide()){
			AJS.$(containerName + '_player').innerHTML = wm.write();
		}else{
			throw new Error('invalide webmovie url: ' . movieUrl);
		}
		return;
	}
    
  var player = new SWFObject('../images/flvplayer.swf', containerName + '_flashplayer', w, h, '9');
    
  player.addParam('allowfullscreen','true');
  player.addParam("allowScriptAccess", "always");
  player.addParam('allownetworking', 'all');  
  //player.addParam('wmode', 'transparent');
  player.addParam('bgcolor', '#FFFFFF');

  player.addVariable('autostart','false');
  player.addVariable('server',BB_FLASH_SERVER);
  player.addVariable('id',id);
  player.addVariable('color',color);
    
  player.write(containerName + '_player');
}

function WebmovieMapperURL(url){
	var e=/^((http|https|ftp):\/\/)?(w*\.?)?([^#?\/]+)([^#]*)([^#]*)$/;
	var arrUrl = url.split('?'); 
	if(arrUrl.length>1){
		var arrQuery = arrUrl[1].split('#');
		this.query = arrQuery.shift();
		url = arrUrl[0];
		if(arrQuery.length>1){
			url += '#'.arrQuery.join('#');
		}
	}
	if (url.match(e)) {
		this.url= RegExp['$&'];
		this.protocol= RegExp.$2;
		this.host=RegExp.$4;
		this.path=RegExp.$5;
		this.hash=RegExp.$6;
		this.isValide = function(){return true;}
	}else{
		this.isValide = function(){return false;}
	}
	this.getParamValue = function(param){
		param = escape(unescape(param));
		var regex = new RegExp("[&]?" + param + "(?:=([^&]*))?","i");
		var match = regex.exec(this.query);
		var value = null;
		if( match != null ){
			value = match[1];
		}else return null;
		return value.length ==0?null:value;
	};
	this.getPathValue = function(where){
		var sections = this.path.split('/');
		if(AJS.isNumber(where)){
			if(sections.length>where && where >= 0){
				return sections[where];
			}
		}else{
			for(var i = 0;i<sections.length;i++){
				if(sections[i] == where && i<(sections.length-1)){
					return sections[i+1];
				}
			}
		}
		return null;
	};
}

function WebmovieMapper(url,color){
	this.strurl = url;
	this.color = color;
	this.blnisvalide = false;
	this.url = null;
	this.validateURL();
}

WebmovieMapper.prototype = {
	validateURL: function(){
		this.url = new WebmovieMapperURL(this.strurl);
		if(!this.url.isValide())return this;
		var arrhost = this.url.host.split('.');
		this.type = "";
		if(arrhost.length>1){
			this.type = arrhost[arrhost.length-2];
		}
		this.type = this.type.toLowerCase();
		return this.validateType()
	},
	validateType: function(){
		return this.each("sf,srf,youtube,vimeo,rtsi,tsr".split(','),function(item){
			if(this.type == item){
				this.blnisvalide = true;
			}
		});
	},
	each: function(data,callback){
		for(var i = 0;i<data.length;i++){
			callback.apply(this,[data[i],i,data]);
		}
		return this;
	},
	isValide: function(){
		return this.blnisvalide;
	},
	ucFirst: function(str){
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
	},
	write: function(){
		return this['write'+this.ucFirst(this.type)].apply(this);
	},
	writeSf: function(){
		var code = this.url.getParamValue('id');
		if(code == null){
			code = this.url.getPathValue('embed');
		}
		/*
		return '<object data="http://www.sf.tv/videoplayer/embed/'+code+'" type="application/x-shockwave-flash" style="width:340px;height:273px">'+
		'<param name="movie" value="http://www.sf.tv/videoplayer/embed/'+code+'"/>'+
		'<param name="quality" value="high" />'+
		'<param name="allowFullScreen" value="true" />'+
		'</object>';
		*/
		return '<object style="width:340px;height:273px" type="application/x-shockwave-flash" id="videoplayer" data="http://www.srf.ch/player/flash/srfplayer.swf">'+
        '<param name="movie" value="http://www.srf.ch/player/flash/srfplayer.swf">'+
        '<param name="quality" value="high">'+
        '<param name="allowFullScreen" value="true">'+
        '<param name="wmode" value="direct">'+
        '<param name="FlashVars" value="playerType=video&amp;mode=embed&amp;segment_id='+code+'&amp;autoplay=false">'+
        '</object>';
	},
	writeSrf: function(){
		var code = this.url.getParamValue('id');
		if(code == null){
			code = this.url.getPathValue('embed');
		}
		return '<object style="width:340px;height:191px" type="application/x-shockwave-flash" id="videoplayer" data="http://www.srf.ch/player/flash/srfplayer.swf">'+
        '<param name="movie" value="http://www.srf.ch/player/flash/srfplayer.swf">'+
        '<param name="quality" value="high">'+
        '<param name="allowFullScreen" value="true">'+
        '<param name="wmode" value="direct">'+
        '<param name="FlashVars" value="playerType=video&amp;mode=embed&amp;segment_id='+code+'&amp;autoplay=false">'+
        '</object>';
	},
	writeVimeo:  function(){
		var code = this.url.getPathValue(1);
		return '<iframe src="http://player.vimeo.com/video/'+code+'?title=0&amp;byline=0&amp;portrait=0&amp;color='+this.color+'" width="340" height="200" frameborder="0"></iframe>';
	},
	writeYoutube:  function(){
		var code = this.url.getParamValue('v');
		if(code == null){
			code = this.url.getPathValue(1);
			if(code == 'v'){
				code = this.url.getPathValue(2);
				return '<object width="340" height="207"><param name="movie" value="http://www.youtube.com/v/'+code+'"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+code+'" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="340" height="207"></embed></object>';
			}
		}
		return '<iframe width="340" height="223" src="http://www.youtube.com/embed/'+code+'?rel=0" frameborder="0" allowfullscreen></iframe>';
	},
	writeRtsi:  function(){
		var code = this.url.getPathValue(6);
		return '<embed width="340" height="207" flashvars="config={ configFileName: \'http://media-public.pmm.rtsi.ch/media/metafile/flashvideo/rtsi/segment/'+code+'\', showFullScreenButton: true, useNativeFullScreen: true, menuItems: \'[true, false, false, false, false, false, false]\', bufferBarColor1: \'0xee0000\', bufferBarColor2: \'0xee0000\', progressBarBorderColor1: \'0xee0000\', progressBarBorderColor2: \'0xee0000\', loop: false, autoRewind: true, autoPlay: false, controlBarBackgroundColor: \'0xb5b5b5\', controlBarGloss: \'none\', timeDisplayFontColor: \'0xffffff\', showMenu: false, initialScale: \'scale\' }" pluginspage="http://www.adobe.com/go/getflashplayer" type="application/x-shockwave-flash" quality="high" allowscriptaccess="always" allowfullscreen="true" src="http://www.rsi.ch/docroot/prisma-common/RSIPlayer/RSIPlayer.swf">';
	},
	writeTsr:  function(){
		var code = this.url.getPathValue(3);
		return '<object type="application/x-shockwave-flash" data="http://www.tsr.ch/v/embed/'+code+'" style="width: 384px; height: 216px;"><param name="movie" value="http://www.tsr.ch/v/embed/'+code+'"><param name="allowFullScreen" value="true"><param name="allowScriptAccess" value="always"><a href="http://www.tsr.ch/video/emissions/religion/faut-pas-croire/3677872-le-plein-d-energies.html"><img src="http://www.tsr.ch/2011/12/26/12/26/3677871.image?w=480&h=270" style="display:block" width="384" height="216" alt=""></a></object>';
	}
}