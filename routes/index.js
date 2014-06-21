
/*
 * GET home page.
 */
var _ = require('underscore');

module.exports = function Route(app){
	app.get('/', function(req, res){
		res.render('index', {title: "Welcome Page"});
	});

		app.get('/client', function(req, res){
		res.render('client', {title: "Welcome Page", session_data:req.session});
	});

		app.get('/results', function(req, res){
		res.render('results', {title: "Results", session_data:req.session});
	});

		app.get('/dojo', function(req, res){
		res.render('dojo', {title: "Results", session_data:req.session});
	});


var users = [];
var chat = [];

app.io.route('ready', function(req){
	users.push({id: req.sessionID, name: req.data.name, room: req.data.room, date: req.data.time});
	req.io.join(req.data.room);
	app.io.room(req.data.room).broadcast('user_entered_room', 
		{users_info:users, name:req.data.name, room:req.data.room, message: req.data.name + " has entered room " + req.data.room + " at " + req.data.time
		});
});
	app.get('/', function(req, res) {
	    res.render('client');
	});


app.io.route('send_chat', function(req){
	chat.push(req.data);
	req.io.join(req.data.room);
	app.io.room(req.data.room).broadcast('broadcast_chat', 
		{chat_message:req.data
		});
});
	app.get('/', function(req, res) {
	    res.render('client');
	});

////Grabs chat log data for each room
app.io.route("get_chats", function(req){
	console.log(req.data.room, "get_chats room");
	var room_chat_session = _.where(chat,{room:req.data.room});
	console.log(room_chat_session, "underscore data search for rooms");
	req.io.emit('previous_chats',{previous_messages:room_chat_session});	
});
	app.get('/', function(req, res) {
	    res.render('client');
	});

app.io.route("get_current_users", function(req){
	var current_users_in_room = _.where(users,{room:req.data.room});
	console.log(current_users_in_room, "get current users in room! server!");
	req.io.join(req.data.room);
	app.io.room(req.data.room).broadcast('current_users',
		{current_users:current_users_in_room
		});
});
	app.get('/', function(req, res) {
		    res.render('client');
	});

app.io.route("options_received", function(req){
	console.log(req.data, "user to block!");

});

	app.get('/', function(req, res) {
			    res.render('client');
		});

app.io.route('disconnect', function(req){
  var disconnect = _.findWhere(users, {id:req.sessionID}); 
  app.io.broadcast('leave',{disconnected_user: disconnect, message: disconnect.name + " has left"});
  var remove_user = _.without(users, disconnect);
  users = remove_user;
  console.log(disconnect.name, " has disconnected");
})

}