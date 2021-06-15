jQuery(document).ready(function(){
    jQuery('.menu .nav-link').each(function(){
        var href = jQuery(this).attr('href')
        jQuery(this).attr('data-link', href).removeAttr('href')
    }).click(function(){
        scrollToElement(jQuery(this).attr('data-link'))
    })
    jQuery('.question').click(function(){
        jQuery(this).toggleClass('open')
    })
})




function scrollToElement(selector) {
    var scrollDiv = jQuery(selector).get(0).offsetTop - 67;
    console.log(scrollDiv)
    window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
}

function toggleMenu(){
    jQuery('.menu-toggler, nav.menu').toggleClass('open')
}