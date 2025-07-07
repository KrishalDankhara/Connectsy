const validate = require("validator"); // Imports the validator library, which provides functions for validating strings (like emails and passwords).
const validateData = (req) => {
  const { firstName, lastName, emailId, password, photoURL,photos } = req.body;
  if (!firstName || !lastName) {
    throw new Error("FirstName/LastName missing");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Please enter valid email");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};
const validateUserEditData = (req) => {  // Purpose: Ensures only allowed fields are being edited in the user profile.
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "about",
    "skills",
    "photoURL",
    "photos"
  ];
  const isValid=Object.keys(req.body).every((field)=>{
    return ALLOWED_FIELDS.includes(field);
  })
  return isValid;

};

const validatePass=(req)=>{
    return validate.isStrongPassword(req.body.newPassword);
}
module.exports = {
  validateData,
  validateUserEditData,
  validatePass
};
