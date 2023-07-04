// JSON Web Token is a proposed Internet standard for creating data with optional signature and / or
// optional encryption whose payload holds JSON that asserts some number of claims.
// The tokens are signed either using a private secret or a public / private key.
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// User is a Model getting from models/user file.
import User from "../models/user.js";
import nodemailer from "nodemailer";
import { ConnectingAirportsOutlined } from "@mui/icons-material";


export const signin = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    const existingUser = await User.findOne({ email }).populate({
      path: "role",
      match: {
        name: role,
      },
    });
    if (!existingUser)
      // return res.status(201).json(req.body);
      return res.status(201).json({ error: true,message: "Invalid Email" });
    const existingPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!existingPassword)
      return res.status(201).json({ error: true,message: "Invalid Password" });
    const isRoleCorrect = role === existingUser.role?.name;
    
    if (!isRoleCorrect)
      return res.status(201).json({ error: true,message: "Invalid Role" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "360d" }
    );
    res.status(200).json({ error:false, message:"Successfully Login", user: existingUser, token });
  } catch (error) {
    res.status(404).json({ error: true, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(201).json({ message: "Invalid Email" });
    
    const token = randomString(10);
    await User.findByIdAndUpdate(
      existingUser._id,
      { resetToken: token },
      {
        new: true,
      }
    );
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "naseerjdmatrix@gmail.com",
        pass: "gxetqmvtrdqdiaoj",
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    transporter.sendMail(
      {
        from: "'No Reply' <naseerjdmatrix@gmail.com>",
        to: email,
        subject: "Reset Password Link",
        html: `<html>
                <body>
                <p>Click on the reset passward link to change your password</p>
                <a href="${process.env.CLIENT_URL}/reset_password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>
                </body>
                </html>`,
      },
      (error, info) => {
        if (error) {
          res.status(404).json("Email is not valid!");
        } else {
          res.status(200).json({
            error:false,
            message: "Please check your email to get reset password link.",
          });
        }
      }
    );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getToken = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await User.findOne({ resetToken: id }).lean().populate("role");
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  console.log("aaa")
  const token = req.params.token;
  const { password } = req.body;
  try {
    const existingUser = await User.findOne({ resetToken:token });
    if (!existingUser)
      return res.status(404).json({ message: "Invalid token" });

    const hashPassword = await bcrypt.hash(password, 10);
    const data = await User.findByIdAndUpdate(
      existingUser._id,
      { resetToken:null,
        password: hashPassword },
      {
        new: true,
      }
    );
    res.status(200).json({error:false,message:"Password Changed Successfully"});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

function randomString(length) {
  var result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
