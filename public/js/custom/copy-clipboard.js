// Copy a table to the clipboard. 
// Is called from within an event handler such as click on a button above the table


// require /bower_components/clipboard/dist/clipboard.js
//  https://clipboardjs.com/


// add button on each table of the document
var prependButtonToTable = function() {
    var tables = $('table');

    // add button before each table
    tables.each(function(index) {

        // test if table is to be copied (ie we only want to copy tables for exercises)
        if($(this).hasClass('no-copy')){
            return;
        } else {

            // first we wrap the element to copy in a wrapping div
            $(this).wrap('<div class="table-wrapper"></div>');

            // we inject the button in the wrapper of the element to copy
            // this way, the button and the element to copy share the same parent (they are sibling!)
            $(this).parent().prepend('<a href="" class="copy-to-clipboard label success right" title="clic to copy table to clipoard">copy table to clipboard</a>');
        }
    });

}

// copy the table (target) on clipboard
function copyToClipboard(button) {

    // on.click event fired on button above table
    $(button).click(function(event) {

        event.preventDefault();

        //  create a new clipboard
        var clipboard = new Clipboard(button, {
            target: function(button) {
                // the clipboard copies its next sibling (ie the table)
                return button.nextElementSibling;
            }
        });

        // fired an alert box on success (disappear after 1.5s, and removed from the DOM)
        clipboard.on('success', function(e) {
            $('.main').prepend('<div class="alert-copied-wrapper"><div data-alert class="alert-box info radius text-center" id="copied-to-clipboard">WELL DONE! The table is in the clipboard, ready for being copied to Excel!</div></div>');
            $('.alert-copied-wrapper').delay(1500).fadeOut(600, function(){
                $(this).remove();
            });

            e.clearSelection();
        });

    });

}

$(function() {
    prependButtonToTable();
    copyToClipboard('.copy-to-clipboard');
});