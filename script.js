let tabCounter = 0;
$(document).ready(function () {


    //Checks Max and Min column to see if the min column is greater than the max and tells the user that the min column cannot be greater than the max column
    $.validator.addMethod("greaterThanColumn", function(value, element ) {
        const minColumn = parseInt($("#minColumn").val());
        const maxColumn = parseInt($("#maxColumn").val());
        return minColumn <= maxColumn;
    }, "Minimum column value cannot be greater than maximum column value");

    //Checks Max and Min row to see if the min row is greater than the max and tells the user that the min row cannot be greater than the max row
    $.validator.addMethod("greaterThanRow", function(value, element ) {
        const minRow = parseInt($("#minRow").val());
        const maxRow = parseInt($("#maxRow").val());
        return minRow <= maxRow;
    }, "Minimum Row value cannot be greater than maximum Row value");    

    // full validation to make sure the user iputs a number, makes sure the min isnt greater than the max, and the range is between -50,50
    $("#form").validate({
            rules: {
                minColumn: {
                    required: true,
                    number: true,
                    min: -50,
                    max: 50,
                },
                maxColumn: {
                    required: true,
                    number: true,
                    min: -50,
                    max: 50,
                    greaterThanColumn: true
                },
                minRow: {
                    required: true,
                    number: true,
                    min: -50,
                    max: 50,
                },
                maxRow: {
                    required: true,
                    number: true,
                    min: -50,
                    max: 50,
                    greaterThanRow: true
                }
            },
            //prints out messages for any user errors and informs them on the error and how to fix it
            messages: {
                minColumn: {
                    required: "Please enter a minimum column value.",
                    number: "Value must be a valid number.",
                    min: "Value can't be less than -50.",
                    max: "Value can't be greater than 50.",
                    greaterThanColumn: "Minimum column must be less than maximum column."
                },
                maxColumn: {
                    required: "Please enter a maximum column value.",
                    number: "Value must be a valid number.",
                    min: "Value can't be less than -50.",
                    max: "Value can't be greater than 50.",
                    greaterThanColumn: "Maximum column must be greater than minimum column."
                },
                minRow: {
                    required: "Please enter a minimum row value.",
                    number: "Value must be a valid number.",
                    min: "Value can't be less than -50.",
                    max: "Value can't be greater than 50.",
                    greaterThanRow: "Minimum row must be less than maximum row."
                },
                maxRow: {
                    required: "Please enter a maximum row value.",
                    number: "Value must be a valid number.",
                    min: "Value can't be less than -50.",
                    max: "Value can't be greater than 50.",
                    greaterThanRow: "Maximum row must be greater than minimum row."
                }
            },
    // appends the error message right after the said error    
    errorPlacement: function (error, element) {
            error.appendTo(element.nextAll(".errorMessage").first());
        },
        //creats the new table tab once the form passes all the verifications
        submitHandler: function () {
            createNewTab();
            return false; 
        }
    });

    // Initializes the tabs
    $("#tabs").tabs();
    //Closes the tab once the user clicks on the x icon
    $(document).on("click", "#tabs span.ui-icon-close", function() {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        $("#tabs").tabs("refresh");
    });
    //delets all tabs
    $("#deleteAllTabs").on("click", function() {
        const $tabsContainer = $("#tabs");
        $tabsContainer.find("li").remove(); 
        $tabsContainer.find("div[id^='tab-']").remove(); 
        $tabsContainer.tabs("refresh"); 
    });

    // List of input IDs to set up sliders for.
    const inputs = ["minColumn", "maxColumn", "minRow", "maxRow"];
    
    // Loops through each input and sets up with its slider
    inputs.forEach(id => setSlider(id)); 

});



function setSlider(inputId) {
    const $input = $("#" + inputId);
    
    let sliderId = inputId;
    if (inputId.includes('Column')) {
        sliderId = inputId.replace('Column', 'Col');
    }
    const $slider = $("#" + sliderId + "Slider"); 
    //Range for slider
    $slider.slider({ 
        range: 'min',
        min: -50,
        max: 50,
        value: parseInt($input.val() || 0),
        
        slide: function(event, ui) {
            $input.val(ui.value);
            $input.valid(); 
        },
        stop: function(event, ui) {
             $input.valid();
        }
    });
    //Changes for slider value
    $input.on("keyup change", function() {
        let value = parseInt($input.val());

        if (!isNaN(value) && value >= -50 && value <= 50) {
            $slider.slider("value", value); 
        }
        
        $input.valid();
    });
}


//Creates a new tab
function createNewTab() {
    const minColumn = $("#minColumn").val();
    const maxColumn = $("#maxColumn").val();
    const minRow = $("#minRow").val();
    const maxRow = $("#maxRow").val(); 

    const tabId = "tab-" + tabCounter;
    const tabLabel = `X:(${minColumn},${maxColumn}) Y:(${minRow},${maxRow})`;
    const tableContent = generateTable(minColumn, maxColumn, minRow, maxRow); 

    const $tabs = $("#tabs").tabs();
    const ul = $tabs.find(".ui-tabs-nav"); 

    const $li = $(`<li><a href="#${tabId}">${tabLabel}</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>`);
    
    const $div = $(`<div id="${tabId}"><h2 class="table-title">${tabLabel}</h2>${tableContent}</div>`);

    ul.append($li);
    $tabs.append($div);
    $tabs.tabs("refresh");
    $tabs.tabs("option", "active", -1); 
    tabCounter++;
}


function generateTable(minC, maxC, minR, maxR) {
    let html = "<table class='multi-table'>";
    
    const minColumn = parseInt(minC);
    const maxColumn = parseInt(maxC);
    const minRow = parseInt(minR);
    const maxRow = parseInt(maxR);
    
    for (let i = minColumn; i <= maxColumn; i++) {
        html += `<th>${i}</th>`;
    }
    html += "</tr></thead>";
    
    html += "<tbody>";
    
    for (let r = minRow; r <= maxRow; r++) {
        html += `<tr><th>${r}</th>`; 
        for (let j = minColumn; j <= maxColumn; j++) {
            html += `<td>${r * j}</td>`; 
        }
        html += "</tr>";
    }
    
    html += "</tbody></table>";
    return html;
}
