# 在React Native中键入-“绑定元素‘导航’隐式具有'any‘type.ts(7031)”

不是编程新手，而是应用程序开发和响应式本机应用程序的新手。我已经找了将近四个小时来解决这个问题。我已经意识到有很多这样的问题，但这不是重复的，因为没有任何工作代码在我的上不起作用。

我遵循了[this](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Freactnative.dev%2Fdocs%2Fnavigation&source=ask&objectId=917932)教程，VS代码给了我错误。即，与.tsx屏幕文件中的文本和按钮导入相关。下面的代码总是给我一个错误：

```javascript
const HomeScreen = ({ navigation }) => {
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigation.navigate('Profile', { name: 'Jane' })
        }
     />
   );
};
```

复制

error: Binding元素‘导航’隐式具有'any‘type.ts(7031)

据我所知，这与语言中的类型相关，因为类型尚未声明，所以我不能使用代码。问题是，我遵循了教程，搜索了许多不同的网站和几个不同的教程，我一直无法让它工作。

我已经尝试了第一行的所有这些变体：

```javascript
const HomeScreen = ({ navigation.navigate ) => {
const HomeScreen = ({ navigation } : Navigator) => {
const HomeScreen = ({ navigation NavigationContainer}) => {
const HomeScreen = ({ navigation = NavigationAction}) => {
const HomeScreen = ({ }) => {
```

复制

因此，我尝试了许多不同的变体来尝试解决这个问题。老实说，我真的被卡住了，在尝试按照教程学习，但在网上找不到答案后，我真的不知道该怎么办。我确信语法有一些非常明显的错误，但作为语言的新手，我不知道如何识别它。谢谢。





#### Stack Overflow用户

发布于 2020-10-27 09:35:25

```javascript
import { StackScreenProps } from '@react-navigation/stack';

...

const HomeScreen = ({ navigation }:StackScreenProps<{Profile: any}>) => {
```

#### 

发布于 2020-07-21 02:10:29

您必须为导航声明一个类型。

```javascript
const HomeScreen = ({ navigation:: StackNavigationProp<HomeParamList> }) => {}
```

因此，在`HomeParamList`中，您可以定义导航路径。

```javascript
export type HomeParamList= {
    Home: undefined;
};
```