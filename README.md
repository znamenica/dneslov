## README

This README would normally document whatever steps are necessary to get the
application up and running.

## Status

[![Homepage](http://img.shields.io/badge/home-dneslov.org-blue.svg)](http://dneslov.org)
[![Website dneslov.org](https://img.shields.io/website-up-down-green-red/https/dneslov.org.svg)](https://dneslov.org/)
[![GitHub](http://img.shields.io/badge/github-znamenica/dneslov-blue.svg)](http://github.com/znamenica/dneslov)
[![GitHub tag](https://img.shields.io/github/tag/znamenica/dneslov.svg)](https://GitHub.com/znamenica/dneslov/tags/)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/znamenica/dneslov)
[![GPLv2 license](https://img.shields.io/badge/License-GPLv2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fznamenica%2Fdneslov%2Fbadge&style=flat&logo=none)](https://actions-badge.atrox.dev/znamenica/dneslov/goto)
[![Build Status](https://circleci.com/gh/znamenica/dneslov/tree/master.svg?style=svg)](https://circleci.com/gh/znamenica/dneslov/tree/master)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7b7578bc49804fa3b56fd1fef5dfbe90)](https://www.codacy.com/gh/znamenica/dneslov/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=znamenica/dneslov&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/znamenica/dneslov/badges/gpa.svg)](https://codeclimate.com/github/znamenica/dneslov)
[![Test Coverage](https://codeclimate.com/github/znamenica/dneslov/badges/coverage.svg)](https://codeclimate.com/github/znamenica/dneslov)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/znamenica/dneslov/pulls)
[![Telegram](https://badgen.net/badge/icon/telegram?icon=telegram&labe)](https://t.me/dneslov)

## Installation
### Requirements

List of the requirements (packages are named as in ALT conventions) are the following:

1. libhiredis-devel
2. libsnappy-devel
3. libruby-devel
4. redis
5. xclip
6. sidekiq
7. postgresql15-server-devel
8. postgresql15-server
9. postgresql15-contrib
10. libwebp-tools
11. ImageMagick
12. curl
13. git
14. sudo
15. node
16. yarn
17. gostsum

If you have an ALT installation, just install requirements by single line:

```bash
apt-get install libhiredis-devel libsnappy-devel redis xclip sidekiq postgresql15-server-devel postgresql15-server postgresql15-contrib libwebp-tools ImageMagick curl git sudo node yarn
```
It any others, just correlate them for each of packages to your system's ones, and then install as usually.

### Prerequisites

1. Setup RVM:
1.1. Import gpg records if required:

```bash
command curl -sSL https://rvm.io/mpapis.asc | gpg --import -
command curl -sSL https://rvm.io/pkuczynski.asc | gpg --import -
```

1.2. Install rvm itself as follows:

```bash
\curl -sSL https://get.rvm.io | bash -s stable
```

1.3. Make sure taht .bashrc has rvm setup lines:

```bash
grep rvm ~/.bashrc
export PATH="$PATH:$HOME/.rvm/bin"
```

1.4. Relogin into the shell.

2. Install required ruby

Get into the projects folder, then run:

```bash
rvm install ruby-$(cat Gemfile|grep ^ruby|sed "s,.*'\([0-9.]\+\)'.*,\1,")
```

This will install projects ruby into the system.

3. Create required config files ***secrets.yml***, and ***database.yml***, and ***.env***

#### dneslov/shared/config/database.yml

```yaml
development:
  adapter: postgresql
  encoding: unicode
  database: dneslov_development
  pool: 5
  username: dneslov
  password: 
```

#### dneslov/shared/config/secrets.yml
```yaml
production:
   secret_key_base: <secret hash>
```

#### dneslov/shared/.env

```yaml
---
github:
   client:
      id: "..."
      secret: "..."
   access_token_url: "https://github.com/login/oauth/access_token"
   user_info_url: "https://api.github.com/user"
   client_url: "https://dneslov.org/dashboard"
   redirect_url: "https://dneslov.org/auth/github"
secret_key_base: '...'
jwt_secret: "..."
sentry:
   dsn: "https://...@....ingest.sentry.io/..."
rails:
   resque:
      redis: "localhost:6379"
redis:
   url: "redis://localhost:6379"
```

## Deployment

### Sudo

Setup sudo for deployment if required.

### Setup

Setup deployment, and remote restart can be done for production or staging environment, it is no meaning to do this for development. So these three steps can be skipped.

Run capistrano setup task:
```bash
$ cap production setup
```

### Deploy

```bash
$ cap production deploy
```

### Deploy with a server restart

```bash
$ cap production deploy deploy:restart
```

### Remote server restart

```bash
$ cap production deploy:restart
```

### Development server start

In development mode:

Run server and file watcher with:

```bash
RAILS_ENV=development foreman start -f config/procfiles/development.rb -d .
```

# Tasks
## Image Synchronisation

On client side proceed images into to upload-ready format, so do:
```bash
rake dneslov:image:proceed[~/Документы/Изображения/dneslov_pin1/,~/Документы/днеслов/upimages]
```

Then rsync them with the upload server(s):
```bash
rake dneslov:image:rsync[~/Документы/днеслов/upimages,~/git/dneslov/public/images:~/git/dneslov/public/images1]
```

Then on server side from mouted upstream server load images as resources, and then converts them into icon or thumb links, as:
```bash
rake dneslov:load:resources[/mnt/mail] dneslov:load:images[/images]
```

## API

Request for all licit calendaries:
```bash
curl -k "https://dneslov.org/api/v1/calendaries.json"
```

Paged version with 10 records per page:

```bash
curl -k "https://dneslov.org/api/v1/calendaries.json?page=1&per=10"
```

Request for all licit calendaries with ones unlicit, which are specified by slug:
```bash
curl -k "https://dneslov.org/api/v1/calendaries.json?c=гпц&page=1&per=10"
```

## Tasks

### PDF Generation

To generate PDF calendary with a first record per day, use the following:

```bash
rake book:pdf[днеслов.pdf,днеслов]
```
