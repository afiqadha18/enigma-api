const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT_NO;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());

// Middleware to allow PUT and DELETE request method
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
})

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
})

const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const activityRoutes = require('./routes/activity.routes');
const bgpRoutes = require('./routes/bgp.routes');
const whitelistRoutes = require('./routes/whitelist.routes');
const loginRoutes = require('./routes/auth.routes');
const roleRoutes = require('./routes/role.routes');

app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/logs', activityRoutes);
app.use('/api/bgp', bgpRoutes);
app.use('/api/whitelist', whitelistRoutes);
app.use('/api/role', roleRoutes);

app.listen(PORT, () => {
    console.log('Listening on port :' + PORT);
})