var mongoose = require("mongoose");
var User = mongoose.model("User");
var Goal = mongoose.model("Goal");
var Todo = mongoose.model("Todo");
var moment = require('moment');

module.exports = {
    login: function (req, res) {
        User.find({ email: req.body.email }, function (err, users) {
            //console.log("find executed");
            //console.log(user)
            if (users.length < 1) {
                User.create(
                    {
                        fname: req.body.fname,
                        lname: req.body.lname,
                        email: req.body.email,
                        pswd: req.body.pswd,
                        lastlogin: moment()
                    }, function (err, user) {
                        //console.log("user created", user);
                        req.session.user = user
                        req.session.save();
                        return res.json({ user: req.session.user })

                    })
            }
            else {
                User.findOne({ _id: users[0]._id }).populate('_mygoals').populate('_mytodos').populate('_pastgoals').populate('_pasttodos').exec(function (err, user) {
                    //console.log("found user", user)
                    //console.log("")
                    FindOverdue(user, 
                        (userOverdue) => {
                            RemoveCompleted(userOverdue, 
                                (finalUser) => {
                                    console.log(finalUser)
                                    finalUser.save(function(err){
                                        if(err){console.log("user save error")}
                                        req.session.user = finalUser;
                                        req.session.save();
                                        return res.json({ user: finalUser })        
                                    })
                                }
                            )
                        }
                    )
                })


                // users[0].lastlogin = moment()
                // users[0].save(function (err) {
                //     if (err) { console.log('user save error') }
                //     req.session.user = users[0];
                //     req.session.save();
                //     //console.log(req.session.user)
                //     return res.json({ user: req.session.user })
                // })
            }
            //console.log(req.session.user)
        })
        //console.log("user controller hit")

    },

    getUsers: function (req, res) {
        //console.log("get all users controller");
        User.find({}, function (err, users) {
            res.json({ users: users })
        })
    },

    logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    },

    checksession: function (req, res) {
        //console.log("user controller hit")
        res.json({ user: req.session.user })
    },

    ScheduleGoal: function (req, res) {
        //console.log(req.body)
        Goal.create({
            title: req.body.title,
            _user: req.body._user,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            repeatdays: req.body.repeatdays,
            repeatweekly: req.body.repeatweekly,
        }, function (err, goal) {
            NewPendingFinder(goal, (updatedGoal) => {
                updatedGoal.save(function (err) {
                    if (err) { console.log('newgoal save broke') }
                    console.log(updatedGoal)
                    console.log('888888888888888888888888888')
                    console.log(req.body._user)
                    console.log('888888888888888888888888888')
                    
                    User.findOne({ _id: req.body._user }, function (err, user) {
                        if (err) { console.log('user find broke') }
                        console.log('pre push',user._mygoals)
                        user._mygoals.push(updatedGoal._id)
                        console.log("post push",user._mygoals)
                        console.log(user)
                        user.save(function (err) {
                            if (err) { console.log('user save broke',err) }
                            res.json(updatedGoal)
                        })
                    })
                })
            })
        })

    },

    ScheduleTodo: function (req, res) {

    },
    //{ goal_id: '5a7377642d55f722b8a95276', date: '2018-01-20' }

    UpdateGoalOverDue: function(req,res){
        Goal.findOne({_id: req.body.goal_id}, function(err,goal){
            if(err){console.log("goal find failed")}    
            let OverDueIDX = goal.overdue.findIndex(function(item){return item == req.body.date})
            goal.overdue.splice(OverDueIDX,1)
            goal.completed.push(req.body.date)
                goal.save(function(err){
                    if(err){console.log('goal save failed')}
                    if(goal.overdue.length == 0 && endflag){
                        User.findOne({_id:goal._user}, function(err, user){
                            console.log(user._mygoals)
                            let GoalIdx = User._mygoals.findIndex(function(item){return item == goal._id})
                            user._pastgoals.push(user._mygoals[GoalIdx])
                            user._mygoals.splice(GoalIdx,1)
                            user.save(function(err){
                                if(err){console.log('user save failed')}
                                return res.json(goal)
                            })
                        })
                    }
                    return res.json(goal)
                })
            }
        )
    },


}

var NewPendingFinder = (goal, cb) => {
    let start = moment(goal.startdate)
    // if(goal.enddate != null){
    //     if(currdate.isAfter(goal.enddate, 'day')){
    //         return cb(goal)
    //     }
    // }
    while (!goal.pending) {
        if (goal.repeatdays[start.day()]) {
            goal.pending = start.format("YYYY-MM-DD")
        }
        start = start.add(1, 'days')
    }
    // console.log('')
    // console.log('888888888888888888888888888888888')
    // console.log('new pending finder before CB')
    // console.log('')
    cb(goal)
}


var FindNextPending = (goal, cb) => {
    console.log('in findnext pending function')
    goal.pending = moment(goal.pending).add(1, 'days').format('YYYY-MM-DD')
    while (true) {
        if (goal.enddate) {
            if (moment(goal.pending).isAfter(moment(goal.enddate), 'days')) {
                goal.pending = null;
                goal.endflag = true
                cb(goal)
                return goal
            }
        }
        if (moment(goal.pending).day() == 6) {
            if (goal.weekfreq == 'biweekly') { goal.pending = moment(goal.pending).day(3).add(2, 'weeks').day(0) }
            if (goal.weekfreq == 'monthly') { goal.pending = moment(goal.pending).day(3).add(1, 'months').day(0) }
        }
        if (goal.repeatdays[moment(goal.pending).day()]) {
            cb(goal)
            return goal
        }
        goal.pending = moment(goal.pending).add(1, 'days').format('YYYY-MM-DD')
    }
}

var FindOverdue = (user, cb) => {
    console.log('In find overdue function')
    var currdate = moment()
    //console.log(currdate)
    for (var i = 0; i < user._mygoals.length; i++) {
        //console.log(moment(user._mygoals[i].pending).isBefore(currdate, 'day'))
        while (!user._mygoals[i].endflag && moment(user._mygoals[i].pending).isBefore(currdate, 'day')) {
            //console.log("before push",moment(user._mygoals[i].pending))
            user._mygoals[i].overdue.push(moment(user._mygoals[i].pending).format("YYYY-MM-DD"));
            //console.log("after push", user._mygoals[i].overdue)
            FindNextPending(user._mygoals[i],
                (updatedGoal) => {
                    //console.log("after find next",updatedGoal.pending)
                    user._mygoals[i] = updatedGoal
                    user._mygoals[i].save(
                        function (err) { if (err) { console.log('find overdue save error') } }
                    )
                })

        }
    }
    cb(user)
}

var RemoveCompleted = (user, cb) => {
    let idx = 0;
    while (idx < user._mygoals.length) {
        if (user._mygoals[idx].endflag) {
            user._pastgoals.push(user._mygoals[idx])
            user._mygoals.splice(idx, 1)
        }
        else { idx++ }
    }
    cb(user)
}

//On completion of a task/todo MOVE it


