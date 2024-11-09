# Contributing to GGReborn-App
![cafe-lady](https://github.com/user-attachments/assets/8a65ed21-2118-4c3d-a471-f7af5b6b04c8)

First off, thanks for taking the time to contribute! ❤️

A big welcome and thank you for considering contributing to GGR-DEVS projects! It’s people like you that make it a reality for users in our community.

Reading and following these guidelines will help us make the contribution process easy and effective for everyone involved. It also communicates that you agree to respect the time of the developers managing and developing these open source projects. In return, we will reciprocate that respect by addressing your issue, assessing changes, and helping you finalize your pull requests.

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
- [Commit Messages](#commit-messages)
- [Join The Project Team](#join-the-project-team)

## Code of Conduct
This project and everyone participating in it is governed by the
[Code of Conduct](https://github.com/GGR-Devs/GGReborn-App/blob/master/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <assistance@ggreborn.net>.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://github.com/GGR-Devs/GGReborn-App/blob/main/DOCUMENTATION.md).

Before you ask a question, it is best to search for existing [Issues](https://github.com/GGR-Devs/GGReborn-App/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/GGR-Devs/GGReborn-App/issues).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://github.com/GGR-Devs/GGReborn-App/blob/main/DOCUMENTATION.md). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/GGR-Devs/GGReborn-App/issues?q=label%3Abug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
- Stack trace (Traceback)
- OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
- Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
- Possibly your input and the output
- Can you reliably reproduce the issue? And can you also reproduce it with older versions?

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to .

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/GGR-Devs/GGReborn-App/issues). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://github.com/GGR-Devs/GGReborn-App/blob/main/DOCUMENTATION.md) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/GGR-Devs/GGReborn-App/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/GGR-Devs/GGReborn-App/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux. <!-- this should only be included if the project has a GUI -->
- **Explain why this enhancement would be useful** to most GGReborn-App users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

### Your First Code Contribution

To get started, make sure you have [Node.js](https://nodejs.org/en/download/) installed on your machine. You'll also need an IDE. We recommend [Visual Studio Code](https://code.visualstudio.com/).

Learn [here](https://youtu.be/ORrELERGIHs?si=FqR5TN6wswT3WGTS) how to use Visual Studio Code.

## 1. **Fork the repository to your own Github account**

![fork](https://docs.github.com/assets/cb-34352/mw-1440/images/help/repository/fork-button.webp)

## 2. **Clone the project to your machine**

If you have git installed on your machine, just run the following command in the terminal

```bash
git clone https://github.com/GGR-Devs/GGReborn-App.git
```

You can learn more about the fork [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)

## 3. **Install the packages**

Navigate to your project folder in the terminal and install the necessary packages with the following command:

```bash
npm install
```

## 4. **Running the app**

To start the application, just run the following command:

```bash
npm run start
```

## 5. **Let's code!**

Read the [documentation](https://github.com/GGR-Devs/GGReborn-App/DOCUMENTATION.md) to get started!

## **6. Push changes to your fork**

To push changes into your repo, just run the following commands:

```bash
git add .
git commit -m 'Your commit message here'
git push
```

## **7. Open a new pull request**

## Getting Help

Join us in the [GGReborn Community](https://discord.com/invite/fHN8Pk9a3Q) and post your question there in the correct category with a descriptive tag.
