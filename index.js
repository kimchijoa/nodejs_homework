const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://kkh:rnjrnjwm12@runreact.z4yqk23.mongodb.net/?retryWrites=true&w=majority', {
  //useNewUrlParser: true, useUnifiedToplogy: true, userCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch((error)=> { console.log(error)})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})