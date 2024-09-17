const express = require('express');
const router = express.Router();
const { getCustomerModel } = require('../models/customer');

// Route to search for company and branch details
router.get('/search', async (req, res) => {
  const { companyName, branchUniqueId } = req.query;

  try {
    const CompanyModel = getCustomerModel(companyName);

    if (!CompanyModel) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const company = await CompanyModel.findOne({ companyName });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (branchUniqueId) {
      const branch = company.branches.find(b => b.branchUniqueId === branchUniqueId);
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }

      return res.json({ company, branch });
    }

    return res.json({ company });
  } catch (error) {
    console.error('Error fetching company/branch details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to update company and branch details
router.put('/update', async (req, res) => {
  const { companyName, updatedDetails, branchUniqueId } = req.body;

  try {
    const CompanyModel = getCustomerModel(companyName);

    if (!CompanyModel) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { companyName },
      { $set: updatedDetails },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (branchUniqueId) {
      const branch = updatedCompany.branches.find(b => b.branchUniqueId === branchUniqueId);

      if (branch) {
        Object.assign(branch, updatedDetails); // Update branch details
        await updatedCompany.save(); // Save the updated company document
      } else {
        return res.status(404).json({ message: 'Branch not found' });
      }
    }

    // Also update the general CUSTOMER collection
    const GeneralCustomerModel = getCustomerModel('CUSTOMERS');
    await GeneralCustomerModel.findOneAndUpdate(
      { companyName },
      { $set: updatedDetails },
      { new: true }
    );

    return res.json({ company: updatedCompany });
  } catch (error) {
    console.error('Error updating company details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/delete', async (req, res) => {
  const { companyName } = req.body;

  try {
    const CompanyModel = getCustomerModel(companyName);

    if (!CompanyModel) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Delete the company document
    await CompanyModel.deleteOne({ companyName });

    // Drop the company collection
    await CompanyModel.collection.drop();

    // Also delete from the general CUSTOMER collection
    const GeneralCustomerModel = getCustomerModel('CUSTOMERS');
    await GeneralCustomerModel.deleteOne({ companyName });

    return res.json({ message: 'Company and its collection successfully deleted.' });
  } catch (error) {
    console.error('Error deleting company:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/delete-branch', async (req, res) => {
  const { companyName, branchUniqueId } = req.body;

  try {
    const CompanyModel = getCustomerModel(companyName);

    if (!CompanyModel) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const company = await CompanyModel.findOne({ companyName });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const branchIndex = company.branches.findIndex(b => b.branchUniqueId === branchUniqueId);

    if (branchIndex === -1) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    company.branches.splice(branchIndex, 1); // Remove the branch from the array
    await company.save(); // Save the updated company document

    // Also update the general CUSTOMER collection
    const GeneralCustomerModel = getCustomerModel('CUSTOMERS');
    await GeneralCustomerModel.updateOne(
      { companyName },
      { $pull: { branches: { branchUniqueId } } }
    );

    return res.json({ company });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
