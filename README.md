
## Установка
Для работы в ком. строке должны быть доступны git, python, npm, node.

```bash
npm install -g yo
npm install -g gerasev-kirill/generator-site
```

## Создание нового проекта
* Генератор дает возможность выбора между angular-ом и только jQuery+Bootstrap *

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

Если в процессе создания приложения была выбрана опция "Use ui.cms", то при make приложение
будет стучаться на сервер с cms в интернете, который указан в ./jade-prod.context


Для запуска гибридного типа(это приложение запускается в режиме prod, loopback_cms запущена на
локальной машине тоже в режиме prod) нужно выполнить:

```bash
make run-mixed
```


## Иерархия сгенерированного приложения


├── /\__build__         папка в которую будут копироваться файлы от make build-dir <br />
├── /bin                папка со скриптами запуска python-dev-сервера <br />
├── /client             папка с клиентскими less, jade, coffee <br />
├── /po                 папка с переводами <br />
├── /views              папка с базовыми html <br />
├── jade-*.context      переменные для grunt задач под jade <br />
└──  server.py           реализация python-dev-сервера <br />


## Cоздание новой view

```bash
yo site:views
```

Новое представление будет создано в выбранной папке ./client/*_app
