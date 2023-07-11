const bcrypt = require("bcrypt");
const User = require("../models/userData");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    //get data
    const { name, email, password, role } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //secure the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Password cannot be hashed. Internal server error",
      });
    }

    //create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be created. Interna server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    //fetch credentials
    const { email, password } = req.body;
    //validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details.",
      });
    }
    //check user is registered or available in the database or not
    let user = await User.findOne({ email });
    //if not a registered user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please signup before logging in.",
      });
    }
    //verify password and generate a jwt token
    const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      };
      
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User login successful",
      });
    } else {
      //password do not match
      return res.status(403).json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Login failed.",
    });
  }
};
