// ----------------------------------staffTypeSchema---------------------------------------
const mongoose = require('mongoose');

const staffTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shortname: {
    type: String,
    required: true
  }
});

const StaffType = mongoose.model('StaffType', staffTypeSchema);

module.exports = StaffType;





// ----------------------------------tier---------------------------------------
const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tier_description: {
    type: String,
    required: true
  }
});

const Tier = mongoose.model('Tier', tierSchema);

module.exports = Tier;


// --------------------------------------------designationSchema----------------------


const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  function: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  }
});

const Designation = mongoose.model('Designation', designationSchema);

module.exports = Designation;