(function($){
	$(function(){
		$('.button-collapse').sideNav();
  });
})(jQuery);
$(document).ready(function() {
	$('select').material_select();
	if (typeof shouldInitSlider !== 'undefined' && shouldInitSlider == true) {
		$('input[type=range]').val(0);
	}
});
$(document).ready(function(){
	$('.modal').modal();
});
$("#ranking-filters-submit").click(function() {
	var finalStr = "";
	if ($("#ranking-filter-select").val() != "" && $("#ranking-filter-select").val() != undefined) {
		finalStr+="?filter="+$("#ranking-filter-select").val();
	} 
	if($("#ranking-event-select").val() != "" && $("#ranking-event-select").val() != undefined) {
		finalStr += ((finalStr == "") ? "?":"&") + "events=" + $("#ranking-event-select").val();
	}
	window.location.replace("/scout/teamranking" + finalStr);
});
$("#export-csv").click(function() {
	var finalStr = "";
	if ($("#select-events").val() != "" && $("#select-events").val() != undefined) {
		finalStr+="?events="+$("#select-events").val();
	} 
	window.location.replace("/scout/csv" + finalStr);
});
$(".increment_number_minus_button").click(function() {
	var element_for = $(this).data("for");
	var new_val = parseInt($('input[name="' + element_for + '"]').val()) - 1;
	if (new_val < 0) new_val = 0;
	$('input[name="' + element_for + '"]').val(new_val);
});

$(".increment_number_plus_button").click(function() {
	var element_for = $(this).data("for");
	$('input[name="' + element_for + '"]').val(parseInt($('input[name="' + element_for + '"]').val()) + 1);
});

$("#team-search").keypress(function(e) {
    if (e.which == 13) {
        window.location.replace("/scout/list/" + $("#team-search").val());
    }
});

$("#team-search-button").click(function() {
	window.location.replace("/scout/list/" + $("#team-search").val());
});