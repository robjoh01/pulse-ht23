<div align="center">

![Banner](./public/img/Pulse_Project.png)

![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/robjoh01/79eb9296ff7428497df21f6b1bb9ef0a/raw/jest-coverage-comment__main.json)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/robjoh01/pulse-ht23/blob/HEAD/LICENSE.txt)

</div>

#

Welcome to **Pulse - Project Management System** 🚀

_Pulse is a powerful custom reporting system developed with Node.js and Express to streamline project management for our team. It revolutionizes how we register team members, configure projects, set reporting frequencies, customize report formats, and provide insightful dashboards for better collaboration and efficiency._

> [!NOTE]
> This project uses `npm` package manager and `express.js` package for handling the server side.

View [docs](https://htmlpreview.github.io/?https://github.com/robjoh01/pulse-ht23/blob/main/docs/index.html)

View [coverage](https://htmlpreview.github.io/?https://github.com/robjoh01/pulse-ht23/blob/main/coverage/index.html)

### Key Features
- **Security**: Utilizes [environment variables](https://www.npmjs.com/package/dotenv) and [server-side session cookies](https://www.npmjs.com/package/express-session) for enhanced security.In addition, hashing the user's password into the database with [bcrypt](https://www.npmjs.com/package/bcrypt).
- **Best Practices**: Adheres to industry best practices for robust and maintainable code.
- **Linting**: Includes [ESLint](https://www.npmjs.com/package/eslint) for code consistency and quality checks.
- **GitHub Actions**: Implements [GitHub Actions](https://github.com/features/actions) for automated workflows and testing.
- **Documentation**: Comprehensive and well-structured codebase with extensive documentation for easier understanding and onboarding.
- **Database**: Powered by [MySQL](https://www.npmjs.com/package/promise-mysql) for efficient and organized data management.
- **Themes**: Offers both **light** and **dark** theme options for a personalized user experience.
- **Sass**: Utilizes [Sass](https://sass-lang.com/) for efficient CSS styling and maintainability.
- **Testing**: Includes [Jest](https://www.npmjs.com/package/jest) for testing and ensuring code coverage.
- **NPM Packages**: Utilizes a wide range of npm packages for added functionalities and productivity.

## Installment

```console
$ npm install
```

Create `.env` file:

```console
$ touch .env
```

```
# Application Config
PORT=<number>
SALT_ROUNDS=<number>
COOKIE_SECRET=<string>
CONFIG_MODE=<dev|dist>

# Development Config
FORCE_LOGIN=<boolean>
ADMIN_ID=<guid>
EMPLOYEE_ID=<guid>
FORCE_ID=$ADMIN_ID <ADMIN_ID|EMPLOYEE_ID>

# Email config
ENABLE_EMAIL=<boolean>
EMAIL_HOST=<string>
EMAIL_PORT=<number>
EMAIL_DISPLAY_NAME=<string>
EMAIL_USER=<string>
EMAIL_PASS=<string>

# URL Links
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

## Stylelint

To run stylelint:

```console
$ npm run lint
```

## Unit Testing

To run the tests:

```console
$ npm run test
```

or

```console
$ npm run test-extend
```

## Updating the stylesheet

To update the project stylesheet with SASS:

```console
$ npm run style
```

or

```console
$ npm run style-watch
```

## 🔗 Helpful links

## 🆘 Support

If you have any questions or issue, just write to my [Email](mailto:mrrobin123mail@gmail.com).

## 📍 Footnotes
