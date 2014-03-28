---
layout: post
title:  "Syntax highlighter JavaScript"
date:   2014-02-08 20:18:48
description: "Syntax highliter test JavaScipt"
tag: "JavaScript"
color: "red"
author: "Jurek Błaszczyk"
---

You'll find this post in your `_posts` directory - edit this post and re-build (or run with the `-w` switch) to see your changes!
To add new posts, simply add a file in the `_posts` directory that follows the convention: YYYY-MM-DD-name-of-post.ext.

Jekyll also offers powerful support for code snippets:

<script type="syntaxhighlighter" class="brush: js"><![CDATA[
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

  $('#blog').find('.item').on('click', function () {
    window.location.href = $(this).attr('data-href');
  });

  SyntaxHighlighter.all();

});
]]></script>
