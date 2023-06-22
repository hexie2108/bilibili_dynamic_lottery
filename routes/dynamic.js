const express = require('express');
const router = express.Router();
const logic = require('../logic/dynamic.logic');


router.get('/:dynamic_id', async function (req, res) {

    let dynamic_id = req.params.dynamic_id;
    let user_type = req.query.user_type;

    let result = 'false';
    if (user_type === 'forward') {
        result = await logic.getDynamicRepostList(dynamic_id);
    } else if (user_type === 'comment') {
        result = await logic.getDynamicCommentList(dynamic_id);
    }
    else if (user_type === 'like') {
        result = await logic.getDynamicLikeList(dynamic_id);
    }


    res.status(result.status);
    res.json(result.body);
});


module.exports = router;
