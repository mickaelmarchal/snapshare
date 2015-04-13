module.exports = function ( grunt ) {
  
  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-html2js');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * The banner is the comment that is placed at the top of our compiled 
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          'package.json', 
          'client/bower.json'
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          'package.json', 
          'client/bower.json'
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },    

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [ 
      '<%= build_dir %>/client', 
      '<%= compile_dir %>/client'
    ],

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_app_assets: {
        files: [
          { 
            src: [ '**' ],
            dest: '<%= build_dir %>/client/assets/',
            cwd: 'client/src/assets',
            expand: true
          }
       ]   
      },
      build_vendor_assets: {
        files: [
          { 
            src: [ '<%= client.vendor_files.assets %>' ],
            dest: '<%= build_dir %>/client/assets/',
            cwd: 'client',
            expand: true,
            flatten: true
          }
       ]   
      },
      build_appjs: {
        files: [
          {
            src: [ '<%= client.app_files.js %>' ],
            dest: '<%= build_dir %>/client',
            cwd: 'client',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= client.vendor_files.js %>' ],
            dest: '<%= build_dir %>/client',
            cwd: 'client',
            expand: true
          }
        ]
      },
      build_vendorcss: {
        files: [
          {
            src: [ '<%= client.vendor_files.css %>' ],
            dest: '<%= build_dir %>/client',
            cwd: 'client',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/client/assets',
            cwd: '<%= build_dir %>/client/assets',
            expand: true
          },
          {
            src: [ '<%= client.vendor_files.css %>' ],
            dest: '<%= compile_dir %>/client',
            cwd: 'client',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      build_css: {
        src: [
          '<%= client.vendor_files.css %>',
          '<%= build_dir %>/client/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= build_dir %>/client/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '', //filled-in by custom task compilejs
        dest: '<%= compile_dir %>/client/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    /**
     * `ngAnnotate` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngAnnotate: {
      compile: {
        files: [
          {
            src: [ '<%= client.app_files.js %>' ],
            cwd: '<%= build_dir %>/client',
            dest: '<%= build_dir %>/client',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
     * Only our `main.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    less: {
      build: {
        files: {
          '<%= build_dir %>/client/assets/<%= pkg.name %>-<%= pkg.version %>.css': 'client/<%= client.app_files.less %>'
        }
      },
      compile: {
        files: {
          '<%= build_dir %>/client/assets/<%= pkg.name %>-<%= pkg.version %>.css': 'client/<%= client.app_files.less %>'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      clientSrc: {
        files: [
          {
            src: '<%= client.app_files.js %>',
            cwd: 'client',
            expand: true
          }
        ]
      },
      clientTest: {
        files: [
          {
            src: '<%= client.app_files.jsunit %>',
            cwd: 'client',
            expand: true
          }
        ]
      },
      serverSrc: {
        files: [
          {
            src: '<%= server.src_files %>',
            cwd: 'server',
            expand: true
          }
        ]
      },
      serverTest: {
        files: [
          {
            src: '<%= server.test_files %>',
            cwd: 'server',
            expand: true
          }
        ]
      },
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'client/src/app'
        },
        src: [ 'client/<%= client.app_files.atpl %>' ],
        dest: '<%= build_dir %>/client/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'client/src/common'
        },
        src: [ 'client/<%= client.app_files.ctpl %>' ],
        dest: '<%= build_dir %>/client/templates-common.js'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/client/karma-unit.js'
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>/client',
        files: [
          {
            src: [ '<%= client.vendor_files.js %>' ],
            cwd: 'client',
            expand: true
          },
          {
            src: [
              '<%= build_dir %>/client/src/**/*.js',
              '<%= html2js.common.dest %>',
              '<%= html2js.app.dest %>',
              '<%= client.vendor_files.css %>',
              '<%= build_dir %>/client/assets/<%= pkg.name %>-<%= pkg.version %>.css'
            ],
            expand: true
          }
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>/client',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= client.vendor_files.css %>',
          '<%= build_dir %>/client/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },

    /**
     * This task runs server unit tests using nodeunit
     */
    nodeunit: {
      files: [
        {
          src: [ '<%= server.test_files %>' ],
          cwd: 'server',
          expand: true
        }
      ]
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>/client',
        files: [
          {
            src: [ '<%= client.vendor_files.js %>', '<%= client.test_files.js %>' ],
            cwd: 'client',
            expand: true
          },
          {
            src: [ '<%= html2js.app.dest %>', '<%= html2js.common.dest %>' ]
          }
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed 
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files. 
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      clientJsSrc: {
        files: [ 
          'client/<%= client.app_files.js %>'
        ],
        tasks: [ 'jshint:clientSrc', 'karma:unit:run', 'copy:build_appjs' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      clientAssets: {
        files: [ 
          'client/src/assets/**/*'
        ],
        tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
      },

      /**
       * When index.html changes, we need to compile it.
       */
      clientHtml: {
        files: [ 'client/<%= client.app_files.html %>' ],
        tasks: [ 'index:build' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      clientTpls: {
        files: [ 
          '<%= client.app_files.atpl %>', 
          '<%= client.app_files.ctpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      clientLess: {
        files: [ 'src/**/*.less' ],
        tasks: [ 'less:build' ]
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      clientJsunit: {
        files: [
          '<%= client.app_files.jsunit %>'
        ],
        tasks: [ 'jshint:clientTest', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      },

      /**
       * When a server src file changes, lint it. Do not do any live reloading.
       */
      serverSrc: {
        files: [
          '<%= server.src_files %>'
        ],
        tasks: [ 'jshint:serverSrc' ],
        options: {
          livereload: false
        }
      },

      /**
       * When a server unti test file changes, lint it and run unit tests.
       * Do not do any live reloading.
       */
      serverTest: {
        files: [
          '<%= server.src_files %>'
        ],
        tasks: [ 'jshint:serverTest', 'nodeunit' ],
        options: {
          livereload: false
        }
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'karma:unit', 'delta' ] );

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean', 'html2js', 'jshint', 'less:build',
    'concat:build_css', 'copy:build_app_assets', 'copy:build_vendor_assets',
    'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_vendorcss', 'index:build', 'karmaconfig',
    'karma:continuous' 
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'less:compile', 'copy:compile_assets', 'ngAnnotate', 'compilejs', 'uglify', 'index:compile'
  ]);

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /** 
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {

    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'\/client|'+grunt.config('compile_dir')+'\/client|client)\/', 'g' );

    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    grunt.file.copy('client/src/index.html', this.data.dir + '/index.html', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {

    var jsFiles = filterForJS( this.filesSrc );

    grunt.file.copy( 'client/karma/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/client/karma-unit.js', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

  /**
   * Configure JS files compilation task
   * Needed because of various Grunt limitations
   */
  grunt.registerTask('compilejs', 'Compile js files together', function() {

    var files = [];
    for(var i = 0; i < grunt.config('client.vendor_files.js').length; i++) {
        files.push('client/'+grunt.config('client.vendor_files.js')[i]);
    }
    files.push('client/module.prefix');
    files.push(grunt.config('build_dir')+'/client/src/**/*.js'); 
    files.push('<%= html2js.app.dest %>');
    files.push('<%= html2js.common.dest %>'); 
    files.push('client/module.suffix');

    //console.log(files, 'FILES');
    grunt.config('concat.compile_js.src', files);

    grunt.task.run('concat:compile_js');
  });

};
