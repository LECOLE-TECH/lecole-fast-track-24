import db from "../utils/db.js";

export const getAllUsers = async (username="",offset=0,limit=10) => {
  return new Promise((resolve, reject) => {
    let sqlStatement = "SELECT * FROM users LIMIT ? OFFSET ?"
    let params = [limit,offset]

    if(username){
      sqlStatement = "SELECT * FROM users WHERE username LIKE ? LIMIT ? OFFSET ?"
      params = [username,limit,offset]
    } 

    db.all(sqlStatement,params, (err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

export const totalUser = async()=>{
  return new Promise((resolve,reject)=>{
    db.get("SELECT COUNT(*) as count FROM users",(err,row)=>{
      if(err) reject(err)
      resolve(row.count)
    })
  })
}

export const loginUser = async (username,secret_phrase)=>{
  return new Promise((resolve,reject)=>{
    db.get("SELECT * FROM users WHERE username = ? AND secret_phrase = ?",[username,secret_phrase],(err,row)=>{
      if(err) reject(err)
      resolve(row)
    })
  })
}

export const getUserByName = async (username)=>{
  return new Promise((resolve,reject)=>{
    db.get("SELECT * FROM users WHERE username = ?",[username],(err,row)=>{
      if(err) reject(err)
      resolve(row)
    })
  })
}

export const setSecretPhrase = async(username,newSecret)=>{
  return new Promise((resolve,reject)=>{
    db.run("UPDATE users SET secret_phrase = ? WHERE username = ?",[newSecret,username],(err)=>{
      if(err) reject(err)
      resolve(true)
    })
  })
}

export const insertUser = async (username, roles, secret_phrase) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (username, roles, secret_phrase) VALUES (?, ?, ?)",
      [username, roles, secret_phrase],
      function (err)  {
        if (err) reject(err)
        resolve({ id: this.lastID, username, roles, secret_phrase });
      }
    )
  })
}
