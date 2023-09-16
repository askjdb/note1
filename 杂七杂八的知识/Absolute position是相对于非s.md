# Absolute position是相对于非static

是的，`absolute` 定位是相对于最近的非 `static` 定位的祖先元素进行定位的。在 CSS 中，每个元素的默认定位方式是 `static`，而 `absolute` 定位会脱离正常的文档流，并相对于最近的非 `static` 定位的祖先元素进行定位。

如果元素的祖先元素中有一个具有非 `static` 的定位方式（例如 `relative`、`fixed` 或 `absolute`），那么 `absolute` 定位的元素将相对于这个祖先元素进行定位。如果没有非 `static` 定位的祖先元素，那么 `absolute` 定位的元素将相对于文档的初始包含块（initial containing block）进行定位。

例如，下面的 HTML 代码中，`absolute-element` 元素的定位方式被设置为 `absolute`，并将其祖先元素 `relative-container` 的定位方式设置为 `relative`：



```html
<div class="relative-container">
  <div class="absolute-element">Absolute positioned element</div>
</div>
```

对应的 CSS 代码如下：



```css
.relative-container {
  position: relative;
}

.absolute-element {
  position: absolute;
  top: 50px;
  left: 100px;
}
```

在这个例子中，`absolute-element` 元素相对于 `relative-container` 元素进行定位，而不是相对于文档的初始包含块。通过设置 `top` 和 `left` 属性，我们可以精确地指定 `absolute-element` 元素相对于 `relative-container` 元素的位置。

需要注意的是，`absolute` 定位的元素会脱离正常的文档流，可能会影响其他元素的布局。因此，在使用 `absolute` 定位时需要谨慎，并确保适当处理元素之间的重叠或布局问题。