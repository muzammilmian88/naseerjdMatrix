import nodemailer from "nodemailer";
import User from "../models/user.js";
import Role from "../models/role.js";

export const email = async (req, res, next) => {
  const { email, password } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "hafizumairtariq1234@gmail.com",
      pass: "ucyfeaeasojfieax",
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(201).json({ message: "Email already exists." });
    const existingPassword = await User.findOne({ password });
    if (existingPassword)
      return res.status(201).json({ message: "Password already exists." });

    const { name } = await Role.findOne({ _id: req.body.role });

    const info = await transporter.sendMail({
      from: "No Reply <hafizumairtariq1234@gmail.com>",
      to: req.body.email,
      subject: "Your Role",
      html: `<html>
                <body>
                <h3>Hi! ${req.body.firstName} ${req.body.lastName}</h3>
                <p>You have given a ${name} role and know you can login to ${name} panel based on the generated password and link.</p>
                <p>your link: <b><a href=https://hr-cms-pro.vercel.app/${name}>Link</a></b></p>
                <p>password: <b>${req.body.password}</b></p>
                <p>You will reset your password later on.</p>
                </body>
                </html>`,
    });

    console.log("Message sent: %s", info.messageId);
    next();
  } catch (error) {
    console.log(error.message);
  }
};
