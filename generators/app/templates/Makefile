ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
.SILENT: install_virtualenv2


install_virtualenv2:
	( \
		virtualenv .virtualenv/p2;\
		chmod +x .virtualenv/p2/bin/activate;\
		rm ./ap2 || true;\
		ln -s .virtualenv/p2/bin/activate ap2 || true;\
		bash ./bin/pip_install.sh;\
	)

run:
	env NODE_ENV=dev bash ./bin/run_server.sh


run-prod:
	env NODE_ENV=prod bash ./bin/run_server.sh


build-dir:
	grunt build-deploy
	rm -fr ./__build__ || true
	rsync -rv --include 'client/' --include '*.min.*' --include '*.png' --include='*.jpg' --include='*.gif' --exclude '*' ./ ./__build__
	rsync -rv --include 'views/' --include '*.html' --exclude '*' ./ ./__build__
	rsync -av --exclude='*.js' --exclude='*.json' --exclude='*.txt' --exclude='*.md' --exclude='*.html' --exclude='*.less' --exclude='*.coffee'  --exclude='.*' --exclude='*.map' --exclude='*.scss' --exclude="LICENSE" --exclude="*.jade" --prune-empty-dirs --copy-links  ./bower_components ./__build__
	grunt compress
