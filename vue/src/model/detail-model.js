export class Detail_Model {

    constructor() {
        this.author_id;
        this.author_name;
        this.author_avatar;
        this.description;
        this.comment_count;
        this.forward_count;
        this.like_count;
        this.comment_area_id;
        this.comment_type;
        this.source_type;


    }

    assign(obj) {
        this.author_id = obj.author_id;
        this.author_name = obj.author_name;
        this.author_avatar = obj.author_avatar;
        this.description = obj.description.substring(0, 200) + '...'; //限制描述最大长度
        this.comment_count = obj.comment_count;
        this.forward_count = obj.forward_count;
        this.like_count = obj.like_count;
        this.comment_area_id = obj.comment_area_id;
        this.comment_type = obj.comment_type;
        this.source_type = obj.source_type;
    }
}