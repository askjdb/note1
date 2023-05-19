const body = document.querySelector('body')
const x = "电报群@fulidashu1024"

for (let i = 1; i <= 11; i++) {
    const img = document.createElement('img');
    const br = document.createElement('br')
    img.setAttribute('data-src', `./${x}(${i}).JPG`)
    body.appendChild(img)
    body.appendChild(br)
}
const images = document.querySelectorAll('img')

// //方法一：
// function y(callback) {
//     let a = true;
//     return () => {
//         if (a) {
//             callback()
//         }
//         setTimeout(() => {
//             a = true;
//         }, 1000)
//         a = false
//     }

// }


// const call = () => {
//     images.forEach((image) => {
//         if (image.getAttribute('src') === null) {
//             if (image.getBoundingClientRect().top - window.innerHeight <= 0) {
//                 const data_src = image.getAttribute('data-src')
//                 image.setAttribute('src', data_src)
//             }
//         }
//     })
//     const nima = Array.from(images)
//     if (nima.every((image) => {
//         return image.getAttribute('src') !== null
//     })) {
//         window.onscroll = null;
//     }
// }

// window.onscroll = y(call)







//方法二:
const callback=(e)=>{
    e.forEach((x)=>{
        if(x.isIntersecting){
           const image=x.target;
           const data_src=image.getAttribute('data-src')
           image.setAttribute('src',data_src)
           observer.unobserve(image)
        }
    })
}
const observer=new IntersectionObserver(callback)
images.forEach((image)=>{
    observer.observe(image)
})