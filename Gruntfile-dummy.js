module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps-customserver');

    grunt.initConfig({
        screeps: {
            options: {
                hostname: 'SERVER_ADDRESS',
                port: '21025',
                'use-https': false,
                username: 'USERNAME',
                password: 'PASSWORD',
                branch: 'default',
                ptr: false
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**/*.{js,wasm}'],
                        flatten: true
                    }
                ]
            }
        }
    });
}