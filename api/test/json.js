

$(function () {

    let tree;

    $('.submit').on('click', () => {

        const output_dom = $('.output').get(0);

        let data = $('.raw-output').val();
        data = JSON.parse(data);

        if (tree) {
            jsonview.destroy(tree);
        }

        // create json tree object
        tree = jsonview.create(data);

        jsonview.render(tree, output_dom);

        // jsonview.renderJSON(data, $('.output').get(0));
        
        // jsonview.expand(tree);

    });



});