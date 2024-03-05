# Gitlab CI 配置文件 .gitlab-ci.yaml 详解（下）

本文档是描述 .gitlab-ci.yml 详细用法的下半部分，上半部分的内容请[参考这里](https://cloud.tencent.com/developer/article/1376224?from_column=20421&from=20421)。.gitlab-ci.yml 文件被用来管理项目的 runner 任务。如果想要快速的了解GitLab CI ，可查看[快速引导](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fquick_start%2FREADME.html&source=article&objectId=1376222)。 该文件存放于项目仓库的根目录，它定义该项目如何构建。

![img](https://ask.qcloudimg.com/http-save/yehe-1435389/y83qen6ku7.png)

参考阅读：[Gitlab CI 配置文件 .gitlab-ci.yaml 详解（上）](https://cloud.tencent.com/developer/article/1376224?from_column=20421&from=20421)

#### artifacts

> 注意： 

- 非Windows平台从GitLab Runner v0.7.0中引入。
- Windows平台从GitLab Runner V1.0.0中引入。
- 在GItLab 9.2之前，在artifacts之后存储缓存。
- 在GItLab 9.2之后，在artifacts之前存储缓存。
- 目前并不是所有的executors都支持。
- 默认情况下，job artifacts 只正对成功的jobs收集。

`artifacts`用于指定成功后应附加到job的文件和目录的列表。只能使用项目工作间内的文件或目录路径。如果想要在不通的job之间传递artifacts，请查[阅依赖关系](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23dependencies&source=article&objectId=1376222)。以下是一些例子：

发送`binaries`和`.config`中的所有文件：

```yaml
artifacts:
  paths:
  - binaries/
  - .config
```



发送所有没有被Git跟踪的文件：

```yaml
artifacts:
  untracked: true
```



发送没有被Git跟踪和`binaries`中的所有文件：

```yaml
artifacts:
  untracked: true
  paths:
  - binaries/
```



定义一个空的[dependencies](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23dependencies&source=article&objectId=1376222)可以禁用artifact传递：

```yaml
job:
  stage: build
  script: make build
  dependencies: []
```



有时候只需要为标签为releases创建artifacts，以避免将临时构建的artifacts传递到生产[服务器](https://cloud.tencent.com/act/pro/promotion-cvm?from_column=20065&from=20065)中。

只为tags创建artifacts（`default-job`将不会创建artifacts）：

```yaml
default-job:
  script:
    - mvn test -U
  except:
    - tags

release-job:
  script:
    - mvn package -U
  artifacts:
    paths:
    - target/*.war
  only:
    - tags
```



在job成功完成后artifacts将会发送到GitLab中，同时也会在GitLab UI中提供下载。

##### artifacts:name

> GitLab 8.6 和 Runner v1.1.0 引入。

`name`允许定义创建的artifacts存档的名称。这样一来，我们可以为每个存档提供一个唯一的名称，当需要从GitLab中下载是才不会混乱。`artifacts:name`可以使用任何的[预定义变量](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fvariables%2FREADME.html&source=article&objectId=1376222)([predefined variables](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fvariables%2FREADME.html&source=article&objectId=1376222))。它的默认名称为`artifacts`，当下载是就变成了`artifacts.zip`。

------

**配置示例**

通过使用当前job的名字作为存档名称：

```yaml
job:
  artifacts:
    name: "$CI_JOB_NAME"
```



使用当前分支名称或者是tag作为存到名称，只存档没有被Git跟踪的文件：

```yaml
job:
   artifacts:
     name: "$CI_COMMIT_REF_NAME"
     untracked: true
```



使用当前job名称和当前分支名称或者是tag作为存档名称，只存档没有被Git跟踪的文件：

```yaml
job:
  artifacts:
    name: "${CI_JOB_NAME}_${CI_COMMIT_REF_NAME}"
    untracked: true
```



使用当前[stage](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23stages&source=article&objectId=1376222)和分支名称作为存档名称：

```yaml
job:
  artifacts:
    name: "${CI_JOB_STAGE}_${CI_COMMIT_REF_NAME}"
    untracked: true
```



如果是使用Windows批处理来运行yaml脚本，需要用`%`替换`$`：

```yaml
job:
  artifacts:
    name: "%CI_JOB_STAGE%_%CI_COMMIT_REF_NAME%"
    untracked: true
```



##### artifacts:when

> GitLab 8.9和GitLab Runner v1.3.0 引入。

在job失败的时候，`artifacts:when`用来上传artifacts或者忽略失败。

`artifacts:when`可以设置一下值：

1. `on_success` – 当job成功的时候上传artifacts。默认值。
2. `on_failure` – 当job失败的时候上传artifacts。
3. `always` – 不论job失败还是成功都上传artifacts。

------

**示例配置**

只在job失败的时候上传artifacts。

```yaml
job:
  artifacts:
    when: on_failure
```



##### artifacts:expire_in

> GitLab 8.9 和 GitLab Runner v1.3.0 引入。

`artifacts:expire_in`用于过期后删除邮件上传的artifacts。默认情况下，artifacts都是在GitLab中永久保存。`expire_in`允许设置设置artifacts的存储时间，从它们被上传存储到GitLab开始计算。

可以通过job页面的**Keep**来修改有效期。

过期后，artifacts会被通过一个默认每小时执行一次的定时job删除，所以在过期后无法访问artifacts。

`expire_in`是一个时间区间。下面可设置的值：

- ‘3 mins 4 sec’
- ‘2 hrs 20 min’
- ‘2h20min’
- ‘6 mos 1 day’
- ’47 yrs 6 mos and 4d’
- ‘3 weeks and 2 days’

------

**示例配置**

设置artifacts的有效期为一个星期：

```yaml
job:
  artifacts:
    expire_in: 1 week
```



#### dependencies

> GitLab 8.6 和 GitLab RUnner v1.1.1引入。

这个功能应该与`artifacts`一起使用，并允许定义在不同jobs之间传递artifacts。

注意：所有之前的stages都是默认设置通过。

如果要使用此功能，应该在上下文的job中定义`dependencies`，并且列出之前都已经通过的jobs和可下载的artifacts。你只能在当前执行的stages前定义jobs。你如果在当前stages或者后续的stages中定义了jobs，它将会报错。可以通过定义一个空数组是当前job跳过下载artifacts。

------

在接下来的例子中，我们定义两个带artifacts的jobs，`build:osx`和`build:linux`。当`test:osx`开始执行的时候，`build:osx`的artifacts就会开始下载并且会在build的stages下执行。同样的会发生在`test:linux`，从`build:linux`中下载artifacts。

因为stages的优先级关系，`deploy`job将会下载之前jobs的所有artifacts：

```yaml
build:osx:
  stage: build
  script: make build:osx
  artifacts:
    paths:
    - binaries/

build:linux:
  stage: build
  script: make build:linux
  artifacts:
    paths:
    - binaries/

test:osx:
  stage: test
  script: make test:osx
  dependencies:
  - build:osx

test:linux:
  stage: test
  script: make test:linux
  dependencies:
  - build:linux

deploy:
  stage: deploy
  script: make deploy
```



#### before_script 和 after_script

它可能会覆盖全局定义的`before_script`和`after_script`：

```yaml
before_script:
- global before script

job:
  before_script:
  - execute this instead of global before script
  script:
  - my command
  after_script:
  - execute this after my script
```



#### coverage

> 注意：GitLab 8.17 中 [引入](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fgitlab.com%2Fgitlab-org%2Fgitlab-ce%2Fmerge_requests%2F7447&source=article&objectId=1376222)。

`coverage`允许你配置代码覆盖率将会从该job中提取输出。

在这里正则表达式是唯一有效的值。因此，字符串的前后必须使用`/`包含来表明一个正确的正则表达式规则。特殊字符串需要转义。

一个简单的例子：

```yaml
job1:
  coverage: '/Code coverage: \d+\.\d+/'
```



### Git Strategy

> GitLab 8.9中以试验性功能引入。将来的版本中可能改变或完全移除。`GIT_STRATEGY`要求GitLab Runner v1.7+。

你可以通过设置`GIT_STRATEGY`用于获取最新的代码，可以再全局`variables`或者是在单个job的`variables`模块中设置。如果没有设置，将从项目中使用默认值。

可以设置的值有：`clone`，`fetch`，和`none`。

`clone`是最慢的选项。它会从头开始克隆整个仓库，包含每一个job，以确保项目工作区是最原始的。

```yaml
variables:
  GIT_STRATEGY: clone
```



当它重新使用项目工作区是，`fetch`是更快（如果不存在则返回克隆）。`git clean`用于撤销上一个job做的任何改变，`git fetch`用于获取上一个job到现在的的commit。

```yaml
variables:
  GIT_STRATEGY: fetch
```



`none`也是重新使用项目工作区，但是它会跳过所有的Git操作（包括GitLab Runner前的克隆脚本，如果存在的话）。它主要用在操作job的artifacts（例如：`deploy`）。Git数据仓库肯定是存在的，但是他肯定不是最新的，所以你只能依赖于从项目工作区的缓存或者是artifacts带来的文件。

```yaml
variables:
  GIT_STRATEGY: none
```



### Git Checout

> GitLab Runner 9.3 引入。

当`GIT_STRATEGY`设置为`clone`或`fetch`时，可以使用`GIT_CHECKOUT`变量来指定是否应该运行`git checkout`。如果没有指定，它默认为true。就像`GIT_STRATEGY`一样，它可以设置在全局`variables`或者是单个job的`variables`中设置。

如果设置为`false`，Runner就会：

- `fetch` – 更新仓库并在当前版本中保留工作副本，
- `clone` – 克隆仓库并在默认分支中保留工作副本。

Having this setting set to `true` will mean that for both `clone` and `fetch` strategies the Runner will checkout the working copy to a revision related to the CI pipeline:

【如果设置这个为`true`将意味着`clone`和`fetch`策略都会让Runner执行项目工作区更新到最新：】

```yaml
variables:
  GIT_STRATEGY: clone
  GIT_CHECKOUT: false
script:
  - git checkout master
  - git merge $CI_BUILD_REF_NAME
```



### Git Submodule Strategy

> 需要GitLab Runner v1.10+。

`GIT_SUBMODULE_STRATEGY`变量用于在构建之前拉取代码时，Git子模块是否或者如何被引入。就像`GIT_STRATEGY`一样，它可在全局`variables`或者是单个job的`variables`模块中设置。

它的可用值有：`none`，`normal`和`recursive`：

- `none`意味着在拉取项目代码时，子模块将不会被引入。这个是默认值，与v1.10之前相同的。
- `normal`意味着在只有顶级子模块会被引入。它相当于：

```yaml
git submodule sync
git submodule update --init
```



`recursive`意味着所有的子模块（包括子模块的子模块）都会被引入，他相当于：

```yaml
git submodule sync --recursive
git submodule update --init --recursive
```



注意：如果想要此功能正常工作，子模块必须配置（在`.gitmodules`）下面中任意一个：

- 可访问的公共仓库http(s)地址，
- 在同一个GitLab服务器上有一个可访问到另外的仓库的真实地址。更多查看[Git 子模块文档](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fgit_submodules.html&source=article&objectId=1376222)。

### Job stages attempts

> GitLab引入，要求GItLab Runner v1.9+。

正在执行的job将会按照你设置尝试次数依次执行下面的stages：

| 变量                       | 描述                    |
| :------------------------- | :---------------------- |
| GET_SOURCES_ATTEMPTS       | 获取job源的尝试次数     |
| ARTIFACT_DOWNLOAD_ATTEMPTS | 下载artifacts的尝试次数 |
| RESTORE_CACHE_ATTEMPTS     | 重建缓存的尝试次数      |

默认是一次尝试。

例如：

```yaml
variables:
  GET_SOURCES_ATTEMPTS: 3
```



你可以在全局`variables`模块中设置，也可以在单个job的`variables`模块中设置。

### Shallow cloning

> GitLab 8.9 以实验性功能引入。在将来的版本中有可能改变或者完全移除。

你可以通过`GIT_DEPTH`来指定抓取或克隆的深度。它可浅层的克隆仓库，这可以显著加速具有大量提交和旧的大型二进制文件的仓库的克隆。这个设置的值会传递给`git fetch`和`git clone`。

> 注意：如果设置depth=1，并且有一个jobs队列或者是重试jobs，则jobs可能会失败。

由于Git抓取和克隆是基于一个REF，例如分支的名称，所以Runner不能指定克隆一个commit SHA。如果队列中有多个jobs，或者您正在重试旧的job，则需要测试的提交应该在克隆的Git历史记录中存在。设置`GIT_DEPTH`太小的值可能会导致无法运行哪些旧的commits。在job日志中可以查看`unresolved reference`。你应该考虑设置`GIT_DEPTH`为一个更大的值。

当`GIT_DEPTH`只设置了部分存在的记录时，哪些依赖于`git describe`的jobs也许不能正确的工作。

只抓取或克隆最后的3次commits：

```yaml
variables:
  GIT_DEPTH: "3"
```



### Hidden keys

> GitLab 8.6 和 GitLab Runner v1.1.1引入。

Key 是以`.`开始的，GitLab CI 将不会处理它。你可以使用这个功能来忽略jobs，或者用[Special YAML features ](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23special-yaml-features&source=article&objectId=1376222)转换隐藏键为模版。

在下面这个例子中，`.key_name`将会被忽略：

```yaml
.key_name:
  script:
    - rake spec
```



Hidden keys 可以是像普通CI jobs一样的哈希值，但你也可以利用special YAMLfeatures来使用不同类型的结构。

### Special YAML features

使用special YAML features 像anchors(`&`)，aliases(`*`)和map merging(`<<`)，这将使您可以大大降低`.gitlab-ci.yml`的复杂性。查看更多[YAML features](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Flearnxinyminutes.com%2Fdocs%2Fyaml%2F&source=article&objectId=1376222)。

#### Anchors

> GitLab 8.6 和 GitLab Runner v1.1.1引入。

YAML有个方便的功能称为”锚”,它可以让你轻松的在文档中内容。Anchors可用于/继承属性，并且是使用[hidden keys](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23hidden-keys&source=article&objectId=1376222)来提供模版的完美示例。

下面这个例子使用了anchors和map merging。它将会创建两个jobs，`test1`和`test2`，该jobs将集成`.job_template`的参数，每个job都自定义脚本：

```yaml
.job_template: &job_definition  # Hidden key that defines an anchor named 'job_definition'
  image: ruby:2.1
  services:
    - postgres
    - redis

test1:
  <<: *job_definition           # Merge the contents of the 'job_definition' alias
  script:
    - test1 project

test2:
  <<: *job_definition           # Merge the contents of the 'job_definition' alias
  script:
    - test2 project
```



`&`在anchor的名称(`job_definition`)前设置，`<<`表示”merge the given hash into the current one”，`*`包括命名的anchor(`job_definition`)。扩展版本如下：

```yaml
.job_template:
  image: ruby:2.1
  services:
    - postgres
    - redis

test1:
  image: ruby:2.1
  services:
    - postgres
    - redis
  script:
    - test1 project

test2:
  image: ruby:2.1
  services:
    - postgres
    - redis
  script:
    - test2 project
```



让我们来看另外一个例子。这一次我们将用anchors来定义两个服务。两个服务会创建两个job，`test:postgres`和`test:mysql`，他们会在`.job_template`中共享定义的`script`指令，以及分别在`.postgres_services`和`.mysql_services`中定义的`service`指令：

```yaml
.job_template: &job_definition
  script:
    - test project

.postgres_services:
  services: &postgres_definition
    - postgres
    - ruby

.mysql_services:
  services: &mysql_definition
    - mysql
    - ruby

test:postgres:
  <<: *job_definition
  services: *postgres_definition

test:mysql:
  <<: *job_definition
  services: *mysql_definition
```



扩展版本如下：

```yaml
.job_template:
  script:
    - test project

.postgres_services:
  services:
    - postgres
    - ruby

.mysql_services:
  services:
    - mysql
    - ruby

test:postgres:
  script:
    - test project
  services:
    - postgres
    - ruby

test:mysql:
  script:
    - test project
  services:
    - mysql
    - ruby
```



你可以看到hidden keys被方便的用作模版。

### Triggers

Triggers 可用于强制使用API调用重建特定分支，tag或commits。[在triggers文档中查看更多。](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Ftriggers%2FREADME.html&source=article&objectId=1376222)

### pages

pages是一个特殊的job，用于将静态的内容上传到GitLab，可用于为您的网站提供服务。它有特殊的语法，因此必须满足以下两个要求：

1. 任何静态内容必须放在`public/`目录下
2. `artifacts`必须定义在`public/`目录下

下面的这个例子是将所有文件从项目根目录移动到`public/`目录。`.public`工作流是`cp`，并且它不会循环`public/`本身。

```yaml
pages:
  stage: deploy
  script:
  - mkdir .public
  - cp -r * .public
  - mv .public public
  artifacts:
    paths:
    - public
  only:
  - master
```



更多内容请查看[GitLab Pages用户文档](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fuser%2Fproject%2Fpages%2Findex.html&source=article&objectId=1376222)。

### Validate the .gitlab-ci.yml

GitLab CI的每个实例都有一个名为Lint的嵌入式调试工具。 你可以在gitlab实例的`/ci/lint`下找到该链接。

### Skipping jobs

如果你的commit信息中包含`[ci skip]`或者`[skip ci]`，不论大小写，那么这个commit将会创建但是jobs也会跳过。

### Examples

访问[examples README](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fexamples%2FREADME.html&source=article&objectId=1376222)来查看各种语言的GitLab CI用法示例。