//import {Spinner} from 'spin.js';

//var api_url = "http://hydroclimtest.centralus.cloudapp.azure.com"
//var api_url = "https://www.hydroclim.org/api"
var api_url = "http://127.0.0.1:5000"
$(function () {
    $.each(modelsList45, function (i, item) {
        $('#45-data').append(
             $('<option value="' + item.id + '">' + item.name + '</option>'));
    });
});
$(function () {
    $.each(modelsList85, function (i, item) {
        $('#85-data').append(
             $('<option value="' + item.id + '">' + item.name + '</option>'));
    });
});
$(function () {
    $.each(basins, function (i, item) {
        $('#basin-data').append(
            $('<option value="' + item.id + '">' + item.name + '</option>'));
    });
});
function appendNormalRCP(){
	$('select[name="85-data"]').html("");//clear
	$('select[name="45-data"]').html("");//clear
	$('#45-data').prop('disabled', false);
	$('input#45-r').prop('disabled', false);
	$("#85-data").selectpicker('refresh');//refresh
	$("#45-data").selectpicker('refresh');//refresh
	$.each(modelsList45, function (i, item) {
		$('#45-data').append(
			$('<option value="' + item.id + '">' + item.name + '</option>'));
	});
	$.each(modelsList85, function (i, item) {
		$('#85-data').append(
			$('<option value="' + item.id + '">' + item.name + '</option>'));
	});
	$("#85-data").selectpicker('refresh');//refresh
	$("#45-data").selectpicker('refresh');//refresh
}

function changeRCPmodels(basin_id){
	var model27 = [39,40,41,42,43]
	if(model27.indexOf(parseInt(basin_id)) !== -1){
		$('input#45-r').prop('disabled', false);
		$('#45-data').prop('disabled', false);
		$('select[name="85-data"]').html("");//clear
		$('select[name="45-data"]').html("");//clear
		$("#85-data").selectpicker('refresh');//refresh
		$("#45-data").selectpicker('refresh');//refresh
		$.each(modelist8527, function (i, item) {
				$('#85-data').append(
					$('<option value="' + item.id + '">' + item.name + '</option>'));
			});
		$.each(modelist4527, function (i, item) {
			$('#45-data').append(
				$('<option value="' + item.id + '">' + item.name + '</option>'));
		});
		$("#85-data").selectpicker('refresh');//refresh
		$("#45-data").selectpicker('refresh');//refresh

	}
	else if(basin_id == 44 ||basin_id == 45){
		$('input#45-r').prop('disabled', true);
		$('#45-data').prop('disabled', true);
		$('select[name="45-data"]').html("");//clear
		$('#45-data').selectpicker('refresh');

		$('select[name="85-data"]').html("");//clear
		$("#85-data").selectpicker('refresh');//refresh
		$.each(modelist852, function (i, item) {
			$('#85-data').append(
				$('<option value="' + item.id + '">' + item.name + '</option>'));
		});
		$("#85-data").selectpicker('refresh');//refresh
	}
	else{
		appendNormalRCP()
	}
}

function showSpinner() {
    var opts = {
      lines: 15, // The number of lines to draw
      length: 3, // The length of each line
      width: 4, // The line thickness
      radius: 30, // The radius of the inner circle
      rotate: 0, // The rotation offset
      color: '#fff', // #rgb or #rrggbb
      speed: 2, // Rounds per second
      trail: 70, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    $('#loading_anim').each(function() {
        //spinner = new Spinner(opts).spin(this);

    });
}
//download data
$('#basin-data').change(function () {
        var selectedItem = $('#basin-data').val();
		getFeature(selectedItem)
		changeRCPmodels(selectedItem)
        //alert(selectedItem);
    });

$("#submitform").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.

	if(dateValidation() && basinValidation() && modelValidation() && rcpValidation() && statsValidation() && statsOptionValidation()){
			var form = $(this);
			//var api_url = 'http://127.0.0.1:5000';
			//var url = form.attr('action');
			var string = form.serialize()
			//validate flag


			//A.Date
			var timerangetype = "&timerangetype=1";//default subset
			if ($("input#timesub").is(':checked'))
				timerangetype = "&timerangetype=1"
			else if($("input#timefull").is(':checked'))
				timerangetype = "&timerangetype=2"

			var basin_id = String($('#basin-data').val());
			basin_id = "&basinids=" + basin_id.split(",").join("_");

			//B.Model
			var obs_r = ''
			if ($("input#obs-r").is(':checked'))
				obs_r = "&isobserved=on"
			else
				obs_r = "&isobserved=off"
			var isrcp45 = ''
			var rcp45 = ''
			if ($("input#45-r").is(':checked'))
				{
					isrcp45 = "&isRCP45=on"
					rcp45 = "&rcp45=" + $('#45-data').val().join("_")
				}
			else
			{
				isrcp45 = "&isRCP45=off"
				rcp45 = "&rcp45="
			}
			var isrcp85 = ''
			if ($("input#85-r").is(':checked'))
				{
					isrcp85 = "&isRCP85=on"
					rcp85 = "&rcp85=" + $('#85-data').val().join("_")
				}
			else
			{
				isrcp85 = "&isRCP85=off"
				rcp85 = "&rcp85="

			}
			//C.Stastics
			var stast_orig = ''
			if ($("input#hydroclim-stast-orig").is(':checked'))
				stast_orig = "&israwdata=true"
			else
				stast_orig = "&israwdata=false"

			var stast = ''
			if ($("input#hydroclim-stast").is(':checked'))
				{
					stast = "&isstastics=true"
					if ($("input#avg").is(':checked'))
						stast += "&isavg=true"
					else
						stast += "&isavg=false"
					if ($("input#max").is(':checked'))
						stast += "&ismax=true"
					else
						stast += "&ismax=false"
					if ($("input#min").is(':checked'))
						stast += "&ismin=true"
					else
						stast += "&ismin=false"
					if ($("input#sd").is(':checked'))
						stast += "&isSD=true"
					else
						stast += "&isSD=false"
					if ($("input#va").is(':checked'))
						stast += "&isVa=true"
					else
						stast += "&isVa=false"
				}
			else
				{
					stast= "&isstastics=false&isavg=false&ismax=false&ismin=false&isSD=false&isVa=false"
				}
			const url = api_url + '/v1/records/reachdatazip?' + string + basin_id + timerangetype + obs_r + isrcp45 + isrcp85 + rcp45 + rcp85 +stast_orig + stast ,
			fileName = "my-csv.csv";
			/*$.ajax({
				   type: "GET",
				   url: 'http://hydroclimtest.centralus.cloudapp.azure.com/v1/basin/basin',
				   //data: string + basin_id, // serializes the form's elements.
				   ajaxSend: function(){ $("#loading").show();},
				   beforeSend:function(){ $("#loading").show();},
				   success: function(result)
				   {
						const saveData = (function () {
						const a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						return function (url, fileName) {
							a.href = url;
							a.download = fileName;
							a.click(function() {

								});
							};
						}());
						saveData(url, fileName);
						 $("#loading").hide();
				   },
				   complete:function(e){
					   //$("#loading").hide();
				   },
				   ajaxComplete:function(){
					   $("#loading").hide();
				   }
				 });
				 */
				const saveData = (function () {
					$.ajax({
							   	type: "GET",
							   	url: url,
								headers:{
							   		"x-access-token": localStorage['Token']
								},
								beforeSend:function (){
									$("#submit-button").attr({ disabled: "disabled" });
								},
								complete: function () {
									setTimeout(function (){
										$("#submit-button").removeAttr("disabled")
									},1500) ;
								},
							//data: string + basin_id, // serializes the form's elements.
							   success: function(result)
							   {
							   		Snackbar.show({
										text: "The new query task has been added to queue. You can check it on the left of the page.",
										pos:'bottom-center'
									});
									//refreshQueue()//not complete
                  					openNav()
							   },
	  							error: function(xhr, ajaxOptions, thrownError){
									Snackbar.show({
										text: "Sorry, there is an issue happened. Error code:" + xhr.status + '-' + thrownError,
										pos:'bottom-center'
									});
									if(parseInt(xhr.status) == '401'){
										window.location.href="data_login.html"
									}
	 					 		}
							 });
						});

		saveData(url, fileName);
}
	else{
		alert("please check your form!")
		return false;
	}
});


createYearDropdowns();
createMonthDropdowns();
function createYearDropdowns() {
    var totalYears = 150;
    var startYear = 1950;
    var count = 1;

    while (count <= totalYears) {
        var newOption = $('<option value="' + startYear + '">' + startYear + '</option>');
        $('#yearstart').append(newOption.clone());
        $('#yearend').append(newOption.clone());
        $('#fullyearstart').append(newOption.clone());
        $('#fullyearend').append(newOption.clone());
        count++;
        startYear++;
    }
}

function createMonthDropdowns() {
    var index, len;
    for (index = 0, len = months.length; index < len; ++index) {
        var month = months[index];
        var newOption = $('<option value="' + month.value + '">' + month.name + '</option>');
        $('#monthstart').append(newOption.clone());
        $('#monthend').append(newOption.clone());
        $('#fullmonthstart').append(newOption.clone());
        $('#fullmonthend').append(newOption.clone());
    }
}

//validate after select date
$("select.selectpicker.date-selection").change(function(){
	dateValidation();
})
$("input#45-r").change(function(){
	rcpValidation()
})
$("input#85-r").change(function(){
	rcpValidation()
})
$("input#obs-r").change(function(){
	modelValidation()
})
$("#basin-data").change(function(){
	basinValidation();

})

//validate Date
function dateValidation(){
	 var monthstart = $("#monthstart option:selected").val();
     var monthend = $("#monthend option:selected").val();
     var yearstart = $("#yearstart option:selected").text();
     var yearend = $("#yearend option:selected").text();
	 var timerange = 1;
	 if($("input#timefull").is(':checked') ) timerange =2
	 if(!checkDate(yearstart,yearend,monthstart,monthend, timerange))
	 {

		 showWarningMsg("#warning-date");
		 showWarningMsg("#warning-date-r");
		 return false;
		 }
	 else
	 {

		 hideWarningMsg("#warning-date");
		 hideWarningMsg("#warning-date-r");
		 return true;

		 }
}
//basin option validation
function basinValidation(){
	var basinselected = $("#basin-data option:selected").text();
	if (basinselected == "" )  {

		 showWarningMsg("#warning-basin");
		 showWarningMsg("#warning-basin-r");
		 return false;
		 }
	 else
	 {

		 hideWarningMsg("#warning-basin");
		 hideWarningMsg("#warning-basin-r");
		 return true;
		 }
}

//model option validation
function modelValidation(){
	if ( (!$("input#obs-r").is(':checked')) && (!$("input#45-r").is(':checked')) && (!$("input#85-r").is(':checked')))  {

		 showWarningMsg("#warning-model");
		 showWarningMsg("#warning-model-r");
		 return false;
		 }
	 else
	 {

		 hideWarningMsg("#warning-model");
		 hideWarningMsg("#warning-model-r");
		 hideWarningMsg("#warning-rcp");
		 hideWarningMsg("#warning-rcp-r");
		 return true;
		 }
}

//observed model option validation
function observedmodelValidation(){
	if ( (!$("input#obs-r").is(':checked')))  {

		 showWarningMsg("#warning-model");
		 showWarningMsg("#warning-model-r");
		 return false;
		 }
	 else
	 {

		 hideWarningMsg("#warning-model");
		 hideWarningMsg("#warning-model-r");
		 return true;
		 }
}
//
function rcpValidation(){
	 if( $("input#45-r").is(':checked') ){
		 var model45selected = $("#45-data option:selected").text();
         if(model45selected == ""){

			showWarningMsg("#warning-rcp");
			showWarningMsg("#warning-rcp-r");
			return false;
			}
		else
		{

			hideWarningMsg("#warning-rcp");
			hideWarningMsg("#warning-rcp-r");
			return true;
		 }
       }

	 if( $("input#85-r").is(':checked') ){
		 var model85selected = $("#85-data option:selected").text();
         if(model85selected == ""){

			showWarningMsg("#warning-rcp");
			showWarningMsg("#warning-rcp-r");
			return false;
			}
		else
		{

			hideWarningMsg("#warning-rcp");
			hideWarningMsg("#warning-rcp-r");
			return true;
		 }
       }
	   if ( ($("input#obs-r").is(':checked')))  {

		 hideWarningMsg("#warning-rcp");
		 hideWarningMsg("#warning-rcp-r");
		 return true;
		 }
}

//stats option validation
function statsValidation(){
	if (  (!$("input#hydroclim-stast-orig").is(':checked')) && (!$("input#hydroclim-stast").is(':checked')))  {
		 // showWarningMsg("#warning-stats");
		 // showWarningMsg("#warning-stats-r");
		 showWarningMsg("#warning-raw");
		 showWarningMsg("#warning-raw-r");
		 return false;
		 }
	 else
	 {
		 hideWarningMsg("#warning-stats");
		 hideWarningMsg("#warning-stats-r");
		 hideWarningMsg("#warning-raw");
		 hideWarningMsg("#warning-raw-r");
		 return true;
		 }
}
function statsOptionValidation(){
	if($("input#hydroclim-stast").is(':checked')){
		if( $("input[name=hydroclim-stas]").is(':checked') ){
			hideWarningMsg("#warning-stats");
		 	hideWarningMsg("#warning-stats-r");
			return true;
		}
		else {
			showWarningMsg("#warning-stats");
			showWarningMsg("#warning-stats-r");
			return false;
		}
	}
	if($("input#hydroclim-stast-orig").is(':checked')){
		hideWarningMsg("#warning-raw");
		hideWarningMsg("#warning-raw-r");
		hideWarningMsg("#warning-stats");
		hideWarningMsg("#warning-stats-r");
		return true;
	}

}


$("input#hydroclim-stast").change(function(){
	if( $("input#hydroclim-stast").is(':checked') ) {
		$("input[name=hydroclim-stas]").prop("disabled", false);
	}
	else
		$("input[name=hydroclim-stas]").prop("disabled", true);
});

$(function () {
	$('#parameters-collapse').on('show.bs.collapse', function (e) {
		e.preventDefault();
	})
});


$(function () {
      $('#collapseOne').on('show.bs.collapse', function () {
          $('#hydroclim-result1').hide();
      })
   });
$(function () {
      $('#collapseOne').on('hidden.bs.collapse', function () {
          $('#date-result').empty();
		  $('#basin-result').empty();
           $('#date-result').append($('<h3>your selection:</h3>'));

           if( $("input#timesub").is(':checked') ){
               var monthstart = $("#monthstart option:selected").text();
               var monthend = $("#monthend option:selected").text();
               var yearstart = $("#yearstart option:selected").text();
               var yearend = $("#yearend option:selected").text();
               $('#date-result').append($('<h4>time subset:'+ monthstart + yearstart + '-'+ monthend + yearend +'</h4>'));
			    dateValidation()
             }

            if( $("input#timefull").is(':checked') ) {
                var monthstart = $("#monthstart option:selected").text();
               var monthend = $("#monthend option:selected").text();
               var yearstart = $("#yearstart option:selected").text();
               var yearend = $("#yearend option:selected").text();
				dateValidation()
                $('#basin-result').append($('<h4>time full:' +  monthstart + yearstart + '-'+ monthend + yearend + '</h4>'));
            }
           var basinselected = $("#basin-data option:selected").text();
		    basinValidation()
           $('#basin-result').append($('<h4>'+ basinselected +'</h4>'));


         $('#hydroclim-result1').show();
      })
   });


$(function () {
      $('#collapseTwo').on('show.bs.collapse', function () {
          $('#hydroclim-result2').css("display","none");
      })
   });
$(function () {
      $('#collapseTwo').on('hidden.bs.collapse', function () {
          $('#model-result').empty();
		   $('#rcp-result').empty();
           $('#model-result').append($('<h3>your selection:</h3>'));
           if( $("input#obs-r").is(':checked') ){
                 $('#model-result').append($('<h4>Observed data</h4>'));
             }

             if( $("input#45-r").is(':checked') ){
                  var model45selected = $("#45-data option:selected").text();
                 $('#rcp-result').append($('<h4>RCP 4.5:' + model45selected +'</h4>'));
             }
              if( $("input#85-r").is(':checked') ){
                  var model85selected = $("#85-data option:selected").text();
                 $('#rcp-result').append($('<h4>RCP 8.5:'+ model85selected +'</h4>'));
             }
			modelValidation();
			rcpValidation();

         $('#hydroclim-result2').show();
      })
   });

$(function () {
      $('#collapseThree').on('show.bs.collapse', function () {
          $('#hydroclim-result3').css("display","none");
      })
   });
$(function () {
      $('#collapseThree').on('hidden.bs.collapse', function () {
          $('#hydroclim-result3').empty();
           $('#hydroclim-result3').append($('<h3>your selection:</h3>'));
           if( $("input#hydroclim-stast-orig").is(':checked') ){
                 $('#hydroclim-result3').append($('<h4>Raw data</h4>'));
             }

             if( $("input#hydroclim-stast").is(':checked') ) {
                 $('#hydroclim-result3').append('Statistics:');
                 var selectedStats = $("input[name=hydroclim-stas]:checked");
                 for(var checkeditem =0; checkeditem < selectedStats.length; checkeditem++){
                     var text = $(selectedStats[checkeditem]).val();
                      $('#hydroclim-result3').append(text + ' ');
                 }

             }


         $('#hydroclim-result3').css("display","block");
      })
   });



$('input#45-r').on('click',function () {
     if( $(this).is(':checked') )
     { $('#45-data').prop('disabled', false);
        $('#45-data').selectpicker('refresh');}
     else
     {
         $('#45-data').prop('disabled', true);
        $('#45-data').selectpicker('refresh');
     }

});
$('input#85-r').on('click',function () {
     if( $(this).is(':checked') )
     { $('#85-data').prop('disabled', false);
        $('#85-data').selectpicker('refresh');}
     else
     {
         $('#85-data').prop('disabled', true);
        $('#85-data').selectpicker('refresh');
     }

});
