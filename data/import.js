const { default: axios } = require('axios');
const fs = require('fs');
const Papa = require('papaparse');
const moment = require("moment");
const { Console } = require('console');

const csvFilePath = 'system.csv'
const csvSystem = 'system.csv'
const csvServer = 'server.csv'

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

const postServer = (data) => {
  let server = { data :{
    Nom: data["Libellé"].trim(),
    Code : data["Code"].trim(),
    Type : data["Type"].trim(),
    VLAN : data["VLAN"].trim(),
    IP : data["Adresse IP"].trim(),
    Virtualisation : data["Virtualisation"].trim(),
    OS : data["OS"].trim(),
    Description : data["Description /role"].trim(),
    Appli_code : data["1_Code Appli"].trim(),
    Appli_libelle : data["2_Libellé Appli"].trim()
    
  }};
  axios.get("http://localhost:1337/api/systems?filters[os_name][$eq]="+server.data.OS)
       .then(resp=> {
         if(resp.data.data.length==1){
            console.log(resp.data.data[0].id)
            server.data.OS=resp.data.data[0].id;
            axios.get("http://localhost:1337/api/servers?filters[Code][$eq]="+server.data.Code)
            .then( resp => {
              if(resp.data.data.length==0){
                axios.post("http://localhost:1337/api/servers",server)
                .then(resp => console.log(server.data.Nom,"ADDED"))
                .catch(err => console.log(err));
               }else{
                console.log(server.data.Nom,"EXISTS")
               }
            })
            .catch(err => console.log(err,data));

         }else{
          console.log(server.data.OS,"NOT FOUND");
         }
       })
       .catch(err => console.log(err,data));


  
}


importCSV(csvSystem,postSystem).then((result) => {
  console.log(result);
});
importCSV(csvServer,postServer).then((result) => {
  
});
