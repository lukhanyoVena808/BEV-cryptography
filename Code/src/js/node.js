
    
//READ ID-DATABASE;
const fs = require ("fs");
const xlsx = require("xlsx");
const jsontoxml = require("jsontoxml");
const workbook = xlsx.readFile("../Book1.xlsx"); 
const worksheet = workbook.Sheets[workbook.SheetNames[0]]; 
const IDS = [];

for (let z in worksheet) {
  if(z.toString()[0] === 'B'){
    IDS.push(worksheet[z].v);
  }

}

function isIn_DB(id) {
    return IDS.includes(id);
        
}

module.exports = isIn_DB;