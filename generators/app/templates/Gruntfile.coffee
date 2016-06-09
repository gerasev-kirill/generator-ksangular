module.exports = (grunt)->
	index_app = [
				'helpers_app',
				'index_app'
			]

	generateFilePattern = (dirs)->
		list=[]
		for d in dirs
			if '*' in d
				list.push('client/'+d)
				continue
			list.push('client/'+d+"/**/module*.js")
			list.push('client/'+d+"/**/!(module*)*.js")
		list

	generateBowerLibsList = ()->
		wiredep = require('wiredep')({
			src: 'views/base.jade',
			ignorePath: '..'
		})
		path = require('path')

		bower_libs = []
		for j in wiredep.js
			j = j.replace(__dirname, '')
			j = j[1...]
			f = path.parse(j)
			if f.ext == '.min.js'
				bower_libs.push(j)
				continue
			bower_libs.push(
				path.join(f.dir, f.name+'.min.js')
			)
		bower_libs

	generateBowerCssList = ()->
		wiredep = require('wiredep')({
			src: 'views/base.jade',
			ignorePath: '..'
		})
		path = require('path')
		bower_css = []
		for j in wiredep.css
			j = j.replace(__dirname, '')
			j = j[1...]
			f = path.parse(j)
			if f.ext == '.css.min'
				bower_libs.push(j)
				continue
			bower_css.push(
				path.join(f.dir, f.name+'.min.css')
			)

		bower_css




	grunt.initConfig {
		pkg: grunt.file.readJSON('package.json'),
		replace: {
			options:{},
			files:{
					expand: true,
					cwd: 'client',
					src: ['**/*.js', '**/*.html'],
					dest: 'client',
				}
		},
		tags: {
			build: {
				options: {
					scriptTemplate: '<script src="/{{ path }}"></script>',
					linkTemplate: '<link href="/{{ path }}"/>',
					absolutePath: true
				},
				src: generateFilePattern(index_app),
				dest: 'views/index.jade'
			}
		},
		less_imports:{
				options:{},
				client:{
					src: [ 'client/*_app/**/style.less'],
					dest: 'client/auto_imports.less'
				}
		},
		watch:{
			js_html:{
					files: ['client/*_app/**/*.js', 'client/*_app/**/*.html' ],
					tasks: ['replace', 'tags']
			},
			css:{
					files: ['client/*_app/**/*.less', 'client/*.less' ],
					tasks: ['less_imports', 'less:prod']
			}
		},
		coffee:{
			glob_to_multiple: {
				expand: true,
				cwd: 'client',
				src: ['**/**/*.coffee'],
				dest: 'client',
				ext: '.js'
			}
		},
		# pug == jade templates
		pug:{
			views:{
				options:{
					data: grunt.file.readJSON('./jade-dev.context')
				}
				files: [{
					expand: true,
					cwd: 'views',
					src: ['**/**/*.jade'],
					dest: 'views',
					ext: '.html'
				}]
			},
			views_prod:{
				options:{
					data: grunt.file.readJSON('./jade-prod.context')
				}
				files: [{
					expand: true,
					cwd: 'views',
					src: ['**/**/*.jade'],
					dest: 'views',
					ext: '.html'
				}]
			},
			client:{
				files: [{
					expand: true,
					cwd: 'client',
					src: ['**/**/*.jade'],
					dest: 'client',
					ext: '.html'
				}]
			},
		},
		concat:{
			options:{
				separator:';\n'
			},
			index_app:{
				src: generateFilePattern(index_app)
				dest:'client/index_app.js'
			},
			bower_js_libs:{
				src: generateBowerLibsList(),
				dest: 'client/bower_libs.min.js'
			}
		}
		less:{
			prod:{
				options:{
					#compress:true
				},
				files:{
					'client/site.css':'client/site.less',
					#'client/css/style-admin.css':'client/style-admin.less',
					#'client/css/style-moderator.css':'client/style-moderator.less'
				}
			}
		}
		wiredep: {
			task: {
				src: [
					'views/**/*.jade'
				],
				options: {
						cwd: './',
						ignorePath: '..',
						#ignorePath: '../bower_components',
						dependencies: true,
						devDependencies: false,
					}
			}
		},
		connect:{
			server:{
				options:{
					port:8000,
					hostname: 'localhost',
					base: ['views', './'],
					keepalive: true
				}
			}
		},

		nggettext_extract: {
			pot: {
				files: {
					'po/template.pot': ['views/**/*.html', 'client/**/*.html']
				}
			},
		},
		nggettext_compile: {
			lazy: {
				options: {
					format: "json"
				},
				files: [
					{
						expand: true,
						dot: true,
						cwd: "po",
						dest: "client/languages",
						src: ['*.po'],
						ext: ".json"
					}
				]
			}
		},
		angular_template_inline_js: {
			options:{
				basePath: __dirname
			},
			files:{
				cwd: 'client',
				expand: true,
				src: ['index_app.js'],
				dest: 'client'
			}
		},
		ngAnnotate: {
			files:{
				cwd: 'client',
				expand: true,
				src: ['*.js'],
				dest: 'client'
			}
		},
		uglify:{
			all:{
				files:{
					'client/index_app.min.js':['client/index_app.js']
				}
			}
		},
		cssmin:{
			all:{
				files:{
					'client/style.min.css': [
						'client/site.css'
					]
				}
			}
		},
		compress:{
			css:{
				options:{
					mode:'gzip'
				}
				expand: true,
				cwd: '__build__/',
				src: ['**/*.min.css'],
				dest: '__build__/',
				ext: '.min.css.gz'
			},
			js:{
				options:{
					mode:'gzip'
				}
				expand: true,
				cwd: '__build__/',
				src: ['**/*.min.js'],
				dest: '__build__/',
				ext: '.min.js.gz'
			},
			html:{
				options:{
					mode:'gzip'
				}
				expand: true,
				cwd: '__build__/',
				src: ['**/*.html'],
				dest: '__build__/',
				ext: '.html.gz'
			},
		}
	}
	grunt.loadNpmTasks 'grunt-contrib-connect'
	grunt.loadNpmTasks 'grunt-script-link-tags'
	grunt.loadNpmTasks 'grunt-replace'
	grunt.loadNpmTasks 'grunt-wiredep'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-less'
	grunt.loadNpmTasks 'grunt-simple-watch'
	grunt.loadNpmTasks 'grunt-less-imports'
	grunt.loadNpmTasks 'grunt-contrib-pug'
	grunt.loadNpmTasks 'grunt-angular-template-inline-js'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-ng-annotate'
	grunt.loadNpmTasks 'grunt-contrib-cssmin'
	grunt.loadNpmTasks 'grunt-contrib-compress'

	grunt.loadNpmTasks 'grunt-angular-gettext'
	grunt.registerTask 'po', ['pug:views', 'pug:client', 'nggettext_extract']
	grunt.registerTask 'po-compile', 'nggettext_compile:lazy'


	grunt.registerTask 'default', 'simple-watch'
	grunt.registerTask 'index_app', [
				'less_imports', 'less:prod',
				'replace', 'concat:index_app', 'ngAnnotate',
				'angular_template_inline_js', 'uglify:all',
				'concat:bower_js_libs',
				'cssmin'
	]

	grunt.registerTask 'build-deploy', [
				'index_app', 'pug:views_prod'
	]
