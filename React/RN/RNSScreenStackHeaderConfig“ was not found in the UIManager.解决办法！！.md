# RNSScreenStackHeaderConfig“ was not found in the UIManager.解决办法！！

Invariant Violation: requireNativeComponent: "RNSScreenStackHeaderConfig" was not found in the UIManager.



![img](https://img-blog.csdnimg.cn/f6efcb22dab9447d96b1dfa5ed7b25cf.png)



原因：RN项目中，开发服务器端已经使用npm i下载了某个模块，但是只有服务器端有，该模块并没有打包安装到手机中，导致手机中的App运行时“界面管理器”找不到可用的组件。
解决办法：

首先确保安装的版本

React最新版： 18.x

React-Router-DOM最新版：V6.4

React Native最新版：V0..70.6

React-Navigation最新版：V6.x

npm  i   @react-navigation/native
npm  i   react-native-screens
npm  i   react-native-safe-area-context
npm  i   @react-navigation/native-stack


删除app-debug.apk文件，然后删除真机上的调试包，关掉node窗口，

npx react-native run-android，就可以啦

底部导航的全部代码app.tsx


```tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
const Stack = createNativeStackNavigator();
 
const HomeScreen = () => {
  return (
    <View>
      <Text>首页</Text>
    </View>
  )
}
const MyScreen = () => {
  return (
    <View>
      <Text>我的</Text>
    </View>
  )
}
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Details">
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Details" component={MyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
 
});
 
export default App;
```

