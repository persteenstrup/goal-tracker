var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    fname:String,
    lname:String,
    email: String,
    pswd: String,
    lastlogin: String,
    _mygoals: [{type: Schema.Types.ObjectId, ref: 'Goal'}],
    _mytodos: [{type: Schema.Types.ObjectId, ref: 'Todo'}],
    _pastgoals: [{type: Schema.Types.ObjectId, ref: 'Goal'}],
    _pasttodos: [{type: Schema.Types.ObjectId, ref: 'Todo'}]
},
    {timestamps:true, usePushEach: true}

)

mongoose.model("User", UserSchema)