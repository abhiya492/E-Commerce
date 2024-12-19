import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a strong password"],
        minlength: 6,
    },
    isAdmin: {
        type: Boolean,  
        required: [true, "Please provide an admin status"],
        default: false,
    },
    createItems:[
        {
            quantity: {
                type: Number,
                required: [true, "Please provide a quantity"],
                default: 1,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Please provide a product"],
            },
        }
    ],
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
}, { timestamps: true });



// pre save middleware to hash password before saving user to database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();       
    } catch (error) {
        next(error);
    }
})
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
const User = mongoose.model("User", userSchema);

export default User;