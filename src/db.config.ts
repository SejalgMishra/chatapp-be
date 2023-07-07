require('dotenv').config();
import harperive from "harperive"


const DB_CONFIG = {
    harperHost: process.env.INSTANCE_URL,
    username: process.env.INSTANCE_USERNAME,
    password: process.env.INSTANCE_PASSWORD,
    schema: process.env.INSTANCE_SCHEMA // optional
  };
  
  const db = new harperive.Client(DB_CONFIG as any);


  // function call with callback
  

  export default db