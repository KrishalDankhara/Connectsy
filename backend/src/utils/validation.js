const validate = require("validator");
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
const validateUserEditData = (req) => {
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
