const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.post('/form-submit', (req, res) => {

    const email = req.body.email;
    console.log(`Email submitted: ${email}`);
    // Do something with the email, like send an email using nodemailer
    async function main() {
        // Fetch data from the Chuck Norris API
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const data = await response.json();
        const joke = data.value;

        // Async function enables allows handling of promises with await

        // First, define send settings by creating a new transporter: 
        let transporter = nodemailer.createTransport({
            host: "smtp.abv.bg", // SMTP server address (usually mail.your-domain.com) / Replace the host name with your service provider, if you have gmail try smtp.gmail.com
            port: 465, // Port for SMTP (usually 465)
            secure: true, // Usually true if connecting to port 465
            auth: {
                user: "kiko4a93@abv.bg", // Replace kiko4a93@abv.bg with your email address
                pass: "12345678qwertyui", // Replace with your password for your email address (for gmail/abv or anyother email service provider, your app password)

            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Define and send message inside transporter.sendEmail() and await info about send from promise:
        let info = await transporter.sendMail({
            from: "kiko4a93@abv.bg",  //Replace this with your email address
            to: email, //This is the received email from the html form
            subject: "Chuck Norris Joke",
            html: `
        <h1>Hello</h1>
        <p>Here is your daily Chuck Norris Joke</p>
        <div> <img src= "https://images02.military.com/sites/default/files/2021-04/chucknorris.jpeg">
        <h2>${joke}</h2>
        </div>
    
        `,
        });

        console.log(info.messageId); // Random ID generated after successful send (optional)
    }

    main()
        .catch(err => res.status(500).send('Error fetching data'));
    res.redirect('/');
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
})
