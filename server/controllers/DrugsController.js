module.exports = {
  getAllDrugs: (req, res) => {
    const drugs = require("../models/liek");
    (async () => {
      console.log(req.params);
      ret_val = await drugs.getLieky();
      res.status(200).json(ret_val);
    })();
  },
};
