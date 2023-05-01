import nc from "next-connect";
import db from "../../../utils/db";
import bcrypt from "bcrypt";
import User from "../../../models/User";
import { activateEmailTemplate } from "../../../emails/activateEmailTemplate";
import { sendEmail } from "../../../utils/sendEmails";
import { validateEmail } from "../../../utils/validation";
import { createActivationToken } from "../../../utils/tokens";
const handler = nc();

handler.post(async (req, res) => {
  try {
    await db.connectDb();
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email Already Exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password Length must be atleast 6 charachters" });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: cryptedPassword });
    const addedUser = await newUser.save();
    const activation_token = createActivationToken({
      id: addedUser._id.toString(),
    });
    const url = `${process.env.BASE_URL}/activate/${activation_token}`;
    sendEmail(email, url, "", "Activate your account.");
    await db.disconnectDb();
    res.json({
      message: "Register success! Please activate your email to start.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;
