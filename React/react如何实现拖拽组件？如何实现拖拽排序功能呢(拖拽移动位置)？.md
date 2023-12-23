# react如何实现拖拽组件？如何实现拖拽排序功能呢(拖拽移动位置)？

## 一、封装拖拽组件（pc端），包裹住组件即可实现组件的拖拽功能。

首先实现拖拽必须定义定位为固定定位，我们在组件中定义一个盒子，设置为固定定位，并且设置top值以及left值，这两个由于是变化的因此我们需要定义state值从而拖过拖拽改变该值。

拖拽需要三个事件，鼠标按下事件 鼠标抬起事件 以及鼠标移动事件

在定义鼠标按下事件时(MouseDown)我们需要将它的x,y鼠标坐标改为我们的当前鼠标的坐标位置-元素位于我们页面的xy坐标位置，这样就可以获取我们鼠标在元素中的x,y坐标位置。

移动时需要定义移动鼠标方法(onMouseMove)，定义它的位置为当前坐标位置-在页面的坐标位置，这样减去偏移量可以获取到我们移动到的位置。

最后鼠标抬起以后设置为不进行拖拽。

```jsx
<div style={{
              position: 'absolute',
              top: position.y,
              left: position.x,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
       onMouseDown={handleMouseDown}
       onMouseMove={handleMouseMove}
       onMouseUp={handleMouseUp}>
       {children}
</div>
```

```jsx
const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
 
    const handleMouseDown = (event) => {
        event.preventDefault();
        setIsDragging(true);
        setOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };
 
    const handleMouseMove = (event) => {
        if (isDragging) {
            setPosition({
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            });
        }
    };
 
    const handleMouseUp = () => {
        setIsDragging(false);
    };
```

使用

```jsx
 <DraggableBox key={item.id}>
        <div key={index} className="wish_additem">
              <img src={item.img} alt="" />
               <span>{item.text}</span>
        </div>
 </DraggableBox>
```

移动端实现方式：

思路一样，只是使用到的是移动端的拖拽方法

```jsx
const DraggableComponent = ({ children }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
 
    const handleTouchStart = (event) => {
        setIsDragging(true);
        setTouchStartPos({
            x: event.touches[0].clientX - position.x,
            y: event.touches[0].clientY - position.y,
        });
    };
 
    const handleTouchMove = (event) => {
        if (!isDragging) return;
        const touchX = event.touches[0].clientX - touchStartPos.x;
        const touchY = event.touches[0].clientY - touchStartPos.y;
        setPosition({ x: touchX, y: touchY });
    };
 
    const handleTouchEnd = () => {
        setIsDragging(false);
    };
 
    return (
        <div
            style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                touchAction: 'none', // Disable default touch behavior (e.g., scrolling)
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {children}
        </div>
    );
};
```

包裹住需要拖拽的盒子

```jsx
<DraggableBoxMobile key={item.id}>
     <div key={index} className="wish_additem">
           <img src={item.img} alt="" />
           <span>{item.text}</span>
     </div>
</DraggableBoxMobile>
```

### 二、实现拖拽换位，拖到某个元素的上下位置

````jsx
 const [listItems, setListItems] = useState([
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
        { id: 4, text: 'Item 4' },
        { id: 5, text: 'Item 5' },
    ]);
    const [draggedItem, setDraggedItem] = useState(null);
 
    const handleDragStart = (event, index) => {
        setDraggedItem(listItems[index]);
        event.dataTransfer.effectAllowed = 'move';
        // Needed for Firefox to enable dragging
        event.dataTransfer.setData('text/plain', '');
    };
 
    const handleDragEnter = (index) => {
        if (!draggedItem) return;
        if (draggedItem.id === listItems[index].id) return;
 
        const newList = [...listItems];
        newList.splice(index, 0, newList.splice(listItems.indexOf(draggedItem), 1)[0]);
        setListItems(newList);
    };
 
    const handleDragEnd = () => {
        setDraggedItem(null);
    };
````

````jsx
<div>
            <h2>Draggable List</h2>
            <ul>
                {listItems.map((item, index) => (
                    <li
                        style={{
                            background: 'skyblue', margin: '10px 0px', width: '150px', height: '35px', lineHeight: '35px', textAlign: 'center'
                        }}
                        key={item.id}
                        draggable
                        onDragStart={(event) => handleDragStart(event, index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                    >
                        {item.text}
                    </li>
                ))}
            </ul>
        </div >
````

