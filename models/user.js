const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
      const notAllowedEmails = [
        "gmail",
        "outlook.com",
        "yahoo",
        "hotmail",
        "aol",
        "msn",
        "microsoft",
        "shaw.ca",
        "att.net",
        "verizon.net",
        "live",
        "me",
        "netapp",
        "amazon",
        "dell",
        "purestorage",
        "hpe.com",
        "hitachivantara",
        "nutanix",
        "ibm",
      ];
      notAllowedEmails.forEach(function (word) {
        if (value.includes(word)) {
          throw new Error(
            "Invalid email selection, please use a business email"
          );
        }
      });
    },
  },
  admin:{
    type: Boolean,
    required: false,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Generate Auth Token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to find Email");
  }
  const isMatch = await bcrypt.compare(email, user.email);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
