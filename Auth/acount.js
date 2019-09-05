
const sgMail=require('@sendgrid/mail')// email for signup an account 
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//   console.log(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail=(email,username)=>{
sgMail.send({
    to:email,
    from:'phoolan@deligence.com',
    subject:'Thanks for joining deligence :)',
    text:`welcome to the deligence, ${username},Let us know how you get along with us`
})
}


// Email for delete an user account 
const sendCancelEmail=(email,username)=>{
sgMail.send({
    to:email,
    from:'phoolan@deligence.com',
    subject:'sorry to see you go :)',
    text:` hey,${username},Hope see you soon at deligence`
})
}

module.exports={
    sendWelcomeEmail,sendCancelEmail
}