var path = require("path");
var users = require('./../controllers/usercontroller');


module.exports = function(app){
    app.post('/login', function(req,res){
        console.log(req.body)
        users.login(req,res)
    })

    app.get('/checksession', function(req,res){
        //console.log("hit routes");
        users.checksession(req,res);
    })

    app.get('/users', function(req,res){
        console.log("hit routes users");
        users.getUsers(req,res);
    })

    app.get('/logout', function(req,res){
        users.logout(req,res)
    })

    app.post('/create/goal', function(req,res){
        users.ScheduleGoal(req, res)
    })

    app.post('/create/todo', function(req,res){
        users.ScheduleTodo(req, res)
    })

    app.post('/goal/update/overdue', function(req,res){
        users.UpdateGoalOverDue(req, res)
    })

    app.post('/goal/fail/overdue', function(req,res){
        users.FailOverDue(req, res)
    })

    app.get('user/removecompleted', function(req,res){
        users.updateUserCompleted(req,res)
    })
    

    app.all("**", (request, response) => {response.sendFile(path.resolve("./client/dist/index.html"))});
}