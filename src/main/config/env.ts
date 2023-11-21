export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb+srv://fontolangustavo:ABoXjxJlaIDiiVGw@example-node-api.rm8e6f0.mongodb.net/?retryWrites=true&w=majority',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'hashcoo-touneslo-toash',
}
