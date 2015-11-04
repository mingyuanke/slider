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
    var isKeyDown = false;
    "use strict";
    var cSlider = {
        init: function (options) {
            return this.each(function () {
                this.options = $.extend(defaultOption, options, {});
                var self = this;
                if (self.options.Vertical) {
                    createVertical(self);
                }
                if (self.options.Horizontal) {
                    createHorizontal(self);
                }
                $(self).resize(function (event) {
                    if ($(event.target).attr("class").match("slider-container")) {
                        if (self.options.Vertical) {
                            createVertical(event.target);
                            refreshV(event.target);
                        }
                        if (self.options.Horizontal) {
                            createHorizontal(event.target);
                            refreshH(event.target);
                        }
                    }

                });
                $(self).find(".slider-context").first().resize(function () {
                    if (self.options.Vertical) {
                        refreshV(self);
                    }
                    if (self.options.Horizontal) {
                        refreshH(self);
                    }
                });
                $(".V-slider").mousedown(function (event) {
                    clickedY = "YES";
                    pX = event.pageX;
                    sliderV = event.target;
                    $(self).addClass("slider-active-move");
                    $(event.target).parent().addClass("guide-active")
                });
                $(".H-slider").mousedown(function (event) {
                    clickedX = "YES";
                    phY = event.pageY;
                    sliderH = event.target;
                    $(self).addClass("slider-active-move");
                    $(event.target).parent().addClass("guide-active")

                });
                $("html").mouseup(function () {
                    clickedY = "NO";
                    clickedX = "NO";
                    phX = null;
                    pY = null;
                    sliderV = null;
                    sliderH = null;
                    $(self).removeClass("slider-active-move");
                    $(self).removeClass("slider-active");
                    $(self).find(".guide-active").removeClass("guide-active");
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
                            $(self).removeClass("slider-active-move");
                            $(self).removeClass("slider-active");
                            $(self).find(".guide-active").removeClass("guide-active");
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
                });
                $(self).mouseenter(function (event) {
                    $(event.currentTarget).addClass("slider-active");
                    $(event.currentTarget).attr("tabindex", 0);
                    $(event.currentTarget).focus();
                    if (self.options.keyMode == 1) {
                        $(event.currentTarget).keydown(function (event) {
                            event.preventDefault();
                            var speed = self.options.sliderSpeed;
                            if (event.keyCode == 38) {
                                vChange($(event.currentTarget), speed);
                                refreshV($(event.currentTarget))
                            }
                            else if (event.keyCode == 40) {
                                vChange($(event.currentTarget), -speed);
                                refreshV($(event.currentTarget))
                            }
                            else if (event.keyCode == 37) {
                                HChange($(event.currentTarget), speed);
                                refreshH($(event.currentTarget));
                            }
                            else if (event.keyCode == 39) {
                                HChange($(event.currentTarget), -speed);
                                refreshH($(event.currentTarget));
                            }
                        })
                    }
                    else if (self.options.keyMode == 2) {
                        $(event.currentTarget).keydown(function (event) {
                            event.preventDefault();
                            if (isKeyDown) {
                                return
                            }
                            if (event.keyCode == 37) {
                                HChange($(event.currentTarget), $(event.currentTarget).innerWidth());
                                refreshH($(event.currentTarget));
                                isKeyDown = true
                            }
                            else if (event.keyCode == 39) {
                                HChange($(event.currentTarget), -$(event.currentTarget).innerWidth());
                                refreshH($(event.currentTarget));
                                isKeyDown = true
                            }
                        }).keyup(function () {
                            isKeyDown = false
                        })
                    }

                }).mouseleave(function () {
                    if (sliderH == null && sliderV == null) {
                        $(event.currentTarget).removeClass("slider-active");
                    }
                });
            })

        },
        changeSpeed: function (newSpeed) {
            return this.each(function () {
                if (typeof newSpeed == 'number') {
                    this.options.sliderSpeed = newSpeed;
                }
            })
        }
    };
    var defaultOption = {
        Vertical: true,
        Horizontal: true,
        width: 5,
        keyMode: 1,
        sliderSpeed: 2
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