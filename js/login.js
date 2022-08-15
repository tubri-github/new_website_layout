/*var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/++[++^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}*/
function b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
        }));
    }
    
function b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    

//var api_url = "https://www.hydroclim.org/api/v1/"
var api_url = "http://127.0.0.1:5000/v1/"
function login(){
	  var username=$('input[name=username]').val();
    var password=$('input[name=password]').val(); 
	  //var params = {"username" : username, "password": password};
	  $.ajax({
      type: "POST",
      url: api_url + "user/login",
	  async:false,
      dataType : "json",
	  headers:{
		  'Content-Type':'application/json',
		  'authorization':make_base_auth(username, password)
	  },
      success: function(data){
		  if(data && data.token){
			  localStorage.setItem('Token', data.token)
			  localStorage.setItem('username', username)
			  $('#error_tip').html("");
			    window.location.href="data.html"
		  }
		  else
			  $('#error_tip').html("Server Error!");
      },
	  error: function(data){
		  $('#error_tip').html(data.responseJSON.error);
	  }
   });
   return false;
  }

  function reg(){
	  	var username=$('input[name=email]').val();
    	var password=$('input[name=password]').val();
    	var institution=$('input[name=institution]').val();
    	var title=$('input[name=title]').val();
	  //var params = {"username" : username, "password": password};
	  $.ajax({
      type: "POST",
      url: api_url + "user/user",
	  //Sasync:false,
		data:$('#reg_form').serialize(),
      //dataType : "json",
	  headers:{
		  //'Content-Type':'application/json',
		  'authorization':make_base_auth(username, password)
	  },
      success: function(data){
      		window.location.href="data_login.html?fg=success"

      },
	  error: function (xhr, ajaxOptions, thrownError) {
      	if(xhr.status==409){
      		Snackbar.show({
			  text: "Error:" +  xhr.status + " - " + xhr.responseJSON['message'],
			  pos:'bottom-center'
		  });
		}
      	else{
      		Snackbar.show({
			  text: "Error:" +  xhr.status + " - " + thrownError,
			  pos:'bottom-center'
		  });
		}

      }
   });
   return false;
  }

 function make_base_auth(user,password){
	 var tok = user + ':' + password;
	 //var hash = Base64.encode(tok);
   var hash = b64EncodeUnicode(tok);
	 return "Basic " + hash;
 }
 
 /*function ajaxRequest = function(option) {
    $.ajax({
      url: getDmsFuncIdUrl(newUrl, currentToken),
      type: option.type,
      data: option.data,
      dataType: "json",
      async: option.async != undefined ? option.async : true,
      cache: false,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Accept", "application/json;charset=UTF-8");
        //"charset=UTF-8"
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        //put Token in header
        xhr.setRequestHeader(
          "Authorization",
          "Bearer " + getParamsStorage("Token")
        );
        if (option.beforeSend) {
          option.beforeSend(xhr);
        }
      },
      success: function(data, textStatus, jqXHR) {
        //stop ajax request
        ajaxRestEnd(option);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        //stop ajax request
        ajaxRestEnd(option);
      }
    })
  };*/