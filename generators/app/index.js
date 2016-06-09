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
    ];

    this.prompt(prompts, function (props) {
        this.props = props;
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


      this.fs.copy(
          this.templatePath('gitignore'),
          this.destinationPath('.gitignore')
      );



      var files = ['jade-dev.context', 'jade-mixed.context', 'jade-prod.context',
                   'Makefile', 'requirements.python.txt', 'server.py',
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
    this.npmInstall([
                    'angular-template-inline-js',
                    'grunt-angular-template-inline-js',
                    'grunt-contrib-compress',
                    'grunt-contrib-cssmin', 'grunt-contrib-uglify',
                    'grunt-ng-annotate', 'grunt',
                    'grunt-contrib-concat', 'grunt-wiredep',
                    'grunt-contrib-less', 'grunt-less-imports',
                    'grunt-contrib-pug', 'grunt-contrib-connect',
                    'grunt-replace', 'grunt-simple-watch',
                    'grunt-angular-gettext',
                    'github:jekkos/grunt-script-link-tags'],
                {'save': true}
    );


    this.bowerInstall([
                        'angular-bootstrap', 'bootstrap',
                        'angular-ui-router', 'angular-animate',
                        'angular-gettext', 'components-font-awesome',
                        'angular-scroll', 'world-flags-sprite',
                        'angular-ui-router-title', 'angular-loading-bar'
                        ],
                {'save':true}
    );

    //this.bowerInstall(['less.js'], {'saveDev':true});

    this.spawnCommand('make', ['install_virtualenv2']);

  },

  end: function(){

    this.spawnCommand('grunt', ['wiredep']);
    this.spawnCommand('grunt', ['tags']);
    this.spawnCommand('grunt', ['pug:client']);
    this.spawnCommand('grunt', ['pug:views']);
    this.spawnCommand('grunt', ['po']);
    this.spawnCommand('grunt', ['index_app']);

    this.log(yosay(
              "Now you can run server with command " + chalk.blue('make run') + " or with "+
              chalk.yellow("grunt connect")
     ));

  }
});
