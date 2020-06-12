const express = require('express');
const router = express.Router();
const logic = require('../logic/dynamic.logic');


router.get('/:dynamic_id', async function(req, res) {

    let dynamic_id = req.params.dynamic_id;
    let result = await logic.getDynamicRepostList(dynamic_id);
    res.status(result.status);
    res.json(result.body);
});


module.exports = router;
