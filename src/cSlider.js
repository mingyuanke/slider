//resize处理div大小变化插件
(function ($, h, c) {
    var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function () {
            if (!e[f] && this[k]) {
                return false
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {w: l.width(), h: l.height()});
            if (a.length === 1) {
                g()
            }
        }, teardown: function () {
            if (!e[f] && this[k]) {
                return false
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i)
            }
        }, add: function (l) {
            if (!e[f] && this[k]) {
                return false
            }
            var n;

            function m(s, o, p) {
                var q = $(this), r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments)
            }

            if ($.isFunction(l)) {
                n = l;
                return m
            } else {
                n = l.handler;
                l.handler = m
            }
        }
    };
    function g() {
        i = h[k](function () {
            a.each(function () {
                var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger(j, [o.w = m, o.h = l])
                }
            });
            g()
        }, e[b])
    }
})(jQuery, this);

//slider
(function ($) {
    var clicked = "NO";
    var pY = null;
    var pX = null;
    var sliderV = null;
    "use strict";
    var cSlider = {
        init: function (options) {
            return this.each(function () {
                this.options = $.extend(options, defaultOption, {});
                var self = this;
                createVertical(self);
                $(self).resize(function (event) {
                    if ($(event.target).attr("class").match("slider-container")) {
                        var $ele = $(event.target);
                    }
                    else if ($(event.target).attr("class").match("slider-context")) {
                        var $ele = $(event.target).parent();
                    }
                    var contextHeight = $ele.find(".slider-context").first().innerHeight();
                    var containerHeight = $ele.innerHeight();
                    console.log($ele);
                    var contextTop = $ele.find(".slider-context").first().position().top;
                    if (contextTop < containerHeight - contextHeight && contextHeight >= containerHeight) {
                        $ele.find(".slider-context").first().css("top", (containerHeight - contextHeight) + "px")
                    }
                    if (containerHeight > contextHeight) {
                        $ele.find(".slider-context").first().css("top", 0)
                    }
                    var slider = $ele.find(".V-slider").first();
                    var sliderHeight = parseInt(containerHeight * (containerHeight / contextHeight) - 4);
                    sliderHeight = sliderHeight > contextHeight ? contextHeight : sliderHeight;
                    slider.css("height", sliderHeight + 'px');
                    refreshV(self)
                });
                $(self).find(".slider-context").first().resize(function (event) {
                    if (!$(event.target).attr("class").match("slider-context")) {
                        return
                    }
                    var contextHeight = $(event.target).innerHeight();
                    var containerHeight = $(event.target).parent().innerHeight();
                    var contextTop = $(event.target).position().top;
                    if (contextTop < containerHeight - contextHeight && contextHeight >= containerHeight) {
                        $(event.target).css("top", (containerHeight - contextHeight) + "px")
                    }
                    if (containerHeight > contextHeight) {
                        $(event.target).css("top", 0)
                    }
                    var slider = $(event.target).parent().find(".V-slider").first();
                    var sliderHeight = parseInt(containerHeight * (containerHeight / contextHeight) - 4);
                    sliderHeight = sliderHeight > contextHeight ? contextHeight : sliderHeight;
                    slider.css("height", sliderHeight + 'px');
                    refreshV(self)
                });
            })

        },
        test: function () {
            return this.each(function () {
                console.log(this.options)
            })
        }
    };
    var defaultOption = {
        Vertical: true,
        Horizontal: true,
        width: 5
    };

    function createVertical(self) {
        var guideWay = $("<div class='guide-way'></div>");
        guideWay.css("width", self.options["width"] + "px");
        var slider = $("<div class='V-slider'></div>");
        var contextHeight = $(self).find(".slider-context").first().innerHeight();
        var containerHeight = $(".slider-container").innerHeight();
        var sliderHeight = parseInt(containerHeight * (containerHeight / contextHeight));
        sliderHeight = sliderHeight > contextHeight ? contextHeight : sliderHeight;
        slider.css("height", sliderHeight + 'px');
        guideWay.append(slider);
        $(self).append(guideWay);
        self.addEventListener("DOMMouseScroll", function (event) {
            event.preventDefault();
            vChange(self, -event.detail * 40)
        });
        self.addEventListener("mousewheel", function (event) {
            event.preventDefault();
            vChange(self, event.wheelDelta)
        });
        $(".V-slider").mousedown(function (event) {
            clicked = "YES";
            pX = event.pageX;
            sliderV = event.target;
            $(self).addClass("slider-active")

        });
        $("body").mouseup(function () {
            clicked = "NO";
            pY = null;
            sliderV = null;
            $(self).removeClass("slider-active")
        });
        $('body').mousemove(function (event) {
            if (clicked == "YES" && sliderV != null) {
                event.preventDefault();
                event.stopPropagation();
                var may = event.pageY;
                var max = event.pageX;
                if (Math.abs(pX - max) > 50) {
                    clicked = "NO";
                    pX = null;
                    sliderV = null;
                    $(self).removeClass("slider-active");
                    return
                }
                pY = pY == null ? may : pY;
                var difY = may - pY;
                sliderTop(sliderV, difY);
                pY = may;
            }
        })
    }

    function refreshV(ele) {
        var contextTop = $(ele).find(".slider-context").position().top;
        var contextHeight = $(ele).find(".slider-context").first().innerHeight();
        var containerHeight = $(ele).innerHeight();
        if (containerHeight >= contextHeight) {
            $(ele).find(".guide-way").first().css("display", "none");
            return
        }
        $(ele).find(".guide-way").first().css("display", "block");
        var cell = contextTop / (contextHeight - containerHeight);
        var wayHeight = $(ele).find(".guide-way").first().innerHeight();
        var sliderHeight = $(ele).find(".V-slider").first().innerHeight();
        var pTop = parseInt((wayHeight - sliderHeight - 6) * cell);
        $(ele).find(".V-slider").first().css("top", -pTop + "px")
    }

    function sliderTop(ele, diff) {
        var primaryTop = $(ele).position().top;
        var newTop = primaryTop + diff;
        newTop = newTop < 0 ? 0 : newTop;
        var pv = $(ele).parent().innerHeight();
        var Sh = $(ele).innerHeight();
        newTop = newTop > (pv - Sh - 6) ? (pv - Sh - 6) : newTop;
        $(ele).css("top", newTop + "px");
        var sliderContainer = $(ele).parent().parent();
        var context = sliderContainer.find(".slider-context").first();
        var distance = -(diff / (pv - Sh - 6)) * (context.innerHeight() - pv);
        distance = parseInt(distance);
        vChange(sliderContainer, distance)

    }

    function vChange(ele, distance) {
        var primaryTop = $(ele).find(".slider-context").position().top;
        var newTop = primaryTop + distance;
        var contextHeight = $(ele).find(".slider-context").innerHeight();
        var containerHeight = $(ele).innerHeight();
        newTop = newTop > 0 ? 0 : newTop;
        newTop = (containerHeight > contextHeight) ? 0 : ((-newTop > contextHeight - containerHeight) ? -(contextHeight - containerHeight) : newTop);
        $(ele).find(".slider-context").css("top", newTop + "px")
        refreshV(ele);
    }

    $.fn.CSlider = function (method) {
        if (cSlider[method]) {
            return cSlider[method].apply(this, Array.prototype.slice.call(arguments, 1))
        }
        else if (typeof method == "object" || !method) {
            return cSlider['init'].apply(this, arguments)
        }
        else {
            $.error("Method:" + method + "dose not exit on JQuery.CSlider")
        }
    }
})(jQuery);