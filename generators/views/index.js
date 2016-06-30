'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

function getNgModuleName(dirpath){
    var stat, content, line, moduleName=null;
    while (true) {
        stat = fs.existsSync(dirpath+'/module.coffee');
        if (stat){
            content = fs.readFileSync(dirpath+'/module.coffee', 'utf-8');
            break;
        }
        dirpath = path.dirname(dirpath);
        if (dirpath == '/') break;
    }
    if (dirpath == '/' || !content) return null;

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
    return moduleName;
}


module.exports = yeoman.Base.extend({

    prompting: function () {
        //
        var done = this.async();
        var dirname, stat, listdir, ng_app_list=[], name, default_app='';

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the neat ' + chalk.red('generator-site') + ' generator!\n'+
            "Let's create some " + chalk.yellow('view ') + "for our app!"
        ));

        dirname = path.join(this.destinationRoot(), 'client');
        listdir = fs.readdirSync(dirname);
        for(var i=0; i<listdir.length; i++){
            stat = fs.statSync(path.join(dirname, listdir[i]));
            if (stat.isDirectory()){
                name = getNgModuleName(path.join(dirname, listdir[i]));
                if (name){
                    ng_app_list.push(
                        listdir[i]
                    );
                }
            }
        }

        if(ng_app_list){
            default_app = ng_app_list[0];
        }
        if (ng_app_list.indexOf('index_app')>-1){
            default_app = 'index_app';
        }

        var prompts = [
        {
            type: 'input',
            name: 'appName',
            message: 'Type folder name of app inside ./client ('+ng_app_list+'): ',
            default: default_app,
            validate: function(name){
                return !!getNgModuleName(path.join(dirname, name));
            }
        },
        {
            type: 'input',
            name: 'viewName',
            message: 'Type view name (ex.: Articles): ',
            validate: function(name){
                return !!name;
            }
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
            default: 'app',
            validate: function(pref){
                return !!pref;
            }
        }
        ];

        this.prompt(prompts, function (props) {
            var dirname, stat, content;
            var line, moduleName;
            this.props = props;
            dirname = this.destinationRoot()+'/client/'+this.props.appName;
            moduleName = getNgModuleName(dirname);

            if (!moduleName){
                this.log(yosay(chalk.red(
                    "Opps! Cant find angular app in module.coffee file=( Path: ./client/"+this.props.appName
                )));
                return;
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

        this.fs.copyTpl(
            this.templatePath('views.coffee'),
            this.destinationPath('views.coffee'),
            this.props
        );

        this.fs.copyTpl(
            this.templatePath('style.less'),
            this.destinationPath('style.less'),
            this.props
        );


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
