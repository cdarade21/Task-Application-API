const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from : 'daradechaitanya21@gmail.com',
        subject: 'Welcome to Task Application!',
        text: `Welcome to the app, ${name}. I hope you manage your tasks with it!`
    })
}

const sendDeleteEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'daradechaitanya21@gmail.com',
        subject: 'Goodbye!',
        text: `Goodbye ${name}. It's sad that you are leaving. We hope to you see get back soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}



