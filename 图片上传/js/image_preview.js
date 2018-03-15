//上传图片前预览
(function ($) {
    var _options = {};
    var filesArr = [];
    var ImagePreview = function (options) {
        this.init(options);
    }  
    ImagePreview.prototype = {
        init: function (options) {
            _options = options || {};
            
            var inputElement = $(_options.File)[0];
            inputElement.addEventListener("change", handleFiles, false);
        },
        GetFile: function () {
            return filesArr;
        }
    };
    function handleFiles() {
        var ImagePreview_List;
        var HasClassList = false;
        if ($(_options.Toel).find(".ImagePreview_List").length > 0) {
            HasClassList = true;
            ImagePreview_List = $(".ImagePreview_List");
        } else {
            ImagePreview_List = $("<div/>");
            ImagePreview_List.attr('class', 'ImagePreview_List');
        }
        if(!_options.isRepeatedly)    ////是否多次选择文件后一起上传 ，不填则为false
        {
            filesArr=[];
            $(ImagePreview_List).html("");
        }

        var fileList = this.files;
        for (var i = 0; i < fileList.length; i++) {
            //是否图片
            var file_name = fileList[i].name;
            var ext = file_name.substring(file_name.lastIndexOf("."), file_name.length).toUpperCase(); //文件扩展名
            if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") { continue; }
            // 添加到数组
            filesArr.push(fileList[i]);

            var reader = new FileReader();
            reader.onload = function (evt) {
                var link = $("<div/>");
                link.attr('class', 'ImagePreview_model');
                link.html(_options.Image_Preview);

                link.appendTo(ImagePreview_List);//添加到div
                var $index = $(link).index();
                //添加图片 Image_Class必填  否者图片不显示
                $(link).find(_options.Image_Class).attr("src", evt.target.result);
                //添加图片名字
                if (_options.FileName_Class) {
                    $(link).find(_options.FileName_Class).html(filesArr[$index].name);
                }
                //添加删除 
                if (_options.Close_Class) {
                    $(link).find(_options.Close_Class).on("click", function () {
                        $(link).remove();//移除html
                        filesArr.splice($index, 1);//移除数组
                    });
                }
            }
            reader.readAsDataURL(fileList[i]);
        };
        if (!HasClassList) {
            ImagePreview_List.appendTo(_options.Toel);//添加到指定容器
        }
    };
    window.ImagePreview = ImagePreview;
})(jQuery);



//////在页面中调用案例
//
//$(function () {
//    var ImagePreview11; = new ImagePreview({
//        File: "#File1",   //file 的id  /必填
//        Toel: ".file_list",  //添加到指定的位置   必填
//        Image_Preview: '<div class="file_model"><span  class="imagepreview_close">x</span><img  class="imagepreview_image" /><p class="imagepreview_filename"></p></div>',  //图片列表的html内容
//        Image_Class: ".imagepreview_image",  //图片的class,  必填 
//        Close_Class: ".imagepreview_close", //删除的class ,不需要删除则注释或删除此行
//        FileName_Class: ".imagepreview_filename",//图片名字的class ,不需要图片名字则注释或删除此行
//        isRepeatedly: false,              //是否多次选择文件后一起上传 ，不填则为false
//    });
        
//    $("#save_info").click(function () {
//        var params = new FormData();

        //// 当isRepeatedly为false，可以直接用input file 的值，也可以用GetFile()返回的值，
//        var fileObj = ImagePreview11.GetFile();
//        for (var i = 0; i < fileObj.length; i++) {
//            params.append("file" + i, fileObj[i]);
//        }
//        $.ajax({
//            type: "POST",
//            url: "/ajax/article_save",
//            data: params,
//            contentType: false,//必须false才会自动加上正确的Content-Type
//            processData: false,//必须false才会避开jQuery对 formdata 的默认处理 ，XMLHttpRequest会对 formdata 进行正确的处理
//            success: function (result) {

//            },
//            error: function () {
//                alert("Error");
//            }
//        });
//    });
//});