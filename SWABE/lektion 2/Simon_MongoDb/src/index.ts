import express from 'express'


const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => res.json({}))


app.listen(3000, () => {
  console.log(`Server running on ${port}`)
})
