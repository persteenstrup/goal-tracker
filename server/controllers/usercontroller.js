var mongoose = require("mongoose");
var User = mongoose.model("User");
var Goal = mongoose.model("Goal");
var Todo = mongoose.model("Todo");
var moment = require('moment');

module.exports = {
    register: function (req, res) {
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
            ///THIS NEEDS TO BE HANDLED ON THE FRONT END
            ///
            ///
            return res.json({ error: 'User with that email already exists' }) 
        })
    },

    login: function (req, res) {
        User.find({ email: req.body.logEmail }, function (err, users) {
            console.log("find executed");
            console.log(users)
            //ADD PASSWORD CHECKING ETC
            //
            //
            User.findOne({ _id: users[0]._id }).populate('_mygoals').populate('_mytodos').populate('_pastgoals').populate('_pasttodos').exec(function (err, user) {
                console.log("found user", user)
                console.log("")
                console.log('in login', user._mygoals[user._mygoals.length - 1])
                req.session.user = user;
                req.session.save();
                FindOverdue(user,
                    (userOverdue) => {
                        //console.log(userOverdue)
                        userOverdue.save(function (err) {
                            if (err) { console.log("user save error") }
                            req.session.user = userOverdue;
                            req.session.save();
                            console.log('post overdue user, login', user._mygoals[user._mygoals.length - 1])
                            return res.json({ user: userOverdue })
                        })
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
        //console.log(req.session.user)
        if (req.session.user) {
            User.findOne({ _id: req.session.user._id }, function (err, user) {
                req.session.user = user;
                req.session.save();
                return res.json({ user: req.session.user })
            })
        }
        else { res.json({ user: req.session.user }) }
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
                    // console.log(updatedGoal)
                    // console.log('888888888888888888888888888')
                    // console.log(req.body._user)
                    // console.log('888888888888888888888888888')

                    User.findOne({ _id: req.body._user }, function (err, user) {
                        if (err) { console.log('user find broke') }
                        //console.log('pre push',user._mygoals)
                        user._mygoals.push(updatedGoal._id)
                        // console.log("post push",user._mygoals)
                        // console.log(user)
                        user.save(function (err) {
                            if (err) { console.log('user save broke', err) }
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

    UpdateGoalOverDue: function (req, res) {
        Goal.findOne({ _id: req.body.goal_id }, function (err, goal) {
            if (err) { console.log("goal find failed") }
            let OverDueIDX = goal.overdue.findIndex(function (item) { return item == req.body.date })
            // console.log('presplice',goal.overdue)
            // console.log(OverDueIDX,'overdueIndex')
            goal.overdue.splice(OverDueIDX, 1)
            // console.log('post splice',goal.overdue)
            goal.completed.push(req.body.date)
            goal.save(function (err) {
                if (err) { console.log('goal save failed') }
                // console.log(goal.overdue.length)
                if (goal.overdue.length == 0 && goal.endflag) {

                    User.findOne({ _id: goal._user }, function (err, user) {
                        if (err) { console.log('user find error') }
                        let GoalIdx = user._mygoals.findIndex(function (item) { return String(item) == String(goal._id) })
                        // console.log('goalIDX',GoalIdx)
                        user._pastgoals.push(user._mygoals[GoalIdx])
                        // console.log('pastgoals',user._pastgoals)
                        user._mygoals.splice(GoalIdx, 1)
                        // console.log('mygoal splice',user._mygoals)                            
                        user.save(function (err) {
                            if (err) { console.log('user save failed') }
                            // console.log(goal)
                            return res.json(goal)
                        })
                    })
                }
                else { return res.json(goal) }
            })
        }
        )
    },

    FailOverDue: function (req, res) {
        //console.log(req.body.goal_id);
        Goal.findOne({ _id: req.body.goal_id }, function (err, goal) {
            console.log('found goal')
            console.log(goal.overdue)
            if (err) { console.log('goal find failed') }
            //console.log('goal failures',goal.failed)
            //console.log('concat result',goal.failed.concat(goal.overdue))
            //console.log('concat eval test', eval(goal.failed).concat(eval(goal.overdue)))
            goal.failed = goal.failed.concat(goal.overdue);
            goal.overdue = [];
            //console.log(goal.failed)
            goal.save(function (err) {
                console.log('fail overdue controller', goal)
                console.log('fail overdue controller')
                if (err) { console.log('goal save failed') }
                // if(goal.endflag){
                //     User.findOne({_id:goal._user},function(err,user){
                //         let GoalIdx = user._mygoals.findIndex(function(item){return String(item) == String(goal._id)})
                //         user._pastgoals.push(user._mygoals[GoalIdx])
                //         user._mygoals.splice(GoalIdx,1)
                //         user.save(function(err){
                //             if(err){console.log('user save failed')}
                //             // console.log(goal)
                //             return res.json(goal)
                //         })
                //     })
                // }
                // else{return res.json(goal)}
                res.json(goal)
            })

        })
    },

    updateUserCompleted: function (req, res) {
        console.log('update user complete controller hit')
        User.findOne({ _id: req.session.user._id }).populate('_mygoals').populate('_mytodos').populate('_pastgoals').populate('_pasttodos').exec(function (err, user) {
            RemoveCompleted(user,
                (UpdatedUser) => {
                    UpdatedUser.save(function (err) {
                        if (err) { console.log('user save error') }
                        res.json(UpdatedUser)
                    })
                })
        })
    }

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
                return
            }
        }
        if (moment(goal.pending).day() == 6) {
            if (goal.weekfreq == 'biweekly') { goal.pending = moment(goal.pending).day(3).add(2, 'weeks').day(0) }
            if (goal.weekfreq == 'monthly') { goal.pending = moment(goal.pending).day(3).add(1, 'months').day(0) }
        }
        if (goal.repeatdays[moment(goal.pending).day()]) {
            cb(goal)
            return
        }
        goal.pending = moment(goal.pending).add(1, 'days').format('YYYY-MM-DD')
    }
}

var FindOverdue = (user, cb) => {
    console.log('In find overdue function')
    var currdate = moment()
    //console.log(currdate)
    for (var i = 0; i < user._mygoals.length; i++) {
        console.log(i, 'FIND OVERDUE FORLOOP INDEX')
        //console.log(moment(user._mygoals[i].pending).isBefore(currdate, 'day'))
        while (!user._mygoals[i].endflag && moment(user._mygoals[i].pending).isBefore(currdate, 'day')) {
            // console.log("before push",moment(user._mygoals[i].pending))
            user._mygoals[i].overdue.push(moment(user._mygoals[i].pending).format("YYYY-MM-DD"));
            console.log("after push overdue", user._mygoals[i].overdue)
            console.log('after push pending', user._mygoals[i].pending)
            FindNextPending(user._mygoals[i],
                (updatedGoal) => {
                    //console.log("after find next",updatedGoal.pending)
                    console.log('find next pending callback', updatedGoal.pending)
                    console.log(i, 'INDEX INDISDE FIND NEXT PENDING')
                    user._mygoals[i] = updatedGoal
                    console.log('find overdue pre save user._mygoals', user._mygoals[i])
                    updatedGoal.save( //changed from user._mygoals[i]
                        function (err) {
                            console.log(err)
                            console.log(i)
                            console.log(user._mygoals[i])
                            if (err) { console.log('find overdue save error') }
                        }
                    )
                })
        }
    }
    cb(user)
}

var RemoveCompleted = (user, cb) => {
    console.log("user goals", user._mygoals)
    let idx = 0;
    while (idx < user._mygoals.length) {
        console.log(idx, "user goal index")
        if (user._mygoals[idx].endflag) {
            user._pastgoals.push(user._mygoals[idx])
            user._mygoals.splice(idx, 1)
        }
        else { idx++ }
    }
    cb(user)
}

//On completion of a task/todo MOVE it


