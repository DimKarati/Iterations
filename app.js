const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 3000;


// The connection string to the MongoDB Database
const uri = "mongodb+srv://erakarati:YceFNCNHz16hIFI5@db.lerhe4i.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (err) {
        console.error("Connection to MongoDB failed", err);
    }
}

run().catch(console.dir);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Static file serving 
app.use(express.static('public'));
app.use(bodyParser.json());




// Route to the main page 
app.get('/', (req, res) => {
    res.render('manager_dashboard');
});



// Login route
app.post('/', async (req, res) => {
    const usersCollection = client.db("managerConsole").collection("users");
    try {
        const user = await usersCollection.findOne({ username: req.body.username });
        if (user) {
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatch) {
                // Set session variables
                req.session.userId = user._id;
                // Redirect to the dashboard
                res.redirect('/');
            } else {
                // Render login page with error
                res.render('manager_dashboard', { error: 'Invalid credentials' });
            }
        } else {
            // Render login page with error
            res.render('manager_dashboard', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in', error);
        // Render login page with error
        res.render('manager_dashboard', { error: 'Error logging in' });
    }
});




app.get('/register', (req, res) => {
    res.render('register', { message: null, error: null });
});

// Register route
app.post('/register', async (req, res) => {
    const usersCollection = client.db("managerConsole").collection("users");

    try {
        // Check if the username already exists
        const existingUser = await usersCollection.findOne({ username: req.body.username });

        if (existingUser) {
            // Username already exists
            return res.render('register', { message: null, error: 'Username is already taken. Please choose another one.' });
        }
        // If username does not exist, proceed to hash the password and register the new user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await usersCollection.insertOne({
            username: req.body.username,
            password: hashedPassword
        });
        // Handle registration success
        res.render('register', { message: 'Registration successful!', error: null });
    } catch (error) {
        console.error('Error registering new user', error);
        // Handle error during registration
        res.render('register', { message: null, error: 'Error registering new user. Please try again.' });
    }
});

// Route to the feedback page
app.get('/manager_feedback', (req, res) => {
    res.render('manager_feedback');
});

// Route to the reports page
app.get('/manager_reports', async (req, res) => {
    const reportsCollection = client.db("managerConsole").collection("reports");
    try {
        const reports = await reportsCollection.find({}).toArray();
        res.render('manager_reports', { reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.render('manager_reports', { error: 'Error fetching reports' });
    }
});


app.post('/submit-report', async (req, res) => {
    const { reportTitle, reportSummary } = req.body;
    const reportsCollection = client.db("managerConsole").collection("reports");

    try {
        // Create a new report document
        const reportDocument = {
            title: reportTitle,
            summary: reportSummary,
            createdOn: new Date() 
        };

        await reportsCollection.insertOne(reportDocument);

        // Send a response back to the client
        res.json({ success: true, message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.json({ success: false, message: 'Error submitting report' });
    }
});



// Route to download a selected report
app.get('/download-report/:id', async (req, res) => {
    const reportsCollection = client.db("managerConsole").collection("reports");
    try {
        const reportId = req.params.id;
        const report = await reportsCollection.findOne({ _id: new ObjectId(reportId) });

        if (report) {

            const reportContent = `Title: ${report.title}\n\nSummary:\n${report.summary}\n\nCreated On: ${report.createdOn.toDateString()}`;
            const filename = `report-${reportId}.txt`;

            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'text/plain');
            res.send(reportContent);
        } else {
            res.status(404).send('Report not found');
        }
    } catch (error) {
        console.error('Error downloading report:', error);
        res.status(500).send('Error downloading report');
    }
});



// Send feedback to DJ
app.post('/send-feedback/dj', async (req, res) => {
    const djFeedbackCollection = client.db("managerConsole").collection("djFeedback");
    try {
        await djFeedbackCollection.insertOne(req.body);
        res.json({ success: true, message: 'DJ feedback sent successfully' });
    } catch (error) {
        console.error('Error sending DJ feedback:', error);
        res.status(500).send('Error sending feedback');
    }
});

// Send feedback to Producer
app.post('/send-feedback/producer', async (req, res) => {
    const producerFeedbackCollection = client.db("managerConsole").collection("producerFeedback");
    try {
        await producerFeedbackCollection.insertOne(req.body);
        res.json({ success: true, message: 'Producer feedback sent successfully' });
    } catch (error) {
        console.error('Error sending Producer feedback:', error);
        res.status(500).send('Error sending feedback');
    }
});


// Close the connection
process.on('SIGINT', async () => {
    await client.close();
    process.exit();
});


// Port that server listens to
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
