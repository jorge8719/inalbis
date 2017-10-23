
"use strict";

var app = app || {};
app.commons = app.commons || {};

app.commons.init = (function () {

    var init = function () {

        this.HeaderMenu = function(){
            var init = function(){
                HeaderMenu.init();
            }();
        };

    };
    return new init();
})();




var HeaderMenu = {

    el: {
        ham: $('.header__menu'),
        megaMenu : $('.mega-menu'),
        megaMenuIsActive: 'is-active',
        closeMegaMenu : $('.mega-menu__close'),
        toggleTrigger : $('.mega-menu__heading'),
        toggleContent : $('.mega-menu__toggle'),
        toggleContentIsActive: 'is-active',
        isOpen: false
    },

    init: function() {
        HeaderMenu.bindUIactions();
    },

    bindUIactions: function() {
         HeaderMenu.el.ham.on('click',function() {
            HeaderMenu.toggleMenuState();
          });

          HeaderMenu.el.toggleTrigger.on('click',function(e){
            HeaderMenu.activateSubMenuElements($(this));
          });

          HeaderMenu.el.closeMegaMenu.on('click',function(e){
              HeaderMenu.toggleMenuState();
              HeaderMenu.resetSubMenuElements();
          });

          $(document).keyup(function(e){
            if(e.keyCode === 27 && HeaderMenu.el.isOpen){
              HeaderMenu.toggleMenuState();
              HeaderMenu.resetSubMenuElements();
            }
          });
    },

    resetSubMenuElements: function(){
      HeaderMenu.el.toggleContent.removeClass(HeaderMenu.el.toggleContentIsActive)
    },

    activateSubMenuElements: function(elem){

      var $_target = elem.next(HeaderMenu.el.toggleContent);

      if(($_target).hasClass(HeaderMenu.el.toggleContentIsActive)){
        $_target.removeClass(HeaderMenu.el.toggleContentIsActive);
      }else{
          HeaderMenu.resetSubMenuElements()
          $_target.toggleClass(HeaderMenu.el.toggleContentIsActive);
      }
    },

    toggleMenuState: function() {
        if(HeaderMenu.el.isOpen){
          HeaderMenu.el.megaMenu.removeClass(HeaderMenu.el.megaMenuIsActive);
          HeaderMenu.el.ham.removeClass(HeaderMenu.el.megaMenuIsActive);
          HeaderMenu.el.isOpen = false;
        }else{
          HeaderMenu.el.megaMenu.addClass(HeaderMenu.el.megaMenuIsActive);
          HeaderMenu.el.ham.addClass(HeaderMenu.el.megaMenuIsActive);
          HeaderMenu.el.isOpen = true;
        }
    }
};




$(document).ready(function () {



    app.commons.init.HeaderMenu();



});
