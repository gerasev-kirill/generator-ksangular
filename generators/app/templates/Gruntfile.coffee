module.exports = (grunt)->
	index_app = ['helpers_app', 'index_app']

	generateFilePattern = (dirs)->
		list=[]
		for d in dirs
			if '*' in d
				list.push('client/'+d)
				continue
			list.push('client/'+d+"/**/module*.js")
			list.push('client/'+d+"/**/!(module*)*.js")
		list



	grunt.initConfig {
		pkg: grunt.file.readJSON('package.json'),
		replace: {
			options:{},
			files:{
				expand: true,
				cwd: 'client',
				src: ['**/*.js'],
				dest: 'client',
				ext: '.js'
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
				so:{
					src: [ 'client/*_app/**/style.less'],
					dest: 'client/auto_imports.less'
				}
		},
		watch:{
			scripts:{
				files: ['client/*_app/**/*.js', 'client/*_app/**/*.less' ],
				tasks: ['replace', 'less_imports', 'tags']
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
			}
		}
		less:{
			prod:{
				options:{
					compress:true
				},
				files:{
					'client/css/style.css':'client/style.less',
					'client/css/style-admin.css':'client/style-admin.less',
					'client/css/style-moderator.css':'client/style-moderator.less'
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
		<% if (useL18n){ %>
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
		<% } %>
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
	<% if (useL18n){ %>
	grunt.loadNpmTasks 'grunt-angular-gettext'
	grunt.registerTask 'po', ['pug:views', 'pug:client', 'nggettext_extract']
	grunt.registerTask 'po-compile', 'nggettext_compile:lazy'
	<% } %>

	grunt.registerTask 'default', 'simple-watch'
	grunt.registerTask 'index_app', ['less_imports', 'less:prod', 'replace', 'concat:index_app']
