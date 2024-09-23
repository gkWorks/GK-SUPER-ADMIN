const express = require("express");
const { getCustomerModel, formatName } = require("../models/customer");
const router = express.Router();
const mongoose = require('mongoose');

// Helper function for error handling
const handleError = (res, error) => {
  console.error('Server Error:', error.message);
  res.status(500).json({ success: false, message: error.message });
};



// Helper function to get the company identifier dynamically
const getCompanyIdentifier = async () => {
  try {
    // Get all customer collections to count existing companies
    const allCustomers = await mongoose.connection.db.listCollections().toArray();
    const companyCount = allCustomers.filter(c => c.name.startsWith('COMPANY_')).length; // Count companies
    return companyCount + 1; // Return the next company number
  } catch (error) {
    throw new Error('Error getting company identifier');
  }
};

// Verify if company with given regNo and companyName exists
router.post("/verify", async (req, res) => {
  const { companyName, regNo } = req.body;

  try {
    const CustomerModel = getCustomerModel(companyName); // Use dynamic model
    const existingCustomer = await CustomerModel.findOne({ regNo });

    if (existingCustomer) {
      return res.status(200).json({ success: true, data: existingCustomer });
    } else {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Add branch to existing customer with dynamic regNo for branch
router.post("/addBranch", async (req, res) => {
  const { companyName, branchName, branchContactPerson, branchContactNumber, branchAddress, branchAmc, branchStartDate, branchUniqueId, branchUsername, branchPassword } = req.body;

  try {
    // Find the company
    const CustomerModel = getCustomerModel(companyName);
    const existingCustomer = await CustomerModel.findOne({ companyName });

    if (!existingCustomer) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const branches = existingCustomer.branches || [];
    const companyBaseRegNo = existingCustomer.regNo.split('.')[0];
    const newBranchRegNo = `${companyBaseRegNo}.${branches.length + 1}`;

    // Format the branch name
    const formattedBranchName = formatName(branchName);
    const branchCollectionName = `branch_${formattedBranchName}`;

    console.log(`Formatted Branch Name: ${formattedBranchName}`);
    console.log(`Branch Collection Name: ${branchCollectionName}`);

    // Connect to the company's specific database
    const companyDbName = `COMPANY_${formatName(companyName)}`;
    const companyConnection = mongoose.createConnection(`mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/${companyDbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Define the schema for branch collection
    const branchSchema = new mongoose.Schema({
      branchName: String,
      branchContactPerson: String,
      branchContactNumber: String,
      branchAddress: String,
      branchAmc: String,
      branchStartDate: Date,
      branchUniqueId: { type: String, unique: true }, // Ensure unique ID
      branchUsername: String,
      branchPassword: String,
      regNo: String
    });

    // Create a model for the branch collection
    const BranchModel = companyConnection.model(branchCollectionName, branchSchema);

    // Save the new branch in the branch collection
    const newBranch = new BranchModel({
      branchName,
      branchContactPerson,
      branchContactNumber,
      branchAddress,
      branchAmc,
      branchStartDate,
      branchUniqueId,
      branchUsername,
      branchPassword,
      regNo: newBranchRegNo // Assign regNo for branch
    });

    await newBranch.save();

    // Push branch details into the existing company document
    existingCustomer.branches.push({
      branchId: branchUniqueId,
      branchName,
      branchContactPerson,
      branchContactNumber,
      branchAddress,
      branchAmc,
      branchStartDate,
      branchUniqueId,
      regNo: newBranchRegNo,
      branchUsername,
      branchPassword
    });

    await existingCustomer.save();

    // Close the company database connection
    companyConnection.close();

    res.status(200).json({ success: true, data: existingCustomer });
  } catch (error) {
    console.error('Error adding branch:', error);
    handleError(res, error);
  }
});



// Create new customer with dynamic regNo
router.post("/", async (req, res) => {
  const { companyName, branchName, branchContactPerson, branchContactNumber, branchAddress, branchAmc, branchStartDate, branchUniqueId, branchUsername, branchPassword } = req.body;

  try {
    // Get all customer models to count existing companies
    const allCustomers = await mongoose.connection.db.listCollections().toArray();
    const companyCount = allCustomers.filter(c => c.name.startsWith('COMPANY_')).length; // Count companies

     // Get company identifier dynamically
     const companyIdentifier = await getCompanyIdentifier();

    // Generate regNo for the new company
    const newCompanyRegNo = `${companyIdentifier}.0`;

    const CustomerModel = getCustomerModel(companyName);
    const newCustomer = new CustomerModel({
      ...req.body,
      regNo: newCompanyRegNo,
      branches: branchName
        ? [ {
            branchName,
            branchContactPerson,
            branchContactNumber,
            branchAddress,
            branchAmc,
            branchStartDate,
            branchUniqueId,
            branchUsername,
            branchPassword,
            regNo: `${companyIdentifier}.1`,  // First branch of new company
          } ]
        : []
    });

    await newCustomer.save();

    // Create a collection for the branches in the company database
    const companyDbName = `COMPANY_${formatName(companyName)}`;
    const companyConnection = mongoose.createConnection(`mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/${companyDbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const companySchema = new mongoose.Schema({
      companyName: { type: String, required: true },
      contactPerson: { type: String, required: true },
      contactNumber: { type: String, required: true },
      address: { type: String, required: true },
      regNo: { type: String, unique: true, required: true },
      dateOfStart: { type: Date, required: true },
      modeOfAmc: { type: String, required: true },
      companyUsername: String,
      companyPassword: String,
      branches: [ {
        branchId: { type: String, unique: true }, // Ensure branch Unique Id is Unique
        branchName: String,
        branchContactPerson: String,
        branchContactNumber: String,
        branchAddress: String,
        branchAmc: String,
        branchStartDate: Date,
        branchUniqueId: String,
        branchUsername: String,
        branchPassword: String,
      } ]
    });

    const CompanyModel = companyConnection.model('COMPANY', companySchema, 'COMPANY');
    const newCompany = new CompanyModel({
      ...req.body,
      regNo: newCompanyRegNo,
      branches: branchName
        ? [ {
            branchName,
            branchContactPerson,
            branchContactNumber,
            branchAddress,
            branchAmc,
            branchStartDate,
            branchUniqueId,
            branchUsername,
            branchPassword,
            regNo: `${companyIdentifier}.1`,
          } ]
        : []
    });

    await newCompany.save();
    companyConnection.close();

    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    handleError(res, error);
  }
});

// Fetch all customers
router.get("/", async (req, res) => {
  try {
    const allCustomers = [];
    const customerModels = await mongoose.connection.db.listCollections().toArray();
    
    for (const model of customerModels) {
      const modelName = model.name;
      if (modelName.startsWith('COMPANY_')) {
        const normalizedName = modelName.replace('COMPANY_', '').replace(/_/g, ' ');
        const CustomerModel = getCustomerModel(normalizedName);
        const customers = await CustomerModel.find({});
        allCustomers.push(...customers);
      }
    }
    
    res.status(200).json({ customers: allCustomers });
  } catch (error) {
    handleError(res, error);
  }
});

// New route to get company details by companyName
router.get("/company/:companyName", async (req, res) => {
  const { companyName } = req.params;
  try {
    const CustomerModel = getCustomerModel(companyName);
    const company = await CustomerModel.findOne({}); // Fetch a single company
    if (company) {
      res.status(200).json({ company });
    } else {
      res.status(404).json({ success: false, message: 'Company not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route to get the latest branch registration number for a specific company
router.get("/getLatestBranchRegNo/:companyName", async (req, res) => {
  const { companyName } = req.params;
  
  try {
    const CustomerModel = getCustomerModel(companyName);
    const company = await CustomerModel.findOne({ companyName });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const branches = company.branches || [];
    const branchCount = branches.length;

    // Get the latest branch regNo
    const latestBranchRegNo = branchCount > 0
      ? `${company.regNo.split('.')[0]}.${branchCount + 1}` // Increment branch count
      : `${company.regNo.split('.')[0]}.1`; // Start with the first branch

    res.status(200).json({ success: true, regNo: latestBranchRegNo });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
