importFile = false; 

app.callbacks.filterBrightness = function (e) { 
    console.log("function called");
    var val = $('#dialog-filterbrightness input').val() / 100; 
    console.log(val);
    filterSwitch(e, val, filterBrightness); 
} 
  
app.callbacks.filterDesaturation = function () { 
    filterDesaturation(); 
} 
  
app.callbacks.filterColorify = function (e) { 
    var r = $('#dialog-filtercolorify input.r').val() * 1, 
        g = $('#dialog-filtercolorify input.g').val() * 1, 
        b = $('#dialog-filtercolorify input.b').val() * 1, 
        a = $('#dialog-filtercolorify input.a').val() * 1; 
    switch (e.type) { 
        case "click": 
            filterColorify(r, g, b, a); 
            break; 
        case "keydown": 
            if (e.keyCode == 13) filterColorify(r, g, b, a); 
            break; 
    } 
} 
  
app.callbacks.filterBlur = function (e) { 
    var val = $('#dialog-filterblur input').val() * 1; 
    filterSwitch(e, val, filterBlur); 
} 
  
app.callbacks.filterGaussianBlur = function (e) { 
    var val = ($('#dialog-filtergaussianblur input.3').attr('checked') ? 2: $('#dialog-filtergaussianblur input.2').attr('checked') ? 1: 0); 
    filterSwitch(e, val, filterGaussianBlur); 
} 
  
app.callbacks.filterEdgeDetection = function (e) { 
    filterEdgeDetection(); 
} 
  
app.callbacks.filterEdgeEnhance = function (e) { 
    filterEdgeEnhance(); 
} 
  
app.callbacks.filterEmboss = function (e) { 
    filterEmboss(); 
} 
  
app.callbacks.filterSharpen = function (e) { 
    filterSharpen(); 
}
  
hideDialog = function (dialog) { 
    $(dialog).hide(); 
    if ($('.dialog:visible').length == 0) $('#overlay').hide(); 
    editText = false; 
} 
  
showDialog = function (dialog) { 
    $('#overlay').show(); 
    $(dialog).show(); 
}

$(window).resize(function () { 
    $('.dialog').each(function () { 
        $(this).css({ left: window.innerWidth / 2 - $(this).outerWidth() / 2 + 'px', top: window.innerHeight / 2 - $(this).outerHeight() / 2 + 'px' }); 
    }); 
      
    $('canvas').attr('height', $(window).height() - 100).attr('width', $(window).width() - 590); 
    $('ul#mainmenu').css({ height: $(window).height() - 37 }); 
    $('ul#layers').css({ height: $(window).height() - 37 }); 
      
    app.refreshLayers(); 
      
    if ($('#cropoverlay').css('display') == 'block') { 
        $('#cropoverlay').css({  
            left: Math.ceil(app.canvas.width / 2 - app.getActiveLayer().x - app.getActiveLayer().regX - 1) + 'px',  
            top: Math.ceil(app.canvas.height / 2 + app.getActiveLayer().y - app.getActiveLayer().regY + 38) + 'px'
        }); 
    } 
});

$(document).ready(function () { 
    console.log("ui functions loaded");
    $("ul#mainmenu li button").click(function () { 
        console.log("showmenu");
        $(this).focus(); 
        $(this).parent().find("ul.submenu:visible").slideUp('fast').show(); 
        $(this).parent().find("ul.submenu:hidden").slideDown('fast').show(); 
    }); 
      
    $("ul#mainmenu li button").blur(function () { 
        $(this).parent().find("ul.submenu:visible").delay(100).slideUp('fast').show(); 
    }); 

    $("#fg").click(function (){
        $("#table_container").show();
        $('#bg_container').hide();

    });

    $("#bg").click(function (){
        $("#table_container").hide();
        $('#bg_container').show();
    });

    $("#exit").click(function (){
        $('#mainmenu').show();
        $('#imageLibrary').hide();
    });
  
    $('#button-openfile').hover( 
        function () { $(this).addClass('hover'); }, 
        function () { $(this).removeClass('hover'); } 
    );
  
    $('#button-importfile').hover( 
        function () { $(this).addClass('hover'); }, 
        function () { $(this).removeClass('hover'); } 
    ); 
  
    $('#button-openurl').click(function () { 
        importFile = false; 
        showDialog('#dialog-openurl'); 
        $('#dialog-openurl input').val('').attr('disabled', false).focus(); 
    }); 
  
    $('#button-importurl').click(function () { 
        importFile = true; 
        showDialog('#dialog-openurl'); 
        $('#dialog-openurl input').val('').attr('disabled', false).focus(); 
    }); 
      
    $('#button-undo').click(function () { app.undo(); }); 
    $('#button-redo').click(function () { app.redo(); }); 
      
    $('#button-layerscale').click(function () { 
        affectImage = false; 
        showDialog('#dialog-scale'); 
        $('#dialog-scale input.input-scaleX').val('100'); 
        $('#dialog-scale input.input-scaleY').val('100'); 
    }); 
      
    $('#button-layerskew').click(function () { 
        affectImage = false; 
        showDialog('#dialog-skew'); 
        $('#dialog-skew input.input-scaleX').val('100'); 
        $('#dialog-skew input.input-scaleY').val('100'); 
    }); 
      
    $('#button-layerrotate').click(function () { 
        affectImage = false; 
        showDialog('#dialog-rotate'); 
        $('#dialog-rotate input').val('0'); 
    }); 
      
    $('#button-layercrop').click(function () { 
        affectImage = false; 
        app.sortLayers(); 
        app.refreshLayers(); 
        var layer = app.getActiveLayer(); 
        $('#overlay').show(); 
        $('#cropoverlay').css({ 
            left: Math.ceil(app.canvas.width / 2 + layer.x - layer.regX - 1) + 'px', 
            top: Math.ceil(app.canvas.height / 2 + layer.y - layer.regY + 38) + 'px',  
            width: (layer.text != null ? layer.getMeasuredWidth() * layer.scaleX: layer.image.width * layer.scaleX) + 2 + 'px',  
            height: (layer.text != null ? layer.getMeasuredLineHeight() * layer.scaleY: layer.image.height * layer.scaleY) + 2 + 'px'
        }).show(); 
    }); 
      
    $('#button-layerflipv').click(app.callbacks.layerFlipV); 
    $('#button-layerfliph').click(app.callbacks.layerFlipH); 
      
    $('#button-imagescale').click(function () { 
        affectImage = true; 
        showDialog('#dialog-scale'); 
        $('#dialog-scale input.input-scaleX').val('100'); 
        $('#dialog-scale input.input-scaleY').val('100'); 
    }); 
      
    $('#button-imageskew').click(function () { 
        affectImage = true; 
        showDialog('#dialog-skew'); 
        $('#dialog-skew input.input-scaleX').val('100'); 
        $('#dialog-skew input.input-scaleY').val('100'); 
    }); 
      
    $('#button-imagerotate').click(function () { 
        affectImage = true; 
        showDialog('#dialog-rotate'); 
        $('#dialog-rotate input').val('0'); 
    }); 
      
    $('#button-imageskew').click(function () { 
        affectImage = true; 
        showDialog('#dialog-skew'); 
        $('#dialog-skew input.input-skewX').val('0'); 
        $('#dialog-skew input.input-skewY').val('0'); 
    }); 
      
    $('#button-filterbrightness').click(function () { 
        showDialog('#dialog-filterbrightness'); 
        $('#dialog-filterbrightness input').val('100'); 
    }); 
      
    $('#button-filtercolorify').click(function () { 
        showDialog('#dialog-filtercolorify'); 
        $('#dialog-filtercolorify input').val('0'); 
    }); 
      
    $('#button-filterblur').click(function () { 
        showDialog('#dialog-filterblur'); 
        $('#dialog-filterblur input').val('1'); 
    }); 
      
    $('#button-filtergaussianblur').click(function () { 
        showDialog('#dialog-filtergaussianblur'); 
        $('#dialog-filtergaussianblur input.7').attr('checked', true); 
    }); 
      
    $('#button-executescript').click(function () { 
        showDialog('#dialog-executescript'); 
        $('#dialog-executescript textarea').val(''); 
    }); 
      
    $('#button-select').click(function () { 
        app.tool = TOOL_SELECT; 
        $('#mainmenu button').removeClass('active'); 
        $(this).addClass('active'); 
    }); 
      
    $('#button-move').click(function () { 
        console.log("set to" +TOOL_MOVE)
        app.tool = TOOL_MOVE; 
        $('#mainmenu button').removeClass('active'); 
        $(this).addClass('active'); 
    }); 
      
    $('#button-text').click(function () { 
        app.tool = TOOL_TEXT; 
        $('#mainmenu button').removeClass('active'); 
        $(this).addClass('active'); 
    }); 
      
    $('#button-imageflipv').click(app.callbacks.imageFlipV); 
    $('#button-imagefliph').click(app.callbacks.imageFlipH); 
      
    $('#dialog-openurl input').keydown(app.callbacks.openURL); 
    $('#dialog-openurl button.button-ok').click(app.callbacks.openURL); 
    $('#dialog-scale input').keydown(app.callbacks.numberOnly).keydown(app.callbacks.layerScale); 
    $('#dialog-scale button.button-ok').click(app.callbacks.layerScale); 
    $('#button-openfile input').change(app.callbacks.openFile); 
    $('#button-importfile input').change(app.callbacks.importFile); 
    $('#dialog-tooltext button.button-ok').click(app.callbacks.toolText); 
    $('#dialog-tooltext input').keydown(app.callbacks.toolText); 
    $('#dialog-layerrename button.button-ok').click(app.callbacks.layerRename); 
    $('#dialog-layerrename input').keydown(app.callbacks.layerRename); 
    $('#dialog-rotate button.button-ok').click(app.callbacks.layerRotate); 
    $('#dialog-rotate input').keydown(app.callbacks.numberOnly).keydown(app.callbacks.layerRotate); 
    $('#dialog-skew button.button-ok').click(app.callbacks.layerSkew); 
    $('#dialog-skew input').keydown(app.callbacks.numberOnly).keydown(app.callbacks.layerSkew); 
    $('#cropoverlay button.button-ok').click(app.callbacks.layerCrop); 
    $('#button-filterdesaturation').click(app.callbacks.filterDesaturation); 
    $('#button-filteredgedetection').click(app.callbacks.filterEdgeDetection); 
    $('#button-filteredgeenhance').click(app.callbacks.filterEdgeEnhance); 
    $('#button-filteremboss').click(app.callbacks.filterEmboss); 
    $('#button-filtersharpen').click(app.callbacks.filterSharpen); 
    $('#dialog-filterbrightness button.button-ok').click(app.callbacks.filterBrightness); 
    $('#dialog-filterbrightness input').keydown(app.callbacks.numberOnly).keydown(app.callbacks.filterBrightness); 
    $('#dialog-filtergaussianblur button.button-ok').click(app.callbacks.filterGaussianBlur); 
    $('#dialog-filtergaussianblur input').keydown(app.callbacks.numberOnly).keydown(app.callbacks.filterGaussianBlur); 
    $('#dialog-filterblur button.button-ok').click(app.callbacks.filterBlur); 
    $('#dialog-filterblur input').keydown(app.callbacks.numberOnly).keydown(app.callbacks.filterBlur); 
    $('#dialog-filtercolorify button.button-ok').click(app.callbacks.filterColorify); 
    $('#dialog-filtercolorify input').keydown(app.callbacks.numberOnly).keydown(app.callbacks.filterColorify); 
    $('#dialog-executescript button.button-ok').click(app.callbacks.scriptExecute); 
    $('#button-save').click(app.callbacks.saveFile); 
    $('#button-print').click(app.callbacks.printFile); 
    $('#button-choose').click(app.callbacks.chooseImage);
      
    $('#dialog-tooltext input.input-color').keyup(function (e) { 
        $(this).css({ backgroundColor: $(this).val() }); 
    }); 
      
    $(document).on("click", "ul#layers li", function () { 
        console.log("clicked");
        app.activateLayer($(this).attr('id').replace('layer-', '') * 1); 
    }); 
      
    $(document).on("click", "ul#layers li button.button-delete", function () { 
        app.layers.splice($(this).parent().parent().attr('id').replace('layer-', '') * 1, 1); 
        this.undoBuffer = []; 
        this.redoBuffer = []; 
        app.refreshLayers(); 
    }); 
      
    $(document).on("click", "ul#layers li button.button-hide", function () { 
        if ($(this).text() == 'Hide') { 
            app.layers[$(this).parent().parent().attr('id').replace('layer-', '') * 1].visible = false; 
        } else { 
            app.layers[$(this).parent().parent().attr('id').replace('layer-', '') * 1].visible = true; 
        } 
        app.refreshLayers(); 
    }); 
      
    $(document).on('click', "ul#layers li button.button-rename", function () { 
        console.log("clicked");
        $('#dialog-layerrename').show(); 
        $('#overlay').show(); 
        $('#dialog-layerrename input').val(''); 
        app.renameLayer = $(this).parent().parent().attr('id').replace('layer-', '') * 1; 
    }); 
      
    $(document).keydown(function (e) { 
        if (e.keyCode == 27) { 
            hideDialog('.dialog'); 
        } 
    }); 
      
    $('.dialog button.button-cancel').each(function () { 
        $(this).click(function () { 
            hideDialog($(this).parent()); 
        }); 
    }); 
      
    $('canvas').click(app.callbacks.toolText); 
      
    $('#cropoverlay').draggable().resizable({ 
        handles: 'se', 
        resize: function (e, ui) { 
            $('#cropoverlay').css({ left: ui.position.left + 'px', top: ui.position.top + 'px' }); 
        }, 
        stop: function (e, ui) { 
            $('#cropoverlay').css({ left: ui.position.left + 'px', top: ui.position.top + 'px' }); 
        } 
    }); 
    //CREATE FOREGROUND IMAGE LIBRARY
    var container = document.getElementById("table_container");
    var table = document.createElement("table");
    document.getElementById("table_container").appendChild(table);


    for (var i=0, len = imageArr.length; i < len;){
        var row = document.createElement("tr");
        for (var j=0;  j < 4; ++j) {       
            photo = document.createElement("td");
            img = new Image();       
            img.src = imageArr[i];
            img.width=50;
            img.height=50;
            photo.appendChild(img); 
            img.setAttribute("id", "imageObj");
            img.setAttribute("onclick", "imgClick(this)");   
            row.appendChild(photo); 
            i++;
         }
         
         table.appendChild(row);
    }

    //CREATE BACKGROUND IMAGE LIBRARY

    container = document.getElementById("bg_container");
    var table = document.createElement("table");
    document.getElementById("bg_container").appendChild(table);

    for (var i=0, len = bgArr.length; i < len;){
        var row = document.createElement("tr");
        for (var j=0;  j < 4; ++j) {       
            photo = document.createElement("td");
            img = new Image();       
            img.src = bgArr[i];
            img.width=50;
            img.height=50;
            photo.appendChild(img); 
            img.setAttribute("id", "imageObj");
            img.setAttribute("onclick", "imgClick(this)");   
            row.appendChild(photo); 
            i++;
         }
         
         table.appendChild(row);
    }

      
    $(window).resize(); 
});