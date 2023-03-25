const mongoose = require('mongoose');
const { mongoPass } = require(`../config.js`)
try {

  mongoose.connect(mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //  useFindAndModify: false,
    // useCreateIndex: true
  }).then(() => console.log(`Sucessfully connected to mongoose database`))
} catch (e) {
  console.log(e)
}


