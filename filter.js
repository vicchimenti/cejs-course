{ /* < script type = "text/javascript" > */ }



/***
*   @author Victor Chimenti, MSCS-SE
*   @file profile-filter.js
*
*   jQuery
*   This script searches the Law School faculty profile content items for matches to the
*   user selected search parameters in the filter field dropdown menus
*
*   @version 3.2
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
                $('form input:radio').change(function () {
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
                $('form input:radio').change(function () {
                    let typeKey = $(this).val();
                    let viewAll = "All";

                    if (typeKey != viewAll) {
                        $('.academicLevel').filter(function (i, e) {
                            var typeValue = $(this).text();

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




        }, 10);
    });
});


{ /* </script> */ }