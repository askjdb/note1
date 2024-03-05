# Gitlab CI 配置文件 .gitlab-ci.yaml 详解（上）

本文档用于描述 .gitlab-ci.yml 语法，.gitlab-ci.yml 文件被用来管理项目的 runner 任务。如果想要快速的了解GitLab CI ，可查看[快速引导](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fquick_start%2FREADME.html&source=article&objectId=1376224)。 从 7.12 版本开始，GitLab CI 使用[YAML](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FYAML&source=article&objectId=1376224)文件 (.gitlab-ci.yml) 来管理项目配置。该文件存放于项目仓库的根目录，它定义该项目如何构建。

![img](https://ask.qcloudimg.com/http-save/yehe-1435389/gszswb7k4j.png)

开始构建之前YAML文件定义了一系列带有约束说明的任务。这些任务都是以任务名开始并且至少要包含`script`部分：

```yaml
job1:
  script: execute-script-for-job1

job2:
  script: execute-script-for-job2
```



上面这个例子就是一个最简单且带有两个独立任务的CI配置，每个任务分别执行不同的命令。

`script`可以直接执行系统命令(例如：./configure && make && make install)或者是直接执行脚本(test.sh)。

```yaml
     (adsbygoogle = window.adsbygoogle || []).push({}); 
```



任务是由[Runners](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Frunners%2FREADME.html&source=article&objectId=1376224)接管并且由[服务器](https://cloud.tencent.com/act/pro/promotion-cvm?from_column=20065&from=20065)中runner执行。更重要的是，每一个任务的执行过程都是独立运行的。

用下面这个例子来说明YAML语法还有更多复杂的任务：

```yaml
image: ruby:2.1
services:
  - postgres

before_script:
  - bundle install

after_script:
  - rm secrets

stages:
  - build
  - test
  - deploy

job1:
  stage: build
  script:
    - execute-script-for-job1
  only:
    - master
  tags:
    - docker
```



下面列出保留字段，这些保留字段不能被定义为`job`名称：

| 关键字        | 是否必须 | 描述                                 |
| :------------ | :------- | :----------------------------------- |
| image         | 否       | 用于docker镜像，查看docker文档       |
| services      | 否       | 用于docker服务，查看docker文档       |
| stages        | 否       | 定义构建阶段                         |
| types         | 否       | stages 的别名(已废除)                |
| before_script | 否       | 定义在每个job之前运行的命令          |
| after_script  | 否       | 定义在每个job之后运行的命令          |
| variable      | 否       | 定义构建变量                         |
| cache         | 否       | 定义一组文件列表，可在后续运行中使用 |

#### image和services

这两个关键字允许使用一个自定义的[Docker](https://cloud.tencent.com/product/tke?from_column=20065&from=20065)镜像和一系列的服务，并且可以用于整个job周期。详细配置文档请查看[a separate document](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fdocker%2FREADME.html&source=article&objectId=1376224)。

#### before_script

`before_script`用来定义所有job之前运行的命令，包括deploy(部署) jobs，但是在修复artifacts之后。它可以是一个数组或者是多行字符串。

#### after_script

> GitLab 8.7 开始引入，并且要求Gitlab Runner v1.2

`after_script`用来定义所有job之后运行的命令。它必须是一个数组或者是多行字符串

#### stages

`stages`用来定义可以被job调用的stages。stages的规范允许有灵活的多级pipelines。

stages中的元素顺序决定了对应job的执行顺序：

1. 相同stage的job可以平行执行。
2. 下一个stage的job会在前一个stage的job成功后开始执行。 接下仔细看看这个例子，它包含了3个stage：

```yaml
stages:
 - build
 - test
 - deploy
```



1. 首先，所有`build`的jobs都是并行执行的。
2. 所有`build`的jobs执行成功后，`test`的jobs才会开始并行执行。
3. 所有`test`的jobs执行成功，`deploy`的jobs才会开始并行执行。
4. 所有的`deploy`的jobs执行成功，commit才会标记为`success`
5. 任何一个前置的jobs失败了，commit会标记为`failed`并且下一个stages的jobs都不会执行。

这有两个特殊的例子值得一提：

1. 如果`.gitlab-ci.yml`中没有定义`stages`，那么job’s stages 会默认定义为 `build`，`test` 和 `deploy`。
2. 如果一个job没有指定`stage`，那么这个任务会分配到`test` stage。

#### types

> 已废除，将会在10.0中移除。用stages替代。

与stages同义

#### variables

> GitLab Runner V0.5.0. 开始引入

GItLab CI 允许在`.gitlab-ci.yml`文件中添加变量，并在job环境中起作用。因为这些配置是存储在git仓库中，所以最好是存储项目的非敏感配置，例如：

```yaml
variables:
  DATABASE_URL:"postgres://postgres@postgres/my_database"
```



这些变量可以被后续的命令和脚本使用。服务[容器](https://cloud.tencent.com/product/tke?from_column=20065&from=20065)也可以使用YAML中定义的变量，因此我们可以很好的调控服务容器。变量也可以定义成[job level](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23job-variables&source=article&objectId=1376224)。

除了用户自定义的变量外，Runner也可以定义它自己的变量。`CI_COMMIT_REG_NAME`就是一个很好的例子，它的值表示用于构建项目的分支或tag名称。除了在`.gitlab-ci.yml`中设置变量外，还有可以通过GitLab的界面上设置私有变量。

[更多关于variables](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fvariables%2FREADME.html&source=article&objectId=1376224)。

#### cache

> Gitlab Runner v0.7.0 开始引入。

`cache`用来指定需要在job之间缓存的文件或目录。只能使用该项目工作空间内的路径。

**从GitLab 9.0开始，pipelines和job就默认开启了缓存**

如果`cache`定义在jobs的作用域之外，那么它就是全局缓存，所有jobs都可以使用该缓存。

缓存`binaries`和`.config`中的所有文件：

```yaml
rspec:
  script: test
  cache:
    paths:
    - binaries/
    - .config
```



缓存git中没有被跟踪的文件：

```yaml
rspec:
  script: test
  cache:
    untracked: true
```



缓存`binaries`下没有被git跟踪的文件：

```yaml
rspec:
  script: test
  cache:
    untracked: true
    paths:
    - binaries/
```



job中优先级高于全局的。下面这个`rspec`job中将只会缓存`binaries/`下的文件：

```yaml
cache:
  paths:
  - my/files

rspec:
  script: test
  cache:
    key: rspec
    paths:
    - binaries/
```



注意，缓存是在jobs之前进行共享的。如果你不同的jobs缓存不同的文件路径，必须设置不同的**cache:key**，否则缓存内容将被重写。

缓存只是尽力而为之，所以别期望缓存会一直存在。查看更多详细内容，请查阅GitLab Runner。

##### 缓存key

> GitLab Runner v1.0.0 开始引入。

`key`指令允许我们定义缓存的作用域(亲和性)，可以是所有jobs的单个缓存，也可以是每个job，也可以是每个分支或者是任何你认为合适的地方。

它也可以让你很好的调整缓存，允许你设置不同jobs的缓存，甚至是不同分支的缓存。

`cache:key`可以使用任何的[预定义变量](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fvariables%2FREADME.html&source=article&objectId=1376224)。

默认key是默认设置的这个项目缓存，因此默认情况下，每个pipelines和jobs中可以共享一切，从GitLab 9.0开始。

**配置示例**

缓存每个job：

```yaml
cache:
  key: "$CI_JOB_NAME"
  untracked: true
```



缓存每个分支：

```yaml
cache:
  key: "$CI_COMMIT_REF_NAME"
  untracked: true
```



缓存每个job且每个分支：

```yaml
cache:
  key: "$CI_JOB_NAME/$CI_COMMIT_REF_NAME"
  untracked: true
```



缓存每个分支且每个stage：

```yaml
cache:
  key: "$CI_JOB_STAGE/$CI_COMMIT_REF_NAME"
  untracked: true
```



如果使用的[**Windows Batch**](https://cloud.tencent.com/developer/tools/blog-entry?target=http%3A%2F%2Fblog.csdn.net%2Fhitlion2008%2Farticle%2Fdetails%2F7467252&source=article&objectId=1376224)**(****windows****批处理)**来跑脚本需要用`%`替代`$`：

```yaml
cache:
  key: "%CI_JOB_STAGE%/%CI_COMMIT_REF_NAME%"
  untracked: true
```



#### Jobs

`.gitlab-ci.yml`允许指定无限量jobs。每个jobs必须有一个唯一的名字，而且不能是上面提到的关键字。job由一列参数来定义jobs的行为。

```yaml
job_name:
  script:
    - rake spec
    - coverage
  stage: test
  only:
    - master
  except:
    - develop
  tags:
    - ruby
    - postgres
  allow_failure: true
```



| Keyword       | Required | Description                                                  |
| :------------ | :------- | :----------------------------------------------------------- |
| script        | yes      | Runner执行的命令或脚本                                       |
| image         | no       | 所使用的docker镜像，查阅使用docker镜像                       |
| services      | no       | 所使用的docker服务，查阅使用docker镜像                       |
| stage         | no       | 定义job stage（默认：test）                                  |
| type          | no       | stage的别名（已弃用）                                        |
| variables     | no       | 定义job级别的变量                                            |
| only          | no       | 定义一列git分支，并为其创建job                               |
| except        | no       | 定义一列git分支，不创建job                                   |
| tags          | no       | 定义一列tags，用来指定选择哪个Runner（同时Runner也要设置tags） |
| allow_failure | no       | 允许job失败。失败的job不影响commit状态                       |
| when          | no       | 定义何时开始job。可以是on_success，on_failure，always或者manual |
| dependencies  | no       | 定义job依赖关系，这样他们就可以互相传递artifacts             |
| cache         | no       | 定义应在后续运行之间缓存的文件列表                           |
| before_script | no       | 重写一组在作业前执行的命令                                   |
| after_script  | no       | 重写一组在作业后执行的命令                                   |
| environment   | no       | 定义此作业完成部署的环境名称                                 |
| coverage      | no       | 定义给定作业的代码覆盖率设置                                 |

##### script

`script`是Runner执行的yaml脚本。举个例子：

```yaml
job:
  script: "bundle exec rspec"
```



该参数也可以用数组包含多个命令：

```yaml
job:
  script:
    - uname -a
    - bundle exec rspec
```



有时候，`script`命令需要被单引号或者是双引号包裹起来。举个例子，当命令中包含冒号(`:`)时，script需要被包在双引号中，这样YAML解析器才可以正确解析为一个字符串而不是一个键值对(key:value)。使用这些特殊字符的时候一定要注意：`:`,`{`,`}`,`[`,`]`,`,`,`&`,`*`,`#`,`?`,`|`,`-`,`<`,`>`,`=`,`!`。

##### stage

`stage`允许一组jobs进入不同的stages。jobs在相同的`stage`时会`parallel`同时进行。查阅`stages`更多的用法请查看[stages](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23stages&source=article&objectId=1376224)。

##### only and except

`only`和except是两个参数用分支策略来限制jobs构建：

1. `only`定义哪些分支和标签的git项目将会被job执行。
2. `except`定义哪些分支和标签的git项目将不会被job执行。

下面是refs策略的使用规则：

- `only`和`except`可同时使用。如果`only`和`except`在一个job配置中同时存在，则以`only`为准，跳过`except`(从下面示例中得出)。
- `only`和`except`可以使用正则表达式。
- `only`和`except`允许使用特殊的关键字：`branches`，`tags`和`triggers`。
- `only`和`except`允许使用指定仓库地址但不是forks的仓库(查看示例3)。

在下面这个例子中，`job`将只会运行以`issue-`开始的refs(分支)，然而except中设置将被跳过。

```yaml
job:
  # use regexp
  only:
    - /^issue-.*$/
  # use special keyword
  except:
    - branches
```



在下面这个例子中，`job`将只会执行有tags的refs，或者通过API触发器明确地请求构建。

```yaml
job:
  # use special keywords
  only:
    - tags
    - triggers
```



仓库路径只能用于父级仓库执行jobs，而不是forks：

```yaml
job:
  only:
    - branches@gitlab-org/gitlab-ce
  except:
    - master@gitlab-org/gitlab-ce
```



上面这个例子将会为所有的分支执行`job`，但master分支除外。

##### Job variables

在job中是可以使用关键字`variables`来定义job变量。它的运行原理跟[global-level](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23variables&source=article&objectId=1376224)是一样的，但是它允许设置特殊的job变量。

当设置了job级别的关键字`variables`，它会覆盖全局YAML和预定义中的job变量。想要关闭全局变量可以在job中设置一个空数组：

```yaml
job_name:
  variables: []
```



Job变量的优先级关系可查看[variables文档](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fvariables%2FREADME.html&source=article&objectId=1376224)说明。

##### tags

`tags`可以从允许运行此项目的所有Runners中选择特定的Runners来执行jobs。

在注册Runner的过程中，我们可以设置Runner的标签，比如`ruby`，`postgres`，`development`。

`tags`可通过tags来指定特殊的Runners来运行jobs：

```yaml
job:
  tags:
    - ruby
    - postgres
```



上面这个示例中，需要确保构建此`job`的Runner必须定义了`ruby`和`postgres`这两个tags。

#### allow_failure

`allow_failure`可以用于当你想设置一个job失败的之后并不影响后续的CI组件的时候。失败的jobs不会影响到commit状态。

当开启了允许job失败，所有的intents和purposes里的pipeline都是成功/绿色，但是也会有一个”CI build passed with warnings”信息显示在merge request或commit或job page。这被允许失败的作业使用，但是如果失败表示其他地方应采取其他（手动）步骤。

下面的这个例子中，`job1`和`job2`将会并列进行，如果`job1`失败了，它也不会影响进行中的下一个stage，因为这里有设置了`allow_failure: true`。

```yaml
job1:
  stage: test
  script:
  - execute_script_that_will_fail
  allow_failure: true

job2:
  stage: test
  script:
  - execute_script_that_will_succeed

job3:
  stage: deploy
  script:
  - deploy_to_staging
```



##### when

`when` is used to implement jobs that are run in case of failure or despite the failure.

`when`可以设置以下值：

1. `on_success` – 只有前面stages的所有工作成功时才执行。 这是默认值。
2. `on_failure` – 当前面stages中任意一个jobs失败后执行。
3. `always` – 无论前面stages中jobs状态如何都执行。
4. “manual – 手动执行(GitLab8.10增加)。更多请查看[手动操作](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23manual-actions&source=article&objectId=1376224)。

举个例子：

```yaml
stages:
- build
- cleanup_build
- test
- deploy
- cleanup

build_job:
  stage: build
  script:
  - make build

cleanup_build_job:
  stage: cleanup_build
  script:
  - cleanup build when failed
  when: on_failure

test_job:
  stage: test
  script:
  - make test

deploy_job:
  stage: deploy
  script:
  - make deploy
  when: manual

cleanup_job:
  stage: cleanup
  script:
  - cleanup after jobs
  when: always
```



脚本说明：

1. 只有当`build_job`失败的时候才会执行“cleanup_build_job` 。
2. 不管前一个job执行失败还是成功都会执行“cleanup_job` 。
3. 可以从GitLab界面中手动执行`deploy_jobs`。

##### Manual actions

> GitLab 8.10 开始引入手动执行。GitLab 9.0 开始引入手动停止。GitLab 9.2 开始引入保护手动操作。

手动操作指令是不自动执行的特殊类型的job；它们必须要人为启动。手动操作指令可以从pipeline，build，environment和deployment视图中启动。

部署到生产环境是手动操作指令的一个很好示例。

了解更多请查看[environments documentation](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fenvironments.html%23manually-deploying-to-environments&source=article&objectId=1376224)。

手动操作指令可以是可选的或阻塞。在定义了手动执行的那个stage中，手动操作指令将会停止pipline中的自动执行指令。当有人通过点击play按钮来执行需要手动执行的job时，可以来恢复pipeline的执行。

当pipeline被阻塞时，即使是pipeline是成功状态也不会merge。被阻塞的pipelines也有一个特殊的状态，叫`manual`。

手动操作指令默认是不阻塞的。如果你想要手动操作指令产生阻塞，首先需要在job的配置文件`.gitlab-ci.yml`中添加`allow_failure:false`。

可选的手动操作指令默认设置`allow_failure:true`。

可选动作的状态不影响整个pipeline的状态。

手动操作指令被认为是写操作，所以当前用户触发操作时，必须拥有操作保护分支的权限。换句话说，为了触发一个手动操作指令到pipeline中正在运行的指定分支，当前用户必须拥有推送到这分支的权限。

#### enviroment

> 注意： 

- GitLab 8.9 开始引入。
- 更多关于environment说明或者示例可以查看 [documentation about environments](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fenvironments.html&source=article&objectId=1376224)。

`environment`用于定义job部署到特殊的环境中。如果指定了`environment`，并且没有该名称下的环境，则会自动创建新环境。

在最简单的格式中，环境关键字可以定义为：

```yaml
deploy to production:
  stage: deploy
  script: git push production HEAD:master
  environment:
    name: production
```



在上面这个例子中，`deploy to profuction`job将会执行部署到`production`环境的操作。

##### environment:name

> 注意 

- GitLab 8.11 开始引入。
- 在GitLab8.11之前，环境名称定义为`environment:production`。现在推荐的做法是定义为`name`关键字。

`environment`名称可以包含：

- 英文字母(`letters`)
- 数字(`digits`)
- 空格(`spaces`)
- `-`
- `_`
- `/`
- `$`
- `{`
- `}`

常用的名称有`qa`,`staging`，和`production`，当然你可以在你的工作流中使用任意名字。

除了在`environment`关键字右边紧跟name定义方法外，也是可以为环境名称单独设定一个值。例如，用`name`关键字在`environment`下面设置：

```yaml
deploy to production:
  stage: deploy
  script: git push production HEAD:master
  environment:
    name: production
```



##### environment:url

> 注意： 

- GitLab 8.11 开始引用。
- 在GitLab 8.11之前，URL只能在GitLab’s UI中添加。现在推荐的定义方法是在`.gitlab-ci.yml`。

这是设置一个可选值，它会显示在按钮中，点击它可以带你到设置的URL页面。

在下面这个例子中，如果job都成功完成了，在environment/deployments页面中将会创建一个合并请求的按钮，它将指向`https://prod.example.com`。

```yaml
deploy to production:
  stage: deploy
  script: git push production HEAD:master
  environment:
    name: production
    url: https://prod.example.com
```



##### environment:on_stop

> 注意： 

- GitLab 8.13中开始[引入](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fgitlab.com%2Fgitlab-org%2Fgitlab-ce%2Fmerge_requests%2F6669&source=article&objectId=1376224)。
- 从GitLab 8.14开始，当在environment中定义了一个stop操作，GitLab将会在相关联的分支本删除时自动触发一个stop操作。

关闭(停止)environments可以通过在`environment`下定义关键字`on_stop`来实现。它定义了一个不同的job，用于关闭environment。

请查看`environment:action`模块中例子。

##### environment:action

> Gitlab 8.13 开始[引入](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fgitlab.com%2Fgitlab-org%2Fgitlab-ce%2Fmerge_requests%2F6669&source=article&objectId=1376224)。

`action`和`on_stop`联合使用，定义在job中，用来关闭environment。

举个例子：

```yaml
review_app:
  stage: deploy
  script: make deploy-app
  environment:
    name: review
    on_stop: stop_review_app

stop_review_app:
  stage: deploy
  script: make delete-app
  when: manual
  environment:
    name: review
    action: stop
```



上面这个例子中，我们定义了`review_app`job来部署到`review`环境中，同时我们也定义了一个新`stop_review_app`job在`on_stop`中。一旦`review_app`job执行完成并且成功，它将触发定义在`when`中的`stop_review_app`job。在这种情况下，我们设置为`manual`，需要通过GitLab’s web界面来允许[manual action](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23manual-actions&source=article&objectId=1376224)。

`stop_review_app`job需要定义下面这些关键字：

- `when` – [说明](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23when&source=article&objectId=1376224)
- `environment:name`
- `environment:action`
- `stage`需要和`review_app`相同，以便分支删除被删除的时候自动执行停止。

##### dynamic environment

> 注意： 

- GitLab 8.12开始引入，并且要求GitLab Runner 1.6 。
- GitLab 8.15开始引入`$CI_ENVIRONMENT_SLUG`。

`environment`也可以是代表配置项，其中包含`name`和`url`。这些参数可以使用任何的[CI variables](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fyaml%2FREADME.html%23variables&source=article&objectId=1376224)(包括预定义、安全变量和`.gitlab-ci.yml`中的变量)。

举个例子：

```yaml
deploy as review app:
  stage: deploy
  script: make deploy
  environment:
    name: review/$CI_COMMIT_REF_NAME
    url: https://$CI_ENVIRONMENT_SLUG.example.com/
```



当`$CI_COMMIT_REF_NAME` 被Runner设置为[environment variable](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Fvariables%2FREADME.html&source=article&objectId=1376224)时，`deply as review app`job将会被指定部署到动态创建`revuew/$CI_COMMIT_REF_NAME`的环境中。`$CI_ENVIRONMENT_SLUG`变量是基于环境名称的，最终组合成完整的URLs。在这种情况下，如果`deploy as review app`job是运行在名称为`pow`的分支下，那么可以通过URL`https"//review-pw.example.com/`来访问这个环境。

这当然意味着托管应用程序的底层服务器已经正确配置。

常见的做法是为分支创建动态环境，并讲它们作为Review Apps。可以通过[https://gitlab.com/gitlab-exa…](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fgitlab.com%2Fgitlab-examples%2Freview-apps-nginx%2F&source=article&objectId=1376224)上查看使用Review Apps的简单示例。