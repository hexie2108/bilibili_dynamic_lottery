$(function(){

    let data = $('.raw-output').html();
    data = JSON.parse(data);
    const tree = jsonview.renderJSON(data, $('.output').get(0));
    jsonview.expand(tree);

});