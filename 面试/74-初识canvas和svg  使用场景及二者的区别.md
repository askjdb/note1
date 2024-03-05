# 初识canvas和svg | 使用场景及二者的区别

### canvas是什么

canvas是H5中新增的标签，官方解释说canvas是一块画布，可以在网页中绘制图像，话不多说，来个例子

```js
js复制代码<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /*
        在使用canvas时候，不可用css来定义canvas的宽度
        因为当画布缩放的同时，内部的图像也会随之缩放，这是就会出现图像失真的情况
        */
        canvas{
            background-color: #aaa;
        }
    </style>
</head>
<body>
    <canvas width="500" height="500">浏览器不支持canvas</canvas> //这就是canvas标签，当浏览器不支持canvas标签的时候就会在浏览器展示出浏览器不支持canvas这段话
    <script>
        var canvas = document.querySelector("canvas")
        //绘图环境
        var ctx = canvas.getContext("2d")
        function img(){
            //ctx.drawImage(图像对象，坐标，宽高)
            var imgObj = new Image() //new一个图像对象
            imgObj.src="./img.jpg"
            //在这里要注意，一点要在imgObj.onload内部再使用ctx.drawImage,否则会画图失败
            imgObj.onload = function (){
                ctx.drawImage(imgObj,100,100,300,300)
            }
            // ctx.drawImage(imgObj,100,100,300,300)
        }
        img()
    </script>
</body>
</html>
```

### 什么svg

svg即可缩放矢量图形，什么是矢量图形呢，也就是放大或者缩小不会失真的图形。 svg绘图时，每个图形都是以DOM节点的形式插入到页面中的，我们可以通过js来直接操作这些图形

### canvas和svg的区别

- canvas绘画出来的图形一般成为位图，也就是放大缩小的情况下会出现失真的情况，svg绘制的图形是矢量图，不存在失真的情况
- canvas绘制的图形不会出现在DOM结构中，svg绘制的会存在于DOM结构
- canvas类似于动画，每次图形的改变都是先清除原来的图形，然后把新的图形画上去，svg则是可以直接通过js来进行某些操作
- canvas依赖于分辨率，svg不依赖分辨率
- canvas最适合图像密集型的游戏，其中的许多对象会被频繁重绘，svg不适合游戏应用