const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/', (req, res) => {
  //res.render('landing')
  res.redirect(`/${uuidV4()}`)
})

// app.get('dashboard', (req, res) => {
//   res.redirect(`dashboard/${uuidV4()}`)
  
// })


app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    console.log('user-connected'+ userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
      console.log('user-disconnected'+ userId);

    })
  })
})

server.listen(process.env.PORT || 3000)