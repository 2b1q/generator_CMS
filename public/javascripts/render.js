$(function () {
  var rendered = false;
  var url = '/api/records'; // records URL API
  var dataset = $('#dataset');
  var btn_reload = '<button type="button" id="reload" class="btn btn-default">Обновить страницу</button><br>'
  var btn_drop = '<button type="button" id="drop" class="btn btn-danger">Удалить все записи</button>'
  var btn_new_recs = '<button type="button" id="create" class="btn btn-primary">Создать 10^6 записей</button>'

  if(!rendered) {
    sort(1,'a')
  }

  // createRecords API
  var createRecords = function () {
    var api_key = '?api_key=B@NKEX'
    // POST XHR
    var request = $.ajax({
      url:url+api_key,
      type: 'POST', // add records API
      data: JSON.stringify({ "size": 1000000 }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'});
      request.fail(function (err, msg){
        $('.alert.alert-danger').html(err.statusText);
        console.log('Request failed.\nStatus:'+err.status+'\nStatus text: '+err.statusText+'\nError message: '+msg);
      });
      request.done(function(response) {
        location.reload()
      })
  }

  // drop all records API
  function drop(){
    var api_key = '?api_key=B@NKEX'
    // POST XHR
    var request = $.ajax({
      url:url+api_key,
      type: 'DELETE', // DELETE records API
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'});
      request.fail(function (err, msg){
        $('.alert.alert-danger').html(err.statusText);
        console.log('Request failed.\nStatus:'+err.status+'\nStatus text: '+err.statusText+'\nError message: '+msg);
      });
      request.done(function(response) {
        location.reload()
      })
  }

  function sort(page,col) {
    rendered = true;
    let sort = '&sort=';
    let pg = 'page='
    pg += page || 1;
    switch (col) {
      case 'a':
        sort += 'a'
        break;
      case 'b':
        sort += 'b'
        break;
      case 'c':
        sort += 'c'
        break;
    }
    $.ajax({
      url: url+'?'+pg+sort
    }).then(function(data) {
      render(data)
    })
  }

  // common render function
  function render(data) {
    console.log(data);
    // not found!
    if(!data.records) {
      dataset.removeClass('hidden').addClass('container');
      dataset.find('.jumbotron')
      .html('<div class="alert alert-danger"><strong>404</strong> Записи не найдены</div>')
      .append(btn_new_recs);
      // new recs handler
      $('#create').click(function(e){
        createRecords();
      })
    } else {
      $('#paginator').removeClass('container').addClass('hidden').find('ul').remove();
      dataset.find('.clone').remove();
      dataset.removeClass('hidden').addClass('container');
      dataset.find('.alert.alert-danger').remove();
      $('#recs')
        .html('Записей в БД: '+data.records_cnt+'<br>Страниц: '+data.pages+'<br>Записей на странице: '+data.limit+'<br>Текущая страница: '+data.page)
        .append(btn_reload)
        .append(btn_drop)
        .append(btn_new_recs)
      $('#reload').click(function(e){
          location.reload()
      })
      $('#drop').click(function(e){
        drop()
      })

      // new recs handler
      $('#create').click(function(e){
        createRecords();
      })

      // show paginator
      if(data.pages > 0) paginator(data.pages, data.records_cnt, data.page, data.limit);

      var rows = '';
      for(let i=0;i<data.records.length;i++){
        rows+='<div class="row">\
        <div class="col-sm-3">'+data.records[i].a +'</div>\
        <div class="col-sm-3">'+data.records[i].b +'</div>\
        <div class="col-sm-3">'+data.records[i].c +'</div>\
        <div class="col-sm-3"></div>\
        </div>'
      }
      $('#header').after('<div class="clone"></div>')
      $('.clone').append(rows)
    }
  }

  // sort handler
  $('#a').click(function(e){
    sort($('.active').text(),'a')
  })
  $('#b').click(function(e){
    sort($('.active').text(),'b')
  })
  $('#c').click(function(e){
    sort($('.active').text(),'c')
  })



  /*
  *  - show paginator
  *  - paginator click handler
  */
  // show pagination
  var paginator = function (pages, records, page, limit) {
    console.log('pages: '+pages+'\ndocs: '+records+'\npage: '+page);
    var ul = '<ul class="pagination"></ul>';
    $('#paginator')
    .removeClass('hidden')
    .addClass('container')
    .append(ul);
    ul = $('#paginator').find('ul');
    if( page === 1 ) ul.append('<li class="disabled"><a>First</a></li>');
    else ul.append('<li><a page="1">First</a></li>');
    var i = (Number(page) > 5 ? Number(page) - 4 : 1);
    if(i != 1) ul.append('<li class="disabled"><a>...</a></li>');
    for (; i <= (Number(page) + 4) && i <= pages; i++) {
      if (i == page)
      ul.append('<li class="active"><a>'+i+'</a></li>');
      else
      ul.append('<li><a page='+i+'>'+i+'</a></li>');
      if(i == Number(page) + 4 && i < pages)
      ul.append('<li class="disabled"><a>...</a></li>');
    }
    if(page === pages) ul.append('<li class="disabled"><a>Last</a></li>');
    else ul.append('<li><a page='+pages+' page='+pages+'>Last</a></li>');

    // paginator event handler
    $('.pagination')
    .find('a')
    .click(function (event) {
      var page = $(this).attr('page');
      sort(page,'a')
      })
    }



})
