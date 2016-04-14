'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fabulous ' + chalk.red('ksangular') + ' generator!'
    ));

    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'Type project name'
    },
    {
        type: 'confirm',
        name: 'useCms',
        message: 'Use cms module?',
        default: true
    },
    {
        type: 'confirm',
        name: 'useL18n',
        message: 'Use multilanguage support?',
        default: true
    },
    {
        type: 'confirm',
        name: 'overrideBootstrapVars',
        message: 'Override bootstrap variables?',
        default: true
    },
    {
        type: 'confirm',
        name: 'installPythonPkgs',
        message: 'Install packages for python scripts?',
        default: false
    }
];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someAnswer;

      done();
    }.bind(this));
  },

  writing: function () {
      mkdirp(this.props.projectName);
      this.destinationRoot(this.destinationRoot()+"/"+this.props.projectName);
      this.config.save();

      this.directory('bin', 'bin');
      this.directory('client', 'client');
      this.directory('views', 'views');

      if (this.props.useL18n){
          this.directory('client_l18n', 'client');
          this.directory('views_l18n', 'views');
      }
      if (this.props.useCms){
          this.directory('client_cms', 'client');
      }

      this.fs.copyTpl(
          this.templatePath('variables.less'),
          this.destinationPath('client/variables.less'),
          this.props
      );

      this.fs.copyTpl(
          this.templatePath('base.jade'),
          this.destinationPath('views/base.jade'),
          this.props
      );
      this.fs.copy(
          this.templatePath('gitignore'),
          this.destinationPath('.gitignore')
      );


      var files = ['jade-dev.context', 'Makefile', 'requirements.python.txt', 'server.py',
                    'package.json', 'bower.json', 'Gruntfile.coffee'];

      for(var i=0; i<files.length; i++){
          this.fs.copyTpl(
              this.templatePath(files[i]),
              this.destinationPath(files[i]),
              this.props
          );
      }
  },


  install: function () {
      this.npmInstall([ 'grunt-contrib-concat', 'grunt-wiredep',
                        'grunt-contrib-less', 'grunt-less-imports',
                        'grunt-contrib-pug', 'grunt-contrib-connect',
                        'grunt-replace', 'grunt-simple-watch',
                        'github:jekkos/grunt-script-link-tags'],
                         {'saveDev': true});


      this.bowerInstall(['angular-bootstrap', 'bootstrap',
                         'angular-ui-router'],
                         {'save':true});

      this.bowerInstall(['less.js'], {'saveDev':true});

      if (this.props.useL18n){
          this.npmInstall(['grunt-angular-gettext'],
                         {'saveDev': true});
          this.bowerInstall(['angular-gettext',
                            'https://github.com/gerasev-kirill/ui-flags.git#~0.0.4',
                            'https://github.com/gerasev-kirill/angular-gettext-lang-picker.git'],
                            {'save':true});
      }

      if (this.props.installPythonPkgs){
          this.spawnCommand('make', ['install_virtualenv2']);
      }
  },

  end: function(){

      this.spawnCommand('grunt', ['wiredep']);
      if (this.props.useL18n){
          this.spawnCommand('grunt', ['po']);
      }

      if (this.props.installPythonPkgs){
          this.log(yosay(
              "Now you can run server with command " + chalk.blue('make run') + " or with "+
              chalk.yellow("grunt connect")
          ));
      }
      else{
          this.log(yosay(
              "Now you can run server with command " + chalk.yellow("grunt connect")
          ));
      }
  }
});
