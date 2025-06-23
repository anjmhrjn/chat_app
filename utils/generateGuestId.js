import { v4 as uuidv4 } from "uuid";
const generateGuestId = () => {
  return uuidv4();
};

module.exports = { generateGuestId };
