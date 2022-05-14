
module.exports = {
    beforeCreate(event) {
      const { data } = event.params;
        data.os_name = data.os_system +" "+ data.os_distrib +" "+ data.os_version +" ("+ data.os_arch +")" ;
    },
    beforeUpdate(event) {
      const { data } = event.params;
      data.os_name = data.os_system +" "+ data.os_distrib +" "+ data.os_version +" ("+ data.os_arch +")" ;
    },
  };