var socket = io.connect('http://mallocspace.tk:8080');
  var localUsername;
  // on connection to server, ask for user's name with an anonymous callback
  socket.on('connect', function(){
    // call the server-side function 'adduser' and send one parameter (value of prompt)
    localUsername = prompt("What's your name?");
    if (!localUsername) {
        window.location = './error';
    } else{
        socket.emit('adduser', localUsername, getUID());
    }
  });

  // listener, whenever the server emits 'updatechat', this updates the chat body
  socket.on('error', function(error) {
      if(localUsername === error) {
        socket.disconnect()
        alert('someone stole your username :(');
      }

  });
  socket.on('updatechat', function (username, data, notice) {

    if(notice.notice) {
      var strippedmsg = data.replace(/(<([^>]+)>)/ig,"");

      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      strippedmsg = strippedmsg.replace(exp,"<a href='$1'>$1</a>"); 
      //alert(s);
      $('#convolist').append('<tr><td><strong>SERVER: ' + strippedmsg + '</strong><br></tr></td>');
    } else {
      var strippedmsg = data.replace(/(<([^>]+)>)/ig,"");

      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      strippedmsg = strippedmsg.replace(exp,"<a href='$1'>$1</a>"); 
      //alert(s);
      $('#convolist').append('<tr><td><b>@'+username + ':</b> ' + strippedmsg + '<br></tr></td>');
    }
    
  });

  // listener, whenever the server emits 'updateusers', this updates the username list
  socket.on('updateusers', function(data) {
    $('#users').empty();
    $.each(data, function(key, value) {
      $('ul#users').append('<li>@' + key + '</li>');
    });
  });


  // on load of page
$(function(){
    // when the client clicks SEND
    $('#datasend').click( function() {
      var message = $('#data').val();
      if(message.length===0) {
            $('div#error').html('<p>You must write a message!</p>');
      } else {
            $('div#error').html('');
            $('#data').val('');
      // tell server to execute 'sendchat' and send along one parameter
      var exploded = message.split(' ');
        if(exploded[0] == '!notice') {
          //exploded.splice(0,1);


          var msg = "";
          $.each(exploded, function(key, value) {
            if(key == 0) {
            } else {
                msg += value+" ";

            }
          });
            socket.emit('sendnotice', msg);


        } else {
            socket.emit('sendchat', message);
        }
      }
      

    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
      if(e.which == 13) {
        $(this).blur();
        $('#datasend').click();
        $('#data').focus();
      }
    });
  });
function getUID() {
  
  var string = Math.random().toString().slice(2,11);

  return string;
}