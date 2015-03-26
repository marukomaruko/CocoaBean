# Require CocoaBean::VERSION
require_relative 'lib/cocoa_bean/version'

# This is duplicated. # Todo: remove this.
ENV['JASMINE_CONFIG_PATH'] = './test/jasmine.yml'

# The root directory of Cocoa Bean project
project_root = File.dirname(__FILE__)

# File task for web framework full version
web_framework_name = 'dist/cocoabean-' + CocoaBean::VERSION + '.js'
file web_framework_name => Rake::FileList.new('src/**/*.js.coffee') do |t|
  generate_web_framework(t.name, false)
end

# File task for web framework min version
web_min_framework_name = 'dist/cocoabean-' + CocoaBean::VERSION + '.min.js'
file web_min_framework_name => Rake::FileList.new('src/**/*.js.coffee') do |t|
  generate_web_framework(t.name, true)
end

# File task for cocoa framework
cocoa_framework_name = 'dist/CocoaBean.framework'
file cocoa_framework_name => Rake::FileList.new('cocoa/**/*') do |t|
  Dir.chdir('cocoa')
  sh "xcodebuild -target CocoaBean"
  sh "cp -R '#{project_root}/cocoa/build/Release/CocoaBean.framework' #{project_root}/dist"
  Dir.chdir('..')
end

# File task for cocoa touch framework
cocoa_touch_framework_name = 'dist/CocoaBeanTouch.framework'
file cocoa_touch_framework_name => Rake::FileList.new('cocoa/**/*') do |t|
  Dir.chdir('cocoa')
  sh "xcodebuild -target CocoaBeanTouch"
  sh "cp -R '#{project_root}/cocoa/build/Release-iphoneos/CocoaBeanTouch.framework' #{project_root}/dist"
  Dir.chdir('..')
end

def generate_web_framework(destination, min = false)
  require 'sprockets'
  environment = Sprockets::Environment.new
  environment.append_path 'src'
  environment.js_compressor = :uglify if min
  js = environment['build.js'].to_s
  File.write(destination, js)
  puts "generated #{destination} with coffee, sprockets and uglifier."
end

# Distribute frameworks into 'dist' dir
namespace :dist do
  desc "Generate Web framework production version."
  task :webmin => [web_min_framework_name]

  desc "Generate Web framework development version."
  task :web => [web_framework_name]

  desc "Generate Cocoa compatible framework."
  task :cocoa => [cocoa_framework_name]

  desc "Generate Cocoa Touch compatible framework."
  task :cocoatouch => [cocoa_touch_framework_name]
end


desc "Generate all platforms and versions of distribution."
task :dist => ['dist:webmin', 'dist:web', 'dist:cocoa', 'dist:cocoatouch']

# Set project version with rake.
desc "Set a specific project version."
task :version, [:ver] do |t, args|
  flag = :flag
  vers = args[:ver]
  catch flag do
    unless args[:ver]
      puts "Please provide a version to be set."
      throw flag
    end
    regexp = /^(\d+\.)?(\d+\.)?(\*|\d+)$/
    unless regexp.match(vers)
      puts "Version string is malformed."
      throw flag
    end

    # Change version in ruby file.
    version_file = File.expand_path('lib/cocoa_bean/version.rb', project_root)
    content = File.read(version_file).gsub!(/'.*'/, "'" + vers + "'")
    File.open(version_file, 'w') do |f|
      f.truncate(0)
      f.write(content)
    end
    # Chang eversion in xcode project which actually located in 'Info.plist's
    require 'xcodeproj'
    ["iOS", "OSX"].each do |platform|
      plist_path = File.expand_path('cocoa/' + platform + '/Info.plist', project_root)
      plist_hash = Xcodeproj::PlistHelper.read(plist_path)
      plist_hash["CFBundleShortVersionString"] = vers
      Xcodeproj::PlistHelper.write(plist_hash, plist_path)
    end
  end
end

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

namespace :test do

  require 'rake/testtask'
  desc "Test ruby command line interface"
  Rake::TestTask.new :cli do |t|
    t.libs.push File.expand_path('../lib', __FILE__)
    t.libs.push File.expand_path('../test/cli', __FILE__)
    t.pattern = 'test/cli/**/*_test.rb'
  end

  namespace :web do
    rule ".js" => ".js.coffee" do |t|
      sh "coffee -o #{File.dirname(t.name)} -c #{t.source}"
      sh "mv #{t.name}.js #{t.name}"
    end

    web_test_sources = Rake::FileList.new('test/**/*[tT]est.js.coffee')
    web_test_targets = web_test_sources.map do |s|
      s.gsub('.coffee', '')
    end

    desc "Clean generated web tests."
    task :clean do
      sh "find test -type f -name '*[tT]est.js' -delete"
      sh "find test -type d -empty -delete"
    end

    task :'do' do
      ENV['JASMINE_CONFIG_PATH'] = './test/jasmine.yml'
      Rake::Task["jasmine"].invoke
    end

    desc "Generate test code for web environment."
    task :generate => web_test_targets
  end

  desc "Test on web environment"
  task :web => ['web:generate', 'web:do']

end

# Require bundler's gem tasks
require "bundler/gem_tasks"
