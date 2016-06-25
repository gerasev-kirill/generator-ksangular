
## Установка
Для работы в ком. строке должны быть доступны git, make, python, npm, node.

```bash
npm install -g yo
npm install -g gerasev-kirill/generator-site
```

## Создание нового проекта
* Генератор дает возможность выбора между angular-ом и только jQuery+Bootstrap

```bash
yo site
```


## Запуск приложения

```bash
cd path_to_my_app/
make run
```

Если нужно запустить приложение как на deploy-сервере, то нужно сначала запустить:

```bash
cd path_to_my_app/
make build-dir
```
а затем:

```bash
make run-prod
```

Если в процессе создания приложения была выбрана опция "Use ui.cms", то при make run-prod приложение будет стучаться на сервер с cms в интернете, который указан в ./jade-prod.context


Для запуска гибридного типа(это приложение запускается в режиме prod, loopback_cms запущена на
локальной машине тоже в режиме prod) нужно выполнить:

```bash
make run-mixed
```

* Если был выбран angular, то приложение будет выглядеть так:
![angular-app](https://github.com/gerasev-kirill/generator-site/blob/master/angular-app.png)
* Если при генерировании отказались от angular, то приложение будет выглядеть так:
![angular-app](https://github.com/gerasev-kirill/generator-site/blob/master/jquery-app.png)


## Иерархия сгенерированного приложения


├── /\__build__.........папка в которую будут копироваться файлы от make build-dir <br />
├── /bin...................папка со скриптами запуска python-dev-сервера <br />
├── /client................папка с клиентскими less, jade, coffee <br />
├── /po....................папка с переводами <br />
├── /views................папка с базовыми html <br />
├── jade-*.context....переменные для grunt задач под jade <br />
└──  server.py............реализация python-dev-сервера <br />


## Дальнейшая сборка и поддержка приложения

Чтоб заменить строки в js, html файлах, собрать less в css нужно запустить в папке с проектом

```bash
grunt
```

Эта задача НЕ ТРАНСЛИРУЕТ coffee => js и jade => html !! Для этого используйте возможности
своей ide. Ide должна транслировать сама файлы, сохраняя вывод в том же месте где и исходник.

Чтобы добавить новый angular-модуль, создайте в ./client новую папку *_app. Также добавьте ее в Gruntfile.coffee.

* Пример дополнительного модуля от которого зависит index_app:

```bash
mkdir ./client/my_new_app
echo "angular.module 'MyNewApp', []" > ./client/my_new_app/module.coffee
```

содержимое Gruntfile.coffee:

```js
index_app = [
    "helpers_app",
    "my_new_app",
    "index_app"
]
```

Также нужно подправить ./client/index_app/module.coffee.
Для обособленного от index_app приложения см. пример в ./client/index_app и задачи в Gruntfile.coffee




## Cоздание новой view

```bash
yo site:views
```

Новое представление будет создано в выбранной папке ./client/*_app
