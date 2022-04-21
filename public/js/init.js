(($) => {
	$(() =>{
		$('.button-collapse').sideNav();
  });
})(jQuery);
$(document).ready(() => {
	$('select').material_select();
	if (typeof shouldInitSlider !== 'undefined' && shouldInitSlider == true) {
		$('input[type=range]').val(0);
	}
});
$(document).ready(() => {
	$('.modal').modal();
});
$("#ranking-filters-submit").click(() => {
	var finalStr = "";
	if ($("#ranking-filter-select").val() != "" && $("#ranking-filter-select").val() != undefined) {
		finalStr+="?filter="+$("#ranking-filter-select").val();
	} 
	if($("#ranking-event-select").val() != "" && $("#ranking-event-select").val() != undefined) {
		finalStr += ((finalStr == "") ? "?":"&") + "events=" + $("#ranking-event-select").val();
	}
	window.location.replace("/scout/teamranking" + finalStr);
});
$("#filters-submit").click(() => {
	var finalStr = "";
	if($("#events-select").val() != "" && $("#events-select").val() != undefined) {
		finalStr += ((finalStr == "") ? "?":"&") + "events=" + $("#events-select").val();
	}
	window.location.replace(window.location.pathname + finalStr);
});
$("#export-csv").click(() => {
	var finalStr = "";
	if ($("#select-events").val() != "" && $("#select-events").val() != undefined) {
		finalStr+="?events="+$("#select-events").val();
	} 
	window.location.replace("/scout/csv" + finalStr);
});
$("#clear-observations").click(() => {
	var finalStr = "";
	if ($("#select-events").val() != "" && $("#select-events").val() != undefined) {
		finalStr+="?events="+$("#select-events").val();
	} 
	window.location.replace("/admin/clearobservations" + finalStr);
});
$(".increment_number_minus_button").click(() => {
	var element_for = $(this).data("for");
	var new_val = parseInt($('input[name="' + element_for + '"]').val()) - 1;
	if (new_val < 0) new_val = 0;
	$('input[name="' + element_for + '"]').val(new_val);
});
$(".increment_number_plus_button").click(() => {
	var element_for = $(this).data("for");
	$('input[name="' + element_for + '"]').val(parseInt($('input[name="' + element_for + '"]').val()) + 1);
});
$("#team-search").keypress((e) => {
    if (e.which == 13) {
        window.location.replace("/scout/list/" + $("#team-search").val());
    }
});

$("#team-search-button").click(() => {
	window.location.replace("/scout/list/" + $("#team-search").val());
});