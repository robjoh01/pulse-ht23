<div align="center">

![Banner](./public/img/markup/Template_Logo.png)

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/robjoh01/pulse-ht23/blob/HEAD/LICENSE.txt)

</div>

#

## Description

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin faucibus a tortor ac condimentum. Vivamus bibendum velit in sollicitudin lobortis. Etiam ac urna vitae dui sollicitudin dignissim ut volutpat libero. Donec a neque eu elit pulvinar pretium ac vel libero. Aenean auctor mattis massa et ultrices. Nulla facilisi. Phasellus suscipit augue mi, nec condimentum tellus porttitor sed. Duis id vehicula arcu. Etiam id faucibus libero, in pharetra urna. Morbi gravida dignissim convallis. Nam tempus libero venenatis sodales ultricies.

Nunc tempor viverra dolor et interdum. In ullamcorper risus quis finibus aliquam. Fusce vestibulum turpis vel mi vehicula, id rhoncus lectus volutpat. Curabitur non vestibulum elit. Fusce interdum metus sit amet pharetra ultricies. Phasellus sed justo non augue finibus iaculis. Sed imperdiet sed neque non blandit. Duis nec augue in metus efficitur dapibus eu ut mauris. Aliquam sagittis neque sollicitudin elit maximus tempus. Nunc dapibus eget enim ut laoreet.

> [!NOTE]
> This project uses `npm` package manager and `express.js` package for handling the server side.

## Installment

```console
sudo npm install -g bcrypt

$ npm install
```

Create `.env` file:

```console
$ touch .env
```

```
PORT=<number>
SALT_ROUNDS=number
COOKIE_SECRET=<id>
GMAIL_NAME=<string>
GMAIL_USER=<string>
GMAIL_PASS=<string>
PHONE_URL=<string>
GITHUB_URL=<string>
GMAIL_URL=<string>
```

Also create `pulse.json` file (at `config/db/pulse.json`):

```console
$ mkdir -p config/db
$ touch config/db/pulse.json
```

```json
{
    "host": "<hostname>",
    "user": "<user>",
    "password": "<password>",
    "database": "<database>",
    "multipleStatements": true
}
```

Then initialize the database locally:

```console
$ cd sql
$ ./scripts/run.bash
```

## 🔗 Helpful links

## 🆘 Support

If you have any questions or issue, just write to my [Email](mailto:mrrobin123mail@gmail.com).

## 📍 Footnotes
