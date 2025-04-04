const mongoose = require('mongoose');
require('dotenv').config();
 
mongoose.connect('mongodb://epetadopt:E-PetAdopt2024@88.222.241.112:27017/epetadopt_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Established a connection to the database'))
    .catch(err => console.log('Something went wrong when connecting to the database ', err));