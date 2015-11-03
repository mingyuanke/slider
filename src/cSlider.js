//resize可监控div大小变化插件
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
    var clickedY = "NO";
    var clickedX = "NO";
    var pY = null;
    var pX = null;
    var phY = null;
    var phX = null;
    var sliderV = null;
    var sliderH = null;
    "use strict";
    var cSlider = {
        init: function (options) {
            return this.each(function () {
                this.options = $.extend(options, defaultOption, {});
                var self = this;
                createVertical(self);
                createHorizontal(self);
                $(self).resize(function (event) {
                    if ($(event.target).attr("class").match("slider-container")) {
                        createVertical(event.target);
                        createHorizontal(event.target)
                        refreshV(event.target);
                        refreshH(event.target);
                    }

                });
                $(self).find(".slider-context").first().resize(function (event) {
                    refreshV(self);
                    refreshH(self);
                });
                $(".V-slider").mousedown(function (event) {
                    clickedY = "YES";
                    pX = event.pageX;
                    sliderV = event.target;
                    $(self).addClass("slider-active")

                });
                $(".H-slider").mousedown(function () {
                    clickedX = "YES";
                    phY = event.pageY;
                    sliderH = event.target;
                    $(self).addClass("slider-active");

                });
                $("html").mouseup(function () {
                    clickedY = "NO";
                    clickedX = "NO";
                    phX = null;
                    pY = null;
                    sliderV = null;
                    sliderH = null;
                    $(self).removeClass("slider-active")
                }).mousemove(function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (clickedY == "YES" && sliderV != null) {
                        var may = event.pageY;
                        var max = event.pageX;
                        if (Math.abs(pX - max) > 50) {
                            clickedY = "NO";
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
                    else if (clickedX == "YES" && sliderH != null) {
                        var mouseX = event.pageX;
                        var mouseY = event.pageY;
                        if (Math.abs(phY - mouseY) > 50) {
                            clickedX = 'NO';
                            phY = null;
                            sliderH = null;
                            $(self).removeClass("slider-active");
                            return
                        }
                        phX = phX == null ? mouseX : phX;
                        var difX = mouseX - phX;
                        sliderLeft(sliderH, difX);
                        phX = mouseX;
                    }
                })
                $(self).mouseenter(function (event) {
                    $(event.currentTarget).attr("tabindex", 0);
                    $(event.currentTarget).focus();
                    $(event.currentTarget).keydown(function (event) {
                        if (event.keyCode == 37) {
                            HChange($(event.currentTarget), $(event.currentTarget).innerWidth());
                            refreshH($(event.currentTarget));
                            return false;
                        }
                        else if (event.keyCode == 39) {
                            HChange($(event.currentTarget), -$(event.currentTarget).innerWidth());
                            refreshH($(event.currentTarget));
                            return false;
                        }
                    })
                });
            })

        }
    };
    var defaultOption = {
        Vertical: true,
        Horizontal: true,
        width: 5
    };

    function createHorizontal(self) {
        var guideWayH = null;
        var HSlider = null;
        if ($(self).find(".slider-context").first().siblings(".guide-way-horizontal").length == 0) {
            guideWayH = $("<div class='guide-way-horizontal'></div>");
            guideWayH.css("height", self.options["width"] + "px");
            HSlider = $("<div class='H-slider'></div>");
            guideWayH.append(HSlider);
            $(self).append(guideWayH);
        }
        else {
            guideWayH = $(self).find('.guide-way-horizontal').first();
            HSlider = guideWayH.find('.H-slider');
        }
        var contextWidth = $(self).find(".slider-context").first().innerWidth();
        var containerWidth = $(".slider-container").innerWidth();
        if (contextWidth <= containerWidth) {
            guideWayH.css("display", "none");
            return
        }
        guideWayH.css("display", "block");
        var sliderWidth = parseInt(containerWidth * (containerWidth / contextWidth));
        sliderWidth = sliderWidth > containerWidth - 4 ? containerWidth - 4 : sliderWidth;
        HSlider.css("width", sliderWidth + "px");
        $(self).find(".slider-context").first().css("left", 0)
    }

    function createVertical(self) {
        var guideWay = null;
        var slider = null;
        if ($(self).find(".slider-context").first().siblings(".guide-way").length == 0) {
            guideWay = $("<div class='guide-way'></div>");
            guideWay.css("width", self.options["width"] + "px");
            slider = $("<div class='V-slider'></div>");
            guideWay.append(slider);
            $(self).append(guideWay);
            self.addEventListener("DOMMouseScroll", function (event) {
                event.preventDefault();
                vChange(self, -event.detail * 40);
                refreshV(self);
            });
            self.addEventListener("mousewheel", function (event) {
                event.preventDefault();
                vChange(self, event.wheelDelta);
                refreshV(self);
            });

        }
        else {
            guideWay = $(self).find('.guide-way').first();
            slider = guideWay.find(".V-slider")
        }
        var contextHeight = $(self).find(".slider-context").first().innerHeight();
        var containerHeight = $(self).innerHeight();
        var sliderHeight = parseInt(containerHeight * (containerHeight / contextHeight));
        sliderHeight = sliderHeight > containerHeight - 4 ? containerHeight - 4 : sliderHeight;
        slider.css("height", sliderHeight + 'px');
        $(self).find(".slider-context").first().css("top", 0)

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

    function refreshH(ele) {
        var contextLeft = $(ele).find(".slider-context").position().left;
        var contextWidth = $(ele).find(".slider-context").first().innerWidth();
        var containerWidth = $(ele).innerWidth();
        if (containerWidth >= contextWidth) {
            $(ele).find(".guide-way-horizontal").first().css("display", "none");
            return
        }
        $(ele).find(".guide-way-horizontal").first().css("display", "block");
        var cell = contextLeft / (contextWidth - containerWidth);
        var wayWidth = $(ele).find(".guide-way-horizontal").first().innerWidth();
        var sliderWidth = $(ele).find(".H-slider").first().innerWidth();
        var pLeft = parseInt((wayWidth - sliderWidth - 6) * cell);
        $(ele).find(".H-slider").first().css("left", -pLeft + "px")
    }

    function sliderLeft(ele, diff) {
        var primaryLeft = $(ele).position().left;
        var newLeft = primaryLeft + diff;
        newLeft = newLeft < 0 ? 0 : newLeft;
        var pv = $(ele).parent().innerWidth();
        var Sh = $(ele).innerWidth();
        newLeft = newLeft > (pv - Sh - 4) ? (pv - Sh - 4) : newLeft;
        $(ele).css("left", newLeft + "px");
        var sliderContainer = $(ele).parent().parent();
        var context = sliderContainer.find(".slider-context").first();
        var distance = -(diff / (pv - Sh - 4)) * (context.innerWidth() - pv);
        HChange(sliderContainer, distance)

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
        vChange(sliderContainer, distance)
    }

    function HChange(ele, distance) {
        var primaryLeft = $(ele).find(".slider-context").first().position().left;
        var newLeft = primaryLeft + distance;
        var contextWidth = $(ele).find(".slider-context").first().innerWidth();
        var containerWidth = $(ele).innerWidth();
        newLeft = newLeft > 0 ? 0 : newLeft;
        newLeft = (containerWidth > contextWidth) ? 0 : ((-newLeft > contextWidth - containerWidth) ? -(contextWidth - containerWidth) : newLeft);
        $(ele).find(".slider-context").first().css("left", newLeft + "px");
    }

    function vChange(ele, distance) {
        var primaryTop = $(ele).find(".slider-context").position().top;
        var newTop = primaryTop + distance;
        var contextHeight = $(ele).find(".slider-context").first().innerHeight();
        var containerHeight = $(ele).innerHeight();
        newTop = newTop > 0 ? 0 : newTop;
        newTop = (containerHeight > contextHeight) ? 0 : ((-newTop > contextHeight - containerHeight) ? -(contextHeight - containerHeight) : newTop);
        $(ele).find(".slider-context").css("top", newTop + "px");
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