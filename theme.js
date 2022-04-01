document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, "") + "js"

if (window.location.hash) {
    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 2);
}

jQuery(document).ready(function ($) {

    /*-----------------------------------------------------------------------------GLOBAL ON LOAD----*/

    var urlParams = (function (strParam) {
        var objParams = {};

        function init() {
            objParams = {};
            var arrURLParams = window.location.search.replace('?', '').split('&');
            arrURLParams.map(function (val) {
                var arrPair = val.split('=');
                objParams[arrPair[0]] = decodeURIComponent(arrPair[1]);
            });
        }
        init();
        return {
            get: function (strParam) {
                return objParams[strParam];
            },
            pull: init
        }
    }());

    var LazyLoading = (function () {
        var instance = new LazyLoad();

        function lazyBGImages() {
            var $bgImages = $('[data-bg]:not(.lazy)');
            if ($bgImages.length) {
                $bgImages.each(function () {
                    $(this).addClass('lazy');
                });
            }
        }

        function update() {
            lazyBGImages();
            instance.update();
        }

        lazyBGImages();

        return {
            update: update
        }
    }());
    
    var SmoothScroll = (function () {
        var $anchorLinks = $('a[href^="#"]').not('a[href="#"]');

        $('a[href="#"]').click(
            function (e) { e.preventDefault(); return; }
        );

        function goTo(target) {
            if (target === "" || !$(target).length) { return; }
            var scrollPos = typeof target === 'number' ? target : $(target).offset().top;

            if (window.innerWidth >= 720) {
                scrollPos -= $('header').outerHeight();
            } else {
                scrollPos -= $('header').outerHeight() * 2;
            }

            $('html, body').stop().animate({
                'scrollTop': scrollPos - 32
            }, 1200, 'swing', function () {
                if (typeof target === 'string') {

                    if (window.location.hash) {
                        // window.location.hash = target;
                    }
                }
            });
        }

        if (window.location.hash) {
            setTimeout(function () {
                goTo(window.location.hash);
            }, 500);
        }

        if ($anchorLinks.length) {
            $anchorLinks.on('click', function (e) {
                if (!$("#" + this.hash.replace('#', '')).length) { return; }
                e.preventDefault();
                goTo(this.hash);
            });
        }

        return { to: goTo }
    }());

    //Global function to toggle simple accordions
    var Accordions = (function () {
        var $accordions = $('.accordion');
        if (!$accordions.length) { return; }

        $accordions.each(function () {
            if ($(this).hasClass('active')) {
                $(this).find('.accordion__content').show();
            }
        });

        $accordions.find('.accordion__trigger').click(function (e) {
            var $this = $(this);
            var $accordion = $this.parent();
            var $content = $accordion.find('.accordion__content');
            var $siblings = $accordion.siblings();

            if ($accordion.hasClass('active')) {
                $accordion.removeClass('active');
                $content.slideUp('fast');
            } else {
                $accordion.addClass('active');
                $siblings.removeClass('active').find('.accordion__content').slideUp('fast');
                $content.slideDown('fast');
            }
        })

    }());

    //
    var InputMasks = (function () {
        var $masks = $('[data-mask]');
        if (!$masks.length) {
            return;
        }

        $('[data-mask]').keyup(function (e) {
            switch (this.dataset.mask) {
                case 'phone':
                    var x = this.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                    console.log(x);
                    this.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
                    break;
                case 'ssn': {
                    var x = this.value.replace(/\D/g, '').match(/^(\d{0,3})(\d{0,2})(\d{0,4})/);
                    this.value = !x[2] ? x[1] : x[1] + '-' + x[2] + '-' + x[3];
                }
            }
        });
    }());

    //Plugin used for form validation
    var parselyOptions = {
        classHandler: function (parsleyField) {
            var $element = parsleyField.$element;
            if ($element.parent().hasClass('select-menu')) {
                return $element.parent();
            }
            return $element;
        },
        errorsContainer: function (parsleyField) {
            var $element = parsleyField.$element;
            var $fieldContainer = $element.closest('.form-field');
            if ($fieldContainer) {
                return $fieldContainer;
            }
        }
    };

    //Global function to set form state classes
    var formStates = (function () {
        $formInputs = $('main form :input');
        if (!$formInputs.length) {
            return;
        }

        $formSelectMenus = $('.select-menu select, .ginput_container_select select');

        function isGFormInput($el) {
            return $el.hasClass('ginput_container') ? $el.parent() : $el;
        }

        function setFilled($input) {
            var $parent = isGFormInput($input.parent());

            $parent.addClass('filled');
        }

        function removeFilled($input) {
            var $parent = isGFormInput($input.parent());

            $parent.removeClass('filled');
        }

        function setFocused() {
            var $parent = isGFormInput($(this).parent());

            $parent.addClass('focused');
        }

        function removeFocused() {
            var $parent = isGFormInput($(this).parent());

            $parent.removeClass('focused');
        }

        function checkInput(e) {
            if (this.type == 'button' ||
                this.type == 'range' ||
                this.type == 'submit' ||
                this.type == 'reset') {
                return;
            }

            var $this = $(this);
            var $parent = $this.parent();
            var is_selectMenu = $parent.hasClass('select-menu') || $parent.hasClass('ginput_container_select');

            var $input = is_selectMenu ? $parent : $this;

            switch (this.type) {
                case 'select-one':
                case 'select-multiple':
                    if (this.value !== '') {
                        setFilled($input);
                    } else {
                        removeFilled($input);
                    }
                    break;
                default:
                    if (this.value) {
                        setFilled($input);
                    } else {
                        removeFilled($input);
                    }
                    break;
            }
        }

        $formInputs.each(checkInput);
        $formInputs.on('change', checkInput);
        $formInputs.on('focus', setFocused);
        $formInputs.on('blur', removeFocused);
        $formSelectMenus.on('focus', setFocused);
        $formSelectMenus.on('blur', removeFocused);

    }());

    //Global function top open / close lightboxes

    var PDMLightbox = (function () {

        var $body = $('body');
        //Lightbox reset - This lightbox is empty and present on all pages
        var $lightbox = $('.pdm-lightbox--reset');

        //it's content can be filled from various sources
        //after close, the content is wiped
        var $lightbox_content = $('.pdm-lightbox--reset .pdm-lightbox__content');

        $body.on('click', '[data-lightbox-iframe],[data-lightbox-content],[data-lightbox-target]', function (e) {

            console.log('Lightbox Trigger');

            e.preventDefault();

            var classes = $(this).data('lightbox-classes');
            var iframe = $(this).data('lightbox-iframe');
            var blur = $(this).data('lightbox-blur');

            if (iframe) {

                var youtubePattern = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
                var vimeoPattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;

                if (youtubePattern.test(iframe)) {

                    classes += ' youtube-vid'

                    replacement = '<div class="spacer"><iframe width="560" height="315" frameborder="0" allowfullscreen src="//www.youtube.com/embed/$1?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3" /></div>';

                    iframe = iframe.replace(youtubePattern, replacement);

                }

                if (vimeoPattern.test(iframe)) {

                    classes += ' vimeo-vid'

                    replacement = '<div class="spacer"><iframe width="560" height="315" frameborder="0" allowfullscreen src="//player.vimeo.com/video/$1?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3" /></div>';

                    iframe = iframe.replace(vimeoPattern, replacement);

                }

                $lightbox_content.html('<div class="iframe-wrap">' + iframe + '</div>');

            } else {
                if ($(this).data('lightbox-content')) {
                    var content = $(this).data('lightbox-content');
                } else if ($(this).data('lightbox-target')) {
                    var target = $(this).data('lightbox-target');
                    var content = $('#' + target).html();
                }
                $lightbox_content.html(content);
            }

            if (blur != false) {
                $body.addClass('blur');
            }

            $lightbox.addClass('active').addClass(classes);

        });

        function closeLightbox($lightbox) {
            $lightbox.removeClass('active');
            $('body').removeClass('no-scroll');
            setTimeout(function () {
                $body.removeClass('blur');
            }, 250);
            //wait before removing classes till lightbox closses
            if ($lightbox.hasClass('pdm-lightbox--reset')) {
                setTimeout(function () {
                    $lightbox.find('.pdm-lightbox__content').empty();
                    $lightbox.attr('class', 'pdm-lightbox pdm-lightbox--reset');
                }, 750);
            }
        }

        $('.pdm-lightbox').on('click', function (e) {
            if (e.target == this) {
                closeLightbox($(this));
            }
        });

        $('.pdm-lightbox__close').click(function (e) {
            e.stopPropagation();
            closeLightbox($(this).closest('.pdm-lightbox'));
        });
        return {
            close: closeLightbox
        };
    }());

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    var ImageEngraving = (function () {
        var $section = $('#liquidpixel_customizer');
        if (!$section.length) { return; }

        var inputDelay;
        var $check = $section.closest('.product-options-check');
        var handle = $check.data('handle');
        var $engraving = $section.find('#engraving');
        var $before_engraving = $section.find('#before-engraving');
        var $after_engraving = $section.find('#after-engraving');
        var $lpx_img = $section.find('#liquidpixel_image');
        var lpx_baseurl = 'https://noemie.liquifire.com/noemie?set=prodID[' + $section.data('prodid') + ']';

        function getMaterialColor() {
            
            var color = '';
            
            if( $('.product-options-check__option-select[name="material"]').length ){
                color = $('.product-options-check__option-select[name="material"]').val();
            }
            
            if( $('.product-options-check__option-select[name="metal"]').length ){
                color = $('.product-options-check__option-select[name="metal"]').val();
            }
            
            if( handle == 'the-symbol-ring-update' ){
                color = 'yellow';
            }

            if (color.toLowerCase().indexOf('rose') != -1) {
                color = 'rose';
            } else if (color.toLowerCase().indexOf('white') != -1) {
                color = 'white';
            } else if (color.toLowerCase().indexOf('yellow') != -1) {
                color = 'yellow';
            } else if (color.toLowerCase().indexOf('plat') != -1) {
                color = 'plat';
            } else if (color.toLowerCase().indexOf('black') != -1) {
                color = 'black';
            } else {
                color = '';
            }
            return color;
        }

        function updateURL() {
            var lpx_src = lpx_baseurl;
            var color = getMaterialColor();

            if ($engraving.val() !== ''&& $engraving.length ) {
                lpx_src += ',textline1[' + $engraving.val() + ']';
                console.log('has text');
            }

            if ($before_engraving.val() !== '') {
                if( handle == 'the-symbol-ring-update' ){
                    lpx_src += ',art1[' + $before_engraving.val() + ']';
                }else{
                    lpx_src += ',icon1[' + $before_engraving.val() + ']';
                }
                console.log('has icon');
            }
            if ($after_engraving.val() !== '' && $after_engraving.length ) {
                lpx_src += ',icon2[' + $after_engraving.val() + ']';
                console.log('has icon2');
                console.log($after_engraving.val());
            }

            lpx_src += ',color1[' + color + ']';
            lpx_src += ',seed[001]&call=url[file:main]&sink';

            if ($engraving.val() !== '' || $before_engraving.val() !== '' || ($after_engraving.length && $after_engraving.val() !== '')) {
                $lpx_img.show()
            }

            $lpx_img.addClass('loading')
                .find('img').attr('src', lpx_src).on('load', function () {
                    $lpx_img.removeClass('loading');
                });
        }

        $engraving.keyup(function () {
            clearTimeout(inputDelay);

            inputDelay = setTimeout(function () {
                updateURL();
            }, 1000);
        });

        $before_engraving.change(function () {
            updateURL();
        });

        $after_engraving.change(function () {
            updateURL();
        });

        return {
            update: updateURL
        }
    }());

    var variantOptionsCheck = (function () {

        var $lastOption;

        function otherOptionsOnSelect($check) {

            var $select = $check.find('.product-options-check__select');
            var variant = $select.val();

            var image = $select.find('option[value="' + variant + '"]').data('image');

            var $images = $('.variant-image');

            $images.addClass('hidden-image');
            $images.filter('[data-master="' + image + '"]').removeClass('hidden-image');
            
//            setTimeout(function(){
                var index = -1;
                $('.product-details__images__slider .product-image').each(function(){
                    index++;
                    if( $(this).data('master') == image ){
                        console.log(index);
                        $('.product-details__images__slider').flickity( 'select', index, false, true );
                    }
                });
//            },500);

        }

        function selectClosestVariant() {

            var $check = $lastOption.closest('.product-options-check');
            var $groups = $check.find('.product-options-check__option-group');
            var $group = $lastOption.closest('.product-options-check__option-group');
            var $productSelect = $check.find('.product-options-check__select');

            var type = $group.data('type');
            var value = $lastOption.val();

            $productSelect.find('option' + '[data-' + type + '="' + value + '"]').each(function () {

                var $this = $(this);

                if ($this.data('instock') == true) {

                    var options = $this.data('options').split(',');
                    var count = options.length;

                    $.each(options, function (i, val) {
                        var $option = $groups.eq(i).find('button[value="' + val + '"]');
                        selectOption($option, false);
                        if (count == (i + 1)) {
                            checkAllOptions($option)
                        }
                    });

                    updateProductSelect($check);

                    return false;

                }
            });

        }

        function isMasterVariant($group) {
            return $group.hasClass('product-options-check__option-group--master');
        }

        function updateProductSelect($check) {

            var $productSelect = $check.find('.product-options-check__select');
            var $groups = $check.find('.product-options-check__option-group');

            var selectedOptions = [];
            var found = false;

            $groups.each(function () {

                var $group = $(this);
                var $select = $group.find('.product-options-check__option-select');

                selectedOptions.push($select.val());

            });

            $productSelect.find('option').each(function () {

                var $this = $(this);

                if (!$this.data('options')) {
                    return;
                }

                var options = $this.data('options').split(',');

                if (options.sort().join(',') == selectedOptions.sort().join(',')) {
                    $productSelect.find('option').attr('selected', false);
                    $this.attr('selected', true);
                    otherOptionsOnSelect($check);
                    found = true;

                    window.history.pushState('', '', '?variant=' + $this.val());

                    return false;
                }

            });

            if (found == false) {
                selectClosestVariant();
            }

        }

        function checkAllOptions($option, $exclude) {

            var $check = $option.closest('.product-options-check');
            var $productSelect = $check.find('.product-options-check__select');
            var $groups = $check.find('.product-options-check__option-group:not(.product-options-check__option-group--master)');

            var $master = $('.product-options-check__option-group--master');
            var masterType = $master.data('type');
            var masterVal = $master.find('.product-options-check__option-select').val();
            var masterQuery = '[data-' + masterType + '="' + masterVal + '"]';

            $groups.each(function () {

                var $group = $(this);

                if ($exclude == undefined || ($group[0] != $exclude[0])) {

                    var type = $group.data('type');
                    var $buttons = $group.find('.product-options-check__option');

                    $buttons.addClass('disabled');

                    if ($exclude) {
                        var excludeType = $exclude.data('type');
                        var excludeVal = $exclude.find('.product-options-check__option-select').val();
                        masterQuery += '[data-' + excludeType + '="' + excludeVal + '"]'
                    }

                    $buttons.each(function () {

                        var $button = $(this);
                        var value = $button.val();

                        $productSelect.find('option' + '[data-' + type + '="' + value + '"]' + masterQuery).each(function () {
                            if ($(this).data('instock') == true) {
                                $button.removeClass('disabled');
                            }
                        });

                    });

                }

            });

            updateProductSelect($check);

        }

        function selectOption($option, check) {

            var $check = $option.closest('.product-options-check');
            var $mselect = $check.find('.product-options-check__select');
            var $group = $option.closest('.product-options-check__option-group');
            var type = $group.data('type');
            var $buttons = $group.find('.product-options-check__option');
            var $select = $group.find('.product-options-check__option-select');
            var $selectOptions = $select.find('option');
            var $selectedOptionText = $group.find('.selected-option');
            var val = $option.val();

//            console.log(val);
            
            if( val != null ){
                if( val.indexOf('Gold') !== -1 ){
                    $selectedOptionText.text('18 Karat ' + val);
                }else{
                    $selectedOptionText.text(val);
                }
            }

            var $selectedButton = $buttons.filter('[value="' + val + '"]');

            if ($selectedButton.hasClass('disabled')) { return; }

            $buttons.removeClass('active');
            $selectedButton.addClass('active');

            $selectOptions.attr('selected', false);
            $selectOptions.filter('[value="' + val + '"]').attr('selected', true);

            $lastOption = $option;

            if (check == true) {
                if (isMasterVariant($group)) {
                    checkAllOptions($option);
                } else {
                    checkAllOptions($option, $group);
                }
            }
            
            if( $('#liquidpixel_customizer').length ){
                ImageEngraving.update();
            }

        }

        $('body').on('click', '.product-options-check__option', function () {
            selectOption($(this), true);
        });

        $('body').on('change', '.product-options-check__option-select', function () {
            selectOption($(this), true);
        });

        function defaultVariantSelect($el) {
            var variant = urlParams.get('variant');

            if (variant) {
                var currentOptions = $('.product-options-check__select').find('option[value="' + variant + '"]').data('options');

                currentOptions = currentOptions.split(',');
                $('.product-options-check__option-group').each(function ($i) {
                    $(this).find('.product-options-check__option').each(function () {
                        if ($(this).val() == currentOptions[$i]) {
                            $(this).click();
                        }
                    });
                });
                updateProductSelect($('.product-options-check'));
            } else {
                $el.click();
            }
            
            var $check = $el.closest('.product-options-check');
            var type = $check.data('type');
                        
            if( type == 'Ring' ){
                
                var $sizeOptions = $check.find('.product-options-check__option-group--size');
                
                var $option7 = $sizeOptions.find('option[value="7"]');
                
                if( $option7.length ){
                    $sizeOptions.find('select').val(7);
                    $sizeOptions.find('select').trigger('change');
                }
                
            }
        }

        function checkAvailableMasterOptions($group) {

            var $check = $group.closest('.product-options-check');
            var $productSelect = $check.find('.product-options-check__select');
            var type = $group.data('type');
            var $buttons = $group.find('.product-options-check__option');

            $buttons.addClass('disabled');

            $buttons.each(function () {

                var $this = $(this);
                var value = $this.val();

                $productSelect.find('option' + '[data-' + type + '="' + value + '"]').each(function () {
                    if ($(this).data('instock') == true) {
                        $this.removeClass('disabled');
                        return false;
                    }
                });

            });

            defaultVariantSelect($buttons.filter(':not(.disabled)').first());

        };

        $('.product-options-check').each(function () {
            var $group = $(this).find('.product-options-check__option-group').first();
            checkAvailableMasterOptions($group);
        });

    }());

    var desktopQuery = window.matchMedia('(min-width: 960px)');

    var header = (function () {

        var $header = $('.gheader');
        var $banner = $('.gheader__banner');
        var $navContainer = $('.gheader__nav');

        function headerHeight() {
            var height = $navContainer.outerHeight();
            if ($banner.length) {
                height += $banner.outerHeight();
            }
            return height;
        }

        //        gsap.set($header,{
        //            position:'fixed',
        //        });
        //
        //        $('#scroll-container').prepend('<div class="gheader__placeholder"></div>');
        //
        //        $(window).resize(function(){
        //            gsap.set('.gheader__placeholder',{
        //                height:headerHeight(),
        //            });
        //        }).trigger('resize');

        //        var previousScroll = 0;
        //        $(window).scroll(function(){
        //            var stickyTop = $header.outerHeight()*2;
        //            var currentScroll = $(this).scrollTop();
        //            if (currentScroll > previousScroll && currentScroll > stickyTop){
        //                $header.addClass('nav-hide');
        //            } else {
        //                $header.removeClass('nav-hide');
        //            }
        //            previousScroll = currentScroll;
        //        });

        var $mobileToggle = $('.menu-burger');
        var $mobileNav = $('.gheader__mobile');
        var $mobileDrops = $mobileNav.find('.dropdown');

        $mobileDrops.click(function (e) {

            if (desktopQuery.matches) { return; }

            e.preventDefault();

            var $this = $(this);

            $this.toggleClass('active');
            $this.next().slideToggle();

        });

        $mobileToggle.click(function () {

            var $this = $(this);

            if ($this.hasClass('active')) {
                $('body').removeClass('noScroll');
                gsap.to($mobileNav, {
                    x: '-100%',
                    duration: .5,
                });
            } else {
                $('body').addClass('noScroll');
                gsap.to($mobileNav, {
                    x: 0,
                    duration: .5,
                });
            }

        });

        $dropdowns = $('.dropdown-menu.show-image');
        $dropdownImages = $('.dropdown-menu.show-image li[data-image]');

        $dropdowns.each(function () {

            var $this = $(this);
            var fistImage = $this.find('li[data-image]').data('image');

            $this.append('<div class="image-container"><img class="lazy" data-src="' + fistImage + '"></div>');
            
            LazyLoading.update();

        });

        $dropdownImages.hover(function () {

            var $this = $(this);
            var fistImage = $this.data('image');
            var $dropdown = $this.closest('.dropdown-menu.show-image');

            $dropdown.find('img').attr('src', fistImage);

        });

        $searchToggle = $('.search-icon');
        $searchBar = $('.search-form');

        $searchToggle.click(function () {
            $searchBar.slideToggle();
//            $mobileToggle.click();
        });

    }());

    //    var heroMain = (function () {
    //
    //        var $hero = $('.hero-main');
    //
    //        if (!$hero.length) {
    //            return;
    //        }
    //
    //    }());

    var USPs = (function () {

        var $usps = $('.usps-row ul');

        if (!$usps.length) {
            return;
        }

        ScrollTrigger.matchMedia({
            "(max-width: 959px)": function () {

                $usps.each(function () {

                    var $this = $(this);
                    var containerWidth = 0;
                    var $slides = $this.find('li');

                    $slides.each(function () {
                        containerWidth += $(this).outerWidth();
                    });

                    $slides.each(function () {
                        var $slide = $(this);
                        var leftBounds = -($slide.outerWidth() + $slide.offset().left);
                        var wrapFunc = gsap.utils.unitize(
                            gsap.utils.wrap(
                                leftBounds,
                                containerWidth + leftBounds
                            )
                        );
                        gsap.to($slide, {
                            x: -containerWidth,
                            ease: "none",
                            delay: .5,
                            duration: 12,
                            repeat: -1,
                            modifiers: {
                                x: wrapFunc
                            },
                        });
                    });

                });

            }
        });

    }());

    var fifty2img = (function () {

        var $els = $('.fifty-2img:not(.special)');

        if (!$els.length) {
            return;
        }

        var $allimages = $els.find('.fifty-2img_image');

        ScrollTrigger.saveStyles($allimages);

        ScrollTrigger.matchMedia({

            "(min-width: 960px)": function () {

                $els.each(function () {

                    var $trigger = $(this);
                    var $images = $trigger.find('.fifty-2img_image');

                    gsap.to($images, {
                        y: (i, el) => (1 - parseFloat($(el).data('speed'))) * $trigger.outerHeight(),
                        ease: "none",
                        scrollTrigger: {
                            trigger: $trigger,
                            start: 'top center',
                            end: "bottom center-=200px",
                            invalidateOnRefresh: true,
                            scrub: 0,
                            markers: false,
                        }
                    });

                });

            }

        });

    }());

    var calloutParallax = (function () {

        var $els = $('.callout-parallax');

        if (!$els.length) {
            return;
        }

        console.log('this worked');

        //        var $allimages = $els.find('.callout-parallax__image');

        //        ScrollTrigger.saveStyles($allimages);

        function startTrigger() {
            if (desktopQuery.matches) {
                return 'top center';
            } else {
                return 'top center+=100';
            }
        }

        $els.each(function () {

            var $trigger = $(this);
            var $images = $trigger.find('.callout-parallax__image');

            gsap.to($images, {
                y: (i, el) => (1 - parseFloat($(el).data('speed'))) * $trigger.outerHeight(),
                ease: "none",
                scrollTrigger: {
                    trigger: $trigger,
                    start: startTrigger,
                    end: "bottom center-=200px",
                    invalidateOnRefresh: true,
                    scrub: 0,
                    markers: false,
                }
            });

        });

    }());

    var productCard = (function () {

        var $loop = $('.product-card,.boost-pfs-filter-products');

        if (!$loop.length) {
            return;
        }

        $('body').on('click', '.material__swatches button', function () {

            var $this = $(this);
            var image = $this.data('image');
            var $card = $this.parents('.product-card');
            var $swatches = $card.find('.material__swatches button');
            var $ul = $this.parents('.material__swatches');
            var $labels = $ul.find('label');
            var $image = $card.find('.product-card__thumb img.variant-image');

//           console.log(image);
//           console.log($card);
//           console.log($image);

            $labels.removeClass('active');
            $this.parent().addClass('active');

            $image.parent().addClass('variant-active');
            $image.attr('src', image);

        });

    }());

    var featCol = (function () {

        var $nav = $('.feat-collections__nav button');

        if (!$nav.length) {
            return;
        }

        var $sliderContainers = $('.feat-collections .feat-collections__slider');
        var $activeSlider = $sliderContainers.filter('.active');
        var $sliders = $('.feat-collections .product-loop');

        function animateSlides($activeSlider) {
            console.log($activeSlider);
            var $slides = $activeSlider.find('.product-card');
            gsap.set($activeSlider, {
                opacity: 0,
            });
            gsap.set($slides, {
                x: '100%',
            });
            gsap.to($activeSlider, {
                delay: .25,
                opacity: 1,
                duration: 1.5,
            });
            gsap.to($slides, {
                x: 0,
                duration: 1,
                stagger: .1,
            });
        }

        animateSlides($activeSlider);

        $sliders.each(function () {

            var $this = $(this);

            $this.flickity({
                cellAlign: 'left',
                groupCells: false,
                pageDots: false,
                prevNextButtons: false,
                wrapAround:true,
            });

            $this.parent().find('.feat-collections__slider__nav button').click(function () {
                if ($(this).hasClass('next')) {
                    console.log("next");
                    $this.flickity('next');

                } else {
                    $this.flickity('previous');
                }

            });

        });

        $nav.click(function () {

            var $this = $(this);

            if ($this.hasClass('active')) { return; }

            var target = $this.data('target');
            var $activeSlider = $sliderContainers.filter('[data-handle="' + target + '"]');

            animateSlides($activeSlider);

            $nav.removeClass('active');
            $this.addClass('active');

            $sliderContainers.removeClass('active');
            $activeSlider.addClass('active').find('.product-loop').flickity('resize');

        });

    }());

    var gallerySlider = (function () {

        $sliders = $('.gallery-slider__slider');

        if (!$sliders.length) { return; }

        $sliders.each(function () {

            var $this = $(this);

            $this.flickity({
                cellAlign: 'left',
                groupCells: true,
                pageDots: false,
                prevNextButtons: false,
            });

            $this.parent().find('.gallery-slider__nav button').click(function () {
                if ($(this).hasClass('next')) {
                    console.log("next");
                    $this.flickity('next');

                } else {
                    $this.flickity('previous');
                }

            });

        });

    }());

    var audioToggle = (function () {

        var $toggle = $('.toggle-audio');

        if (!$toggle.length) {
            return;
        }

        $toggle.click(function () {

            var $video = $(this).closest('.video-wrap').find('video');

            if ($video.prop('muted')) {
                $video.prop('muted', false);
            } else {
                $video.prop('muted', true);
            }

        });

    }());

    function klaviyoSubscribe(listID, email, source, callback) {

        // send Identify request to cookie the browser
        var _learnq = _learnq || [];
        _learnq.push(["identify", { $email: email }]);

        $.ajax({
            type: "POST",
            url: "https://manage.kmail-lists.com/ajax/subscriptions/subscribe",
            data: `g=${listID}&email=${encodeURIComponent(email)}&$fields=$source&$source=${source}`,
            contentType: "application/x-www-form-urlencoded",
            error: function (err) {
                console.log("Could not connect to Klaviyo.");
                return err;
            },
            success: callback
        });

    }

    var newsletter = (function () {

        var $signup = $('.signup-block form');

        if (!$signup.length) { return; }

        function handleResponse(data) {
            console.log(data);
            if (data.success == true) {
                $signup.find('input').hide();
                $signup.append('<p class="message message--sucess">Thanks for subscribing!</p>');
            }
        }

        $signup.submit(function (e) {

            e.preventDefault();

            var $this = $(this);
            var email = $(this).find('.email').val();

            klaviyoSubscribe('MiWHFU', email, 'Website Newsletter Signup', handleResponse);

        });

    }());

    var comapeHero = (function () {
        
        var $toggle = $('.compare-images');

        if (!$toggle.length) {
            return;
        }
        
        $toggle.twentytwenty();

    }());
    
    var galSlider2 = (function () {
        
        var $imgSlider = $('.gallery-slider-v2__slider');
        
        $imgSlider.each(function(){
            
            var $this = $(this);
            
            $this.flickity({
                cellAlign: 'left',
                groupCells: false,
                prevNextButtons: false,
                wrapAround:true,
            });
            
            $this.parent().find('.gallery-slider-v2__nav button').click(function () {
                if ($(this).hasClass('next')) {
                    console.log("next");
                    $this.flickity('next');

                } else {
                    $this.flickity('previous');
                }

            });
            
        });
        
    }());
    

    var collection = (function () {

        var $toggle = $('.show-toggle');

        if (!$toggle.length) { return; }

        var $loop = $('.boost-pfs-filter-products');

        $toggle.click(function () {

            $toggle.removeClass('active');
            $(this).addClass('active');

            if ($(this).hasClass('three-col')) {
                $loop.addClass('three-col');
            } else {
                $loop.removeClass('three-col');
            }

        });

    }());
    
    var ProductPage = (function () {
        var $section = $('.product-details');
        if (!$section.length) { return; }

        var $check = $section.find('.product-options-check');
        var handle = $check.data('handle');
        
        var ImageSlider = (function () {
            
            var $imgSlider = $section.find('.product-details__images__slider');
            
            $imgSlider.flickity({
                cellAlign: 'left',
                groupCells: true,
                prevNextButtons: true,
                watchCSS: true,
                pageDots: false,
                wrapAround:true,
            });
         /*   
            $imgSlider.parent().find('.product-details__images__nav button').click(function () {
                if ($(this).hasClass('next')) {
                    $imgSlider.flickity('next');
                } else {
                    $imgSlider.flickity('previous');
                }
            });*/
            
        }());
        
        var EngravingDropdowns = (function () {
            var $dropdowns = $section.find('.engraving-icons select');
            if (!$dropdowns.length) { return; }

            function formatSelect(state) {

                if (!state.id) {
                    return state.text;
                }

                var $state = $('<span><span><img src=' + state.element.dataset.imagesrc + '/></span> ' + state.text + '</span>');
                return $state;
            }

            $dropdowns.select2({
                templateResult: formatSelect,
                templateSelection: formatSelect
            });

            $dropdowns.on('select2:select', function (e) {
                var el = e.params.data.element;
                var icon_src = el.dataset.imagesrc;
                var val = el.value;

                var selected_html = '<img src="' + icon_src + '" title=' + val + '/>';

                if (icon_src == undefined) {
                    selected_html = '(' + el.innerText + ')';
                }

                $(el).parent().parent().find('.selected-option').html(selected_html);
                
                if( handle == 'custom-letter-necklace' || handle == 'custom-engraved-heart-necklace' ){
                    if( val == '' ){
                        $('#engraving').removeAttr('readonly');   
                    }else{
                        $('#engraving').attr('readonly', true);   
                    }
                }
            });
            
            $('#engraving').change(function(){
                if( handle == 'custom-letter-necklace' || handle == 'custom-engraved-heart-necklace' ){
                    if( $(this).val() == '' ){
                        $dropdowns.removeAttr('disabled');
                    }else{
                        $dropdowns.attr('disabled', true);

                    }
                }
            });
            

        }());
        
        var view360 = (function(){
            
            $('.view-360btn').on('click',function(e){
                e.preventDefault();
                var $lightbox = $('.lightbox-360view');
                var $iframe = $lightbox.find('iframe');
                var src = $iframe.data('src');
                $iframe.attr('src',src);
                $lightbox.addClass('active');
                return false;
            });
            
        }());
        
        var share = (function(){
            
            $('.social-share button,.social-share a').click(function(){
                $('.social-share').toggleClass('active');
            });
            
        }());
        
        var textUs = (function(){
            
            $('.product-details__sizer button').on('click',function(){
                var ua = navigator.userAgent.toLowerCase();
                var url = '';
                var tel = $(this).attr('data-tel');
                
                var body = $(this).attr('data-content');
                body = encodeURIComponent(body);
                
                var referer_url = window.location.href;

                if ( ua.match(/(ipad|iphone|ipod)/g) ){
                    url = "sms:"+ tel +"&body=" + body;
                }
                else{
                    url = "sms:"+ tel +"?body=" + body;
                }

                window.location = url;
            });
            
        }());
        

    }());

    var yotpoLoad = (function(){

        var $section = $('.yotpo-reviews-section');

        if (!$section.length) {
            return;
        }

        var yotpoCheck = setInterval(function(){

            if( $section.find('.scroller').length ){
                clearInterval(yotpoCheck);
                refreshSmooth.init();
            }

        },100);

    }());
    
    var featuredProducts = (function(){

        $sliders = $('.featured-products__slider');

        if( !$sliders.length ){ return; }

        $sliders.each(function () {

            var $this = $(this);

            $this.flickity({
                cellAlign: 'left',
                groupCells: true,
                pageDots: false,
                prevNextButtons: false,
            });

            $this.parent().find('.featured-products__nav button').click(function () {
                if ($(this).hasClass('next')) {
                    console.log("next");
                    $this.flickity('next');

                } else {
                    $this.flickity('previous');
                }

            });

        });

    }());

    
    var similarProducts = (function(){

        $sliders = $('.similar-products__slider');

        if( !$sliders.length ){ return; }

        $sliders.each(function () {

            var $this = $(this);

            $this.flickity({
                cellAlign: 'left',
                groupCells: true,
                pageDots: false,
                prevNextButtons: false,
                wrapAround:true,
            });

            $this.parent().find('.similar-products__nav button').click(function () {
                if ($(this).hasClass('next')) {
                    console.log("next");
                    $this.flickity('next');

                } else {
                    $this.flickity('previous');
                }

            });

        });

    }());

    var costPerWear = (function(){

        var $itemRange = $("#itemRange");

        if( !$("#itemRange").length ){ return; }

        // $("#itemRange").slider({
        //     value: 0,
        
        // });
        $("#itemRange").on('change', function() {
            costPerWear($('#itemRange').val());
        });
        
        $(document).on('keyup change', "#itemPrice", function() {
            if ($(this).val() != null && $(this).val() != '' && $(this).val() != 0) {
                if ($("#itemMaintenance").val() != null && $("#itemMaintenance").val() != '' && $("#itemMaintenance").val() != 0) {
                    var maintenanceCost = $("#itemMaintenance").val();
                    var noOfYear = $("#itemYear").val();
                    var totalCostOfMaintenance = maintenanceCost * noOfYear;
                    var itemPrice = totalCostOfMaintenance + parseInt($(this).val());
                    var costPerWear = itemPrice / (noOfYear * $("#itemRange").val());
                    if (isFinite(costPerWear)) {
                        $('.cost-per-wear__result span').text("$" + costPerWear.toFixed(2).replace(".00", "").replace(",", ""));
                    } else {
                        $('.cost-per-wear__result span').text("--");
                    }
        
                } else if ($("#itemYear").val() != null && $("#itemYear").val() != '' && $("#itemYear").val() != 0) {
                    var noOfYear = $("#itemYear").val();
                    var itemPrice = parseInt($(this).val());
                    var costPerWear = itemPrice / (noOfYear * $("#itemRange").val());
                    if (isFinite(costPerWear)) {
                        $('.cost-per-wear__result span').text("$" + costPerWear.toFixed(2).replace(".00", "").replace(",", ""));
                    } else {
                        $('.cost-per-wear__result span').text("--");
                    }
                }
            }
        });

        $(document).on('keyup change', "#itemMaintenance", function() {
            if ($("#itemPrice").val() != null && $("#itemPrice").val() != '' && $("#itemPrice").val() != 0) {
                if ($(this).val() != null && $(this).val() != '' && $(this).val() != 0) {
                    var maintenanceCost = $(this).val();
                    var noOfYear = $("#itemYear").val();
                    var totalCostOfMaintenance = maintenanceCost * noOfYear;
                    var itemPrice = totalCostOfMaintenance + parseInt($("#itemPrice").val());
                    var costPerWear = itemPrice / (noOfYear * $("#itemRange").val());
                    if (isFinite(costPerWear)) {
                        $('.cost-per-wear__result span').text("$" + costPerWear.toFixed(2).replace(".00", "").replace(",", ""));
                    } else {
                        $('.cost-per-wear__result span').text("--");
                    }
        
                } else if ($("#itemYear").val() != null && $("#itemYear").val() != '' && $("#itemYear").val() != 0) {
                    var noOfYear = $("#itemYear").val();
                    var itemPrice = parseInt($("#itemPrice").val());
                    var costPerWear = itemPrice / (noOfYear * $("#itemRange").val());
                    if (isFinite(costPerWear)) {
                        $('.cost-per-wear__result span').text("$" + costPerWear.toFixed(2).replace(".00", "").replace(",", ""));
                    } else {
                        $('.cost-per-wear__result span').text("--");
                    }
                }
            }
        });

        $(document).on('keyup change', "#itemYear", function() {
            if ($("#itemPrice").val() != null && $("#itemPrice").val() != '' && $("#itemPrice").val() != 0) {
                if ($("#itemMaintenance").val() != null && $("#itemMaintenance").val() != '' && $("#itemMaintenance").val() != 0) {
                    var maintenanceCost = $("#itemMaintenance").val();
                    var noOfYear = $("#itemYear").val();
                    var totalCostOfMaintenance = maintenanceCost * noOfYear;
                    var itemPrice = totalCostOfMaintenance + parseInt($("#itemPrice").val());
                    var costPerWear = itemPrice / (noOfYear * $("#itemRange").val());
                    if (isFinite(costPerWear)) {
                        $('.cost-per-wear__result span').text("$" + costPerWear.toFixed(2).replace(".00", "").replace(",", ""));
                    } else {
                        $('.cost-per-wear__result span').text("--");
                    }
        
                } else if ($(this).val() != null && $(this).val() != '' && $(this).val() != 0) {
                    var noOfYear = $(this).val();
                    var itemPrice = parseInt($("#itemPrice").val());
                    var costPerWear = itemPrice / (noOfYear * $("#itemRange").val());
                    if (isFinite(costPerWear)) {
                        $('.cost-per-wear__result span').text("$" + costPerWear.toFixed(2).replace(".00", "").replace(",", ""));
                    } else {
                        $('.cost-per-wear__result span').text("--");
                    }
                }
            }
        });

        $(document).on("wheel", ".cost-per-wear-form input[type=number]", function(e) {
            $(this).blur();
        });
        
        function costPerWear(value) {
            if ($("#itemPrice").val() != null && $("#itemPrice").val() != '' && $("#itemPrice").val() != 0) {
                if ($("#itemMaintenance").val() != null && $("#itemMaintenance").val() != '' && $("#itemMaintenance").val() != 0) {
                    var maintenanceCost = $("#itemMaintenance").val();
                    var noOfYear = $("#itemYear").val();
                    var totalCostOfMaintenance = maintenanceCost * noOfYear;
                    var itemPrice = totalCostOfMaintenance + parseInt($("#itemPrice").val());
                    var costPerWear = itemPrice / (noOfYear * value);
                    if (isFinite(costPerWear)) {
                        $('.cost-per-wear__result span').text("$" + costPerWear.toFixed(2).replace(".00", "").replace(",", ""));
                    } else {
                        $('.cost-per-wear__result span').text("--");
                    }
        
                } else if ($("#itemYear").val() != null && $("#itemYear").val() != '' && $("#itemYear").val() != 0) {
                    var noOfYear = $("#itemYear").val();
                    var itemPrice = parseInt($("#itemPrice").val());
                    var costPerWear = itemPrice / (noOfYear * value);
                    if (isFinite(costPerWear)) {
                        $('.cost-per-wear__result span').text("$" + costPerWear.toFixed(2).replace(".00", "").replace(",", ""));
                    } else {
                        $('.cost-per-wear__result span').text("--");
                    }
                }
            }
        }

    }());

    var estShipping = (function () {

        var shippingEstimator = $('.shipping-estimator');

        if (!shippingEstimator.length) { return; }

        var shippingEstimatorSubmit = shippingEstimator.find('.shipping-estimator__submit');

        new Shopify.CountryProvinceSelector('address_country', 'address_province', {
            hideElement: 'address_province_container'
        });

        function showShippingEstimateError(results) {

            console.log(results);

            var $results = $('.shipping-estimator__results');
            var $title = $results.find('.shipping-estimator__title');
            var $list = $results.find('.shipping-estimator__list');

            $list.empty();

            $title.text('There are some errors with your submission:');

            $list.append('<li>' + results.zip[0] + '</li>');

            $results.show();

        }

        function showShippingEstimateSuccess(results) {

            console.log(results);

            var $results = $('.shipping-estimator__results');
            var $title = $results.find('.shipping-estimator__title');
            var $list = $results.find('.shipping-estimator__list');

            $list.empty();

            $title.text('Available shipping rates:');

            $.each(results, function (i, result) {

                var price = result.price;

                if (price == 0.00) { price = 'FREE' } else { price = '$' + price; }

                $list.append('<li>' + result.name + ': <strong>' + price + '</strong></li>');

            });

            $results.show();

        }

        $('.shipping-estimator__form').submit(function (e) {

            e.preventDefault();

            shippingEstimatorSubmit.text('Estimating...');

            $.ajax({
                method: 'GET',
                url: '/cart/shipping_rates.json',
                data: {
                    shipping_address: {
                        country: shippingEstimator.find('#address_country').val(),
                        province: shippingEstimator.find('#address_province').val(),
                        zip: shippingEstimator.find('#address_zip').val()
                    }
                },
                error: function (results) {
                    shippingEstimatorSubmit.text('Estimate');

                    var response = results.responseJSON;

                    showShippingEstimateError(response);

                },
                success: function (results) {

                    shippingEstimatorSubmit.text('Estimate');

                    var response = results.shipping_rates;

                    showShippingEstimateSuccess(response);

                }
            });

            new Shopify.CountryProvinceSelector('address_country', 'address_province', {
                hideElement: 'address_province_container'
            });

        });

    }());

    var fenixPDP = (function () {

        if (typeof productJSONFenix === 'undefined') { return; }

        var __FenixProductData_ProductPage = [];
        var __FenixProductVariants_ProductPage = [];
        var __fenixcallbackBulb = true;
        var __fenixFirstON = false;

        function isValidUSZip(sZip) {
            return /^\d{5}(-\d{4})?$/.test(sZip);
        }

        $.event.special.inputchange = {
            setup: function () {
                var self = this,
                    val;
                $.data(this, 'timer', window.setInterval(function () {
                    val = self.value;
                    if ($.data(self, 'cache') != val) {
                        $.data(self, 'cache', val);
                        $(self).trigger('inputchange');
                    }
                }, 20));
            },
            teardown: function () {
                window.clearInterval($.data(this, 'timer'));
            },
            add: function () {
                $.data(this, 'cache', this.value);
            }
        };

        // foreach loop for products in page.
        $(productJSONFenix).each(function (index2, value2) {
            __FenixProductData_ProductPage[value2.id] = value2;
            if (value2.variants !== undefined && value2.variants !== null && value2.variants !== '') {
                $(value2.variants).each(function (index3, value3) {
                    __FenixProductVariants_ProductPage[value3.id] = value3; // set global product variants
                });
            }
        });

        setTimeout(function () {
            ___updateFenixDelhiveryDates(productJSONFenix, $("select[name='id']").val() || $("input[name='Size']:checked").val() || $("input[name='Color']:checked").val());
        }, 300);

        $("form").each(function (index, form) {
            $(productJSONFenix).each(function (index2, value2) {
                const formaction = $(form).attr("action");
                if (formaction == "/cart/add" && productJSONFenix.variants.length > 0) {
                    $(form).find('input').on('inputchange', function (event) {
                        if (__fenixcallbackBulb === true && __fenixFirstON === true) {
                            __fenixcallbackBulb = false;
                            __findFormidProductPage();
                        }
                    });
                    $(form).find('input').on('change', function (event) {
                        if (__fenixcallbackBulb === true && __fenixFirstON === true) {
                            __fenixcallbackBulb = false;
                            __findFormidProductPage();
                        }
                    });
                    $(form).find('select').on('change', function (event) {
                        if (__fenixcallbackBulb === true && __fenixFirstON === true) {
                            __fenixcallbackBulb = false;
                            __findFormidProductPage();
                        }
                    });
                    $(form).on('change', function (event) {
                        if (__fenixcallbackBulb === true && __fenixFirstON === true) {
                            __fenixcallbackBulb = false;
                            __findFormidProductPage();
                        }
                    });
                }
            });
        });

        setTimeout(function () {
            __fenixcallbackBulb = true;
            __fenixFirstON = true;
        }, 1000);

        // pass product id //
        function ___updateFenixDelhiveryDates(productid, variant, testzip) {
            $('.fenix-fixd-delivery').css('display', 'block');
            $(".fenix-fixd-delivery").insertAfter($(".product__meta:visible").find(".product__labels"));
            FenixDeliveryEstimates({
                zipcode: $("#zip-inpt").val() || 0,
                page: "product",
                product: productJSONFenix,
                productVariant: __FenixProductVariants_ProductPage[variant] || productJSONFenix.variants[0],
                locationid: 'manual',
                shop: "noemie-1.myshopify.com",
                template: "product",
                shippingOptions: {
                    showAll: true,
                    defaultRule: 'fastest'
                },
                fenixMessageStyles: {
                    fontSize: '16px',
                    messageHighlightColor: '#333',
                    changeZipTextColor: '#333',
                }
            });

            $('#fenix-toggle-zip').on('click', function () {
                $(this).hide();
                $("#fenix-zip").show();
            });
            // Stop propogation in CDN file.
            $('#zip-inpt').on('keyup', function (event) {
                var testzip = $('#zip-inpt').val();
                if (event.which === 13 || event.keyCode === 13) {
                    if (isValidUSZip(testzip)) {
                        __findFormidProductPage(testzip);
                    }
                }
            });
            $('#check-zip').on('click', function () {
                var testzip = $('#zip-inpt').val();
                if (isValidUSZip(testzip)) {
                    __findFormidProductPage(testzip);
                }
            });
        }

        function __findFormidProductPage(testzip) {
            // console.log(testzip);
            var fromserialize = decodeURI($("form[action='/cart/add']").serialize());
            // console.log(fromserialize);
            var variantid = "";
            var ispresent = false;
            $.each(productJSONFenix.variants, function (index, value) {
                ispresent = false;

                $.each(value.options, function (indexoptions, valueoptions) {
                    if (fromserialize.indexOf(valueoptions) !== -1) {
                        ispresent = true;
                    } else {
                        ispresent = false;
                    }
                });
                if (ispresent) {
                    variantid = value.id;
                }
            });

            setTimeout(function () {
                ___updateFenixDelhiveryDates(productJSONFenix, $("select[name='id']").val() || $("input[name='Size']:checked").val() || $("input[name='Color']:checked").val() || variantid, testzip);
                __fenixcallbackBulb = true;
            }, 20);
            return false;
        }

        $(document).ajaxComplete(function (event, xhr, settings) {
            if (settings.url == "https://delest-api.fenixcommerce.com/fenixdelest/api/v2/deliveryestimates") {
                if (xhr.responseJSON != undefined &&
                    xhr.responseJSON != null &&
                    xhr.responseJSON.length > 0) {
                    $(".fenix-fixd-delivery").show();
                    $(".fenix-fixd-delivery-empty").hide();
                } else {
                    $(".fenix-fixd-delivery").hide();
                }
            }
        });

    }());

    $(window).trigger('resize');
    refreshSmooth.init();

});
