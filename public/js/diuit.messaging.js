var currentUser;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var messages = [];
var chat_id = -1;
var session = "";

/* open modal to let user input session and chat id */
$('#myModal').modal('show');
/* Socket.io */
var socket = io('https://api.diuit.net');
var isConnected = false;
socket.on('connect', function () {
  console.log('connected');
  isConnected = true;
});

socket.on('reconnect', function ()
{
  console.log('reconnected');
  isConnected = true;
});

socket.on('disconnect', function (){
  console.log('disconnected');
  isConnected = false;
});

socket.on('message', function(message) {
  console.log("got message with id :"+message.id);
  var newMessage = new Message(message);
  messages.push(newMessage);
  $('#messages').append(generateMessageUIElement(newMessage));
  $("#panel").animate({ scrollTop: $('#panel').prop("scrollHeight")}, 1000);
});

/* Event handler */
function authAndListenToChat() {
  session = $('#session_token').val();
  chat_id = parseInt($('#chat_id').val());
  loginWithSessionToken(session);
}
/* general function */
function loginWithSessionToken(session) {
  socket.emit('authenticate', {"authToken":session}, function (data) {
    console.log(data);
    if(data.code == 200) {
      $('#myModal').modal('hide');
      currentUser = new User(data.device.owner);
      listMessages(chat_id, function(messages) {
        $.each(messages, function( index, value ) {
          $('#messages').prepend(generateMessageUIElement(value));
        });
        $("#panel").animate({ scrollTop: $('#panel').prop("scrollHeight")}, 1000);
      });
    }
  });
}

function generateMessageUIElement(message) {
  if(message.sender.meta == null) return [];
  if(message.sender.meta.name == "System") return [];

  var outGoing = (message.sender.serial == currentUser.serial)? true : false;
  var displayName = (outGoing) ? currentUser.meta.name : (message.sender.meta.name) ? (message.sender.meta.name) : (message.sender.serial);

  var messageElement;
  if (outGoing) { // sent by me
    var timeLabel = $('<small class="text-muted">')
                      .append('<i class="material-icons">schedule</i>')
                      .append(getTimeLabelDisplayOf(message.createdAt));
    var messageLabel = $('<div class="head">')
                        .append(timeLabel)
                        .append($('<strong class="pull-right primary-font">').text(displayName));

    var messageBody = $('<div class="chat-body clearfix">').append(messageLabel)
                        .append($('<p>').text(message.text));

    var avatar = $('<img alt="User Avatar" class="img-circle">');
    avatar.attr('src', "http://placehold.it/50/FA6F57/fff&amp;text=ME");
    messageElement = $('<li class="right clearfix">')
                      .append($('<span class="chat-img pull-right">').append(avatar))
                      .append(messageBody);
  } else { // received by me
    var timeLabel = $('<small class="pull-right text-muted">')
                      .append($('<i class="material-icons">schedule</i>').text(''))
                      .append(getTimeLabelDisplayOf(message.createdAt));
    var messageLabel = $('<div class="head">')
                        .append($('<strong class="primary-font">').text(displayName))
                        .append(timeLabel);

    var messageBody = $('<div class="chat-body clearfix">').append(messageLabel)
                        .append($('<p>').text(message.text));

    var avatar = $('<img alt="User Avatar" class="img-circle">');
    avatar.attr('src', "http://placehold.it/50/55C1E7/fff&amp;text=" + getShortName(displayName));
    messageElement = $('<li class="left clearfix">')
                      .append($('<span class="chat-img pull-left">').append(avatar))
                      .append(messageBody);
  }
  return messageElement;
}

function getTimeLabelDisplayOf(date) {
  var now = new Date();
  if(now.getFullYear() == date.getFullYear()) {
    if((now.getMonth() == date.getMonth()) && (now.getDate() == date.getDate())) {
      return date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
    } else {
      return months[date.getMonth()] + ' ' + date.getDate().toString();
    }
  } else {
    return (date.getMonth() + 1).toString() + '/' + date.getDate().toString() + '/' + (date.getFullYear() % 1000).toString();
  }
}

function getShortName(name) {
  if(name.indexOf(' ') == -1) return (name[0]).toUpperCase();

  var nameSplit = name.split(" ");
  var names = nameSplit.map(function(e) {return e.replace(/ /g,'');});
  return (names.reduce(function(pre,next) { return pre[0]+next[0];})).toUpperCase();
}
/* chats function */
function listChats(fn) {
  listChatWith("", fn);
}

function listChatWith(chatType, fn) {
  var params = {};
  if (chatType == "group")
    params = {"type":"group"};
  else if (chatType == "direct")
    params = {"type":"direct"};
  socket.emit('chats/list', params, function (data) {
    console.log(data);
    if(data.code == 200) {
      fn(data.chats.map(function(c){ return new Chat(c); }));
    } else {
      fn([]);
    }
  });
}

/* message */
function listMessages(chatId, fn) {
  socket.emit('messages/list', {
    "chatId": chatId,
    "page": 0,
    "count": 20,
    "before": Math.floor(Date.now() / 1000)
  }, function(result) {
    console.log(result);
    if(result.code == 200) {
      fn(result.messages.map(function(m){return new Message(m);}));
    } else {
      fn([]);
    }
  });
}

function sendMessageIn(chatId, text) {
  socket.emit('messages/create', {
    "chatId": chatId,
    "data": text,
    "mime": 'text/plain',
    "encoding": 'utf8'
  }, function(result){
    console.log(result);
    if(result.code == 200) {
      var newMessage = new Message(result.message);
      newMessage.sender.userSerial = currentUser.serial;
      $('#messages').append(generateMessageUIElement(newMessage));
      $("#panel").animate({ scrollTop: $('#panel').prop("scrollHeight")}, 1000);
    }
  });
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

/* Classes */

function Chat(obj) {
  this.id = obj.id;
  this.isBlockedByMe = (obj.isBlockedByMe == null)? false : obj.isBlockedByMe;
  this.lastMessage = (obj.lastMessage)? new Message(obj.lastMessage) : null;
  this.members = obj.memberSerials;
  this.meta = (obj.meta == null)? [] : obj.meta;
  this.type = obj.type;
  this.whiteList = obj.whiteList;

}

function Message(obj) {
  this.id = obj.id;
  this.text = obj.data;
  this.encoding = obj.encoding;
  this.mime = obj.mime;
  this.createdAt = (obj.createdAt)? new Date(obj.createdAt) : new Date();
  this.sender = (obj.senderUser) ? new User(obj.senderUser) : new User({id:0, meta:{name:'System'}, serial:'System'});
}

function User(obj) {
  this.id = obj.id;
  this.meta = obj.meta;
  this.serial = obj.serial;
}
