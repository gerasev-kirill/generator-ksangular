'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = yeoman.Base.extend({

    prompting: function () {
        //
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the neat ' + chalk.red('generator-site') + ' generator!\n'+
            "Let's create some " + chalk.yellow('view ') + "for our app!"
        ));

        var prompts = [
        {
            type: 'input',
            name: 'appName',
            message: 'Type folder name of app inside ./client (ex.: my_fancy_app): ',
            default: 'index_app'
        },
        {
            type: 'input',
            name: 'viewName',
            message: 'Type view name (ex.: Articles): '
        },
        {
            type: 'input',
            name: 'viewsType',
            message: 'Views type [l - list, d - object details view, e - edit view, a - add view], empty for single (ex.: lea): ',
            default: ''
        },
        {
            type: 'input',
            name: 'inheritController',
            message: 'Inherit controller (leave empty if not): ',
            default: ''
        },
        {
            type: 'input',
            name: 'uiRouterPrefix',
            message: 'Ui router prefix (ex.: app ) : ',
            default: 'app'
        }
        ];

        this.prompt(prompts, function (props) {
            var dirname, stat, content;
            var line, moduleName;
            this.props = props;
            dirname = this.destinationRoot()+'/client/'+this.props.appName;


            while (true) {
                stat = fs.existsSync(dirname+'/module.coffee');
                if (stat){
                    content = fs.readFileSync(dirname+'/module.coffee', 'utf-8');
                    break;
                }
                dirname = path.dirname(dirname);
                if (dirname == '/') break;
            }
            if (!content){
                this.log(yosay(chalk.red(
                    "Opps! Cant find module.coffee file=("
                )));
                process.exit(1);
            }
            content = content.split('\n')
            for(var i in content){
                line = content[i];
                if (line.indexOf('angular.module')==0){
                    line = line.replace('angular.module','').split(',');
                    moduleName = line[0];
                    moduleName = moduleName.replace(/'/g,'').replace(/"/g,'').replace(/ /g,'');
                    break;
                }
            }
            if (!moduleName){
                this.log(yosay(chalk.red(
                    "Opps! Cant find angular app in module.coffee file=("
                )));
                process.exit(1);
            }

            var name = this.props.viewName;
            this.props.viewNameLowerCase = name[0].toLowerCase() + name.slice(1);
            this.props.moduleName = moduleName;

            // To access props later use this.props.someAnswer;

            done();
        }.bind(this));
    },

    writing: function () {
        mkdirp('./client/'+this.props.appName+"/"+this.props.viewNameLowerCase);
        this.destinationRoot(this.destinationRoot()+'/client/'+this.props.appName+"/"+this.props.viewNameLowerCase);
        console.log('00000000000000');
        this.fs.copyTpl(
            this.templatePath('views.coffee'),
            this.destinationPath('views.coffee'),
            this.props
        );
        console.log('000000000000001');
        this.fs.copyTpl(
            this.templatePath('style.less'),
            this.destinationPath('style.less'),
            this.props
        );

        console.log('000000000000002');
        if (!this.props.viewsType){
            this.fs.copyTpl(
                this.templatePath('view.jade'),
                this.destinationPath(this.props.viewNameLowerCase + 'View.jade'),
                this.props
            );
        }
        else{
            var viewNames = {
                'l': 'ListView',
                'd': 'DetailsView',
                'e': 'EditView'
            };
            for(var n in viewNames){
                if (this.props.viewsType.indexOf(n)>-1){
                    this.fs.copyTpl(
                        this.templatePath(viewNames[n]+'.jade'),
                        this.destinationPath(this.props.viewNameLowerCase + viewNames[n] +'.jade'),
                        this.props
                    );
                }
            }
            if (this.props.viewsType.indexOf('a')>-1){
                if (!this.props.viewsType.indexOf('e')>-1){
                    this.fs.copyTpl(
                        this.templatePath(viewNames[n]),
                        this.destinationPath(this.props.viewNameLowerCase + 'EditView.jade'),
                        this.props
                    );
                }
            }
        }
    }
});
