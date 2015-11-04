++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
html:
<div id="div1" class="slider-container">
    <div class="slider-context">
    </div>
</div>
在slider-context中添加内容
js:
$("#div1").CSlider();

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
支持滚轮上下移动
支持左右方向键左右移动
参数：
        Vertical: 是否显示垂直滚动条，默认true
        Horizontal: 是否显示水平滚动条，默认true
        keyMode: 数值枚举：1:可以用方向键控制滚动条，滚动条速度由sliderSpeed控制；2：只有水平受方向键控制，每按一次移动一个容器宽度，默认为1
        sliderSpeed:滚动条移动速度，默认2