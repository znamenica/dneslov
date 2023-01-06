## README

This README would normally document whatever steps are necessary to get the
application up and running.

## Status

[![Homepage](http://img.shields.io/badge/home-dneslov.org-blue.svg)](http://dneslov.org)
[![Website dneslov.org](https://img.shields.io/website-up-down-green-red/https/dneslov.org.svg)](https://dneslov.org/)
[![GitHub](http://img.shields.io/badge/github-znamenica/dneslov-blue.svg)](http://github.com/znamenica/dneslov)
[![GitHub tag](https://img.shields.io/github/tag/znamenica/dneslov.svg)](https://GitHub.com/znamenica/dneslov/tags/)
[![MIT License](http://b.repl.ca/v1/License-MIT-blue.png)](LICENSE)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/znamenica/dneslov)
[![GPLv2 license](https://img.shields.io/badge/License-GPLv2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fznamenica%2Fdneslov%2Fbadge&style=flat&logo=none)](https://actions-badge.atrox.dev/znamenica/dneslov/goto)
[![Build Status](https://circleci.com/gh/znamenica/dneslov/tree/master.svg?style=svg)](https://circleci.com/gh/znamenica/dneslov/tree/master)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7b7578bc49804fa3b56fd1fef5dfbe90)](https://www.codacy.com/gh/znamenica/dneslov/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=znamenica/dneslov&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/znamenica/dneslov/badges/gpa.svg)](https://codeclimate.com/github/znamenica/dneslov)
[![Test Coverage](https://codeclimate.com/github/znamenica/dneslov/badges/coverage.svg)](https://codeclimate.com/github/znamenica/dneslov)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/znamenica/dneslov/pulls)
[![Telegram](https://badgen.net/badge/icon/telegram?icon=telegram&labe)](https://t.me/dneslov)

## Requirements

1. libhiredis-devel
2. libsnappy-devel
3. redis
4. xclip
5. sidekiq
6. postgresql14-server-devel
7. postgresql14-server
8. libwebp-tools
9. ImageMagick

Install requirements by single line:

```bash
apt-get install libhiredis-devel libsnappy-devel redis xclip sidekiq postgresql14-server-devel postgresql14-server libwebp-tools ImageMagick
```

## Setup

```bash
$ cap production setup
```

### Restart server

```bash
$ cap production deploy:restart
```

### Deploy

```bash
$ cap production deploy
```

### Deploy with a server restart

```bash
$ cap production deploy deploy:restart
```
## Tasks

### PDF Generation

To generate PDF calendary with a first record per day, use the following:

    $ rake book:pdf[днеслов.pdf,днеслов]

### Start

In development mode:

```bash
foreman start -f Procfile.dev
```


# Tasks
## Image Synchronisation

On client side do:
```bash
rake dneslov:image:sync[/usr/local/home/majioa/Документы/Изображения/dneslov_pin1/,/usr/local/home/majioa/git/dneslov/public/images]
```

Then on server side do:
```bash
rake dneslov:load:resources dneslov:load:images
```
