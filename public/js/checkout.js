Strip.setPublishableKey("pk_test_PQTliQ86BBcE4ja5F0T8XnBO00KdOLskfX");

var $form = $("#checkout-form");
$form.submit(function (event) {
  $("#charge-error").addClass("hidden");
  $form.find("button").prop("disabled", true);
  Strip.card.createToken(
    {
      number: $("#card-number").val(),
      cvc: $("#card-cvc").val(),
      exp_month: $("#card-expiry-month").val(),
      exp_year: $("#card-expiry-year").val(),
      name: $("#card-name").val(),
    },
    stripResponseHandler
  );
  return false;
});

function stripeResponseHandler(status, response) {
  if (response.error) {
    // Show the errors on the form
    $("#charge-error").text(response.error.message);
    $("#charge-error").removeClass("hidden");
    $form.find("button").prop("disabled", false);
  } else {
    // token contains id, last4, and card type
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and submit
    $form.get(0).submit();
  }
}
