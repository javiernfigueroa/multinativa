const mongoose = require('mongoose');
const app = require('./app');

const port = 3000;

mongoose.connect('mongodb://localhost:27017/hospital_elerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected');

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
