const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD
  }
})
const sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      return console.log(err)
    }else {
      console.log("Send mail: ", info)
    }
  })
}

module.exports = sendMail