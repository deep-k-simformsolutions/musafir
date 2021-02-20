const sgMail = require('@sendgrid/mail')
//const sendgridAPIKey = ''  => pass in setAPIKey

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'deepbhaideepbhai@gmail.com',
        subject:'Thanks for joining in!',
        text:`whats up ${name}`
    })
}
const sendCancelationEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'deepbhaideepbhai@gmail.com',
        subject:'Removed account',
        text:`Goodbye,${name}. see you soon`
    })
}
module.exports = {sendWelcomeEmail,sendCancelationEmail}
