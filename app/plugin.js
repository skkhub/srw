(function ($) {
    const shade = "#050";
    $.fn.greenify = function() {
        this.css( "color", shade );
        return this;
    };
}(jQuery));
