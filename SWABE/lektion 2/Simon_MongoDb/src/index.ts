import express from 'express'

import { orders } from './orders-router';

const app = express()
const port = 3000;

app.use(express.json())

app.get('/', (req, res) => res.json({test: 'Hej'}))


app.use('/orders',orders);

app.listen(3000, () => {
  console.log(`Server running on ${port}`)
})
