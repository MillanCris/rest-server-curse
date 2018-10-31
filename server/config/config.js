//=======================
//         Port
//=======================
process.env.PORT = process.env.PORT || 3000;


//=======================
//     Environment
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//========================
//     Data Base
//========================
let urlDB

//if (process.env.NODE_ENV === 'dev') {
//    urlDB = 'mongodb://localhost:27017/cafe';
//} else {
urlDB = 'mongodb://cafe-user:N123456@ds117485.mlab.com:17485/cafe';
//}

process.env.URLDB = urlDB;