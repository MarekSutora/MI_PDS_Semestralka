module.exports = {
  getPopisZaznamu: (req, res) => {
    const zaznam = require("../models/zdravotny_zaznam");
    console.log(req.params);
    (async () => {
      ret_val = await zaznam.getPopisZaznamu(req.params.id);
      res.status(200).json(ret_val);
    })();
  },

  getPriloha: (req, res) => {
    const zaznam = require("../models/zdravotny_zaznam");
    console.log(req.params);
    (async () => {
      ret_val = await zaznam.getPriloha(req.params.id);
      console.log(ret_val);
      if (typeof ret_val !== "undefined") {
        res.status(200).write(ret_val.PRILOHA, "binary");
        res.end(null, "binary");
      } else {
        res.status(200).write("");
        res.end(null, "binary");
      }
    })();
  },
};
