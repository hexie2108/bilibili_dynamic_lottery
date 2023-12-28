const express = require('express');
const router = express.Router();
const logic = require('../logic/dynamic.logic');

const REACTION_TYPE = {
    forward : '转发了',
    like : '赞了',
}

router.get('/:dynamic_id', async function (req, res) {

    let dynamic_id = req.params.dynamic_id;
    let user_type = req.query.user_type;

    let result = 'false';
    if (user_type === 'forward') {
        result = await logic.getDynamicRepostAndLikeList(dynamic_id, REACTION_TYPE.forward);
    } else if (user_type === 'comment') {
        result = await logic.getDynamicCommentList(dynamic_id);
    }
    else if (user_type === 'like') {
        result = await logic.getDynamicRepostAndLikeList(dynamic_id, REACTION_TYPE.like);
    }


    res.status(result.status);
    res.json(result.body);
});


module.exports = router;
