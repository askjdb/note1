# ReactNative安卓兼容HTTP请求

在安卓9以上正式包HTTP请求不通，可以配置一下允许它请求。
当然，还是建议优先开通HTTPS，实在不行就用下面的方法：

1. 在android\app\src\main\res下创建xml文件夹。
2. 在xml文件夹下创建network_security_config.xml文件，写上：(这步没啥用,可以删，加了反而发不出去请求)

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="true">
    <trust-anchors>
      <!-- Trust user added CAs while debuggable only -->
      <certificates src="user" />
    </trust-anchors>
  </base-config>
</network-security-config>

```

3. 在android\app\src\main\AndroidManifest.xml下，添加android:networkSecurityConfig="@xml/network_security_config"这一句。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.xxx">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:networkSecurityConfig="@xml/network_security_config" 
      android:allowBackup="false"
      android:theme="@style/AppTheme">

      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
        android:launchMode="singleTask"
        android:exported="true"
        android:windowSoftInputMode="adjustResize">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>

</manifest>

```

4. 在 `AndroidManifest.xml` 文件中添加以下内容，以允许应用请求不安全的 HTTP 接口：

```xml
<application
  android:usesCleartextTraffic="true"
  ...>
  ...
</application>

```

5. 将 `localhost` 替换为IP 4地址，因为当您在 Android 设备上运行该项目时，localhost 指向 Android 设备，而不是您的计算机，例如：将 `http://localost` 更改为 172.16.10.157(最重要的一步)

```
win + r 输入cmd
输入ipconfig
找到本机的IP4地址，将请求地址修改，
```

