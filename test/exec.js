"use strict"

var test = require('tape')

var path = require('path')

var npmRun = require('../')

var level0 = path.join(__dirname, 'fixtures', 'level0')
var level1 = path.join(level0, 'node_modules', 'level1')
var level2 = path.join(level1, 'node_modules', 'level2')

var level = [level0, level1, level2]
var binPath = level.map(function(levelPath) {
  return path.join(levelPath, "node_modules", ".bin")
})

test('execution', function(t) {
  npmRun('level1', {cwd: level[0]}, function(err, stdout, stderr) {
    t.ifError(err)
    t.equal(stderr.length, 0)
    t.equal(stdout.trim(), 'level1')
    t.end()
  })
})

test('passing args', function(t) {
  npmRun('level1 here are some arguments', {cwd: level[0]}, function(err, stdout, stderr) {
    t.ifError(err)
    t.equal(stderr.trim(), 'here are some arguments')
    t.equal(stdout.trim(), 'level1')
    t.end()
  })
})

test('includes all .bin dirs in all parent node_modules folders', function(t) {
  t.test('no nesting', function(t) {
    npmRun('level1', {cwd: level[0]}, function(err, stdout, stderr) {
      t.ifError(err)
      t.equal(stderr.length, 0)
      t.equal(stdout.trim(), 'level1')
      t.end()
    })
  })

  t.test('nesting', function(t) {
    t.plan(6)

    npmRun('level1', {cwd: level[1]}, function(err, stdout, stderr) {
      t.ifError(err)
      t.equal(stderr.length, 0)
      t.equal(stdout.trim(), 'level1')
    })

    npmRun('level2', {cwd: level[1]}, function(err, stdout, stderr) {
      t.ifError(err)
      t.equal(stderr.length, 0)
      t.equal(stdout.trim(), 'level2')
    })
  })

  t.test('more nesting', function(t) {
    t.plan(6)

    npmRun('level1', {cwd: level[2]}, function(err, stdout, stderr) {
      t.ifError(err)
      t.equal(stderr.length, 0)
      t.equal(stdout.trim(), 'level1')
    })

    npmRun('level2', {cwd: level[2]}, function(err, stdout, stderr) {
      t.ifError(err)
      t.equal(stderr.length, 0)
      t.equal(stdout.trim(), 'level2')
    })
  })

  t.end()
})


