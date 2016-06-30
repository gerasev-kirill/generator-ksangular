'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var extend = require('util')._extend;


module.exports = yeoman.Base.extend({

    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the fabulous ' + chalk.red('site') + ' generator!'
        ));

        var prompts = [{
            type: 'input',
            name: 'projectName',
            message: 'Type project name '
        }, {
            type: 'confirm',
            name: 'inlineCssStyle',
            message: 'Paste site.css file into index.html?',
            default: false
        }, {
            type: 'confirm',
            name: 'useAngular',
            message: 'Use angular (y - angular, n - jQuery)? ',
            default: true
        }];
        var prompts_jQuery = [{
            type: 'input',
            name: 'siteTitle',
            message: 'Type site title'
        }];
        var prompts_angular = [{
            type: 'confirm',
            name: 'useCustomUiBootstrap',
            message: 'Use custom ui.bootstrap (y - custom with small footprint, n - default build)? ',
            default: true
        }, {
            type: 'confirm',
            name: 'useUiCms',
            message: 'Use ui.cms (you must run loopback_cms on your localhost)?',
            default: true
        }];

        this.prompt(prompts, function(props) {
            this.props = props;
            this.props.projectName = props.projectName.replace(/ /g, '_');
            if (props.useAngular) {
                this.prompt(prompts_angular, function(props) {
                    this.props = extend(this.props, props);
                    this.props.siteTitle = '';
                    done();
                }.bind(this));
            } else {
                this.prompt(prompts_jQuery, function(props) {
                    this.props = extend(this.props, props);
                    this.props.useUiCms = false;
                    done();
                }.bind(this));
            }
        }.bind(this));

    },

    writing: function() {
        mkdirp(this.props.projectName);
        this.destinationRoot(this.destinationRoot() + "/" + this.props.projectName);
        this.config.save();


        this.directory('bin', 'bin');
        this.directory('client', 'client');
        if (this.props.useAngular) {
            this.directory('client_angular', 'client');
        }
        else{
            this.fs.delete('client/*_app');
            this.fs.copy(
                this.templatePath('empty.txt'),
                this.destinationPath('client/site.min.css')
            );
            this.directory('client_jquery', 'client');
        }

        var files = ['base.jade', 'index.jade', 'sitemap.xml'];

        for (var i = 0; i < files.length; i++) {
            this.fs.copyTpl(
                this.templatePath('views/' + files[i]),
                this.destinationPath('views/' + files[i]),
                this.props
            );
        }


        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath('.gitignore')
        );


        files = ['jade-dev.context', 'jade-mixed.context', 'jade-prod.context',
            'Makefile', 'requirements.python.txt', 'server.py',
            'package.json', 'bower.json', 'Gruntfile.coffee'
        ];

        for (var i = 0; i < files.length; i++) {
            this.fs.copyTpl(
                this.templatePath(files[i]),
                this.destinationPath(files[i]),
                this.props
            );
        }
    },


    install: function() {
        var self = this,
            bower_libs = [];

        self.spawnCommand('git', ['init']);


        function bowerInstall() {
            if (self.props.useAngular) {
                bower_libs = [
                    'angular-bootstrap', 'bootstrap',
                    'angular-ui-router#0.3.x', 'angular-animate',
                    'angular-gettext', 'components-font-awesome',
                    'angular-scroll',
                    'angular-ui-router-title', 'angular-loading-bar'
                ];
                if (!self.props.useUiCms) {
                    bower_libs.push("https://github.com/gerasev-kirill/ui-flags.git");
                    bower_libs.push("https://github.com/gerasev-kirill/angular-gettext-lang-picker.git#0.3.5");
                }
                if (self.props.useCustomUiBootstrap){
                    bower_libs.push("https://github.com/gerasev-kirill/uib-custom-build.git");
                }
            } else {
                bower_libs = [
                    'bootstrap', 'components-font-awesome'
                ];
            }

            self.bowerInstall(
                bower_libs, {
                    'save': true
                },
                function() {
                    self.spawnCommand('git', ['add',
                            'bin/', 'client/', 'views/', 'Gruntfile.coffee',
                            'jade-*', 'package.json', 'requirements*', 'server.py',
                            '.gitignore', 'bower.json', 'Makefile'
                    ]);
                    self.spawnCommand('grunt', ['wiredep']);
                    self.spawnCommand('grunt', ['po']);
                    self.spawnCommand('grunt', ['build']);
                }
            );
        }


        this.npmInstall([
                'grunt@0.4.5',
                'grunt-contrib-coffee',
                'angular-template-inline-js',
                'grunt-angular-template-inline-js',
                'grunt-contrib-compress',
                'grunt-contrib-uglify',
                'grunt-ng-annotate',
                'grunt-contrib-concat',
                'grunt-wiredep',
                'grunt-contrib-less',
                'grunt-less-imports',
                'grunt-contrib-pug',
                'grunt-replace',
                'grunt-simple-watch',
                'grunt-angular-gettext',
                'github:jekkos/grunt-script-link-tags',
                'grunt-contrib-imagemin',
                'grunt-purifycss'
            ], {
                'save': true
            },
            bowerInstall
        );

        //this.bowerInstall(['less.js'], {'saveDev':true});
        this.spawnCommand('make', ['install_virtualenv2']);

    },


    end: function() {

        this.log(yosay(
            "Now you can run server with command " + chalk.blue('make run')
        ));

    }
});
