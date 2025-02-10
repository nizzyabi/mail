# Mail0.io 🚀

An Open-Source Gmail Alternative for the Future of Email

## What is Mail0.io?

Mail0.io is an open-source email solution that gives users the power to **self-host** their own email app while also integrating external services like Gmail and other email providers. Our goal is to put **control, privacy, and customization** back into the hands of users—whether they choose to host their email independently or manage multiple inboxes from a single, customizable platform.

## Why Mail0.io?

Most email services today are either **closed-source**, **data-hungry**, or **too complex to self-host**. Mail0.io is different:

✅ **Fully Open-Source** – No hidden agendas, no walled gardens. 100% transparency.  
🔒 **Data Privacy First** – Your emails, your data. No tracking, no selling, no middlemen.  
⚙️ **Self-Hosting Freedom** – Run your own email app with ease.
📬 **Unified Inbox** – Connect multiple email providers like Gmail, Outlook, and more.  
🎨 **Customizable UI & Features** – Tailor your email experience the way you want it.  
🚀 **Developer-Friendly** – Built with extensibility and integrations in mind.

## Our Mission

We believe email should be:

1. **Yours** – You control where your data is stored.
2. **Flexible** – Use it however you want—self-hosted or connected to third-party providers.
3. **Open** – Transparent development, open collaboration, and community-driven innovation.
4. **User-Friendly** – No need for technical expertise to get started.

## Roadmap 🛤️

We're in the early stages of development, and we're shaping the future of Mail0.io **together with the community**. Some key areas we will focus on:

- **Core Email Server** – A lightweight, reliable self-hosted email server.
- **Email Client** – A sleek, customizable web app for managing emails.
- **Gmail & External Email Integration** – Support for linking third-party email services.
- **Privacy-Focused Features** – Encryption, tracking protection, and secure authentication.
- **Developer API** – Extensible tools for building integrations and automations.

## Join the Movement 🚀

Mail0.io is not just another email app—it's a **vision** for a better, more open, and user-controlled email ecosystem. If you believe in **privacy**, **open-source software**, and **giving users control**, we'd love for you to join us!

📢 **Follow our progress** – Stay updated on GitHub as we build Mail0.io.  
💡 **Contribute** – Share your ideas, suggest features, and help shape the project.  
🤝 **Community-driven** – Our goal is to create an email solution **for the people, by the people**.

### Stay Tuned!

We're just getting started. If you're excited about a future where **email belongs to users, not corporations**, let's make it happen together.

---

🤍 **Mail0.io – Email, Reimagined.**

## Getting Started

### Prerequisites

Before running the application, you'll need to set up several services and environment variables:

1. **Setup Local Services with Docker**

   - Make sure you have [Docker](https://docs.docker.com/get-docker/), [NodeJS](https://nodejs.org/en/download/), and [pnpm](https://pnpm.io/installation) installed.
   - Install all dependencies with `pnpm install`
   - Copy the example env, `cp .env.example .env`
   - Run `pnpm docker:up` to start the database and other services.
   - Run `pnpm db:push` to sync your schema with the database
   - Use `pnpm db:studio` to view and manage your data

2. **Better Auth Setup**

   - Open `.env` and change the BETTER_AUTH_SECRET to a random string. (Use `openssl rand -hex 32` to generate a 32 character string)

     ```env
     BETTER_AUTH_SECRET=your_secret_key
     ```

3. **Google OAuth Setup (Optional)**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the Google OAuth2 API
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-production-url/api/auth/callback/google` (production)
   - Add to `.env`:

     ```env
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     ```

### Running Locally

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contribute

1. You can fork the repository and make your changes on your forked repository. Once you have made your changes, you can create a pull request to the main branch.
2. To add code to the main branch, make a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). **Your code should always be reviewed by a partner, not yourself!**

## Issues

### Create a new issue

If you spot a problem with the docs, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue doesn't exist, you can open a new issue using a relevant [issue form](https://github.com/nizzyabi/Mail0/issues/new?template=Blank+issue).

### Solve an issue

Scan through our [existing issues](https://github.com/nizzyabi/Mail0/issues) to find one that interests you. You can narrow down the search using `labels` as filters. See "[Label reference](https://docs.github.com/en/contributing/collaborating-on-github-docs/label-reference)" for more information. As a general rule, we don't assign issues to anyone. If you find an issue to work on, you are welcome to open a PR with a fix.

## Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

- Fill the "Ready for review" template so that we can review your PR. This template helps reviewers understand your changes as well as the purpose of your pull request.
- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a reviewer will review your proposal. We may ask questions or request additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

## License

Mail0.io is licensed under the MIT License. This means you can:

✅ Use the software commercially  
✅ Modify the source code  
✅ Distribute your modifications  
✅ Use and modify the software privately

The only requirement is that you include the original copyright and license notice in any copy of the software/source.

See the [LICENSE](LICENSE) file for the full license text.
