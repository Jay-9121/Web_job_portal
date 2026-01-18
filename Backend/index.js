const express = require('express');
const app = express();
const {connectDB, sequelize} = require('./database/database');

app.use(express.json());
app.use("/api/user/", require("./routes/route"));

app.get('/', (req, res) => {
    res.json('Welcome to the home page');
});

app.use("/api/product/",require('./routes/productRoute'))


// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });

const startServer = async () => {
    await connectDB();
    await sequelize.sync({ alter: true }); // Sync models with the database
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}
startServer();