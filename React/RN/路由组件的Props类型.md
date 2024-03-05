在 React Native 版本 0.73 中，使用 React Navigation 的基本模式与之前版本基本相同。以下是在 React Native 0.73 中定义路由组件 `props` 类型的常见方式：

1. **导航参数（Navigation Params）的类型：**

   ```tsx
   type RootStackParamList = {
     Home: undefined;
     Profile: { userId: string };
   };
   
   type ProfileScreenProps = {
     route: RouteProp<RootStackParamList, 'Profile'>;
   };
   ```

   或者使用 `useRoute` 钩子：

   ```tsx
   import { useRoute } from '@react-navigation/native';
   
   const ProfileScreen: React.FC = () => {
     const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
     // 使用 route.params 访问导航参数
     // ...
   };
   ```

2. **导航对象（Navigation Object）的类型：**

   ```tsx
   import { useNavigation } from '@react-navigation/native';
   
   const ProfileScreen: React.FC = () => {
     const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Profile'>>();
     // 使用 navigation 导航对象进行导航操作
     // ...
   };
   ```

3. **整体的 Props 类型：**

   ```tsx
   type ProfileScreenProps = {
     route: RouteProp<RootStackParamList, 'Profile'>;
     navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
   };
   ```

   或者结合使用 `useRoute` 和 `useNavigation` 钩子：

   ```tsx
   import { useRoute, useNavigation } from '@react-navigation/native';
   
   const ProfileScreen: React.FC = () => {
     const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
     const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Profile'>>();
     // 使用 route.params 和 navigation 导航对象
     // ...
   };
   ```

`RootStackParamList` 是一个用于定义整个应用程序路由的 TypeScript 类型。它代表了导航器的根参数列表，包含了所有可能的路由和它们可能的导航参数。

通常，你需要根据你的应用程序的路由结构，为每个路由定义一个条目，并在需要时为它们添加导航参数。以下是一个简单的例子：

```tsx
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: { screenId: number };
  Details: { itemId: string };
};
```

在这个例子中：

- `Home` 路由没有导航参数，因此 `undefined` 表示它不需要任何参数。
- `Profile` 路由有一个名为 `userId` 的导航参数，它是一个字符串。
- `Settings` 路由有一个名为 `screenId` 的导航参数，它是一个数字。
- `Details` 路由有一个名为 `itemId` 的导航参数，它是一个字符串。

你可以根据你的应用程序需求调整这些路由和参数的定义。这个类型将在整个应用程序中使用，用于定义和检查导航时的参数。在 React Navigation 中，这个类型通常用于 `StackNavigationProp` 和 `RouteProp` 的泛型参数。例如：

```tsx
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

type ProfileScreenProps = {
  route: RouteProp<RootStackParamList, 'Profile'>;
};
```

在这里，`StackNavigationProp` 和 `RouteProp` 使用 `RootStackParamList` 类型来表示导航的路由和参数的类型。







### 示例：

```ts
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  TextInputKeyPressEventData,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

/**
 * 各个路由进行路由传参的时候传递参数的类型
 */
export type RootStackParamList = {
  Home?: {} | undefined;
  Profile?: {userId: string} | undefined | {};
  Login?: undefined;
  Register?: undefined;
  Index?: undefined;
  ChatPage: {userId: string};
};
export type RootStackParamListKey = keyof RootStackParamList;

/**
 * SubmitEdit回调的Props的类型
 */
export type SubmitEditType =
  NativeSyntheticEvent<TextInputSubmitEditingEventData>;

/**
 * keyPress回调的Props的类型
 */
export type KeyPressType = NativeSyntheticEvent<TextInputKeyPressEventData>;

/**
 * 路由组件使用需要的useNavigation的泛型
 */
export type useNavigationType<T extends RootStackParamListKey> =
  StackNavigationProp<RootStackParamList, T>;

/**
 * 路由组件使用需要的useRoute的泛型
 */
export type useRouteType<T extends RootStackParamListKey> = RouteProp<
  RootStackParamList,
  T
>;

/**
 * 用户信息类型
 */
export interface userInfo {
  userId: string;
}
/**
 * 用户的Action的类型
 */
export interface userAction {
  type: string;
  data: userInfo;
}

/**
 * state的类型
 */
export interface RootState {
  UserInfo: userInfo;
}

```

如果要调用const route = useRoute<useRouteType<"ChatPage">>();那么ChatPage的类型就不能是可选的。