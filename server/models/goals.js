var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GoalSchema = new Schema({
    title:String,
    completed: {type:Array, default : []},
    failed: {type:Array, default : []},
    pending: String,
    _user: {type: Schema.Types.ObjectId, ref:'User'},
    startdate: String,
    enddate: String,
    repeatdays: Array,
    // [true false false true true false false]
    //  Sun   Mon   Tue   Wed Thur  Fri   Sat  
    repeatweekly: String,
    overdue: {type:Array, default: []},
    endflag: {type:Boolean, default:false}
},  {timestamps:true, usePushEach: true})

mongoose.model("Goal", GoalSchema)