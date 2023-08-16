import mongoose from "mongoose"

const JobSchema = new mongoose.Schema({
    userId:{
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    proposals: {
        type: Map,
        of: Boolean,
        default: {}
    },
    type:{
        type: String,
        required: true
    },
    progress:{
        type: String,
        enum: ['pending', 'lawyer selected', 'closed'],
        default: "pending"
    },
    desc:{
        type: String,
        required: true
    }
},{ timestamps: true })

export default mongoose.model('Job', JobSchema)