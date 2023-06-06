const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



exports.signup = async (req, res) => {
  console.log(req.body)
    try {
      const { name, email, password } = req.body;
  
      const user = await User.findOne({ email }).exec();
      if (user) {
        return res.status(400).json({
          error: 'Email is taken'
        });
      }
  
      const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });
  
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
          <h1>Please use the following link to activate your account</h1>
          <p>https://effortless-khapse-a44008.netlify.app/auth/activates/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>https://effortless-khapse-a44008.netlify.app/</p>
        `
      };
  
      await sgMail.send(emailData);
  
      return res.json({
        message: `Email has been sent to ${email}. Follow the instructions to activate your account`
      });
    } catch (err) {
      return res.status(500).json({
        error: 'An error occurred'
      });
    }
  };


  exports.accountActivation = async (req, res) => {
    try {
      const { token } = req.body;
  
      if (token) {
        const decoded = await jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
        const { name, email, password } = jwt.decode(token);
  
        const user = new User({ name, email, password });
  
        await user.save();
        
        return res.json({
          message: 'Signup success. Please signin.'
        });
      } else {
        return res.json({
          message: 'Something went wrong. Try again.'
        });
      }
    } catch (err) {
      console.log('ACCOUNT ACTIVATION ERROR', err);
      return res.status(401).json({
        error: 'Expired link. Signup again'
      });
    }
  };
  

  exports.signin = async (req, res) => {
    console.log(req.body.email)
    
    
  
    try {
      // const {email,password}=req.body;
      // check if user exists
      const user = await User.findOne({email:req.body.email} ).exec();
  
      if (!user) {
        return res.status(400).json({
          error: 'User with that email does not exist. Please signup',
        });
      }
  
      // authenticate
      if (!user.authenticate(req.body.password)) {
        return res.status(400).json({
          error: 'Email and password do not match',
        });
      }
  
      // generate a token and send it to the client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const { _id, name, email, role } = user;
  
      return res.json({
        token,
        user: { _id, name, email, role },
      });
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        error: err,
        
      });
    }
  };
  
  
  
//   exports.requireSignin = expressJwt({
//     secret: process.env.JWT_SECRET,
//   });
  
  exports.adminMiddleware = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).exec();
  
      if (!user) {
        return res.status(400).json({
          error: 'User not found',
        });
      }
  
      if (user.role !== 'admin') {
        return res.status(400).json({
          error: 'Admin resource. Access denied.',
        });
      }
  
      req.profile = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  };
  
  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email }).exec();
  
      if (!user) {
        return res.status(400).json({
          error: 'User with that email does not exist',
        });
      }
  
      const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_RESET_PASSWORD, {
        expiresIn: '10m',
      });
  
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password Reset link`,
        html: `
                  <h1>Please use the following link to reset your password</h1>
                  <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                  <hr />
                  <p>This email may contain sensitive information</p>
                  <p>${process.env.CLIENT_URL}</p>
              `,
      };
  
      user.resetPasswordLink = token;
  
      await user.save();
  
      await sgMail.send(emailData);
  
      return res.json({
        message: `Email has been sent to ${email}. Follow the instruction to reset your password`,
      });
    } catch (err) {
      console.log('RESET PASSWORD LINK ERROR', err);
      return res.status(500).json({
        error: 'Database connection error on user password forgot request',
      });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;
  
    if (resetPasswordLink) {
      try {
        const decoded = jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD);
  
        const user = await User.findOne({ resetPasswordLink }).exec();
  
        if (!user) {
          return res.status(400).json({
            error: 'Something went wrong. Try later',
          });
        }
  
        user.password = newPassword;
        user.resetPasswordLink = '';
  
        await user.save();
  
        return res.json({
          message: `Great! Now you can login with your new password`,
        });
      } catch (err) {
        return res.status(400).json({
          error: 'Expired link. Try again',
        });
      }
    }
  };
  
