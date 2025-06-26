const {v4: uuidv4} = require("uuid");
const generateGuestId = () => {
  return uuidv4();
};

module.exports = { generateGuestId };
