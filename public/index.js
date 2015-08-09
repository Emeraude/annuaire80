var socket = io.connect(location.origin);

socket.on('update', function(services) {
  for (i in services) {
    if (services[i].active)
      $('div[data-port='+services[i].port+']').html('<a target="_blank" href="http://127.0.0.1:' + services[i].port + '">' + services[i].port + ': ' + services[i].name +  '</a>');
    else
      $('div[data-port='+services[i].port+']').html(services[i].port + ': ' + services[i].name +  '</a>');
    $('div[data-port='+services[i].port+']').attr('class', services[i].active ? 'active' : 'inactive');
  }
});
