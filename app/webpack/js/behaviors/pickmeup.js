$(document).ready(function(){
  pickmeup('#calendar').show();
  cal = $('.pickmeup').remove();
  cal.removeAttr('style');
  cal.appendTo('#calendar');
});
