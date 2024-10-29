// $("#exampleModal").modal("show");
//  $("#editModal").modal('show');
$("#add-automatic").hide();
//change slect time and start timer radio when add
$("#rd-manual").click(function() {
  $("#add-automatic").hide();
  $("#add-manual").show();
});
$("#rd-automatic").click(function() {
  $("#add-manual").hide();
  $("#add-automatic").show();
});
/* hide modal after click save
$('.btn-save').click(function() {
 $("#exampleModal").modal("hide");
}); */

