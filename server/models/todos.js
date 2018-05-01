var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    title:String,
    completed: {type: Boolean, default:false},
    _user: {type: Schema.Types.ObjectId, ref:'User'},
    duedate: String,
    completiondate: String,
    // [true false false true true false false, true, false false]
    //  Sun   Mon   Tue   Wed  Thur Fri   Sat   Weekly  bi    month
},  {timestamps:true, usePushEach: true})

mongoose.model("Todo", TodoSchema)