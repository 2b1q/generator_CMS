$(function () {
  var url = '/api/records'; // records URL API
  var query = '?page=1&sort=a';
  var dataset = $('#dataset');
  var btn_reload = '<button type="button" id="reload" class="btn btn-default">Обновить страницу</button><br>'
  var btn_drop = '<button type="button" id="drop" class="btn btn-danger">Удалить все записи</button>'

  $.ajax({
    url: url+query
  }).then(function(data) {
    console.log(data);
    // not found!
    if(!data.records) {
      dataset.find('.jumbotron')
      .html('<div class="alert alert-danger"><strong>404</strong> Записи не найдены</div>')
      .append('<button type="button" id="create" class="btn btn-primary">Создать 10^6 записей</button>');
      $('#create').click(function(e){
        createRecords();
      })
    } else {
      dataset.removeClass('hidden').addClass('container');
      dataset.find('.alert.alert-danger').remove();
      $('#recs')
        .html('Записей в БД: '+data.records_cnt+'<br>Страниц: '+data.pages+'<br>Записей на странице: '+data.limit+'<br>Текущая страница: '+data.page)
        .append(btn_reload)
        .append(btn_drop)
      $('#reload').click(function(e){
          location.reload()
      })
      $('#drop').click(function(e){
        drop()
      })


      var rows = '';
      for(let i=0;i<data.records.length;i++){
        rows+='<div class="row">\
        <div class="col-sm-3">'+data.records[i].a +'</div>\
        <div class="col-sm-3">'+data.records[i].b +'</div>\
        <div class="col-sm-3">'+data.records[i].c +'</div>\
        <div class="col-sm-3"></div>\
        </div>'
      }
      $('#header').after(rows)
    }
  });
  var createRecords = function () {
    var api_key = '?api_key=B@NKEX'
    // POST XHR
    var request = $.ajax({
      url:url+api_key,
      type: 'POST', // add records API
      data: JSON.stringify({ "size": 100000 }),
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



})
