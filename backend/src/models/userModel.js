const mongoose =  require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
      
    firstname: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    Lastname: {
        type: String,
        minlength: 3,
        maxlegth: 20,
        trim: true,
    },
    emailID: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    age: {
        type: Number,
        min: 5,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'problem'
        }],
        unique:true
    }

}, { timestamps: true })

userSchema.post('findOneAndDelete', async function(userInfo) {
    if(userInfo){
        await mongoose.model('submission').deleteMany({ userId: userInfo._id });
    }
});
  

const User = mongoose.model("user", userSchema);

module.exports = User;