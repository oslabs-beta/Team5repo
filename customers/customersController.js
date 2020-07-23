const customersModel = require('./customersModel.js');
const customersController = {};



// Controller create customer
customersController.createCustomer = (sampleAdd, res, next) => {
    customersModel.create(sampleAdd, (error, result) => {
      if (error) {
        console.log(`Customer could not be created in database ${error}`);
        return res.status(404).json(error);
      }
    });
  };

//**********/may have to add id for customer in protofile

  // controller deletes customer
customersController.deleteCustomer = (sampleDelete, res, next) => {
    console.log(sampleDelete)
    const { id } = sampleDelete;
    customersModel.findOneAndDelete({ id: id }, (error, result) => {
      if (error) {
        console.log(`Deletion was not successful ${error}`);
        return res.status(404).json(error);
      }
    });
  };


  // controller gets all customers in the book db
customersController.getCustomers = (callback) => {
    customersModel.find({},(err, result) => {
      if (err) {
        console.log('customer retrieval was not successful', err);
        return res.status(404).json(err);
      }
  
      const arr = [];
      for(let i = 0; i < result.length; i++){
        arr.push({
          id: result[i].id,
          name: result[i].name, 
          age: result[i].age,
          address: result[i].address,
        })            
      }
  //***********IMPORTANT: MAKE SURE WHEN YOU'RE SENDING DATA BACK TO THE CLIENT THAT YOU ARE FOLLOWING THE PROTOFILE FORMAT EXACTLY!!!
  
      callback(
        null,
        {
          names: arr
        }
      )
    });
  };

  module.exports = customersController;