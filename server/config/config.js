//=======================
//         Port
//=======================
process.env.PORT = process.env.PORT || 3000;


//=======================
//     Environment
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//========================
//   Token expire
//========================
// 60 seconds 
// 60 minutes
// 2 hours
process.env.TOKEN_EXPIRES = { expiresIn: 60 * 60 * 2 }


//========================
//   Token SEED
//========================
process.env.SEED = process.env.SEED || 'DEV-SEED';


//========================
//     Data Base
//========================

let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;