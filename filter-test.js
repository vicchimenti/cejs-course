{/* <script> */}
/***
*   @author Victor Chimenti, MSCS
*   @file filter.js
*
*   jQuery
*   This script searches the Ignatian Article Application content items for matches to the
*   user selected search parameters in the filter field dropdown menus
*
*   @version 5.9
*/






$(function () {
    // After the DOM is ready, Wait until the window loads
    $(window).load(function () {
        // Once window loads set a timeout delay
        setTimeout(function () {




            //** global array holds list of content items that will render after filter selection **//
            var visibleItems = [];
            var parseItems = {};



            
            //   ***   Process and Parse Visible Items   ***   //
            $(function () {
                let parseItemsToDisplay = function() {
                    // assign array of currently visible content items
                    visibleItems = $('.ignatianArticle ').not('hideByElement, hideByLevel, hideByCourse, hideByResource, hideByProgram, hideByText');
                    // check to see if array is empty
                    if (visibleItems.length == 0) {
                        // when array is empty show the results message
                        $('.noResultsToShow').removeClass('hideResultsMessage');
                    } else {
                        // when array has content items suppress the results message
                        $('.noResultsToShow').addClass('hideResultsMessage');
                    }
                };
                parseItems.process = parseItemsToDisplay;
            });
            
            
            
            
            //   ***   Keyword Search   ***   //
            $(function () {
                // scan the keyword each character the user inputs
                $('#keystroke_filter').on('keyup', function () {
                    // Assign Search Key
                    let keyword = $(this).val().toLowerCase();
                    // filter the items for the input key
                    $(function () {
                        $('.ignatianArticle ').filter(function () {
                            // when the search key is not present in the item then hide the item
                            $(this).toggleClass('hideByText', !($(this).text().toLowerCase().indexOf(keyword) > -1));
                        });
                    });
                    // parse out unselected content items and limit display to user selected items
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
                        $('div.pedagogy ul.categories').filter(function (i, e) {
                            let elementValue = $(this).text();
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



            //   ***   Level Multi-Select Checkbox Filter    ***   //
            $(function () {
                $('#SelectBox-ByLevel').change(function () {
                    let levelKeys = [];
                    levelKeys[0] = 'Any';
                    $('input[name=SelectBox-ByLevel]:checked').each(function (item) {
                        levelKeys[item] = $(this).val();
                    });
                    if (levelKeys[0] != "Any") {
                        $('div.levels ul.categories').filter(function (i, e) {
                            let levelValue = $(this).text();
                            $(this).parents('.ignatianArticle').addClass('hideByLevel');
                            for (let index = 0; index < levelKeys.length; index++) {
                                if (levelValue.includes(levelKeys[index])) {
                                    $(this).parents('.ignatianArticle').removeClass('hideByLevel');
                                }
                            }
                        });
                    } else {
                        $('.ignatianArticle').removeClass('hideByLevel');
                    }
                    parseItems.process();
                });
            });



            //   ***   Course Filter Multi-Select Checkbox Filter with detailed checkbox comments   ***   //
            $(function () {
                // When the Radio Checkbox Selector for Resource/Activity Changes - Execute change function 
                $('#SelectBox-ByCourse').change(function () {
                    // initialize an array of keys to hold each check box selected
                    let courseKeys = [];
                    // set default value to show all items
                    courseKeys[0] = 'Any';
                    // inspect each radio button to see which is checked
                    $('input[name=SelectBox-ByCourse]:checked').each(function (item) {
                        courseKeys[item] = $(this).val();
                    });
                    // If Search Key array has at least one valid value then Compare to the Each Content Item
                    if (courseKeys[0] != "Any") {
                        $('div.courses ul.categories').filter(function (i, e) {
                            let courseValue = $(this).text();
                            // set state to hidden for all items
                            $(this).parents('.ignatianArticle').addClass('hideByCourse');
                            // Check to see if any Keys are a match with the Value
                            for (let index = 0; index < courseKeys.length; index++) {
                                if (courseValue.includes(courseKeys[index])) {
                                    // make current item visible when we validate a match
                                    $(this).parents('.ignatianArticle').removeClass('hideByCourse');
                                }
                            }
                        });
                    // Else the Search Key is set to Any so Reset all Content Items to Visible
                    } else {
                        $('.ignatianArticle').removeClass('hideByCourse');
                    }
                    // parse out unselected content items and limit display to user selected items
                    parseItems.process();
                });
            });




            //   ***   Resource/Activity Radio Filter with detailed radio comments  ***   //
            $(function () {
                // When the Radio Checkbox Selector for Resource/Activity Changes - Execute change function 
                $('#SelectBox-ByActivity').change(function () {
                    // initialize an array of keys to hold each check box selected
                    let resourceKeys = [];
                    // set default value to show all items
                    resourceKeys[0] = 'Any';
                    // inspect each radio button to see which is checked
                    $('input[name=SelectBox-ByActivity]:checked').each(function (item) {
                        resourceKeys[item] = $(this).val();
                    });
                    // If Search Key array has at least one valid value then Compare to the Each Content Item
                    if (resourceKeys[0] != "Any") {
                        $('span.resourceType').filter(function (i, e) {
                            let resourceValue = $(this).text();
                            // set state to hidden for all items
                            $(this).parents('.ignatianArticle').addClass('hideByResource');
                            // Check to see if any Key is a match with the current Value
                            for (let index = 0; index < resourceKeys.length; index++) {
                                if (resourceValue.match(resourceKeys[index])) {
                                    // make current item visible when we validate a match
                                    $(this).parents('.ignatianArticle').removeClass('hideByResource');
                                }
                            }
                        });
                    // Else the Search Key is set to Any so Reset all Content Items to Visible
                    } else {
                        $('.ignatianArticle').removeClass('hideByResource');
                    }
                    // parse out unselected content items and limit display to user selected items
                    parseItems.process();
                });
            });



            //   ***   Program Type Check box Filter   ***   //
            $(function () {
                $('#SelectBox-ByProgram').change(function () {
                    let programKeys = [];
                    programKeys[0] = 'Any';
                    $('input[name=SelectBox-ByProgram]:checked').each(function (item) {
                        programKeys[item] = $(this).val();
                    });
                    if (programKeys[0] != "Any") {
                        $('p.program').filter(function (i, e) {
                            let programValue = $(this).text();
                            $(this).parents('.ignatianArticle').addClass('hideByProgram');
                            for (let index = 0; index < programKeys.length; index++) {
                                if (programValue.includes(programKeys[index])) {
                                    $(this).parents('.ignatianArticle').removeClass('hideByProgram');
                                }
                            }
                        });
                    } else {
                        $('.ignatianArticle').removeClass('hideByProgram');
                    }
                    parseItems.process();
                });
            });




        }, 10);
    });
});
{/* </script> */}