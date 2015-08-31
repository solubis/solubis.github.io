$(function () {

  var settings = {
    verbose: false,
    debug: false,
    performance: false
  };

  $.extend($.fn.sidebar.settings, settings);
  $.extend($.fn.modal.settings, settings);
  $.extend($.fn.dimmer.settings, settings);

  $.fn.dimmer.settings.closable = false;

  $('.column .back').hide();

  $('.ui.dimmable')
      .dimmer({
        on: 'hover'
      })
  ;

  $('.ui.sidebar')
      .sidebar({
        debug: false,
        performance: false,
        overlay: false
      })
      .sidebar('attach events', '#sidebar-toggle');

  $('.ui.dropdown').dropdown({on: 'hover'});

  $('.masthead .information').transition('scale in');

  $('#modal-netgraph').modal('attach events', '#thumb-netgraph', 'show');
  $('#modal-sequis').modal('attach events', '#thumb-sequis', 'show');
  $('#modal-arc').modal('attach events', '#thumb-arc', 'show');
  $('#modal-crm').modal('attach events', '#thumb-crm', 'show');
  $('#modal-gamification-widget').modal('attach events', '#thumb-gamification-widget', 'show');
  $('#modal-gamification-mobile').modal('attach events', '#thumb-gamification-mobile', 'show');
  $('#modal-alerter').modal('attach events', '#thumb-alerter', 'show');

  $('#blog').find('.item').on('click', function () {
    window.location.href = $(this).attr('data-href');
  });

  $('#language-pl').on('click', function () {
    document.location.href = 'pl.html';
  });

  $('#language-eng').on('click', function () {
    document.location.href = 'eng.html';
  });

  SyntaxHighlighter.all();

});
