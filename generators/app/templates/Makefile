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
	bash ./bin/run_server.sh
