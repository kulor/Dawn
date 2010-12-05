/*
 * HTML5 placeholder-enhancer
 * version: 2.0.2
 * including a11y-name fallback
 * 
 * Simply use the HTML5 placeholder attribute 
 * <input type="text" id="birthday" placeholder="dd.mm.yyyy" />
 * 
 * http://www.protofunc.com/2009/08/16/meinung-zu-html5/, 
 * http://robertnyman.com/2010/06/17/adding-html5-placeholder-attribute-support-through-progressive-enhancement/
 * 
 */


(function($){

    $.support.placeHolder = ("placeholder"  in $('<input type="text" />')[0]);
    $.fn.placeholder = function(){return this;};
    (function(){
        if ($.support.placeHolder) {return;}

        var oldVal = $.fn.val;
        $.fn.val = function(){
            if(!arguments.length && this[0] && this[0].getAttribute('placeholder') && $(this).hasClass('placeholder-visible')){
                return '';
            }
            return oldVal.apply(this, arguments);
        };

        var delReg  = /\n|\r|\f|\t/g,
            uID     = 0,
            idPref  = $.placeholderLabelPrefix || 'placeholder-'
        ;

        $.fn.placeholder = function(){

            return this.each(function(){
                    var elem        = this,
                        placeHolder = elem.getAttribute('placeholder').replace(delReg, ''),
                        id          = elem.id,
                        //simplified a11y name computation
                        hasLabel    = !!( elem.getAttribute('title') || elem.getAttribute('aria-labelledby') || elem.getAttribute('aria-label') ),
                        curVal      = elem.value,
                        removeVal   = function(){
                            if( $(elem).hasClass('placeholder-visible') ) {
                                elem.value = '';
                            }
                        }
                    ;
                    if( !hasLabel && id ){
                        hasLabel = !!( $('label[for="'+ id +'"]', elem.form)[0] );
                    }

                    if( !hasLabel ){
                        if(!id){
                            uID++;
                            id = idPref + uID;
                            elem.setAttribute('id', id);
                        }
                        //yes, display: none; can be used here: 
                        // special a11y-name computation in conjunction with label-element
                        $('<label for="'+ id +'" style="display: none;">'+placeHolder+'</label>').insertBefore(this);
                    }
                    elem.setAttribute('placeholder', placeHolder);
                    if(!curVal){
                        elem.value = placeHolder;
                        $(elem).addClass('placeholder-visible');
                    }
                    $(window).bind('unload', removeVal);
                    $(elem.form).bind('submit', removeVal);

                })
                .bind('blur', function(){
                    if(!this.value){
                        this.value = this.getAttribute('placeholder');
                        $(this).addClass('placeholder-visible');
                    }
                })
                .bind('focus', function(){
                    if( $(this).hasClass('placeholder-visible') ){
                        this.value = '';
                        $(this).removeClass('placeholder-visible');
                    }
                })
            ;
        };


        $(function(){
            $('input[placeholder], textarea[placeholder]').placeholder();
        });

    })();
})(jQuery);