const { default: axios } = require('axios');
const fs = require('fs');
const Papa = require('papaparse');
const moment = require("moment");

const csvFilePath = 'system.csv'

// Function to read csv which returns a promise so you can do async / await.

const importCSV = (filePath,todowithitem) => {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()  
  return new Promise(resolve => {
    Papa.parse(csvData, {
      header: true,
      transformHeader: h => h.trim(),
      skipEmptyLines: true,
      step: result => {
        //console.log("Row data:", result.data,); 
        todowithitem (result.data);  
      }
    });
  });
};

// Post System

const postSystem = (data) => {
  let system = { data :{
    os_system : data.os_system.trim(),
    os_distrib : data.os_distrib.trim(),
    os_version: data.os_version.trim(),
    os_arch: data.os_arch.trim(),
    os_type: data.os_type.trim(),
    os_eos: moment(data.os_eos.trim(), "DD/MM/YYYY").format("YYYY-MM-DD"),
    os_name: data.os_system.trim() +" "+ data.os_distrib.trim() +" "+ data.os_version.trim()+" ("+ data.os_arch.trim() +")"
  }};
  axios.get("http://localhost:1337/api/systems?filters[os_name][$eq]="+system.data.os_name)
       .then(resp=> {
         if(resp.data.data.length==0){
          axios.post("http://localhost:1337/api/systems",system)
          .then(resp => console.log(system.data.os_name,"ADDED"))
          .catch(err => console.log(err));
         }else{
          console.log(system.data.os_name,"EXISTS")
         }
       })
       .catch(err => console.log(err,data));
}


importCSV(csvFilePath,postSystem).then((result) => {
    console.log(result);
});

