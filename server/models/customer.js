const mongoose = require('mongoose');

// Define the schema for customer data with branches array
const customerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  regNo: { type: String, unique: true, required: true },
  dateOfStart: { type: Date, required: true },
  modeOfAmc: { type: String, required: true },
  companyUsername: String,
  companyPassword: String,
  branches: [{
    branchName: String,
    branchContactPerson: String,
    branchContactNumber: String,
    branchAddress: String,
    branchAmc: String,
    branchStartDate: Date,
    branchUniqueId: { type: String, unique: true },
    branchUsername: String,
    branchPassword: String,
  }]
});

// Helper function to format names
const formatName = (name) => name.toUpperCase().replace(/[^a-zA-Z0-9]/g, '');

const getCustomerModel = (companyName) => {
  const modelName = `COMPANY_${formatName(companyName)}`;
  
  if (!mongoose.models[modelName]) {
    return mongoose.model(modelName, customerSchema, modelName);
  }
  
  return mongoose.model(modelName);
};

module.exports = { getCustomerModel };
