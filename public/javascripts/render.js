$(function () {
  var url = '/api/records'; // records URL API

  // var query = $('#f1').val() || $('#f1').attr('placeholder');
  var query = '?page=1&sort=a';

  $.ajax({
    url: url+query
  }).then(function(data) {
    // console.log(data);
    var dataset = $('#dataset').removeClass('hidden').addClass('container');
    // not found!
    if(data.records.length === 0) {
      dataset.find('.jumbotron')
      .html('<div class="alert alert-danger"><strong>404</strong> Записи не найдены</div>');
    }
    else {
      dataset.find('.alert.alert-danger').remove();
      $('#recs').html('Записей в БД: '+data.records_cnt+'<br>Страниц: '+data.pages+'<br>Записей на странице: '+data.limit+'<br>Текущая страница: '+data.page)
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


})
