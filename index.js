const express = require('express');
const connection = require('./config/db');
const UserRouter = require('./routers/user.router');
const LawyerRouter = require('./routers/lawyer.router');
const AdminRouter = require('./routers/admin.router');
const GoogleRouter = require("./routers/googleAuth.router")
const app = express();
const passport = require("./config/google.auth");
const cookieSession = require("cookie-session");
const AppoinmtentRouter = require('./routers/appointment.router');
const router = require('./routers/jobs.router');

//=============> ENV VARIABLES
require('dotenv').config()
const PORT = process.env.PORT;

//=============> MIDDLEWARES

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://gwetarangu.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(express.json())

//=============> Testing endpoint
app.get('/', (req, res) => res.send({ Message: 'ALS server working fine' }))

//=============> ROUTES

app.use(cookieSession({
  name: 'google-auth-session',
  keys: ["key1", "key2"],
}))

app.use(passport.initialize());
app.use(passport.session());

//=============> Testing endpoint
app.get('/', (req, res) => res.send({ Message: "Welcome to ALS-Backend Server" }))


//=============> ROUTES
app.use('/user', UserRouter)
app.use('/lawyer', LawyerRouter)
app.use('/admin', AdminRouter)
app.use("/auth", GoogleRouter)
app.use("/appointment", AppoinmtentRouter)
app.use("/jobs", router)




//=============> CONNECTION
app.listen(PORT, async () => {
  try {
    await connection
    console.log(`ALS backend running @ ${PORT}`)
  } catch (error) {
    console.log({ error: error.message })
  }
})
