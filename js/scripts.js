$(function() {

  $('#accept_legal').change(function(){
    if($(this).is(':checked')){
      $(this).parents('form').find('button[type="submit"]').prop('disabled', false)
    }
  });


  $('.js-extra-field').on('change', function(){
    $('.extra-field').show();
  });

  $("#toggleAdvice").click(function () {
    var adviceContent = $("#adviceContent");
    var icon = $(".toggle-icon");
    if (adviceContent.hasClass("hidden")) {
        adviceContent.css("display", "block");
        adviceContent.removeClass("hidden");
        icon.addClass("rotated");
    } else {
        adviceContent.css("display", "none");
        adviceContent.addClass("hidden");
        icon.removeClass("rotated");
    }
  });

  $('#legal_notice_toggle').click(function () {
    var legalNoticeText = $('#legal_notice_text');
    if (legalNoticeText.hasClass('hidden')) {
        legalNoticeText.removeClass('hidden').css('display', 'block');
    } else {
        legalNoticeText.addClass('hidden').css('display', 'none');
    }
});


    $('#legal_notice_toggle_vjd').on('click', function () {
      $('#legal_notice_vjd').slideToggle(); // Alterna entre mostrar y ocultar con animación
    });
    

  
      $('#toggle_legal_notice_vjd-2').on('click', function (e) {
        e.preventDefault();
        $('#legal_notice_vjd-2').toggleClass('d-none');
      });
    


});



  document.addEventListener("DOMContentLoaded", function () {
    const btnAceptarModal = document.getElementById("btnAceptarModal");
    const acceptCheckbox = document.getElementById("accept_checkbox");

    btnAceptarModal.addEventListener("click", function () {
      acceptCheckbox.checked = true;
    });
  });