{ /* < script type = "text/javascript" > */ }



/***
*   @author Victor Chimenti, MSCS-SE
*   @file profile-filter.js
*
*   jQuery
*   This script searches the Law School faculty profile content items for matches to the
*   user selected search parameters in the filter field dropdown menus
*
*   @version 3.4
*/






$(function () {

    $(window).load(function () {
        setTimeout(function () {

            let visibleItems = [];
            let parseItems = {};




            //   ***   Process and Parse Visible Items   ***   //
            $(function () {
                let parseItemsToDisplay = function () {
                    visibleItems = $('.cejscourseWrapper').not('.hideByText, .hideBySchool, .hideByLevel');
                    
                    if (visibleItems.length == 0) {
                        $('.noResultsToShow').removeClass('hideResultsMessage');
                    } else {
                        $('.noResultsToShow').addClass('hideResultsMessage');
                    }
                };

                parseItems.process = parseItemsToDisplay;
            });




            //   ***   Keyword Search   ***   //
            $(function () {
                $('#keystroke_filter').on('keyup', function () {
                    let keyword = $(this).val().toLowerCase();

                    $(function () {
                        $('.cejscourseWrapper').filter(function () {
                            $(this).toggleClass('hideByText', !($(this).text().toLowerCase().indexOf(keyword) > -1));
                        });
                    });

                    parseItems.process();
                });
            });





            //   ***   School Filter   ***   //
            $(function () {
                $('#SelectBox-BySchool input:radio').change(function () {
                    // Assign Search Key
                    let typeKey = $(this).val();
                    let viewAll = "All";
                    // If Search Key is Not Null then Compare to the Type List Items in Each Content Item
                    if (typeKey != viewAll) {
                        $('.college').filter(function (i, e) {
                            var typeValue = $(this).text();
                            // Check to see if the Key and Value are a Match
                            if (typeValue.match(typeKey)) {
                                $(this).parents('.cejscourseWrapper').removeClass('hideBySchool');
                            } else {
                                $(this).parents('.cejscourseWrapper').addClass('hideBySchool');
                            }
                        });
                        // Else the Search Key is Null so Reset all Content Items to Visible
                    } else {
                        $('.cejscourseWrapper').removeClass('hideBySchool');
                    }
                    // parse out unselected content items and limit display to user selected items
                    parseItems.process();
                });
            });





            //   ***   Course Level Filter   ***   //
            $(function () {
                $('#SelectBox-ByLevel input:radio').change(function () {
                    let typeKey = $(this).val();
                    let viewAll = "All";
                    console.log("typeKey: " + typeKey);
                    if (typeKey != viewAll) {
                        $('.academicLevel').filter(function (i, e) {
                            var typeValue = $(this).text();
                            console.log("typeValue: " + typeValue);

                            if (typeValue.match(typeKey)) {
                                $(this).parents('.cejscourseWrapper').removeClass('hideByLevel');
                            } else {
                                $(this).parents('.cejscourseWrapper').addClass('hideByLevel');
                            }

                        });
                    } else {
                        $('.cejscourseWrapper').removeClass('hideByLevel');
                    }

                    parseItems.process();
                });
            });





            //   ***  Ignatian Element Multi-Select Checkbox Filter    ***   //
            $(function () {
                $('#SelectBox-ByElement').change(function () {
                    let elementKeys = [];
                    elementKeys[0] = 'Any';
                    $('input[name=SelectBox-ByElement]:checked').each(function (item) {
                        elementKeys[item] = $(this).val();
                    });
                    if (elementKeys[0] != "Any") {
                        let target =  $("img.listgroupImage");
                        $('SelectBox-ByGoal ul.iconDashboard').filter(function (i, e) {
                            let elementValue = $(target).attr("aria-label");
                            // let elementValue = $(this).text();
                            $(this).parents('.ignatianArticle').addClass('hideByElement');
                            for (let index = 0; index < elementKeys.length; index++) {
                                if (elementValue.includes(elementKeys[index])) {
                                    $(this).parents('.ignatianArticle').removeClass('hideByElement');
                                }
                            }
                        });
                    } else {
                        $('.ignatianArticle').removeClass('hideByElement');
                    }
                    parseItems.process();
                });
            });

            console.log ($(x).attr("aria-label"));


        }, 10);
    });
});


{ /* </script> */ }