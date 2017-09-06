const nodemailer = require('nodemailer');

let mailSender = function(receiver,tempObject, mailConfig){}
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: mailConfig.user,
        pass: mailConfig.pass
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    to: receiver, // list of receivers
    subject: tempObject.subject, // Subject line
    text: tempObject.text, // plain text body
    html: tempObject.html // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
